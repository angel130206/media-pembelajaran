import TanyaClient from "./client";
import { getDb } from "@/lib/db";
import { materi } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { Bot, Sparkles } from "lucide-react";

export default async function TanyaPage({ searchParams }: { searchParams:{ materi?:string, soal?:string }}) {
  let konteks: string | undefined;
  if (searchParams.materi) {
    try {
      const db = getDb();
      if (db) {
        const [m] = await db.select().from(materi).where(eq(materi.id, searchParams.materi)).limit(1);
        if (m) konteks = `Materi: ${m.judul}\nRingkasan: ${m.ringkasan}\nIsi ringkas: ${(m.isi||"").slice(0,800)}`;
      }
    } catch {}
  }
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 h-[calc(100vh-80px)] md:h-[calc(100vh-64px)] flex flex-col">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-amber-700 uppercase"><Bot className="w-4 h-4" /> Tanya AI</div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900 mt-1 flex items-center gap-2">Asisten Wirausaha Samarinda <Sparkles className="w-5 h-5 text-amber-500" /></h1>
        <p className="text-sm text-zinc-600">Jawab pakai bahasa sederhana + contoh warung lokal. Batas 30 pesan/jam.</p>
      </div>
      <TanyaClient initialContext={konteks} />
    </div>
  );
}
