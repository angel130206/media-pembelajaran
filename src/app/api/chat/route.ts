import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { aiRateLimit } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { chatSchema } from "@/lib/validation";
import { streamAiResponse } from "@/lib/ai";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = await req.json();
  const parsed = chatSchema.safeParse({ message: body.message });
  if (!parsed.success) return NextResponse.json({ error: "Pesan tidak valid (max 2000 karakter)" }, { status: 400 });
  const message = parsed.data.message;
  const konteks = body.konteks as string | undefined;

  // rate limit 30/jam (disimpan di DB, tetap stateless di server)
  const db = getDb();
  if (db) {
    const userId = (session.user as any).id;
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const rows = await db.select().from(aiRateLimit).where(and(eq(aiRateLimit.userId, userId), gte(aiRateLimit.windowStart, oneHourAgo)));
    const count = rows.reduce((a, b) => a + b.count, 0);
    if (count >= 30) return NextResponse.json({ error: "Batas 30 pesan per jam tercapai. Coba lagi nanti." }, { status: 429 });
    const bucketStart = new Date();
    bucketStart.setMinutes(0, 0, 0);
    const existing = rows.find((r) => r.windowStart.getTime() === bucketStart.getTime());
    if (existing) {
      await db.update(aiRateLimit).set({ count: existing.count + 1 }).where(eq(aiRateLimit.id, existing.id));
    } else {
      await db.insert(aiRateLimit).values({ userId, windowStart: bucketStart, count: 1 });
    }
  }

  try {
    const encoder = new TextEncoder();
    const stream = new ReadableStream({
      async start(controller) {
        try {
          for await (const chunk of streamAiResponse(message, konteks)) {
            controller.enqueue(encoder.encode(chunk));
          }
        } catch (e: any) {
          controller.enqueue(encoder.encode(`\n[Error AI: ${e.message}]`));
        }
        controller.close();
      },
    });
    return new Response(stream, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || "Gagal AI" }, { status: 500 });
  }
}
