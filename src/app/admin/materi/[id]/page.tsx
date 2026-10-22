import { getDb } from "@/lib/db";
import { materi, gameMateri } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import MateriForm from "../form";
import { notFound } from "next/navigation";

export default async function EditMateri({ params }: { params:{id:string}}) {
  let m:any=null; let linkedGameIds:string[]=[];
  try {
    const db = getDb();
    if (db) {
      const [found]=await db.select().from(materi).where(eq(materi.id, params.id)).limit(1);
      if (!found) return notFound();
      m=found;
      const gm=await db.select().from(gameMateri).where(eq(gameMateri.materiId, m.id));
      linkedGameIds = gm.map(g=> g.gameId);
    }
  } catch { return notFound(); }
  return <MateriForm initial={m} linkedGames={linkedGameIds} />;
}
