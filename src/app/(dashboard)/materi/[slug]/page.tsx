import { getDb } from "@/lib/db";
import { materi, gameMateri, soalSet } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { sanitize } from "@/lib/sanitize";
import Link from "next/link";
import TandaiSelesaiButton from "./tandai-client";
import { gameRegistry } from "@/components/games/registry";
import { ArrowLeft, Clock, BookOpen, Gamepad2, GraduationCap, MessageCircle, CheckCircle2 } from "lucide-react";

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
      <Link href="/materi" className="inline-flex items-center gap-1.5 text-sm font-semibold text-zinc-600 hover:text-brand-700">
        <ArrowLeft className="w-4 h-4" /> Kembali ke Materi
      </Link>

      <div className="mt-4 bg-white rounded-[1.5rem] border border-orange-100 shadow-card overflow-hidden">
        {m.sampulUrl && <img src={m.sampulUrl} alt={m.judul} className="w-full h-[220px] md:h-[280px] object-cover" />}
        <div className="p-6">
          <div className="flex flex-wrap gap-2 text-xs">
            <span className="badge badge-warm"><BookOpen className="w-3.5 h-3.5" /> Materi</span>
            <span className="badge badge-neutral"><Clock className="w-3.5 h-3.5" /> 10 menit • Pemula</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink-900 mt-3">{m.judul}</h1>
          <p className="text-zinc-600 mt-2 leading-relaxed">{m.ringkasan}</p>
        </div>
      </div>

      <article className="prose prose-zinc prose-headings:font-extrabold prose-headings:tracking-tight prose-a:text-brand-700 prose-strong:text-ink-900 mt-6 bg-white rounded-[1.5rem] p-6 md:p-8 border border-orange-100 shadow-card max-w-none" dangerouslySetInnerHTML={{ __html: clean }} />

      <div className="mt-6 grid md:grid-cols-3 gap-3">
        {games.length>0 && (
          <Link href={`/game/${games[0].id}`} className="group bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-4 flex flex-col items-center text-center card-hover">
            <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center"><Gamepad2 className="w-5 h-5" /></div>
            <div className="font-bold text-teal-900 mt-3">Main Game</div>
            <div className="text-xs text-teal-700">Latihan interaktif materi ini</div>
          </Link>
        )}
        {sets.length>0 && (
          <Link href={`/latihan/${sets[0].id}`} className="group bg-gradient-to-br from-violet-50 to-indigo-50 border border-violet-200 rounded-2xl p-4 flex flex-col items-center text-center card-hover">
            <div className="w-10 h-10 rounded-xl bg-violet-600 text-white flex items-center justify-center"><GraduationCap className="w-5 h-5" /></div>
            <div className="font-bold text-violet-900 mt-3">Latihan Soal</div>
            <div className="text-xs text-violet-700">Uji pemahamanmu</div>
          </Link>
        )}
        <Link href={`/tanya-ai?materi=${m.id}`} className="group bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 rounded-2xl p-4 flex flex-col items-center text-center card-hover">
          <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center"><MessageCircle className="w-5 h-5" /></div>
          <div className="font-bold text-amber-900 mt-3">Tanya AI</div>
          <div className="text-xs text-amber-800">Jelaskan materi ini</div>
        </Link>
      </div>

      <div className="mt-6 bg-white rounded-2xl border border-orange-100 p-4 flex flex-col md:flex-row gap-3 items-center justify-between">
        <div className="flex items-center gap-2 text-sm font-semibold text-zinc-700"><CheckCircle2 className="w-5 h-5 text-emerald-600" /> Selesaikan materi untuk dapat poin</div>
        <div className="w-full md:w-auto"><TandaiSelesaiButton materiId={m.id} /></div>
      </div>
    </div>
  );
}
