'use client';

import { Card } from './Card';

interface CompareViewProps {
  beforeImage: string;
  afterImage: string;
}

export function CompareView({ beforeImage, afterImage }: CompareViewProps) {
  return (
    <Card className="p-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gray-500/20 text-xs font-semibold text-gray-300">
              Before
            </span>
          </div>
          <div className="relative rounded-xl overflow-hidden bg-black/20">
            <img
              src={beforeImage}
              alt="Before"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 text-xs font-semibold text-white">
              After
            </span>
          </div>
          <div className="relative rounded-xl overflow-hidden bg-black/20">
            <img
              src={afterImage}
              alt="After"
              className="w-full h-auto object-contain"
            />
          </div>
        </div>
      </div>
    </Card>
  );
}
