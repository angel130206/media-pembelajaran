"use client";
import { useState, useRef } from "react";

export default function TanyaClient({ initialContext }: { initialContext?:string }) {
  const [messages, setMessages] = useState<{role:"user"|"assistant", content:string}[]>(initialContext ? [{ role:"assistant", content:`Halo! Aku siap bantu kamu belajar tentang:\n${initialContext}\n\nTanya apa saja tentang materi ini ya!`}] : [{ role:"assistant", content:"Halo! 👋 Aku asisten belajar wirausaha Samarinda. Tanya tentang modal, omzet, HPP, atau ide usaha — aku jelaskan dengan bahasa sederhana dan contoh warung di Samarinda." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  async function send() {
    if (!input.trim()) return;
    const userMsg = input; setInput("");
    setMessages(m=>[...m, { role:"user", content:userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ message:userMsg, konteks: initialContext }) });
      if (!res.ok) {
        const err = await res.json();
        setMessages(m=>[...m, { role:"assistant", content: err.error || "Gagal menghubungi AI" }]);
      } else if (res.body) {
        // streaming
        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let assistantText = "";
        setMessages(m=>[...m, { role:"assistant", content:"" }]);
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value);
          assistantText += chunk;
          setMessages(m=> {
            const copy = [...m];
            copy[copy.length-1] = { role:"assistant", content: assistantText };
            return copy;
          });
        }
      }
    } catch { setMessages(m=>[...m, { role:"assistant", content:"Terjadi kesalahan." }]); }
    setLoading(false);
  }

  return (
    <div className="flex flex-col flex-1 mt-4 card p-0 overflow-hidden">
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((m,i)=> (
          <div key={i} className={`max-w-[85%] p-3 rounded-2xl text-sm ${m.role==="user"?"bg-brand-500 text-white ml-auto":"bg-zinc-100"}`}>
            <div className="whitespace-pre-wrap">{m.content}</div>
          </div>
        ))}
        {loading && <div className="text-xs text-zinc-500">AI mengetik...</div>}
      </div>
      <div className="p-3 border-t flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==="Enter" && send()} placeholder="Tulis pertanyaanmu..." maxLength={2000} className="flex-1 rounded-xl border px-4 py-2.5" />
        <button onClick={send} disabled={loading || !input.trim()} className="btn-primary disabled:opacity-50">Kirim</button>
      </div>
      <div className="text-xs text-zinc-500 p-2 text-center">Batas 30 pesan/jam • Jawaban hanya untuk pembelajaran wirausaha</div>
    </div>
  );
}
