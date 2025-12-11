'use client';

import { useState, useCallback } from 'react';
import { Sparkles } from 'lucide-react';
import { Card } from '@/components/Card';
import { UploadArea } from '@/components/UploadArea';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { PrimaryButton } from '@/components/PrimaryButton';
import { ResultViewer } from '@/components/ResultViewer';
import { CompareView } from '@/components/CompareView';
import { HistoryGrid } from '@/components/HistoryGrid';
import { Spinner } from '@/components/Spinner';
import { useToast } from '@/components/Toast';
import { generateTryOn, fileToBase64 } from '@/lib/api';
import type { TryOnRequestPayload, HistoryItem } from '@/types';

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

      setHistory((prev) => {
        const updated = [newHistoryItem, ...prev];
        return updated.slice(0, 4);
      });

      showToast('Your virtual try-on is ready', 'success');
    } catch (error) {
      console.error('Error generating try-on:', error);
      showToast(
        'We couldn\'t generate your try-on. Please try again.',
        'error'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSelectHistory = (item: HistoryItem) => {
    setSelectedHistoryId(item.id);
    setResult(null);
    setActiveTab('result');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-slate-950">
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10">
        <nav className="border-b border-white/5 backdrop-blur-md bg-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gradient-to-br from-blue-500 to-purple-600">
                <Sparkles className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-white">Virtual Try-On Studio</h1>
            </div>
          </div>
        </nav>

        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid lg:grid-cols-5 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="p-6 space-y-6">
                <h2 className="text-lg font-semibold text-white">Upload Images</h2>

                <UploadArea
                  label="Model / Mannequin Image"
                  file={modelFile}
                  onFileChange={setModelFile}
                  error={modelImageErrors}
                  accept="image/png,image/jpeg,image/jpg"
                />

                <UploadArea
                  label="T-Shirt Image"
                  file={tshirtFile}
                  onFileChange={setTshirtFile}
                  error={tshirtImageErrors}
                  accept="image/png,image/jpeg,image/jpg"
                />

                <div className="pt-2">
                  <ToggleSwitch
                    label="Generate Video Preview"
                    description="Create a short video of the try-on result"
                    checked={generateVideo}
                    onChange={setGenerateVideo}
                  />
                </div>

                <PrimaryButton
                  onClick={handleGenerateTryOn}
                  disabled={!modelFile || !tshirtFile || loading}
                  loading={loading}
                  className="w-full"
                >
                  Generate Try-On
                </PrimaryButton>
              </Card>
            </div>

            <div className="lg:col-span-3 space-y-6">
              {loading && (
                <Card className="p-8 flex flex-col items-center justify-center min-h-[400px] gap-4">
                  <Spinner size="lg" />
                  <p className="text-white text-center font-medium">
                    Generating your virtual try-on...
                  </p>
                </Card>
              )}

              {!loading && !currentResult && (
                <Card className="p-12 flex flex-col items-center justify-center min-h-[400px] gap-4">
                  <div className="p-4 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20">
                    <Sparkles className="w-8 h-8 text-blue-400" />
                  </div>
                  <div className="text-center">
                    <p className="text-white font-medium">
                      Upload a model and T-shirt image
                    </p>
                    <p className="text-sm text-gray-400 mt-2">
                      Then click "Generate Try-On" to see your preview
                    </p>
                  </div>
                </Card>
              )}

              {!loading && currentResult && (
                <>
                  <div className="flex gap-2 border-b border-white/10 pb-4">
                    {['result', 'compare'].map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveTab(tab as 'result' | 'compare')}
                        className={`px-4 py-2 font-medium rounded-lg transition-all ${
                          activeTab === tab
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white'
                            : 'text-gray-400 hover:text-white'
                        }`}
                      >
                        {tab === 'result' ? 'Result' : 'Compare'}
                      </button>
                    ))}
                  </div>

                  {activeTab === 'result' && (
                    <ResultViewer
                      imageUrl={currentResult.imageUrl}
                      videoUrl={currentResult.videoUrl}
                      generationTimeMs={
                        selectedHistoryId ? undefined : result?.generationTimeMs
                      }
                    />
                  )}

                  {activeTab === 'compare' && currentResult.originalModelImage && (
                    <CompareView
                      beforeImage={currentResult.originalModelImage}
                      afterImage={currentResult.imageUrl}
                    />
                  )}
                </>
              )}
            </div>
          </div>

          {history.length > 0 && (
            <div className="mt-12">
              <HistoryGrid
                items={history}
                selectedId={selectedHistoryId}
                onSelect={handleSelectHistory}
              />
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
