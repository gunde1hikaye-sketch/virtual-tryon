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
// TRY-ON API
// =======================
export async function generateTryOn(payload: {
  modelImage: string;
  tshirtImage: string;
  generateVideo?: boolean;
}) {
  const res = await fetch("/api/tryon", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      // auth header burada yoksa backend zaten hata döner
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
    throw data ?? { error: "request_failed" };
  }

  return data;
}
