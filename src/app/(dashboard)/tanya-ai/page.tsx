import TanyaClient from "./client";
import { getDb } from "@/lib/db";
import { materi } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

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
    <div className="max-w-3xl mx-auto p-4 md:p-6 h-[calc(100vh-80px)] flex flex-col">
      <h1 className="text-2xl font-bold">Tanya AI</h1>
      <p className="text-sm text-zinc-500">Asisten belajar wirausaha Samarinda — bahasa sederhana, contoh lokal</p>
      <TanyaClient initialContext={konteks} />
    </div>
  );
}
