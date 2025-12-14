import { supabase } from '@/lib/supabase-client';

// =======================
// FILE → BASE64
// =======================
export function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// =======================
// FORMAT FILE SIZE
// =======================
export function formatFileSize(bytes: number): string {
  if (!bytes || bytes === 0) return '0 Bytes';

  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

// =======================
// TRY-ON API (AUTH'LU)
// =======================
export async function generateTryOn(payload: {
  modelImage: string;
  tshirtImage: string;
  generateVideo?: boolean;
}) {
  // 🔐 Supabase session → access token
  const { data: sessionData } = await supabase.auth.getSession();
  const token = sessionData.session?.access_token;

  if (!token) {
    throw new Error('Not authenticated');
  }

  const res = await fetch('/api/tryon', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`, // ✅ KRİTİK
    },
    body: JSON.stringify(payload),
  });

  const text = await res.text();
  let data: any = null;

  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = null;
  }

  if (!res.ok) {
    throw data ?? { error: 'request_failed' };
  }

  return data;
}
