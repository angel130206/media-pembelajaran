import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { soal, soalSet, hasilLatihan, poinLog } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const { setId, jawaban } = await req.json();
  if (!setId || !jawaban) return NextResponse.json({ error:"Data tidak valid" }, { status:400 });
  const db = getDb();
  if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  const questions = await db.select().from(soal).where(eq(soal.setId, setId));
  let skor=0;
  const detail = questions.map(q=> {
    const jawab = jawaban[q.id];
    const benar = jawab===q.kunci;
    if (benar) skor++;
    return { pertanyaan: q.pertanyaan, opsi: q.opsi as string[], jawab, kunci: q.kunci, benar, pembahasan: q.pembahasan };
  });
  await db.insert(hasilLatihan).values({ userId: (session.user as any).id, setId, skor, total: questions.length, jawaban });
  await db.insert(poinLog).values({ userId: (session.user as any).id, jumlah: skor*5, alasan:`Latihan ${setId}` });
  return NextResponse.json({ skor, total: questions.length, detail });
}
