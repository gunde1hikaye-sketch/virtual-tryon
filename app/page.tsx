'use client';

import { useMemo, useState } from 'react';
import { Sparkles } from 'lucide-react';
import { redirect } from 'next/navigation';

import { UploadArea } from '@/components/UploadArea';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spinner } from '@/components/Spinner';
import { useToast } from '@/components/Toast';

import { generateTryOn, fileToBase64 } from '@/lib/api';
import { useUser } from '@/lib/useUser';

type TryOnResponse = {
  imageUrl?: string;
  videoUrl?: string | null;
  generationTimeMs?: number;
  ok?: boolean;
  remainingCredits?: number;
  [k: string]: any;
};

type HistoryItem = {
  id: string;
  imageUrl?: string;
  videoUrl?: string | null;
  timestamp: number;
  originalModelImage?: string;
};

export default function Home() {
  // 🔐 LOGIN GUARD
  const { user, loading: userLoading } = useUser();

  if (userLoading) return null;
  if (!user) redirect('/auth/login');

  // --------------------

  const { showToast } = useToast();

  const [modelFile, setModelFile] = useState<File | null>(null);
  const [tshirtFile, setTshirtFile] = useState<File | null>(null);
  const [generateVideo, setGenerateVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<TryOnResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [modelImageErrors, setModelImageErrors] = useState('');
  const [tshirtImageErrors, setTshirtImageErrors] = useState('');

  const selected = useMemo(() => {
    if (!selectedId) return null;
    return history.find((h) => h.id === selectedId) ?? null;
  }, [history, selectedId]);

  const handleGenerateTryOn = async () => {
    setModelImageErrors('');
    setTshirtImageErrors('');
    setResult(null);
    setSelectedId(null);

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

      const payload = {
        modelImage: modelImageBase64,
        tshirtImage: tshirtImageBase64,
        generateVideo,
      };

      const response: TryOnResponse = await generateTryOn(payload);

      setResult(response);

      const newItem: HistoryItem = {
        id: crypto.randomUUID
          ? crypto.randomUUID()
          : Math.random().toString(36).slice(2),
        imageUrl: response.imageUrl,
        videoUrl: response.videoUrl ?? null,
        timestamp: Date.now(),
        originalModelImage: modelImageBase64,
      };

      setHistory((prev) => [newItem, ...prev].slice(0, 6));

      if (response.imageUrl)
        showToast('Your virtual try-on is ready', 'success');
      else
        showToast(
          'Request completed (no imageUrl returned yet)',
          'success'
        );
    } catch (e) {
      console.error(e);
      showToast('Try-on failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const display =
    selected ?? (result ? ({ id: 'current', ...result } as any) : null);

  return (
    <div className="min-h-screen bg-black text-white px-6 py-8 space-y-8">
      {/* HEADER */}
      <header className="flex items-center gap-3">
        <Sparkles className="w-7 h-7 text-purple-400" />
        <h1 className="text-2xl font-bold">Virtual Try-On Studio</h1>
      </header>

      {/* UPLOAD */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <UploadArea
          label="Model Image"
          file={modelFile}
          onFileChange={setModelFile}
          error={modelImageErrors}
        />
        <UploadArea
          label="T-Shirt Image"
          file={tshirtFile}
          onFileChange={setTshirtFile}
          error={tshirtImageErrors}
        />
      </div>

      {/* OPTIONS */}
      <ToggleSwitch
        label="Generate Video"
        checked={generateVideo}
        onChange={setGenerateVideo}
      />

      {/* ACTION */}
      <PrimaryButton onClick={handleGenerateTryOn} disabled={loading}>
        {loading ? <Spinner /> : 'Generate Try-On'}
      </PrimaryButton>

      {/* RESULT */}
      <section className="space-y-3">
        <h2 className="text-lg font-semibold">Result</h2>

        {!display ? (
          <div className="border border-white/10 rounded-xl p-4 bg-white/5 text-sm text-gray-300">
            No result yet. Upload images and click “Generate”.
          </div>
        ) : display.imageUrl ? (
          <div className="border border-white/10 rounded-xl p-4 bg-white/5 space-y-3">
            <img
              src={display.imageUrl}
              alt="Try-on result"
              className="w-full max-w-2xl rounded-lg"
            />
            {display.videoUrl && (
              <a
                href={display.videoUrl}
                target="_blank"
                rel="noreferrer"
                className="text-sm text-blue-300 underline"
              >
                Open video
              </a>
            )}
          </div>
        ) : (
          <pre className="border border-white/10 rounded-xl p-4 bg-white/5 text-xs overflow-auto">
            {JSON.stringify(display, null, 2)}
          </pre>
        )}
      </section>

      {/* HISTORY */}
      {history.length > 0 && (
        <section className="space-y-3">
          <h2 className="text-lg font-semibold">History</h2>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            {history.map((h) => (
              <button
                key={h.id}
                onClick={() => setSelectedId(h.id)}
                className={`border rounded-xl p-3 text-left bg-white/5 hover:bg-white/10 transition ${
                  selectedId === h.id
                    ? 'border-purple-400/60'
                    : 'border-white/10'
                }`}
              >
                <div className="text-xs text-gray-400">
                  {new Date(h.timestamp).toLocaleString()}
                </div>
                {h.imageUrl ? (
                  <img
                    src={h.imageUrl}
                    alt="History item"
                    className="mt-2 w-full rounded-lg"
                  />
                ) : (
                  <div className="mt-2 text-xs text-gray-300">
                    No imageUrl in this response.
                  </div>
                )}
              </button>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
