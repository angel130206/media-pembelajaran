"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClientSetForm({ materiList }: { materiList:any[] }) {
  const [materiId, setMateriId] = useState("");
  const [judul, setJudul] = useState("");
  const router = useRouter();
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/admin/soal-set", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ materiId, judul }) });
    if (res.ok) { setJudul(""); router.refresh(); } else alert("Gagal");
  }
  return (
    <form onSubmit={submit} className="flex gap-2 mt-3">
      <select value={materiId} onChange={e=>setMateriId(e.target.value)} className="border rounded-xl px-3 py-2">
        <option value="">Pilih materi</option>
        {materiList.map((m:any)=> <option key={m.id} value={m.id}>{m.judul}</option>)}
      </select>
      <input value={judul} onChange={e=>setJudul(e.target.value)} placeholder="Judul set" className="flex-1 border rounded-xl px-3 py-2" required />
      <button className="btn-primary">Buat</button>
    </form>
  );
}
