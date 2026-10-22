"use client";
import { useState } from "react";
export default function TandaiSelesaiButton({ materiId }: { materiId: string }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  async function handle() {
    setLoading(true);
    const res = await fetch("/api/progress", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ materiId }) });
    setLoading(false);
    if (res.ok) setDone(true);
  }
  if (done) return <div className="bg-green-50 border border-green-200 text-green-700 p-4 rounded-xl text-center font-semibold">✅ Materi ditandai selesai! +10 poin</div>;
  return <button onClick={handle} disabled={loading} className="btn-primary w-full">{loading?"Menyimpan...":"Tandai selesai & dapatkan poin"}</button>;
}
