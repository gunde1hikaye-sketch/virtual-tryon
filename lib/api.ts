export async function postTryOn(
  token: string,
  payload: {
    modelImage: string;
    tshirtImage: string;
    generateVideo?: boolean;
  }
) {
  const res = await fetch("/api/tryon", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
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
    throw {
      status: res.status,
      data,
    };
  }

  return data;
}
