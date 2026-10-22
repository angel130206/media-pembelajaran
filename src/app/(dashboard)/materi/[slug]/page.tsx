import { getDb } from "@/lib/db";
import { materi, gameMateri, soalSet } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { sanitize } from "@/lib/sanitize";
import Link from "next/link";
import TandaiSelesaiButton from "./tandai-client";
import { gameRegistry } from "@/components/games/registry";

export default async function MateriDetail({ params }: { params: { slug: string } }) {
  let m: any = null; let games: any[]=[]; let sets: any[]=[];
  try {
    const db = getDb();
    if (db) {
      const [found] = await db.select().from(materi).where(eq(materi.slug, params.slug)).limit(1);
      if (!found) return notFound();
      m = found;
      const gm = await db.select().from(gameMateri).where(eq(gameMateri.materiId, m.id));
      games = gm.map(g=> gameRegistry.find(r=> r.id===g.gameId)).filter(Boolean);
      sets = await db.select().from(soalSet).where(eq(soalSet.materiId, m.id));
    }
  } catch (e) { return notFound(); }
  if (!m) return notFound();
  const clean = sanitize(m.isi || "");

  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6">
      <Link href="/materi" className="text-sm text-brand-600">← Kembali ke Materi</Link>
      {m.sampulUrl && <img src={m.sampulUrl} alt={m.judul} className="w-full h-64 object-cover rounded-2xl mt-4" />}
      <h1 className="text-3xl font-bold mt-4">{m.judul}</h1>
      <p className="text-zinc-500 mt-1">{m.ringkasan}</p>
      <article className="prose prose-orange max-w-none mt-6 bg-white rounded-2xl p-6 border border-orange-100" dangerouslySetInnerHTML={{ __html: clean }} />
      <div className="grid md:grid-cols-3 gap-3 mt-6">
        {games.length>0 && <Link href={`/game?materi=${m.id}`} className="card bg-teal-50 border-teal-200 text-center font-semibold">🎮 Main Game materi ini</Link>}
        {sets.length>0 && <Link href={`/latihan?set=${sets[0].id}`} className="card bg-violet-50 border-violet-200 text-center font-semibold">📝 Latihan Soal</Link>}
        <Link href={`/tanya-ai?materi=${m.id}`} className="card bg-amber-50 border-amber-200 text-center font-semibold">🤖 Tanya AI tentang materi ini</Link>
      </div>
      <div className="mt-6">
        <TandaiSelesaiButton materiId={m.id} />
      </div>
    </div>
  );
}
