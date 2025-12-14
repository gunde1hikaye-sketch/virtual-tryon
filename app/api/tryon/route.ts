import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { modelImage, tshirtImage } = body;

    if (!modelImage || !tshirtImage) {
      return NextResponse.json(
        { error: "missing_images" },
        { status: 400 }
      );
    }

    // ⏱ fake processing delay
    await new Promise((res) => setTimeout(res, 1500));

    // 🧪 MOCK RESULT (fal.ai yerine)
    return NextResponse.json({
      imageUrl:
        "https://images.unsplash.com/photo-1520975916090-3105956dac38?w=1024",
      generationTimeMs: 1500,
      mock: true,
    });
  } catch (err: any) {
    return NextResponse.json(
      { error: err?.message ?? "mock_failed" },
      { status: 500 }
    );
  }
}
