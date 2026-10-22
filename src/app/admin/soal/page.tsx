import { getDb } from "@/lib/db";
import { materi, soalSet } from "@/lib/db/schema";
import Link from "next/link";

export default async function AdminSoalPage() {
  let sets:any[]=[]; let materiList:any[]=[];
  try {
    const db = getDb();
    if (db) {
      sets = await db.select().from(soalSet);
      materiList = await db.select().from(materi);
    }
  } catch {}
  const map = new Map(materiList.map(m=>[m.id, m.judul]));
  return (
    <div>
      <h1 className="text-2xl font-bold">Kelola Soal</h1>
      <div className="mt-4 card">
        <h3 className="font-bold">Buat Set Soal</h3>
        <SetForm materiList={materiList} />
      </div>
      <div className="mt-6 space-y-3">
        {sets.map(s=> (
          <div key={s.id} className="card flex justify-between items-center">
            <div><div className="font-bold">{s.judul}</div><div className="text-xs text-zinc-500">Materi: {map.get(s.materiId) || "-"}</div></div>
            <Link href={`/admin/soal/${s.id}`} className="px-3 py-1.5 border rounded-lg text-sm">Kelola Soal</Link>
          </div>
        ))}
        {sets.length===0 && <div className="text-sm text-zinc-500">Belum ada set</div>}
      </div>
    </div>
  );
}

function SetForm({ materiList }: { materiList:any[] }) {
  // client component inline
  return <ClientSetForm materiList={materiList} />;
}

import ClientSetForm from "./set-form";
