import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { materi, progresMateri, poinLog, lencana } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { BookOpen, Gamepad2, GraduationCap, MessageCircle, Trophy, Flame, ArrowRight, Sparkles, Target, Clock } from "lucide-react";

export default async function BerandaPage() {
  const session = await auth();
  const name = session?.user?.name || "Teman";
  let progres = 0; let totalMateri = 0; let poin = 0; let lastMateri: any = null;
  let lencanaList: any[] = [];
  try {
    const db = getDb();
    if (db) {
      const allMateri = await db.select().from(materi).where(eq(materi.status, "terbit"));
      totalMateri = allMateri.length;
      const prog = await db.select().from(progresMateri).where(eq(progresMateri.userId, (session!.user as any).id));
      const selesai = prog.filter(p=>p.status==="selesai").length;
      progres = totalMateri ? Math.round((selesai/totalMateri)*100) : 0;
      if (prog.length) {
        const last = [...prog].sort((a,b)=> new Date(b.updatedAt).getTime()-new Date(a.updatedAt).getTime())[0];
        lastMateri = allMateri.find(m=> m.id===last.materiId) || allMateri[0];
      } else {
        lastMateri = allMateri[0];
      }
      const poinRows = await db.select().from(poinLog).where(eq(poinLog.userId, (session!.user as any).id));
      poin = poinRows.reduce((a,b)=>a+b.jumlah,0);
      lencanaList = await db.select().from(lencana).where(eq(lencana.userId, (session!.user as any).id));
    }
  } catch {}

  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6 space-y-6">
      {/* Hero beranda */}
      <div className="relative overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-brand-600 via-brand-500 to-orange-400 text-white shadow-lifted">
        <div className="absolute inset-0 opacity-15 hero-pattern" />
        <div className="absolute -right-12 -top-12 w-64 h-64 bg-white/15 rounded-full blur-3xl" />
        <div className="absolute -bottom-16 -left-12 w-72 h-72 bg-amber-200/20 rounded-full blur-3xl" />
        <div className="relative p-6 md:p-8">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold">
            <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur border border-white/20 rounded-full px-3 py-1"><Sparkles className="w-3.5 h-3.5" /> Halo, {name}</span>
            <span className="inline-flex items-center gap-1 bg-white text-brand-700 rounded-full px-3 py-1 font-bold">🔥 3 hari streak</span>
          </div>
          <h1 className="mt-4 text-2xl md:text-3xl font-extrabold leading-tight">Semangat belajar hari ini!</h1>
          <p className="mt-2 text-white/90 text-sm md:text-base max-w-2xl">Lanjutkan materi terakhir, kumpulkan poin, dan buka lencana baru. Semua contoh pakai usaha lokal Samarinda.</p>

          <div className="mt-6 bg-white/15 backdrop-blur rounded-2xl p-4 border border-white/20">
            <div className="flex justify-between text-xs font-semibold text-white/90">
              <span className="flex items-center gap-1.5"><Target className="w-4 h-4" /> Progres belajar</span>
              <span>{progres}% • {progres === 100 ? "Selesai!" : `${totalMateri ? Math.round(progres/100*totalMateri) : 0}/${totalMateri} materi`}</span>
            </div>
            <div className="mt-2 h-2.5 bg-white/20 rounded-full overflow-hidden">
              <div className="h-full bg-white rounded-full transition-all duration-500" style={{ width: `${progres}%` }} />
            </div>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="bg-white text-brand-700 font-bold px-2.5 py-1 rounded-full">{poin} poin</span>
              <span className="bg-white/15 border border-white/20 px-2.5 py-1 rounded-full">{lencanaList.length} lencana</span>
              <span className="bg-white/15 border border-white/20 px-2.5 py-1 rounded-full flex items-center gap-1"><Clock className="w-3 h-3" /> 12 menit/hari</span>
            </div>
          </div>

          {lastMateri ? (
            <Link href={`/materi/${lastMateri.slug}`} className="mt-6 inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-5 py-3 rounded-xl shadow-soft hover:bg-orange-50 transition-colors">
              Lanjutkan: {lastMateri.judul.slice(0, 36)} <ArrowRight className="w-4 h-4" />
            </Link>
          ) : (
            <Link href="/materi" className="mt-6 inline-flex items-center gap-2 bg-white text-brand-700 font-bold px-5 py-3 rounded-xl">Lihat Materi <ArrowRight className="w-4 h-4" /></Link>
          )}
        </div>
      </div>

      {/* 4 menu */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {[
          { href:"/materi", title:"Materi", desc:"12 topik praktis", icon: BookOpen, bg:"from-orange-500 to-brand-600", sub:"Baca & pahami" },
          { href:"/game", title:"Game", desc:"3 game seru", icon: Gamepad2, bg:"from-teal-600 to-emerald-600", sub:"Main & latih" },
          { href:"/latihan", title:"Latihan", desc:"Uji pemahaman", icon: GraduationCap, bg:"from-zinc-800 to-zinc-900", sub:"Soal & nilai" },
          { href:"/tanya-ai", title:"Tanya AI", desc:"Jawab 24 jam", icon: MessageCircle, bg:"from-amber-500 to-orange-500", sub:"Asisten lokal" },
        ].map(c=> (
          <Link key={c.href} href={c.href} className="group bg-white rounded-[1.25rem] border border-orange-100 p-4 shadow-card card-hover">
            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${c.bg} text-white flex items-center justify-center shadow-soft group-hover:scale-105 transition-transform`}>
              <c.icon className="w-5 h-5" />
            </div>
            <div className="font-bold mt-3 text-ink-900">{c.title}</div>
            <div className="text-xs text-zinc-500">{c.desc}</div>
            <div className="mt-2 text-xs font-semibold text-brand-700 flex items-center gap-1">{c.sub} <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></div>
          </Link>
        ))}
      </div>

      {/* poin & lencana */}
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-ink-900"><Trophy className="w-4 h-4 text-amber-600" /> Ringkasan poin</div>
          <div className="text-3xl font-extrabold text-brand-600 mt-2">{poin}</div>
          <p className="text-sm text-zinc-500">Dari materi, latihan & game. Target minggu ini: 200 poin</p>
          <div className="mt-3 h-2 bg-orange-100 rounded-full overflow-hidden"><div className="h-full bg-brand-600 rounded-full" style={{width: `${Math.min(100, Math.round(poin/2))}%`}} /></div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-sm font-bold text-ink-900"><Flame className="w-4 h-4 text-orange-500" /> Streak & kebiasaan</div>
          <div className="mt-3 flex gap-1.5">
            {[1,2,3,4,5,6,7].map(i=> <div key={i} className={`flex-1 h-8 rounded-lg border flex items-center justify-center text-xs font-bold ${i<=3 ? "bg-brand-600 text-white border-brand-600" : "bg-zinc-50 text-zinc-400 border-zinc-200"}`}>{i<=3 ? "✓" : "·"}</div>)}
          </div>
          <p className="text-xs text-zinc-500 mt-2">3 hari berturut. Lanjutkan besok!</p>
        </div>
        <div className="card p-5">
          <h3 className="font-bold text-ink-900">Lencana</h3>
          {lencanaList.length===0 ? <p className="text-sm text-zinc-500 mt-2">Belum ada. Selesaikan 1 materi untuk buka lencana pertama.</p> : <div className="flex flex-wrap gap-2 mt-3">{lencanaList.map((l:any)=> <span key={l.id} className="bg-amber-100 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full text-xs font-semibold">{l.ikon || "🏅"} {l.nama}</span>)}</div>}
          <Link href="/profil" className="text-sm text-brand-700 font-semibold mt-3 inline-flex items-center gap-1">Lihat profil <ArrowRight className="w-3.5 h-3.5" /></Link>
        </div>
      </div>
    </div>
  );
}
