'use client';

import { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';
import { formatFileSize } from '@/lib/api';

interface UploadAreaProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  error?: string;
}

export function UploadArea({
  label,
  file,
  onFileChange,
  accept = 'image/png,image/jpeg,image/jpg',
  error
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      onFileChange(droppedFile);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) {
      onFileChange(selectedFile);
    }
  };

  const handleRemove = () => {
    onFileChange(null);
    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white">{label}</label>

      {!file ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 transition-all cursor-pointer ${
            isDragging
              ? 'border-blue-400 bg-blue-500/10'
              : error
              ? 'border-red-400/50 bg-red-500/5'
              : 'border-white/20 bg-white/5 hover:border-white/40 hover:bg-white/10'
          }`}
        >
          <input
            ref={inputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="p-3 rounded-full bg-gradient-to-br from-blue-500/20 to-purple-600/20">
              <Upload className="w-6 h-6 text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                Drag & drop or click to upload
              </p>
              <p className="text-xs text-gray-400 mt-1">PNG or JPG (max 10MB)</p>
            </div>
          </div>
        </div>
      ) : (
        <div className="relative border border-white/20 rounded-xl p-4 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="flex-shrink-0 w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden">
              {file.type.startsWith('image/') ? (
                <img
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">{file.name}</p>
              <p className="text-xs text-gray-400 mt-1">{formatFileSize(file.size)}</p>
            </div>
            <button
              onClick={handleRemove}
              className="flex-shrink-0 p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {error && (
        <p className="text-xs text-red-400 mt-1">{error}</p>
      )}
    </div>
  );
}
