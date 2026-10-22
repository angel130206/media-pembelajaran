import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { soal } from "@/lib/db/schema";
import { soalSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role==="siswa") return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const body = await req.json();
  // body contains setId + soal fields
  const parsed = soalSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status:400 });
  const { setId } = body as any;
  if (!setId) return NextResponse.json({ error:"setId wajib" }, { status:400 });
  const db = getDb(); if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  const { eq } = await import("drizzle-orm");
  const all = await db.select().from(soal).where(eq(soal.setId, setId));
  const inserted = await db.insert(soal).values({ setId, pertanyaan: parsed.data.pertanyaan, opsi: parsed.data.opsi, kunci: parsed.data.kunci, pembahasan: parsed.data.pembahasan, urutan: all.length+1 }).returning();
  return NextResponse.json({ ok:true, soal: inserted[0] });
}
