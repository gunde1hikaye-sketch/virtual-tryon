'use client';

import { Download, Clock } from 'lucide-react';
import { Card } from './Card';
import { PrimaryButton } from './PrimaryButton';
import { downloadFile } from '@/lib/api';

interface ResultViewerProps {
  imageUrl: string;
  videoUrl?: string | null;
  generationTimeMs?: number;
}

export function ResultViewer({ imageUrl, videoUrl, generationTimeMs }: ResultViewerProps) {
  const handleDownloadImage = () => {
    downloadFile(imageUrl, 'virtual-tryon-result.jpg');
  };

  const handleDownloadVideo = () => {
    if (videoUrl) {
      downloadFile(videoUrl, 'virtual-tryon-video.mp4');
    }
  };

  return (
    <Card className="p-6 space-y-6">
      <div className="space-y-4">
        <div className="relative rounded-xl overflow-hidden bg-black/20">
          <img
            src={imageUrl}
            alt="Try-on result"
            className="w-full h-auto object-contain"
          />
        </div>

        {videoUrl && (
          <div className="relative rounded-xl overflow-hidden bg-black/20">
            <video
              src={videoUrl}
              controls
              className="w-full h-auto"
              preload="metadata"
            >
              Your browser does not support video playback.
            </video>
          </div>
        )}
      </div>

      <div className="flex flex-wrap gap-3">
        <PrimaryButton onClick={handleDownloadImage} variant="primary">
          <Download className="w-4 h-4" />
          Download Image
        </PrimaryButton>

        {videoUrl && (
          <PrimaryButton onClick={handleDownloadVideo} variant="secondary">
            <Download className="w-4 h-4" />
            Download Video
          </PrimaryButton>
        )}
      </div>

      {generationTimeMs && (
        <div className="flex items-center gap-2 text-xs text-gray-400">
          <Clock className="w-3 h-3" />
          <span>Generated in {(generationTimeMs / 1000).toFixed(1)}s</span>
        </div>
      )}
    </Card>
  );
}
