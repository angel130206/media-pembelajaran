"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Utensils, Shirt, Briefcase, Palette, Monitor, Sparkles, BookOpen, Gamepad2, GraduationCap, MessageCircle } from "lucide-react";

const minatOptions = [
  { id:"kuliner", label:"Kuliner", Icon: Utensils, desc:"Makanan & minuman" },
  { id:"fashion", label:"Fashion", Icon: Shirt, desc:"Pakaian & aksesoris" },
  { id:"jasa", label:"Jasa", Icon: Briefcase, desc:"Servis & keterampilan" },
  { id:"kerajinan", label:"Kerajinan", Icon: Palette, desc:"Kreasi tangan" },
  { id:"digital", label:"Digital", Icon: Monitor, desc:"Online & konten" },
  { id:"lainnya", label:"Lainnya", Icon: Sparkles, desc:"Ide lain" },
];

export default function OnboardingClient({ initialMinat, initialPengalaman }: any) {
  const [step, setStep] = useState(1);
  const [minat, setMinat] = useState(initialMinat || "");
  const [pengalaman, setPengalaman] = useState(initialPengalaman || "");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState("");

  async function finish() {
    setErr("");
    setLoading(true);
    try {
      const res = await fetch("/api/onboarding", { method: "POST", headers: { "Content-Type":"application/json" }, body: JSON.stringify({ minat, pengalaman }) });
      if (!res.ok) throw new Error("Gagal menyimpan");
      router.push("/beranda");
      router.refresh();
    } catch (e:any) { setErr(e.message); setLoading(false); }
  }

  return (
    <div className="max-w-xl mx-auto p-4 md:p-6">
      <div className="flex gap-2 mb-6">{[1,2,3].map(i=> <div key={i} className={`h-2 flex-1 rounded-full transition-all ${i<=step ? "bg-brand-600":"bg-zinc-200"}`} />)}</div>
      <div className="text-xs font-semibold tracking-widest text-zinc-500 uppercase text-center">Langkah {step} dari 3</div>

      {step===1 && (
        <div className="card mt-4">
          <h2 className="text-2xl font-extrabold tracking-tight text-ink-900">Pilih minat usahamu</h2>
          <p className="text-zinc-600 text-sm mt-1">Kami rekomendasikan materi sesuai minatmu</p>
          <div className="grid grid-cols-2 gap-3 mt-6">
            {minatOptions.map(o=> {
              const Icon = o.Icon;
              const active = minat===o.id;
              return (
                <button key={o.id} onClick={()=>setMinat(o.id)} className={`p-4 rounded-2xl border-2 text-left transition-all ${active ? "border-brand-600 bg-orange-50 shadow-soft" : "border-zinc-200 bg-white hover:border-orange-200"}`}>
                  <Icon className={`w-6 h-6 ${active ? "text-brand-600" : "text-zinc-600"}`} />
                  <div className="font-bold mt-2 text-sm">{o.label}</div>
                  <div className="text-xs text-zinc-500">{o.desc}</div>
                </button>
              );
            })}
          </div>
          <button disabled={!minat} onClick={()=>setStep(2)} className="btn-primary w-full mt-6 disabled:opacity-50">Lanjut</button>
        </div>
      )}

      {step===2 && (
        <div className="card mt-4">
          <h2 className="text-2xl font-extrabold tracking-tight">Pengalaman jualan?</h2>
          <p className="text-sm text-zinc-600 mt-1">Supaya kami sesuaikan tingkat materi</p>
          <div className="grid gap-3 mt-6">
            {[
              { id:"pemula", title:"Pemula — Belum pernah jualan", desc:"Mulai dari nol, kami bimbing pelan-pelan", icon: BookOpen },
              { id:"pernah_jualan", title:"Pernah jualan", desc:"Sudah pernah coba, ingin lebih serius", icon: GraduationCap },
            ].map(opt=> {
              const Icon = opt.icon as any;
              const active = pengalaman===opt.id;
              return (
                <button key={opt.id} onClick={()=>setPengalaman(opt.id)} className={`p-4 rounded-2xl border-2 text-left flex gap-3 transition-all ${active ? "border-brand-600 bg-orange-50" : "border-zinc-200 bg-white hover:border-orange-200"}`}>
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${active ? "bg-brand-600 text-white" : "bg-zinc-100 text-zinc-600"}`}><Icon className="w-5 h-5" /></div>
                  <div>
                    <div className="font-bold text-sm">{opt.title}</div><div className="text-xs text-zinc-500">{opt.desc}</div>
                  </div>
                </button>
              );
            })}
          </div>
          <div className="flex gap-3 mt-6">
            <button onClick={()=>setStep(1)} className="btn-ghost flex-1">Kembali</button>
            <button disabled={!pengalaman} onClick={()=>setStep(3)} className="btn-primary flex-1 disabled:opacity-50">Lanjut</button>
          </div>
        </div>
      )}

      {step===3 && (
        <div className="card mt-4">
          <h2 className="text-2xl font-extrabold tracking-tight">Kenalan dengan 4 menu belajar</h2>
          <div className="grid gap-3 mt-6">
            <div className="flex gap-3 p-3 bg-orange-50 border border-orange-200 rounded-xl"><div className="w-9 h-9 rounded-lg bg-brand-600 text-white flex items-center justify-center"><BookOpen className="w-4 h-4" /></div><div><div className="font-bold text-sm">Materi</div><div className="text-xs text-zinc-600">Baca materi ringkas dengan contoh Samarinda</div></div></div>
            <div className="flex gap-3 p-3 bg-teal-50 border border-teal-200 rounded-xl"><div className="w-9 h-9 rounded-lg bg-teal-600 text-white flex items-center justify-center"><Gamepad2 className="w-4 h-4" /></div><div><div className="font-bold text-sm">Game</div><div className="text-xs text-zinc-600">Latihan jadi kasir & hitung untung</div></div></div>
            <div className="flex gap-3 p-3 bg-violet-50 border border-violet-200 rounded-xl"><div className="w-9 h-9 rounded-lg bg-violet-600 text-white flex items-center justify-center"><GraduationCap className="w-4 h-4" /></div><div><div className="font-bold text-sm">Latihan Soal</div><div className="text-xs text-zinc-600">Uji pemahaman, lihat pembahasan</div></div></div>
            <div className="flex gap-3 p-3 bg-amber-50 border border-amber-200 rounded-xl"><div className="w-9 h-9 rounded-lg bg-amber-500 text-white flex items-center justify-center"><MessageCircle className="w-4 h-4" /></div><div><div className="font-bold text-sm">Tanya AI</div><div className="text-xs text-zinc-600">Chat asisten wirausaha 24 jam</div></div></div>
          </div>
          {err && <div className="mt-4 text-sm text-red-600 bg-red-50 border border-red-200 rounded-xl px-3 py-2">{err}</div>}
          <button onClick={finish} disabled={loading} className="btn-primary w-full mt-6">{loading?"Menyimpan...":"Mulai Belajar"}</button>
        </div>
      )}
    </div>
  );
}
