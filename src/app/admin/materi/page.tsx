import { getDb } from "@/lib/db";
import { materi } from "@/lib/db/schema";
import { asc } from "drizzle-orm";
import Link from "next/link";
import MateriTableClient from "./table-client";

export default async function AdminMateriPage() {
  let list:any[]=[];
  try {
    const db = getDb();
    if (db) list = await db.select().from(materi).orderBy(asc(materi.urutan));
  } catch {}
  return (
    <div>
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Kelola Materi</h1>
        <Link href="/admin/materi/new" className="btn-primary">+ Tambah Materi</Link>
      </div>
      <MateriTableClient initial={list} />
    </div>
  );
}
