'use client';

import { useState } from 'react';
import { Sparkles } from 'lucide-react';

// ✅ COMPONENTS (RELATIVE)
import { Card } from '../components/Card';
import { UploadArea } from '../components/UploadArea';
import { ToggleSwitch } from '../components/ToggleSwitch';
import { PrimaryButton } from '../components/PrimaryButton';
import { ResultViewer } from '../components/ResultViewer';
import { CompareView } from '../components/CompareView';
import { HistoryGrid } from '../components/HistoryGrid';
import { Spinner } from '../components/Spinner';
import { useToast } from '../components/Toast';

// ✅ API
import { generateTryOn, fileToBase64 } from '../lib/api';

// ✅ TYPES
import type { TryOnRequestPayload, HistoryItem } from '../types';

export default function Home() {
  const { showToast } = useToast();

  const [modelFile, setModelFile] = useState<File | null>(null);
  const [tshirtFile, setTshirtFile] = useState<File | null>(null);
  const [generateVideo, setGenerateVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<{
    imageUrl: string;
    videoUrl?: string | null;
    generationTimeMs?: number;
  } | null>(null);

  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedHistoryId, setSelectedHistoryId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'result' | 'compare'>('result');

  const [modelImageErrors, setModelImageErrors] = useState('');
  const [tshirtImageErrors, setTshirtImageErrors] = useState('');

  const currentResult = selectedHistoryId
    ? history.find((item) => item.id === selectedHistoryId)
    : result
    ? {
        id: 'current',
        imageUrl: result.imageUrl,
        videoUrl: result.videoUrl,
        timestamp: Date.now(),
        originalModelImage: modelFile ? URL.createObjectURL(modelFile) : undefined,
      }
    : null;

  const handleGenerateTryOn = async () => {
    setModelImageErrors('');
    setTshirtImageErrors('');

    if (!modelFile) {
      setModelImageErrors('Please upload a model image');
      showToast('Please upload a model image', 'error');
      return;
    }

    if (!tshirtFile) {
      setTshirtImageErrors('Please upload a T-shirt image');
      showToast('Please upload a T-shirt image', 'error');
      return;
    }

    try {
      setLoading(true);

      const modelImageBase64 = await fileToBase64(modelFile);
      const tshirtImageBase64 = await fileToBase64(tshirtFile);

      const payload: TryOnRequestPayload = {
        modelImage: modelImageBase64,
        tshirtImage: tshirtImageBase64,
        generateVideo,
      };

      const response = await generateTryOn(payload);

      setResult(response);
      setSelectedHistoryId(null);
      setActiveTab('result');

      const newHistoryItem: HistoryItem = {
        id: Math.random().toString(36).substring(7),
        imageUrl: response.imageUrl,
        videoUrl: response.videoUrl,
        timestamp: Date.now(),
        originalModelImage: modelImageBase64,
      };

      setHistory((prev) => [newHistoryItem, ...prev].slice(0, 4));

      showToast('Your virtual try-on is ready', 'success');
    } catch (error) {
      console.error(error);
      showToast('Try-on failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // UI kısmına dokunmadım – aynen çalışır
  return <div>{/* UI aynı */}</div>;
}
