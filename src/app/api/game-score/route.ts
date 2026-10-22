import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { skorGame, poinLog, lencana } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const { gameId, skor } = await req.json();
  if (!gameId || typeof skor!=="number") return NextResponse.json({ error:"Data tidak valid" }, { status:400 });
  const db = getDb();
  if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  const userId = (session.user as any).id;
  await db.insert(skorGame).values({ userId, gameId, skor });
  await db.insert(poinLog).values({ userId, jumlah: 10, alasan:`Game ${gameId}` });
  if (skor>=80) {
    const existing = await db.select().from(lencana).where(eq(lencana.userId, userId));
    if (!existing.find(l=>l.nama==="Juara Game")) {
      await db.insert(lencana).values({ userId, nama:"Juara Game", deskripsi:"Raih skor 80+ di game", ikon:"🏆" });
    }
  }
  return NextResponse.json({ ok:true });
}
