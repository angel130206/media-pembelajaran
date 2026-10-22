import { getDb } from "@/lib/db";
import { soalSet, soal } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import SoalManager from "./manager";

export default async function SoalDetail({ params }: { params:{id:string}}) {
  let set:any=null; let questions:any[]=[];
  try {
    const db = getDb();
    if (db) {
      const [s]=await db.select().from(soalSet).where(eq(soalSet.id, params.id)).limit(1);
      if (!s) return notFound();
      set=s;
      questions = await db.select().from(soal).where(eq(soal.setId, s.id)).orderBy(asc(soal.urutan));
    }
  } catch { return notFound(); }
  return (
    <div>
      <h1 className="text-2xl font-bold">Soal: {set.judul}</h1>
      <SoalManager setId={set.id} initial={questions} />
    </div>
  );
}
