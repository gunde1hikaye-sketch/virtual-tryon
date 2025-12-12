import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-server";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    // ======================
    // AUTH HEADER
    // ======================
    const authHeader = req.headers.get("authorization");

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json(
        { error: "unauthorized", message: "Missing token" },
        { status: 401 }
      );
    }

    const token = authHeader.replace("Bearer ", "");

    // ======================
    // USER DOĞRULA
    // ======================
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json(
        { error: "unauthorized", message: "Invalid session" },
        { status: 401 }
      );
    }

    // ======================
    // 🔥 KREDİ DÜŞ (RPC)
    // ======================
    const { data: remainingCredits, error: creditError } =
      await supabaseAdmin.rpc("consume_credit");

    if (creditError) {
      console.error("❌ CREDIT ERROR:", creditError);
      return NextResponse.json(
        { error: "credit_error", message: "Credit check failed" },
        { status: 500 }
      );
    }

    if (remainingCredits === -1) {
      return NextResponse.json(
        {
          error: "no_credits",
          message: "Deneme hakkın bitti",
        },
        { status: 402 }
      );
    }

    console.log("✅ CREDIT USED. REMAINING:", remainingCredits);

    // ======================
    // ⏩ BURADAN SONRASI TRY-ON
    // (fal.ai / kling burada çalışacak)
    // ======================

    return NextResponse.json({
      ok: true,
      remainingCredits,
    });
  } catch (err: any) {
    console.error("❌ SERVER ERROR:", err);
    return NextResponse.json(
      { error: "server_error", message: err?.message ?? "Unknown error" },
      { status: 500 }
    );
  }
}
