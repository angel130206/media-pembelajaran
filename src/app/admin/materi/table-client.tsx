"use client";
import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function MateriTableClient({ initial }: { initial:any[] }) {
  const [list, setList] = useState(initial);
  const router = useRouter();

  async function hapus(id:string) {
    if (!confirm("Hapus materi?")) return;
    await fetch(`/api/admin/materi/${id}`, { method:"DELETE" });
    setList(l=> l.filter(x=> x.id!==id));
  }
  async function move(id:string, dir:number) {
    await fetch(`/api/admin/materi/reorder`, { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ id, dir }) });
    router.refresh();
  }

  return (
    <div className="mt-6 space-y-3">
      {list.length===0 ? <div className="card text-center text-zinc-500">Belum ada materi</div> : list.map((m:any)=> (
        <div key={m.id} className="card flex gap-4 items-center">
          {m.sampulUrl && <img src={m.sampulUrl} alt={m.judul} className="w-16 h-16 rounded-lg object-cover" />}
          <div className="flex-1">
            <div className="font-bold">{m.judul}</div>
            <div className="text-xs text-zinc-500">{m.slug} • {m.status} • urutan {m.urutan}</div>
          </div>
          <div className="flex gap-1">
            <button onClick={()=>move(m.id, -1)} className="px-2 py-1 border rounded">↑</button>
            <button onClick={()=>move(m.id, 1)} className="px-2 py-1 border rounded">↓</button>
          </div>
          <Link href={`/admin/materi/${m.id}`} className="px-3 py-1.5 border rounded-lg text-sm">Ubah</Link>
          <button onClick={()=>hapus(m.id)} className="px-3 py-1.5 bg-red-50 text-red-600 rounded-lg text-sm">Hapus</button>
        </div>
      ))}
    </div>
  );
}
