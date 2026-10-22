import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { materi, gameMateri } from "@/lib/db/schema";
import { slugify } from "@/lib/utils";
import { materiSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role==="siswa") return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const body = await req.json();
  const parsed = materiSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status:400 });
  const db = getDb(); if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  const d = parsed.data;
  const slug = d.slug ? slugify(d.slug) : slugify(d.judul);
  const { eq } = await import("drizzle-orm");
  const [dup] = await db.select().from(materi).where(eq(materi.slug, slug)).limit(1);
  const finalSlug = dup ? `${slug}-${Date.now().toString().slice(-4)}` : slug;

  // get max urutan
  const all = await db.select().from(materi);
  const maxU = all.reduce((a,b)=> Math.max(a, b.urutan||0),0);
  const inserted = await db.insert(materi).values({ judul:d.judul, slug: finalSlug, ringkasan:d.ringkasan, sampulUrl: d.sampulUrl || null, isi:d.isi, status:d.status, urutan: maxU+1 }).returning();
  const gameIds = (body.gameIds as string[]) || [];
  for (const gid of gameIds) await db.insert(gameMateri).values({ materiId: inserted[0].id, gameId: gid });
  return NextResponse.json({ ok:true, id: inserted[0].id });
}
