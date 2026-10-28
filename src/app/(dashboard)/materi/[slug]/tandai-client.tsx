"use client";
import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";
export default function TandaiSelesaiButton({ materiId }: { materiId: string }) {
  const [done, setDone] = useState(false);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");
  async function handle() {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/progress", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ materiId }) });
      const data = await res.json().catch(()=>({}));
      if (!res.ok) throw new Error(data.error || "Gagal menyimpan");
      setDone(true);
    } catch (e:any) { setErr(e.message); }
    setLoading(false);
  }
  if (done) return <div className="w-full flex items-center justify-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-xl font-semibold"><CheckCircle2 className="w-5 h-5" /> Selesai! +10 poin ditambahkan</div>;
  return (
    <div className="w-full">
      <button onClick={handle} disabled={loading} className="btn-primary w-full inline-flex items-center justify-center gap-2">
        {loading && <Loader2 className="w-4 h-4 animate-spin" />} {loading?"Menyimpan...":"Tandai selesai & dapatkan 10 poin"}
      </button>
      {err && <p className="text-xs text-red-600 mt-2 text-center">{err}</p>}
    </div>
  );
}
