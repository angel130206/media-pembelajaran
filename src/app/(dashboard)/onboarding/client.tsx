"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

const minatOptions = [
  { id:"kuliner", label:"Kuliner", emoji:"🍜" },
  { id:"fashion", label:"Fashion", emoji:"👗" },
  { id:"jasa", label:"Jasa", emoji:"💇" },
  { id:"kerajinan", label:"Kerajinan", emoji:"🎨" },
  { id:"digital", label:"Digital", emoji:"💻" },
  { id:"lainnya", label:"Lainnya", emoji:"✨" },
];

export default function OnboardingClient({ initialMinat, initialPengalaman }: any) {
  const [step, setStep] = useState(1);
  const [minat, setMinat] = useState(initialMinat || "");
  const [pengalaman, setPengalaman] = useState(initialPengalaman || "");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function finish() {
    setLoading(true);
    await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ minat, pengalaman }) });
    router.push("/beranda");
    router.refresh();
  }

  return (
    <div className="max-w-xl mx-auto p-6">
      <div className="flex gap-2 mb-6">{[1,2,3].map(i=> <div key={i} className={`h-2 flex-1 rounded-full ${i<=step ? "bg-brand-500":"bg-zinc-200"}`} />)}</div>
      {step===1 && (
        <div className="card">
          <h2 className="text-2xl font-bold">Pilih minat usahamu</h2>
          <p className="text-zinc-500 text-sm mt-1">Kami akan rekomendasikan materi sesuai minatmu</p>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {minatOptions.map(o=> (
              <button key={o.id} onClick={()=>setMinat(o.id)} className={`p-4 rounded-2xl border-2 text-left ${minat===o.id?"border-brand-500 bg-orange-50":"border-zinc-200 bg-white"}`}>
                <div className="text-2xl">{o.emoji}</div><div className="font-semibold">{o.label}</div>
              </button>
            ))}
          </div>
          <button disabled={!minat} onClick={()=>setStep(2)} className="btn-primary w-full mt-6 disabled:opacity-50">Lanjut</button>
        </div>
      )}
      {step===2 && (
        <div className="card">
          <h2 className="text-2xl font-bold">Pengalaman jualan?</h2>
          <div className="grid gap-3 mt-6">
            <button onClick={()=>setPengalaman("pemula")} className={`p-4 rounded-2xl border-2 text-left ${pengalaman==="pemula"?"border-brand-500 bg-orange-50":"border-zinc-200 bg-white"}`}>
              <div className="font-bold">Pemula — Belum pernah jualan</div><div className="text-sm text-zinc-500">Mulai dari nol, kami bimbing pelan-pelan</div>
            </button>
            <button onClick={()=>setPengalaman("pernah_jualan")} className={`p-4 rounded-2xl border-2 text-left ${pengalaman==="pernah_jualan"?"border-brand-500 bg-orange-50":"border-zinc-200 bg-white"}`}>
              <div className="font-bold">Pernah jualan</div><div className="text-sm text-zinc-500">Sudah pernah coba, ingin lebih serius</div>
            </button>
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={()=>setStep(1)} className="btn-ghost flex-1">Kembali</button>
            <button disabled={!pengalaman} onClick={()=>setStep(3)} className="btn-primary flex-1 disabled:opacity-50">Lanjut</button>
          </div>
        </div>
      )}
      {step===3 && (
        <div className="card">
          <h2 className="text-2xl font-bold">Kenalan dengan 4 menu belajar</h2>
          <div className="grid gap-3 mt-6">
            <div className="flex gap-3 p-3 bg-orange-50 rounded-xl"><span className="text-xl">📚</span><div><div className="font-semibold">Materi</div><div className="text-sm text-zinc-600">Baca materi ringkas dengan contoh Samarinda</div></div></div>
            <div className="flex gap-3 p-3 bg-teal-50 rounded-xl"><span className="text-xl">🎮</span><div><div className="font-semibold">Game</div><div className="text-sm text-zinc-600">Latihan jadi kasir & hitung untung</div></div></div>
            <div className="flex gap-3 p-3 bg-violet-50 rounded-xl"><span className="text-xl">📝</span><div><div className="font-semibold">Latihan Soal</div><div className="text-sm text-zinc-600">Uji pemahaman, lihat pembahasan</div></div></div>
            <div className="flex gap-3 p-3 bg-amber-50 rounded-xl"><span className="text-xl">🤖</span><div><div className="font-semibold">Tanya AI</div><div className="text-sm text-zinc-600">Chat asisten wirausaha 24 jam</div></div></div>
          </div>
          <button onClick={finish} disabled={loading} className="btn-primary w-full mt-6">{loading?"Menyimpan...":"Mulai Belajar 🚀"}</button>
        </div>
      )}
    </div>
  );
}
