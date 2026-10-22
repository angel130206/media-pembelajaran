import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { aiRateLimit } from "@/lib/db/schema";
import { eq, and, gte } from "drizzle-orm";
import { chatSchema } from "@/lib/validation";

export const runtime = "nodejs";

const SYSTEM_PROMPT = `Kamu adalah asisten belajar kewirausahaan untuk pemula di Samarinda, Indonesia.
Aturan:
- Jelaskan dengan bahasa Indonesia sederhana, ramah, dan singkat.
- Beri contoh dari kehidupan usaha kecil di Samarinda (mis. warung di Sungai Kunjang, jualan di Pasar Pagi, mahasiswa Unmul).
- Hanya jawab topik pembelajaran: modal, HPP, harga jual, laba, omzet, pemasaran, manajemen stok, ide usaha.
- Jika ditanya di luar topik, tolak sopan dan arahkan kembali ke pembelajaran wirausaha.
- Jangan berikan nasihat medis, hukum, atau politik.
`;

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error:"Unauthorized" }, { status:401 });
  const body = await req.json();
  const parsed = chatSchema.safeParse({ message: body.message });
  if (!parsed.success) return NextResponse.json({ error:"Pesan tidak valid (max 2000 karakter)" }, { status:400 });
  const message = parsed.data.message;
  const konteks = body.konteks as string | undefined;

  // rate limit 30/jam
  const db = getDb();
  if (db) {
    const userId = (session.user as any).id;
    const oneHourAgo = new Date(Date.now() - 60*60*1000);
    const rows = await db.select().from(aiRateLimit).where(and(eq(aiRateLimit.userId, userId), gte(aiRateLimit.windowStart, oneHourAgo)));
    const count = rows.reduce((a,b)=>a+b.count,0);
    if (count >= 30) return NextResponse.json({ error:"Batas 30 pesan per jam tercapai. Coba lagi nanti." }, { status:429 });
    // upsert hour bucket
    const bucketStart = new Date(); bucketStart.setMinutes(0,0,0);
    const existing = rows.find(r=> r.windowStart.getTime()===bucketStart.getTime());
    if (existing) {
      await db.update(aiRateLimit).set({ count: existing.count+1 }).where(eq(aiRateLimit.id, existing.id));
    } else {
      await db.insert(aiRateLimit).values({ userId, windowStart: bucketStart, count:1 });
    }
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey || apiKey==="dummy") {
    // mock streaming response
    const mock = `Halo! Ini respons contoh (kunci ANTHROPIC_API_KEY belum diatur).\n\nKonteks: ${konteks ? konteks.slice(0,200) : "umum"}\n\nPertanyaanmu: "${message}"\n\nUntuk usaha di Samarinda, mulailah dari hitung modal dan tes pasar kecil. Contoh: jika jual 20 porsi nasi kuning Rp12.000, omzet Rp240.000/hari. Atur HPP agar laba 25% ya!`;
    return new Response(mock, { headers: { "Content-Type":"text/plain; charset=utf-8" } });
  }

  try {
    // dynamic import to avoid build requirement
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    const client = new Anthropic({ apiKey });
    const stream = await client.messages.stream({
      model: "claude-3-haiku-20240307",
      max_tokens: 800,
      system: SYSTEM_PROMPT + (konteks ? `\nKonteks materi: ${konteks}` : ""),
      messages: [{ role:"user", content: message }],
    });

    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        for await (const event of stream) {
          if (event.type==="content_block_delta" && (event as any).delta?.text) {
            controller.enqueue(encoder.encode((event as any).delta.text));
          }
        }
        controller.close();
      }
    });
    return new Response(readable, { headers: { "Content-Type":"text/plain; charset=utf-8" } });
  } catch (e:any) {
    return NextResponse.json({ error: e.message || "Gagal AI" }, { status:500 });
  }
}
