import { gameRegistry } from "@/components/games/registry";
import Link from "next/link";
import { Gamepad2, Trophy, Clock, Star } from "lucide-react";

export default function GameListPage() {
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-teal-700 uppercase"><Gamepad2 className="w-4 h-4" /> Game Edukasi</div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-ink-900 mt-1">Belajar sambil main</h1>
        <p className="text-sm text-zinc-600 mt-1">Kumpulkan poin, asah hitungan & pemahaman istilah — semua pakai konteks warung Samarinda.</p>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        {gameRegistry.map(g=> (
          <Link key={g.id} href={`/game/${g.id}`} className="group bg-white rounded-[1.25rem] border border-orange-100 shadow-card p-5 card-hover">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-orange-400 text-white flex items-center justify-center text-xl shadow-soft group-hover:scale-105 transition-transform">{g.icon}</div>
            <h3 className="font-bold text-ink-900 mt-4 group-hover:text-brand-700 transition-colors">{g.judul}</h3>
            <p className="text-sm text-zinc-600 mt-1 leading-relaxed">{g.deskripsi}</p>
            <div className="mt-3 flex gap-2">
              <span className={`badge ${g.kesulitan==="Mudah"?"badge-success":"bg-amber-100 text-amber-800 border border-amber-200"}`}>{g.kesulitan}</span>
              <span className="badge badge-neutral"><Clock className="w-3 h-3" /> 2-5 menit</span>
            </div>
            <div className="mt-4 flex items-center gap-2 text-sm font-semibold text-brand-700">Main sekarang <Star className="w-4 h-4" /></div>
          </Link>
        ))}
      </div>

      <div className="mt-6 bg-gradient-to-br from-teal-50 to-emerald-50 border border-teal-200 rounded-2xl p-4 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center"><Trophy className="w-5 h-5" /></div>
        <div>
          <div className="text-sm font-bold text-teal-900">Papan peringkat kelas</div>
          <div className="text-xs text-teal-700">Skor game masuk profil — raih lencana Juara Game di 80+ poin</div>
        </div>
      </div>
    </div>
  );
}
