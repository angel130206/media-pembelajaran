import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { soal } from "@/lib/db/schema";

export async function POST(req: Request) {
  const session = await auth();
  if (!session || (session.user as any).role==="siswa") return NextResponse.json({ error:"Forbidden" }, { status:403 });
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const setId = form.get("setId") as string;
  if (!file || !setId) return NextResponse.json({ error:"File & setId wajib" }, { status:400 });
  const text = await file.text();
  const lines = text.split("\n").filter(l=> l.trim());
  const header = lines[0].split(",").map(s=> s.trim().toLowerCase());
  const required = ["pertanyaan","opsi_a","opsi_b","opsi_c","opsi_d","kunci"];
  for (const r of required) if (!header.includes(r)) return NextResponse.json({ error:`Header harus mengandung ${required.join(",")}` }, { status:400 });
  const db = getDb(); if (!db) return NextResponse.json({ error:"DB error" }, { status:500 });
  let inserted=0;
  for (let i=1;i<lines.length;i++) {
    // simple CSV parse handling quotes
    const row = parseCSV(lines[i]);
    if (row.length <6) continue;
    const obj: any = {};
    header.forEach((h,idx)=> obj[h]=row[idx]);
    const kunciMap:any = { A:0, B:1, C:2, D:3, a:0,b:1,c:2,d:3, "0":0,"1":1,"2":2,"3":3 };
    const kunci = kunciMap[obj.kunci?.trim()] ?? 0;
    await db.insert(soal).values({
      setId,
      pertanyaan: obj.pertanyaan,
      opsi: [obj.opsi_a, obj.opsi_b, obj.opsi_c, obj.opsi_d],
      kunci,
      pembahasan: obj.pembahasan || null,
      urutan: i,
    });
    inserted++;
  }
  return NextResponse.json({ ok:true, inserted });
}

function parseCSV(line:string):string[] {
  const result:string[]=[]; let cur=""; let inQuotes=false;
  for (let i=0;i<line.length;i++) {
    const c=line[i];
    if (c=='"') { inQuotes=!inQuotes; continue; }
    if (c=="," && !inQuotes) { result.push(cur.trim()); cur=""; continue; }
    cur+=c;
  }
  result.push(cur.trim());
  return result;
}
