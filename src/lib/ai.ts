/**
 * Adapter AI yang mendukung free tier tanpa kartu kredit:
 * - Groq (prioritas): 30 RPM / 1.000 RPD per model, no card, cepat (LPU)
 * - Google Gemini: Flash/Flash-Lite, no card, per-project quota di AI Studio
 * - Fallback mock jika tidak ada kunci
 */

export const SYSTEM_PROMPT = `Kamu adalah asisten belajar kewirausahaan untuk pemula di Samarinda, Indonesia.
Aturan:
- Jelaskan dengan bahasa Indonesia sederhana, ramah, dan singkat.
- Beri contoh dari kehidupan usaha kecil di Samarinda (mis. warung di Sungai Kunjang, jualan di Pasar Pagi, mahasiswa Unmul).
- Hanya jawab topik pembelajaran: modal, HPP, harga jual, laba, omzet, pemasaran, manajemen stok, ide usaha.
- Jika ditanya di luar topik, tolak sopan dan arahkan kembali ke pembelajaran wirausaha.
- Jangan berikan nasihat medis, hukum, atau politik.
`;

export type AiStreamChunk = { text: string };

export async function* streamAiResponse(message: string, konteks?: string): AsyncGenerator<string> {
  const groqKey = process.env.GROQ_API_KEY;
  const geminiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY;

  // 1) Groq (prioritas) - free tier no card, OpenAI-compatible
  if (groqKey) {
    yield* streamGroq(message, konteks, groqKey);
    return;
  }

  // 2) Gemini - free tier no card, but variable quotas
  if (geminiKey) {
    yield* streamGemini(message, konteks, geminiKey);
    return;
  }

  // 3) Fallback mock (tanpa kunci)
  const mock = `Halo! Ini respons contoh (kunci AI belum diatur).\n\nKonteks: ${konteks ? konteks.slice(0, 300) : "umum"}\n\nPertanyaanmu: "${message}"\n\nUntuk usaha di Samarinda, mulailah dari hitung modal dan tes pasar kecil. Contoh: jika jual 20 porsi nasi kuning Rp12.000, omzet Rp240.000/hari. Atur HPP agar laba 25% ya!\n\n💡 Tip: Atur GROQ_API_KEY (gratis, tanpa kartu) atau GEMINI_API_KEY di .env untuk jawaban AI nyata.`;
  // simulate streaming per sentence
  for (const part of mock.split(/(?<=[.!?\n])/g)) {
    yield part;
    await new Promise((r) => setTimeout(r, 30));
  }
}

async function* streamGroq(message: string, konteks: string | undefined, apiKey: string): AsyncGenerator<string> {
  const system = SYSTEM_PROMPT + (konteks ? `\nKonteks materi: ${konteks}` : "");
  const model = process.env.GROQ_MODEL || "llama-3.1-8b-instant"; // free tier: 30 RPM, 14.400 RPD, 6k TPM

  // Use Groq OpenAI-compatible streaming API via fetch
  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: [
        { role: "system", content: system },
        { role: "user", content: message },
      ],
      max_tokens: 800,
      temperature: 0.7,
      stream: true,
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Groq API error ${res.status}: ${txt.slice(0, 500)}`);
  }

  if (!res.body) throw new Error("Groq response body kosong");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed || trimmed === "data: [DONE]") continue;
      if (!trimmed.startsWith("data: ")) continue;
      try {
        const json = JSON.parse(trimmed.slice(6));
        const delta = json.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {}
    }
  }
}

async function* streamGemini(message: string, konteks: string | undefined, apiKey: string): AsyncGenerator<string> {
  const model = process.env.GEMINI_MODEL || "gemini-2.0-flash"; // atau gemini-2.5-flash-lite, cek AI Studio
  const prompt = (konteks ? `Konteks: ${konteks}\n\n` : "") + `Pertanyaan: ${message}`;

  // Gemini streaming via REST (generateContent with stream)
  // Fallback non-streaming jika streaming gagal
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:streamGenerateContent?key=${apiKey}&alt=sse`;

  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { maxOutputTokens: 800, temperature: 0.7 },
    }),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`Gemini API error ${res.status}: ${txt.slice(0, 500)}`);
  }

  if (!res.body) throw new Error("Gemini body kosong");

  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const lines = buffer.split("\n");
    buffer = lines.pop() || "";
    for (const line of lines) {
      if (!line.trim().startsWith("data:")) continue;
      const dataStr = line.replace(/^data:\s*/, "").trim();
      if (!dataStr || dataStr === "[DONE]") continue;
      try {
        const json = JSON.parse(dataStr);
        const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) yield text;
      } catch {}
    }
  }
}

export function getAiProviderInfo() {
  if (process.env.GROQ_API_KEY) return { provider: "groq", model: process.env.GROQ_MODEL || "llama-3.1-8b-instant", freeTier: "Groq Free: 30 RPM / 1.000 RPD, tanpa kartu" };
  if (process.env.GEMINI_API_KEY || process.env.GOOGLE_GENERATIVE_AI_API_KEY) return { provider: "gemini", model: process.env.GEMINI_MODEL || "gemini-2.0-flash", freeTier: "Gemini Free: quota per-project di AI Studio, tanpa kartu" };
  return { provider: "mock", model: "mock", freeTier: "Belum ada kunci, mode demo" };
}
