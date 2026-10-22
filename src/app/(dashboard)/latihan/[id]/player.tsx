"use client";
import { useState } from "react";
import Link from "next/link";

export default function LatihanPlayer({ setId, questions, materiId }: { setId:string, questions:any[], materiId?:string }) {
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [finished, setFinished] = useState(false);
  const [result, setResult] = useState<any>(null);

  async function next() {
    if (idx+1 < questions.length) setIdx(i=>i+1);
    else {
      // submit
      const res = await fetch("/api/latihan-submit", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ setId, jawaban: answers }) });
      const data = await res.json();
      setResult(data);
      setFinished(true);
    }
  }

  if (questions.length===0) return <div className="card mt-6 text-center text-zinc-500">Belum ada soal</div>;

  if (finished && result) {
    return (
      <div className="card mt-6">
        <h2 className="text-xl font-bold text-center">Hasil: {result.skor}/{result.total} benar</h2>
        <div className="text-center text-sm text-zinc-500">Skor {Math.round((result.skor/result.total)*100)}% • Poin +{result.skor*5}</div>
        <div className="mt-6 space-y-4">
          {result.detail.map((d:any,i:number)=>(
            <div key={i} className={`p-4 rounded-xl border ${d.benar?"bg-green-50 border-green-200":"bg-red-50 border-red-200"}`}>
              <div className="font-semibold">{i+1}. {d.pertanyaan}</div>
              <div className="text-sm mt-1">Jawabanmu: {d.opsi[d.jawab]} {d.benar?"✅":"❌"} { !d.benar && <span className="text-green-700">• Kunci: {d.opsi[d.kunci]}</span>}</div>
              {d.pembahasan && <div className="text-sm bg-white p-2 rounded-lg mt-2">💡 {d.pembahasan}</div>}
            </div>
          ))}
        </div>
        <div className="flex gap-3 mt-6">
          <button onClick={()=>{ setIdx(0); setAnswers({}); setFinished(false); setResult(null); }} className="btn-primary flex-1">Ulangi</button>
          {materiId && <Link href={`/materi`} className="btn-ghost flex-1 text-center">Baca Materi</Link>}
          <Link href={`/tanya-ai?soal=${setId}`} className="btn-ghost flex-1 text-center">Tanya AI</Link>
        </div>
      </div>
    );
  }

  const q = questions[idx];
  const opsi = q.opsi as string[];
  return (
    <div className="card mt-6">
      <div className="flex justify-between text-sm font-semibold"><span>Soal {idx+1}/{questions.length}</span><span className="text-zinc-500">{Math.round(((idx)/questions.length)*100)}%</span></div>
      <div className="w-full bg-zinc-100 rounded-full h-2 mt-2"><div className="bg-brand-500 h-2 rounded-full" style={{ width:`${((idx)/questions.length)*100}%`}} /></div>
      <h3 className="font-bold text-lg mt-4">{q.pertanyaan}</h3>
      <div className="grid gap-2 mt-4">
        {opsi.map((o:string,i:number)=> (
          <button key={i} onClick={()=> setAnswers(a=>({...a, [q.id]: i}))} className={`p-3 rounded-xl border text-left ${answers[q.id]===i?"bg-brand-500 text-white border-brand-500":"bg-white border-zinc-200 hover:bg-orange-50"}`}>
            <span className="font-bold mr-2">{String.fromCharCode(65+i)}.</span>{o}
          </button>
        ))}
      </div>
      <button disabled={answers[q.id]===undefined} onClick={next} className="btn-primary w-full mt-6 disabled:opacity-50">{idx+1===questions.length ? "Selesai & Lihat Hasil" : "Lanjut →"}</button>
    </div>
  );
}
