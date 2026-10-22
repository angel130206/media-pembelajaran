"use client";
import { useState } from "react";

type Props = { onFinish:(score:number)=>void };
const pairs = [
  { istilah:"Modal", arti:"Uang awal untuk usaha" },
  { istilah:"Omzet", arti:"Total penjualan kotor" },
  { istilah:"Laba", arti:"Keuntungan bersih" },
  { istilah:"HPP", arti:"Biaya buat satu produk" },
  { istilah:"Pasar Sasaran", arti:"Kelompok pembeli yang dituju" },
  { istilah:"Stok", arti:"Persediaan barang" },
];

export default function TebakIstilah({ onFinish }: Props) {
  const [shuffledArti] = useState(()=> [...pairs].sort(()=>Math.random()-0.5));
  const [selectedIstilah, setSelectedIstilah] = useState<string|null>(null);
  const [selectedArti, setSelectedArti] = useState<string|null>(null);
  const [matched, setMatched] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState("");

  function pickIstilah(i:string) { setSelectedIstilah(i); tryMatch(i, selectedArti); }
  function pickArti(a:string) { setSelectedArti(a); tryMatch(selectedIstilah, a); }
  function tryMatch(istilah:string|null, arti:string|null) {
    if (!istilah || !arti) return;
    const correct = pairs.find(p=>p.istilah===istilah)?.arti===arti;
    if (correct) {
      setMatched(m=>[...m, istilah]);
      setScore(s=>s+15);
      setWrong("✅ Cocok!");
      setTimeout(()=>{ setSelectedIstilah(null); setSelectedArti(null); setWrong(""); if (matched.length+1===pairs.length) onFinish(score+15); },600);
    } else {
      setWrong("❌ Belum cocok, coba lagi");
      setTimeout(()=>{ setSelectedIstilah(null); setSelectedArti(null); setWrong(""); },800);
    }
  }

  return (
    <div className="max-w-2xl mx-auto card">
      <div className="flex justify-between text-sm font-semibold"><span>⭐ {score}</span><span>{matched.length}/{pairs.length} cocok</span></div>
      {wrong && <div className="text-center font-semibold mt-2">{wrong}</div>}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div className="space-y-2">
          <div className="font-bold text-sm">Istilah</div>
          {pairs.map(p=> {
            const done = matched.includes(p.istilah);
            return <button key={p.istilah} disabled={done} onClick={()=>pickIstilah(p.istilah)} className={`w-full p-3 rounded-xl border text-left font-medium ${done?"bg-green-100 border-green-300": selectedIstilah===p.istilah?"bg-brand-500 text-white":"bg-white hover:bg-orange-50"}`}>{p.istilah}</button>;
          })}
        </div>
        <div className="space-y-2">
          <div className="font-bold text-sm">Arti</div>
          {shuffledArti.map(p=> {
            const done = matched.includes(p.istilah);
            return <button key={p.arti} disabled={done} onClick={()=>pickArti(p.arti)} className={`w-full p-3 rounded-xl border text-left text-sm ${done?"bg-green-100 border-green-300": selectedArti===p.arti?"bg-teal-500 text-white":"bg-white hover:bg-teal-50"}`}>{p.arti}</button>;
          })}
        </div>
      </div>
    </div>
  );
}
