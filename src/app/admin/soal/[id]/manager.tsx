"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SoalManager({ setId, initial }: { setId:string, initial:any[] }) {
  const [list, setList] = useState(initial);
  const [q, setQ] = useState(""); const [a,setA]=useState(""); const [b,setB]=useState(""); const [c,setC]=useState(""); const [d,setD]=useState(""); const [kunci,setKunci]=useState(0); const [pembahasan,setPembahasan]=useState("");
  const router = useRouter();

  async function add() {
    const res = await fetch("/api/admin/soal", { method:"POST", headers:{ "Content-Type":"application/json" }, body: JSON.stringify({ setId, pertanyaan:q, opsi:[a,b,c,d], kunci: Number(kunci), pembahasan }) });
    if (res.ok) { const data=await res.json(); setList((l:any)=>[...l, data.soal]); setQ(""); setA("");setB("");setC("");setD("");setPembahasan(""); }
    else alert("Gagal");
  }
  async function hapus(id:string) {
    await fetch(`/api/admin/soal/${id}`, { method:"DELETE" }); setList(l=> l.filter((x:any)=> x.id!==id));
  }
  async function importCSV(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    const fd = new FormData(); fd.append("file", file); fd.append("setId", setId);
    const res = await fetch("/api/admin/soal/import", { method:"POST", body: fd });
    if (res.ok) router.refresh(); else alert("Gagal impor");
  }
  function downloadTemplate() {
    const csv = "pertanyaan,opsi_a,opsi_b,opsi_c,opsi_d,kunci,pembahasan\n\"Apa itu HPP?\",\"Harga Pokok Penjualan\",\"Harga Promo\",\"Hasil Pasar\",\"Hitung Porsi\",\"A\",\"HPP adalah biaya produksi\"\n";
    const blob = new Blob([csv], { type:"text/csv" }); const url=URL.createObjectURL(blob); const a=document.createElement("a"); a.href=url; a.download="template_soal.csv"; a.click();
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="card">
        <h3 className="font-bold">Tambah Soal Manual</h3>
        <div className="grid gap-2 mt-3">
          <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Pertanyaan" className="border rounded-xl px-3 py-2" />
          <div className="grid grid-cols-2 gap-2">
            <input value={a} onChange={e=>setA(e.target.value)} placeholder="Opsi A" className="border rounded-xl px-3 py-2" />
            <input value={b} onChange={e=>setB(e.target.value)} placeholder="Opsi B" className="border rounded-xl px-3 py-2" />
            <input value={c} onChange={e=>setC(e.target.value)} placeholder="Opsi C" className="border rounded-xl px-3 py-2" />
            <input value={d} onChange={e=>setD(e.target.value)} placeholder="Opsi D" className="border rounded-xl px-3 py-2" />
          </div>
          <div className="flex gap-2">
            <label className="text-sm">Kunci: <select value={kunci} onChange={e=>setKunci(Number(e.target.value))} className="border rounded-lg px-2 py-1"><option value={0}>A</option><option value={1}>B</option><option value={2}>C</option><option value={3}>D</option></select></label>
            <input value={pembahasan} onChange={e=>setPembahasan(e.target.value)} placeholder="Pembahasan" className="flex-1 border rounded-xl px-3 py-2" />
          </div>
          <button onClick={add} className="btn-primary self-start">Tambah</button>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold">Impor CSV</h3>
        <div className="flex gap-2 mt-2">
          <button onClick={downloadTemplate} className="btn-ghost text-sm">Unduh Template</button>
          <label className="btn-ghost text-sm cursor-pointer">Pilih File CSV<input type="file" accept=".csv" className="hidden" onChange={importCSV} /></label>
        </div>
        <p className="text-xs text-zinc-500 mt-2">Format: pertanyaan,opsi_a,opsi_b,opsi_c,opsi_d,kunci(A-D atau 0-3),pembahasan</p>
      </div>

      <div className="space-y-2">
        {list.map((s:any, i:number)=> (
          <div key={s.id} className="card flex justify-between">
            <div><div className="font-semibold">{i+1}. {s.pertanyaan}</div><div className="text-xs text-zinc-500">{(s.opsi as string[]).join(" | ")} • Kunci: {String.fromCharCode(65+Number(s.kunci))}</div></div>
            <button onClick={()=>hapus(s.id)} className="text-red-600 text-sm">Hapus</button>
          </div>
        ))}
        {list.length===0 && <div className="text-sm text-zinc-500">Belum ada soal</div>}
      </div>
    </div>
  );
}
