"use client";
import { useState, useEffect } from "react";

type Props = { onFinish:(score:number)=>void };
const cases = [
  { produk:"Es Teh Jumbo", modal:4000, targetUntung:30 },
  { produk:"Nasi Kuning", modal:10000, targetUntung:25 },
  { produk:"Keripik Pisang", modal:7000, targetUntung:40 },
  { produk:"Hijab Samarinda", modal:35000, targetUntung:20 },
  { produk:"Kue Lapis", modal:15000, targetUntung:35 },
];

export default function UntungRugi({ onFinish }: Props) {
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [answered, setAnswered] = useState(0);
  const total = 5;
  const cur = cases[idx];

  function submit() {
    const harga = parseInt(input.replace(/\D/g,""))||0;
    const ideal = Math.round(cur.modal * (1+cur.targetUntung/100));
    const diff = Math.abs(harga - ideal);
    const tolerance = ideal*0.05; // 5%
    let pts = 0;
    if (diff <= tolerance) { pts=20; setFeedback(`✅ Pas! Ideal Rp${ideal.toLocaleString("id-ID")} +20`); }
    else if (diff <= ideal*0.15) { pts=10; setFeedback(`🟡 Mendekati. Ideal Rp${ideal.toLocaleString("id-ID")} +10`); }
    else { pts=0; setFeedback(`❌ Kurang tepat. Ideal Rp${ideal.toLocaleString("id-ID")}`); }
    setScore(s=>s+pts);
    setAnswered(a=>a+1);
    setTimeout(()=>{
      if (idx+1>=total) onFinish(score+pts);
      else { setIdx(i=>i+1); setInput(""); setFeedback(""); }
    },900);
  }

  return (
    <div className="max-w-md mx-auto card">
      <div className="flex justify-between text-sm font-semibold"><span>Soal {idx+1}/{total}</span><span>⭐ {score}</span></div>
      <div className="mt-4 text-center">
        <div className="text-4xl">💰</div>
        <div className="font-bold text-lg mt-2">{cur.produk}</div>
        <div className="text-sm text-zinc-600">Modal/HPP: Rp{cur.modal.toLocaleString("id-ID")}</div>
        <div className="text-sm bg-amber-50 rounded-lg p-2 mt-2">Target untung <b>{cur.targetUntung}%</b>. Harga jual berapa agar untung?</div>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="Masukkan harga jual" className="mt-4 w-full rounded-xl border px-4 py-3 text-center text-lg" inputMode="numeric" />
        <button onClick={submit} className="btn-primary w-full mt-3">Kunci Harga</button>
        {feedback && <div className="mt-3 font-semibold text-sm">{feedback}</div>}
      </div>
    </div>
  );
}
