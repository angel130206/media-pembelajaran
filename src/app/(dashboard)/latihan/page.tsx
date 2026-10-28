import { getDb } from "@/lib/db";
import { soalSet, materi } from "@/lib/db/schema";
import Link from "next/link";
import { GraduationCap, FileText, ArrowRight } from "lucide-react";

export default async function LatihanList({ searchParams }: { searchParams:{ set?:string } }) {
  let sets: any[] = [];
  let materiMap = new Map();
  try {
    const db = getDb();
    if (db) {
      sets = await db.select().from(soalSet);
      const ms = await db.select().from(materi);
      materiMap = new Map(ms.map(m=>[m.id, m]));
    }
  } catch {}
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-violet-700 uppercase"><GraduationCap className="w-4 h-4" /> Latihan Soal</div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink-900 mt-1">Uji pemahamanmu</h1>
        <p className="text-sm text-zinc-600">Kerjakan per materi, lihat pembahasan langsung, dan kumpulkan poin</p>
      </div>
      {sets.length===0 ? (
        <div className="card mt-6 text-center py-12">
          <div className="w-12 h-12 mx-auto rounded-xl bg-violet-100 flex items-center justify-center"><FileText className="w-6 h-6 text-violet-600" /></div>
          <p className="font-semibold mt-3">Belum ada set soal</p><p className="text-sm text-zinc-500">Admin akan menambah soal segera.</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {sets.map(s=> {
            const m = materiMap.get(s.materiId);
            return (
              <Link key={s.id} href={`/latihan/${s.id}`} className="group bg-white rounded-[1.25rem] border border-orange-100 p-5 shadow-card card-hover">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-bold text-ink-900 group-hover:text-brand-700 transition-colors">{s.judul}</div>
                    <div className="text-sm text-zinc-500 mt-1">Materi: {m?.judul || "-"}</div>
                  </div>
                  <div className="w-9 h-9 rounded-xl bg-violet-600 text-white flex items-center justify-center shrink-0"><FileText className="w-4 h-4" /></div>
                </div>
                <div className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-violet-700">Kerjakan sekarang <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" /></div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
