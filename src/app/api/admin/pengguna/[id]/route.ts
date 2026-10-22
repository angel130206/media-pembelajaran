import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";

export async function PATCH(req: Request, { params }: { params:{id:string}}) {
  const session = await auth();
  if (!session || (session.user as any).role==="siswa") return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const body = await req.json();
  const db = getDb(); if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  const updates:any = {};
  if (body.role) updates.role = body.role;
  if (typeof body.aktif==="boolean") updates.aktif = body.aktif;
  if (Object.keys(updates).length===0) return NextResponse.json({ error:"Tidak ada update" }, { status:400 });
  await db.update(users).set(updates).where(eq(users.id, params.id));
  return NextResponse.json({ ok:true });
}
