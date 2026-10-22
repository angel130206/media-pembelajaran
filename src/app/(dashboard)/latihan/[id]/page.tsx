import { getDb } from "@/lib/db";
import { soalSet, soal, materi } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { notFound } from "next/navigation";
import LatihanPlayer from "./player";

export default async function LatihanDetail({ params }: { params:{id:string}}) {
  let set: any = null; let questions: any[]=[]; let mat: any=null;
  try {
    const db = getDb();
    if (db) {
      const [s] = await db.select().from(soalSet).where(eq(soalSet.id, params.id)).limit(1);
      if (!s) return notFound();
      set = s;
      questions = await db.select().from(soal).where(eq(soal.setId, s.id)).orderBy(asc(soal.urutan));
      if (s.materiId) { const [m]=await db.select().from(materi).where(eq(materi.id, s.materiId)).limit(1); mat=m; }
    }
  } catch { return notFound(); }
  if (!set) return notFound();
  return (
    <div className="max-w-2xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold">{set.judul}</h1>
      {mat && <p className="text-sm text-zinc-500">Materi: {mat.judul}</p>}
      <LatihanPlayer setId={set.id} questions={questions} materiId={mat?.id} />
    </div>
  );
}
