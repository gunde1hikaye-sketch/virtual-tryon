'use client';

import { Video } from 'lucide-react';
import { Card } from './Card';
import type { HistoryItem } from '@/types';

interface HistoryGridProps {
  items: HistoryItem[];
  selectedId?: string | null;
  onSelect: (item: HistoryItem) => void;
}

export function HistoryGrid({ items, selectedId, onSelect }: HistoryGridProps) {
  if (items.length === 0) {
    return null;
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-white">Recent Results</h3>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item)}
            className={`group relative rounded-xl overflow-hidden transition-all ${
              selectedId === item.id
                ? 'ring-2 ring-blue-400 scale-105'
                : 'hover:scale-105 hover:ring-2 hover:ring-white/30'
            }`}
          >
            <div className="relative aspect-square bg-black/20">
              <img
                src={item.imageUrl}
                alt="History item"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

              {item.videoUrl && (
                <div className="absolute top-2 right-2 p-1.5 rounded-full bg-blue-500/80 backdrop-blur-sm">
                  <Video className="w-3 h-3 text-white" />
                </div>
              )}
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
