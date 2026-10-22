"use client";
import { gameRegistry } from "@/components/games/registry";
import { useState } from "react";
import Link from "next/link";

export default function GamePlayer({ gameId }: { gameId:string }) {
  const entry = gameRegistry.find(g=> g.id===gameId);
  const [finished, setFinished] = useState(false);
  const [score, setScore] = useState(0);
  const [started, setStarted] = useState(false);

  async function onFinish(s:number) {
    setScore(s); setFinished(true);
    await fetch("/api/game-score", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ gameId, skor:s }) });
  }

  if (!entry) return null;
  const Comp = entry.komponen as any;

  if (finished) {
    return (
      <div className="card text-center">
        <div className="text-5xl">🎉</div>
        <h2 className="text-2xl font-bold mt-2">Skor Kamu: {score}</h2>
        <p className="text-sm text-zinc-500">Kerja bagus! Poin sudah ditambahkan.</p>
        <div className="flex gap-3 mt-6 justify-center">
          <button onClick={()=>{ setFinished(false); setStarted(false); setScore(0); }} className="btn-primary">Main Lagi</button>
          <Link href="/materi" className="btn-ghost">Buka Materi</Link>
          <Link href="/game" className="btn-ghost">Kembali</Link>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className="card text-center">
        <div className="text-4xl">{entry.icon}</div>
        <h3 className="font-bold mt-2">{entry.judul}</h3>
        <p className="text-sm text-zinc-500 mt-1">{entry.deskripsi}</p>
        <div className="bg-orange-50 rounded-xl p-3 text-sm mt-4 text-left">
          <div className="font-semibold">Petunjuk:</div>
          <ul className="list-disc pl-5 mt-1 text-zinc-600">
            <li>Main dengan sentuh / klik</li>
            <li>Raih skor setinggi mungkin</li>
            <li>Skor akan disimpan otomatis</li>
          </ul>
        </div>
        <button onClick={()=>setStarted(true)} className="btn-primary w-full mt-4">Mulai Main ▶</button>
      </div>
    );
  }

  return <Comp onFinish={onFinish} />;
}
