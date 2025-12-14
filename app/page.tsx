'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

import { Navbar } from '@/components/Navbar';
import { UploadArea } from '@/components/UploadArea';
import { ToggleSwitch } from '@/components/ToggleSwitch';
import { PrimaryButton } from '@/components/PrimaryButton';
import { Spinner } from '@/components/Spinner';
import { useToast } from '@/components/Toast';

import { generateTryOn, fileToBase64 } from '@/lib/api';
import { useUser } from '@/lib/useUser';
import { useCredits } from '@/lib/useCredits';

/* ---------------- TYPES ---------------- */

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
  /* 🔐 ROUTER */
  const router = useRouter();

  /* 🔐 AUTH */
  const { user, loading: userLoading } = useUser();

  /* 💳 CREDITS */
  const { credits, loading: creditsLoading } = useCredits();

  /* 🔔 TOAST */
  const { showToast } = useToast();

  /* 🧠 STATE */
  const [modelFile, setModelFile] = useState<File | null>(null);
  const [tshirtFile, setTshirtFile] = useState<File | null>(null);
  const [generateVideo, setGenerateVideo] = useState(false);
  const [loading, setLoading] = useState(false);

  const [result, setResult] = useState<TryOnResponse | null>(null);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [modelImageErrors, setModelImageErrors] = useState('');
  const [tshirtImageErrors, setTshirtImageErrors] = useState('');

  /* 🧮 MEMO */
  const selected = useMemo(() => {
    if (!selectedId) return null;
    return history.find((h) => h.id === selectedId) ?? null;
  }, [history, selectedId]);

  /* 🚧 CLIENT AUTH GUARD (HOOKLARDAN SONRA!) */
  useEffect(() => {
    if (!userLoading && !user) {
      router.replace('/auth/login');
    }
  }, [userLoading, user, router]);

  if (userLoading) return null;
  if (!user) return null;

  /* 💳 CREDIT DURUMU */
  const noCredits =
    !creditsLoading && typeof credits === 'number' && credits <= 0;

  /* ---------------- ACTION ---------------- */

  const handleGenerateTryOn = async () => {
    if (noCredits) {
      router.push('/upgrade');
      return;
    }

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

      const response = await generateTryOn({
        modelImage: modelImageBase64,
        tshirtImage: tshirtImageBase64,
        generateVideo,
      });

      // ✅ CREDIT UPDATE EVENT
      if (typeof response?.remainingCredits === 'number') {
        window.dispatchEvent(
          new CustomEvent('credits:update', {
            detail: { credits: response.remainingCredits },
          })
        );
      } else {
        window.dispatchEvent(new CustomEvent('credits:update'));
      }

      setResult(response);

      const newItem: HistoryItem = {
        id: crypto.randomUUID(),
        imageUrl: response.imageUrl,
        videoUrl: response.videoUrl ?? null,
        timestamp: Date.now(),
        originalModelImage: modelImageBase64,
      };

      setHistory((prev) => [newItem, ...prev].slice(0, 6));

      showToast('Your virtual try-on is ready', 'success');
    } catch (e: any) {
      console.error(e);

      // 🚫 CREDIT BİTTİ → UPGRADE
      if (e?.error === 'no_credits') {
        showToast('Credits’in bitti. Upgrade gerekli.', 'error');
        router.push('/upgrade');
        return;
      }

      showToast('Try-on failed. Please try again.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const display =
    selected ?? (result ? ({ id: 'current', ...result } as any) : null);

  /* ---------------- UI ---------------- */

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-black text-white px-6 py-8 space-y-8 pt-24">
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

        <ToggleSwitch
          label="Generate Video"
          checked={generateVideo}
          onChange={setGenerateVideo}
        />

        <PrimaryButton
          onClick={handleGenerateTryOn}
          disabled={loading || creditsLoading || noCredits}
        >
          {loading ? (
            <Spinner />
          ) : noCredits ? (
            'No Credits'
          ) : (
            'Generate Try-On'
          )}
        </PrimaryButton>

        {noCredits && (
          <div className="border border-purple-400/30 bg-purple-500/10 rounded-xl p-4 text-sm text-purple-200">
            Credits’in bitti. Devam etmek için{' '}
            <button
              onClick={() => router.push('/upgrade')}
              className="underline text-purple-300 hover:text-purple-200"
            >
              Upgrade
            </button>
            .
          </div>
        )}

        <section className="space-y-3">
          <h2 className="text-lg font-semibold">Result</h2>

          {!display ? (
            <div className="border border-white/10 rounded-xl p-4 bg-white/5 text-sm text-gray-300">
              No result yet. Upload images and click “Generate”.
            </div>
          ) : display.imageUrl ? (
            <img
              src={display.imageUrl}
              alt="Try-on result"
              className="w-full max-w-2xl rounded-lg"
            />
          ) : (
            <pre className="border border-white/10 rounded-xl p-4 bg-white/5 text-xs overflow-auto">
              {JSON.stringify(display, null, 2)}
            </pre>
          )}
        </section>
      </div>
    </>
  );
}
