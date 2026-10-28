import { NextResponse } from "next/server";
import { checkDbConnection } from "@/lib/db";

export async function GET() {
  const dbCheck = await checkDbConnection();
  const status = {
    ok: dbCheck.ok,
    database: dbCheck.ok ? "terhubung" : dbCheck.error,
    auth: process.env.AUTH_SECRET ? "ok" : "AUTH_SECRET belum diatur",
    supabase: process.env.SUPABASE_URL ? "ok" : "SUPABASE_URL belum diatur (opsional jika pakai S3)",
    ai: process.env.GROQ_API_KEY ? "groq: ok" : process.env.GEMINI_API_KEY ? "gemini: ok" : "AI belum dikonfigurasi (mode mock)",
    timestamp: new Date().toISOString(),
  };
  return NextResponse.json(status, { status: dbCheck.ok ? 200 : 503 });
}
