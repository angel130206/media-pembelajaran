import { getDb } from "@/lib/db";
import { materi, progresMateri } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import Link from "next/link";
import { BookOpen, Clock, CheckCircle2, Play, Sparkles } from "lucide-react";

export default async function MateriListPage() {
  const session = await auth();
  let list: any[] = [];
  let progMap = new Map();
  try {
    const db = getDb();
    if (db) {
      list = await db.select().from(materi).where(eq(materi.status, "terbit")).orderBy(asc(materi.urutan));
      const prog = await db.select().from(progresMateri).where(eq(progresMateri.userId, (session!.user as any).id));
      progMap = new Map(prog.map(p=>[p.materiId, p.status]));
    }
  } catch {}
  const selesaiCount = Array.from(progMap.values()).filter(v=>v==="selesai").length;

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div className="flex flex-wrap gap-4 justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-brand-700 uppercase"><BookOpen className="w-4 h-4" /> Materi Belajar</div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink-900 mt-1">Pilih materi & mulai langkahmu</h1>
          <p className="text-sm text-zinc-600 mt-1">Semua pakai contoh warung & UMKM Samarinda — 8-12 menit per topik</p>
        </div>
        <div className="bg-white border border-orange-100 rounded-xl px-4 py-3 shadow-card">
          <div className="text-xs text-zinc-500">Progres</div>
          <div className="text-lg font-extrabold text-ink-900">{selesaiCount}/{list.length || 0} selesai</div>
        </div>
      </div>

      {list.length===0 ? (
        <div className="card mt-6 text-center py-12">
          <div className="w-12 h-12 mx-auto rounded-xl bg-orange-100 flex items-center justify-center"><Sparkles className="w-6 h-6 text-brand-600" /></div>
          <p className="text-zinc-700 font-semibold mt-3">Belum ada materi</p>
          <p className="text-sm text-zinc-500">Admin akan segera menambahkannya. Coba cek lagi nanti.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {list.map((m, idx)=> {
            const status = progMap.get(m.id) || "belum_mulai";
            const isSelesai = status==="selesai";
            const isSedang = status==="sedang";
            return (
              <Link key={m.id} href={`/materi/${m.slug}`} className="group bg-white rounded-[1.25rem] border border-orange-100 shadow-card overflow-hidden card-hover flex flex-col">
                <div className="relative">
                  {m.sampulUrl ? (
                    <img src={m.sampulUrl} alt={m.judul} className="w-full h-40 object-cover group-hover:scale-[1.02] transition-transform duration-300" />
                  ) : (
                    <div className="w-full h-40 bg-gradient-to-br from-orange-100 via-amber-50 to-white flex items-center justify-center">
                      <span className="text-4xl">📚</span>
                    </div>
                  )}
                  <div className="absolute top-3 left-3 flex gap-2">
                    <span className={`badge ${isSelesai ? "badge-success" : isSedang ? "badge-warm" : "badge-neutral"}`}>
                      {isSelesai ? <><CheckCircle2 className="w-3.5 h-3.5" /> Selesai</> : isSedang ? <><Play className="w-3.5 h-3.5" /> Lanjutkan</> : `0${idx+1} • Baru`}
                    </span>
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur rounded-full px-2.5 py-1 text-xs font-semibold flex items-center gap-1 border border-orange-100">
                    <Clock className="w-3.5 h-3.5 text-zinc-500" /> 10 menit
                  </div>
                </div>
                <div className="p-4 flex-1 flex flex-col">
                  <h3 className="font-bold text-ink-900 leading-tight group-hover:text-brand-700 transition-colors">{m.judul}</h3>
                  <p className="text-sm text-zinc-600 line-clamp-2 mt-1 flex-1">{m.ringkasan}</p>
                  <div className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-brand-700">
                    {isSelesai ? "Ulas lagi" : isSedang ? "Lanjutkan belajar" : "Mulai belajar"} <span className="group-hover:translate-x-0.5 transition-transform">→</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
