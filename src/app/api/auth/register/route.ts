import { NextResponse } from "next/server";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    const { name, email, password } = parsed.data;
    const db = getDb();
    if (!db) return NextResponse.json({ error: "DB belum siap" }, { status: 500 });
    const [exists] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (exists) return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 400 });
    const hash = await bcrypt.hash(password, 10);
    const role = (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) ? "admin" as const : "siswa" as const;
    await db.insert(users).values({ name, email, passwordHash: hash, role, onboardingDone: false });
    return NextResponse.json({ ok: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Gagal" }, { status: 500 });
  }
}
