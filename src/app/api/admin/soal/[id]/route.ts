import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { soal } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function DELETE(req: Request, { params }: { params:{id:string}}) {
  const session = await auth();
  if (!session || (session.user as any).role==="siswa") return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const db = getDb(); if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  await db.delete(soal).where(eq(soal.id, params.id));
  return NextResponse.json({ ok:true });
}
