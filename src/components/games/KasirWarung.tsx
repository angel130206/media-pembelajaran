"use client";
import { useState, useEffect, useRef } from "react";

type Props = { onFinish: (score:number)=>void };
type Order = { id:number; item:string; price:number; pay:number; emoji:string };

const ITEMS = [
  { item:"Nasi Kuning", price:12000, emoji:"🍛" },
  { item:"Es Teh", price:5000, emoji:"🧋" },
  { item:"Gorengan", price:2000, emoji:"🍘" },
  { item:"Ayam Bakar", price:18000, emoji:"🍗" },
];

export default function KasirWarung({ onFinish }: Props) {
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(60);
  const [order, setOrder] = useState<Order | null>(null);
  const [input, setInput] = useState("");
  const [feedback, setFeedback] = useState("");
  const [stok, setStok] = useState(10);
  const [pelanggan, setPelanggan] = useState(0);

  function newOrder() {
    const it = ITEMS[Math.floor(Math.random()*ITEMS.length)];
    const payOptions = [20000,50000,10000,20000];
    const pay = payOptions[Math.floor(Math.random()*payOptions.length)];
    // ensure pay >= price
    const finalPay = Math.max(pay, it.price + Math.floor(Math.random()*5000));
    setOrder({ id: Date.now(), item: it.item, price: it.price, pay: finalPay, emoji: it.emoji });
    setInput(""); setFeedback("");
  }

  useEffect(()=>{ newOrder(); },[]);
  useEffect(()=>{
    if (time<=0) { onFinish(score); return; }
    const t = setInterval(()=>setTime(s=>s-1),1000);
    return ()=>clearInterval(t);
  },[time]);

  function submit() {
    if (!order) return;
    const kembalian = order.pay - order.price;
    const jawab = parseInt(input.replace(/\D/g,"")) || 0;
    if (jawab===kembalian) {
      setScore(s=>s+15);
      setStok(s=>Math.max(0,s-1));
      setPelanggan(p=>p+1);
      setFeedback("✅ Tepat! +15 poin");
    } else {
      setScore(s=>Math.max(0,s-5));
      setFeedback(`❌ Seharusnya Rp${kembalian.toLocaleString("id-ID")}`);
    }
    setTimeout(newOrder, 800);
  }

  return (
    <div className="max-w-md mx-auto card">
      <div className="flex justify-between text-sm font-semibold">
        <span>⏱ {time}s</span><span>⭐ Skor {score}</span><span>📦 Stok {stok}</span>
      </div>
      <div className="mt-4 text-center">
        <div className="text-5xl">{order?.emoji}</div>
        <div className="font-bold mt-2">{order?.item} — Rp{order?.price.toLocaleString("id-ID")}</div>
        <div className="text-sm text-zinc-500">Pelanggan bayar Rp{order?.pay.toLocaleString("id-ID")}</div>
        <div className="text-lg font-bold mt-2">Kembalian berapa?</div>
        <input value={input} onChange={e=>setInput(e.target.value)} placeholder="contoh 8000" className="mt-3 w-full rounded-xl border px-4 py-3 text-center text-lg" inputMode="numeric" />
        <button onClick={submit} className="btn-primary w-full mt-3">Bayar Kembalian</button>
        {feedback && <div className="mt-3 text-sm font-semibold">{feedback}</div>}
        <div className="mt-4 text-xs text-zinc-500">Layani {pelanggan} pelanggan • Hitung cepat & tepat!</div>
      </div>
    </div>
  );
}
