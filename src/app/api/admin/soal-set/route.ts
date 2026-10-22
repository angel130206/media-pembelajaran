import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { soalSet } from "@/lib/db/schema";
import { soalSetSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role==="siswa") return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const body = await req.json();
  const parsed = soalSetSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error:"Data tidak valid" }, { status:400 });
  const db = getDb(); if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  const inserted = await db.insert(soalSet).values({ materiId: parsed.data.materiId, judul: parsed.data.judul }).returning();
  return NextResponse.json({ ok:true, id: inserted[0].id });
}
