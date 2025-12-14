import { NextResponse } from "next/server";
import { run } from "@fal-ai/serverless-client";

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

    console.log("📩 Try-on request received");

    const result: any = await run("fal-ai/cat-vton", {
      input: {
        human_image: modelImage,
        garment_image: tshirtImage,
      },
    });

    console.log("✅ RAW fal.ai result:", result);

    // 🔥 GÜVENLİ IMAGE URL ÇIKARMA
    const imageUrl =
      result?.image?.url ??
      result?.output?.image?.url ??
      result?.images?.[0]?.url ??
      null;

    if (!imageUrl) {
      return NextResponse.json(
        {
          error: "no_image_returned",
          raw: result,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageUrl,
    });
  } catch (err: any) {
    console.error("❌ fal.ai error:", err);
    return NextResponse.json(
      { error: err?.message ?? "fal_failed" },
      { status: 500 }
    );
  }
}
