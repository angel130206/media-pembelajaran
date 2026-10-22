import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { progresMateri, poinLog, lencana } from "@/lib/db/schema";
import { eq, and } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const { materiId } = await req.json();
  if (!materiId) return NextResponse.json({ error:"materiId wajib" }, { status:400 });
  const db = getDb();
  if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  const userId = (session.user as any).id;
  const existing = await db.select().from(progresMateri).where(and(eq(progresMateri.userId, userId), eq(progresMateri.materiId, materiId))).limit(1);
  if (existing.length && existing[0].status==="selesai") return NextResponse.json({ ok:true, already:true });
  if (existing.length) {
    await db.update(progresMateri).set({ status:"selesai", selesaiPada: new Date() }).where(and(eq(progresMateri.userId, userId), eq(progresMateri.materiId, materiId)));
  } else {
    await db.insert(progresMateri).values({ userId, materiId, status:"selesai", selesaiPada: new Date() });
  }
  await db.insert(poinLog).values({ userId, jumlah:10, alasan:"Selesaikan materi" });
  // check lencana pertama
  const allDone = await db.select().from(progresMateri).where(and(eq(progresMateri.userId, userId), eq(progresMateri.status,"selesai")));
  if (allDone.length===1) {
    await db.insert(lencana).values({ userId, nama:"Langkah Pertama", deskripsi:"Selesaikan 1 materi", ikon:"🌟" });
  }
  if (allDone.length===5) {
    await db.insert(lencana).values({ userId, nama:"Rajin Belajar", deskripsi:"Selesaikan 5 materi", ikon:"📚" });
  }
  return NextResponse.json({ ok:true });
}
