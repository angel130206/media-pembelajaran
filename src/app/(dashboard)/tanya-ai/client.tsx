"use client";
import { useState, useRef, useEffect } from "react";
import { Send, Bot, User, Loader2 } from "lucide-react";

export default function TanyaClient({ initialContext }: { initialContext?:string }) {
  const [messages, setMessages] = useState<{role:"user"|"assistant", content:string}[]>(initialContext ? [{ role:"assistant", content:`Halo! Aku siap bantu kamu belajar tentang:\n${initialContext}\n\nTanya apa saja tentang materi ini ya!`} ] : [{ role:"assistant", content:"Halo! Aku asisten belajar wirausaha Samarinda. Tanya tentang modal, omzet, HPP, atau ide usaha — aku jelaskan dengan bahasa sederhana dan contoh warung di Samarinda." }]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(()=>{ listRef.current?.scrollTo({ top: listRef.current.scrollHeight, behavior: "smooth" }); }, [messages]);

  async function send() {
    if (!input.trim() || loading) return;
    const userMsg = input.trim(); setInput("");
    setMessages(m=>[...m, { role:"user", content:userMsg }]);
    setLoading(true);
    try {
      const res = await fetch("/api/chat", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ message:userMsg, konteks: initialContext }) });
      if (!res.ok) {
        const err = await res.json().catch(()=>({error:"Gagal menghubungi AI"}));
        setMessages(m=>[...m, { role:"assistant", content: err.error || "Gagal menghubungi AI. Coba lagi." }]);
      } else if (res.body) {
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
    } catch { setMessages(m=>[...m, { role:"assistant", content:"Terjadi kesalahan jaringan. Coba lagi." }]); }
    setLoading(false);
  }

  return (
    <div className="flex flex-col flex-1 mt-4 bg-white rounded-[1.25rem] border border-orange-100 shadow-card overflow-hidden">
      <div ref={listRef} className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#FFFBEB]/30">
        {messages.map((m,i)=> (
          <div key={i} className={`flex gap-3 ${m.role==="user" ? "justify-end" : "justify-start"}`}>
            {m.role==="assistant" && <div className="w-8 h-8 rounded-full bg-brand-600 text-white flex items-center justify-center shrink-0"><Bot className="w-4 h-4" /></div>}
            <div className={`max-w-[78%] rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm ${m.role==="user" ? "bg-brand-600 text-white rounded-br-md" : "bg-white border border-orange-100 rounded-bl-md"}`}>
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
            {m.role==="user" && <div className="w-8 h-8 rounded-full bg-zinc-900 text-white flex items-center justify-center shrink-0"><User className="w-4 h-4" /></div>}
          </div>
        ))}
        {loading && <div className="flex items-center gap-2 text-xs text-zinc-500"><Loader2 className="w-4 h-4 animate-spin" /> AI mengetik...</div>}
      </div>
      <div className="p-3 border-t border-orange-100 bg-white flex gap-2">
        <input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=> e.key==="Enter" && !e.shiftKey && send()} placeholder="Tulis pertanyaanmu..." maxLength={2000} className="flex-1 rounded-xl border border-zinc-200 bg-zinc-50 px-4 py-3 text-sm focus:bg-white focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10 outline-none" />
        <button onClick={send} disabled={loading || !input.trim()} className="bg-brand-600 hover:bg-brand-700 text-white rounded-xl px-5 font-semibold disabled:opacity-50 inline-flex items-center gap-2 transition-colors">
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Send className="w-4 h-4" />} Kirim
        </button>
      </div>
      <div className="text-xs text-zinc-500 p-2 text-center bg-orange-50/50 border-t border-orange-100">Batas 30 pesan/jam • Jawaban hanya untuk pembelajaran wirausaha</div>
    </div>
  );
}
