import { getDb } from "@/lib/db";
import { soalSet, materi } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

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
  if (searchParams?.set) {
    // redirect handled inside detail page, but we support single set view via query?
  }
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold">Latihan Soal</h1>
      <p className="text-sm text-zinc-500">Uji pemahamanmu per materi</p>
      {sets.length===0 ? <div className="card mt-6 text-center py-10 text-zinc-500">Belum ada set soal</div> : (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {sets.map(s=> {
            const m = materiMap.get(s.materiId);
            return (
              <Link key={s.id} href={`/latihan/${s.id}`} className="card hover:shadow-lg">
                <div className="font-bold">{s.judul}</div>
                <div className="text-sm text-zinc-500">Materi: {m?.judul || "-"}</div>
                <div className="mt-3 text-sm text-brand-600 font-semibold">Kerjakan →</div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
