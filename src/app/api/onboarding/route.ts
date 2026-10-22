import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { onboardingSchema } from "@/lib/validation";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = onboardingSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Data tidak valid" }, { status: 400 });
  const db = getDb();
  if (!db) return NextResponse.json({ error: "DB error" }, { status: 500 });
  await db.update(users).set({ minat: parsed.data.minat, pengalaman: parsed.data.pengalaman as any, onboardingDone: true }).where(eq(users.id, (session.user as any).id));
  return NextResponse.json({ ok: true });
}
