import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { materi } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role==="siswa") return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const { id, dir } = await req.json();
  const db = getDb(); if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  const list = await db.select().from(materi).orderBy(asc(materi.urutan));
  const idx = list.findIndex(m=> m.id===id);
  if (idx===-1) return NextResponse.json({ error:"Not found" }, { status:404 });
  const swapIdx = idx + dir;
  if (swapIdx <0 || swapIdx >= list.length) return NextResponse.json({ ok:true });
  const a = list[idx], b = list[swapIdx];
  await db.update(materi).set({ urutan: b.urutan }).where(eq(materi.id, a.id));
  await db.update(materi).set({ urutan: a.urutan }).where(eq(materi.id, b.id));
  return NextResponse.json({ ok:true });
}
