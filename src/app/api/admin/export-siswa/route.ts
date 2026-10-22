import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users, progresMateri, poinLog, materi } from "@/lib/db/schema";

export async function GET() {
  const session = await auth();
  if (!session || (session.user as any).role==="siswa") return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const db = getDb(); if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  const allUsers = await db.select().from(users);
  const prog = await db.select().from(progresMateri);
  const poinRows = await db.select().from(poinLog);
  const poinMap = new Map<string,number>();
  for (const p of poinRows) poinMap.set(p.userId, (poinMap.get(p.userId)||0)+p.jumlah);
  const rows = [["nama","email","peran","minat","pengalaman","materi_selesai","poin"]];
  for (const u of allUsers) {
    const selesai = prog.filter(p=> p.userId===u.id && p.status==="selesai").length;
    rows.push([u.name||"", u.email, u.role, u.minat||"", u.pengalaman||"", String(selesai), String(poinMap.get(u.id)||0)]);
  }
  const csv = rows.map(r=> r.map(v=> `"${String(v).replace(/"/g,'""')}"`).join(",")).join("\n");
  return new Response(csv, { headers: { "Content-Type":"text/csv", "Content-Disposition":"attachment; filename=siswa.csv" } });
}
