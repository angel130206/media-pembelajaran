"use client";
import { useState } from "react";
import TiptapEditor from "@/components/editor/TiptapEditor";
import { useRouter } from "next/navigation";
import { gameRegistry } from "@/components/games/registry";

export default function MateriForm({ initial, linkedGames=[] }: { initial?:any, linkedGames?:string[] }) {
  const router = useRouter();
  const [judul, setJudul] = useState(initial?.judul || "");
  const [ringkasan, setRingkasan] = useState(initial?.ringkasan || "");
  const [sampulUrl, setSampulUrl] = useState(initial?.sampulUrl || "");
  const [isi, setIsi] = useState(initial?.isi || "");
  const [status, setStatus] = useState(initial?.status || "draf");
  const [games, setGames] = useState<string[]>(linkedGames);
  const [loading, setLoading] = useState(false);
  const [sampulUploading, setSampulUploading] = useState(false);

  async function uploadSampul(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setSampulUploading(true);
    const fd = new FormData(); fd.append("file", file);
    const res = await fetch("/api/upload", { method:"POST", body: fd });
    const data = await res.json();
    setSampulUploading(false);
    if (data.url) setSampulUrl(data.url);
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true);
    const url = initial ? `/api/admin/materi/${initial.id}` : "/api/admin/materi";
    const method = initial ? "PUT" : "POST";
    const res = await fetch(url, { method, headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ judul, ringkasan, sampulUrl, isi, status, gameIds: games }) });
    setLoading(false);
    if (res.ok) router.push("/admin/materi");
    else alert("Gagal menyimpan");
  }

  function toggleGame(id:string) { setGames(g=> g.includes(id) ? g.filter(x=>x!==id) : [...g, id]); }

  return (
    <form onSubmit={submit} className="max-w-3xl space-y-4">
      <h1 className="text-2xl font-bold">{initial?"Ubah Materi":"Tambah Materi"}</h1>
      <div><label className="text-sm font-medium">Judul</label><input value={judul} onChange={e=>setJudul(e.target.value)} required className="w-full border rounded-xl px-4 py-2.5" /></div>
      <div><label className="text-sm font-medium">Ringkasan</label><textarea value={ringkasan} onChange={e=>setRingkasan(e.target.value)} className="w-full border rounded-xl px-4 py-2.5" rows={2} /></div>
      <div>
        <label className="text-sm font-medium">Gambar Sampul</label>
        <div className="flex gap-3 items-center mt-1">
          <input value={sampulUrl} onChange={e=>setSampulUrl(e.target.value)} placeholder="https://..." className="flex-1 border rounded-xl px-4 py-2.5" />
          <label className="btn-ghost cursor-pointer text-sm">{sampulUploading?"Upload...":"Upload"}<input type="file" accept="image/*" className="hidden" onChange={uploadSampul} /></label>
        </div>
        {sampulUrl && <img src={sampulUrl} alt="sampul" className="w-32 h-20 object-cover rounded-lg mt-2" />}
      </div>
      <div><label className="text-sm font-medium">Isi Materi</label><TiptapEditor content={isi} onChange={setIsi} /></div>
      <div>
        <label className="text-sm font-medium">Status</label>
        <select value={status} onChange={e=>setStatus(e.target.value)} className="w-full border rounded-xl px-4 py-2.5">
          <option value="draf">Draf</option><option value="terbit">Terbit</option>
        </select>
      </div>
      <div>
        <label className="text-sm font-medium">Hubungkan Game</label>
        <div className="flex gap-2 mt-1 flex-wrap">
          {gameRegistry.map(g=> (
            <label key={g.id} className={`px-3 py-2 rounded-xl border cursor-pointer ${games.includes(g.id)?"bg-brand-500 text-white border-brand-500":"bg-white"}`}>
              <input type="checkbox" checked={games.includes(g.id)} onChange={()=>toggleGame(g.id)} className="hidden" />{g.icon} {g.judul}
            </label>
          ))}
        </div>
      </div>
      <button type="submit" disabled={loading} className="btn-primary">{loading?"Menyimpan...":"Simpan"}</button>
    </form>
  );
}
