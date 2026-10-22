import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { materi, gameMateri } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { materiSchema } from "@/lib/validation";
import { slugify } from "@/lib/utils";

export async function PUT(req: Request, { params }: { params:{id:string}}) {
  const session = await auth();
  if (!session || (session.user as any).role==="siswa") return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const body = await req.json();
  const parsed = materiSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status:400 });
  const db = getDb(); if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  const d = parsed.data;
  await db.update(materi).set({ judul:d.judul, slug: d.slug? slugify(d.slug): slugify(d.judul), ringkasan:d.ringkasan, sampulUrl:d.sampulUrl||null, isi:d.isi, status:d.status, updatedAt: new Date() }).where(eq(materi.id, params.id));
  await db.delete(gameMateri).where(eq(gameMateri.materiId, params.id));
  const gameIds = (body.gameIds as string[]) || [];
  for (const gid of gameIds) await db.insert(gameMateri).values({ materiId: params.id, gameId:gid });
  return NextResponse.json({ ok:true });
}
export async function DELETE(req: Request, { params }: { params:{id:string}}) {
  const session = await auth();
  if (!session || (session.user as any).role==="siswa") return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const db = getDb(); if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  await db.delete(materi).where(eq(materi.id, params.id));
  return NextResponse.json({ ok:true });
}
