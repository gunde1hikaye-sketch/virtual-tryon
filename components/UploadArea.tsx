'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface UploadAreaProps {
  label: string;
  file: File | null;
  onFileChange: (file: File | null) => void;
  accept?: string;
  error?: string;
}

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

export function UploadArea({
  label,
  file,
  onFileChange,
  accept = 'image/png,image/jpeg,image/jpg',
  error
}: UploadAreaProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      setLocalError('Only image files are allowed');
      return false;
    }

    if (file.size > MAX_FILE_SIZE) {
      setLocalError('File size must be less than 10MB');
      return false;
    }

    setLocalError(null);
    return true;
  };

  const handleFile = (file: File) => {
    if (validateFile(file)) {
      onFileChange(file);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile) handleFile(droppedFile);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile) handleFile(selectedFile);
  };

  const handleRemove = () => {
    onFileChange(null);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  return (
    <div className="space-y-2">
      <label className="block text-sm font-semibold text-white">{label}</label>

      {!file ? (
        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsDragging(true);
          }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-xl p-8 cursor-pointer transition-all ${
            isDragging
              ? 'border-blue-400 bg-blue-500/10'
              : error || localError
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
            <p className="text-sm font-medium text-white">
              Drag & drop or click to upload
            </p>
            <p className="text-xs text-gray-400">PNG or JPG (max 10MB)</p>
          </div>
        </div>
      ) : (
        <div className="relative border border-white/20 rounded-xl p-4 bg-white/5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-lg bg-white/5 overflow-hidden flex items-center justify-center">
              {file.type.startsWith('image/') ? (
                <Image
                  src={URL.createObjectURL(file)}
                  alt="Preview"
                  width={64}
                  height={64}
                  unoptimized
                  className="object-cover"
                />
              ) : (
                <ImageIcon className="w-6 h-6 text-gray-400" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-white truncate">
                {file.name}
              </p>
              <p className="text-xs text-gray-400">
                {formatFileSize(file.size)}
              </p>
            </div>

            <button
              onClick={handleRemove}
              className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {(error || localError) && (
        <p className="text-xs text-red-400">{error || localError}</p>
      )}
    </div>
  );
}
