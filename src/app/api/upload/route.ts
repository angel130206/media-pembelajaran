import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { uploadToS3 } from "@/lib/s3";

export async function POST(req: Request) {
  const session = await auth();
  if (!session) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const form = await req.formData();
  const file = form.get("file") as File | null;
  if (!file) return NextResponse.json({ error:"File wajib" }, { status:400 });
  if (file.size > 5*1024*1024) return NextResponse.json({ error:"Maks 5MB" }, { status:400 });
  const allowed = ["image/jpeg","image/png","image/webp","image/gif"];
  if (!allowed.includes(file.type)) return NextResponse.json({ error:"Tipe file tidak didukung" }, { status:400 });
  const buf = Buffer.from(await file.arrayBuffer());
  const key = `uploads/${Date.now()}-${file.name.replace(/\s+/g,"-")}`;
  // if S3 not configured, return data url fallback (still stateless but allow demo)
  const endpoint = process.env.S3_ENDPOINT;
  if (!endpoint || process.env.S3_ACCESS_KEY==="dummy" || !process.env.S3_BUCKET) {
    // fallback: store as base64 data url (not ideal but works without S3)
    const base64 = buf.toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;
    return NextResponse.json({ url: dataUrl });
  }
  try {
    const url = await uploadToS3(buf, key, file.type);
    return NextResponse.json({ url });
  } catch (e:any) {
    return NextResponse.json({ error: e.message }, { status:500 });
  }
}
