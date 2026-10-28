import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users, progresMateri, poinLog, lencana, hasilLatihan, skorGame } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import LogoutButton from "./logout";
import { Trophy, BookOpen, Medal, Target, User, LogOut, Award } from "lucide-react";

export default async function ProfilPage() {
  const session = await auth();
  const userId = (session!.user as any).id;
  let user:any=null, progresList:any[]=[], poinTotal=0, lencanaList:any[]=[], latihan:any[]=[], gameScores:any[]=[];
  try {
    const db = getDb();
    if (db) {
      const [u]=await db.select().from(users).where(eq(users.id, userId)).limit(1); user=u;
      progresList = await db.select().from(progresMateri).where(eq(progresMateri.userId, userId));
      const poinRows = await db.select().from(poinLog).where(eq(poinLog.userId, userId)); poinTotal = poinRows.reduce((a,b)=>a+b.jumlah,0);
      lencanaList = await db.select().from(lencana).where(eq(lencana.userId, userId));
      latihan = await db.select().from(hasilLatihan).where(eq(hasilLatihan.userId, userId));
      gameScores = await db.select().from(skorGame).where(eq(skorGame.userId, userId));
    }
  } catch {}
  return (
    <div className="max-w-3xl mx-auto p-4 md:p-6 space-y-6">
      <div className="bg-white rounded-[1.5rem] border border-orange-100 shadow-card p-6 flex gap-4 items-center">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-600 to-orange-400 text-white flex items-center justify-center text-2xl font-extrabold shadow-soft">{user?.name?.[0]?.toUpperCase() || "U"}</div>
        <div className="flex-1 min-w-0">
          <div className="font-extrabold text-lg text-ink-900 truncate">{user?.name || "Pengguna"}</div>
          <div className="text-sm text-zinc-500 truncate">{user?.email} • <span className="badge badge-warm text-xs">{user?.role || "siswa"}</span></div>
          <div className="text-xs text-zinc-500 mt-1">Minat: <b>{user?.minat || "-"}</b> • Pengalaman: <b>{user?.pengalaman || "-"}</b></div>
        </div>
        <User className="w-5 h-5 text-zinc-400" />
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <div className="card p-5 text-center">
          <div className="w-10 h-10 mx-auto rounded-xl bg-brand-100 flex items-center justify-center"><Trophy className="w-5 h-5 text-brand-600" /></div>
          <div className="text-xs text-zinc-500 mt-2 font-semibold tracking-widest uppercase">Poin</div>
          <div className="text-2xl font-extrabold text-brand-600">{poinTotal}</div>
        </div>
        <div className="card p-5 text-center">
          <div className="w-10 h-10 mx-auto rounded-xl bg-emerald-50 flex items-center justify-center"><BookOpen className="w-5 h-5 text-emerald-600" /></div>
          <div className="text-xs text-zinc-500 mt-2 font-semibold tracking-widest uppercase">Materi selesai</div>
          <div className="text-2xl font-extrabold">{progresList.filter(p=>p.status==="selesai").length}</div>
        </div>
        <div className="card p-5 text-center">
          <div className="w-10 h-10 mx-auto rounded-xl bg-amber-100 flex items-center justify-center"><Medal className="w-5 h-5 text-amber-600" /></div>
          <div className="text-xs text-zinc-500 mt-2 font-semibold tracking-widest uppercase">Lencana</div>
          <div className="text-2xl font-extrabold">{lencanaList.length}</div>
        </div>
      </div>

      <div className="card">
        <h3 className="font-bold flex items-center gap-2"><Award className="w-4 h-4 text-amber-600" /> Lencana</h3>
        {lencanaList.length===0 ? <p className="text-sm text-zinc-500 mt-2">Belum ada — selesaikan materi untuk membuka lencana pertama.</p> : <div className="flex flex-wrap gap-2 mt-3">{lencanaList.map((l:any)=> <span key={l.id} className="bg-amber-50 text-amber-800 border border-amber-200 px-3 py-1.5 rounded-full text-sm font-semibold">{l.ikon || "🏅"} {l.nama}</span>)}</div>}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-bold flex items-center gap-2"><Target className="w-4 h-4 text-violet-600" /> Riwayat Latihan</h3>
          {latihan.length===0 ? <p className="text-sm text-zinc-500 mt-2">Belum ada</p> : <ul className="mt-3 space-y-2">{latihan.map((h:any)=> <li key={h.id} className="text-sm flex justify-between bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2"><span>{h.setId.slice(0,8)}...</span><span className="font-bold">{h.skor}/{h.total}</span></li>)}</ul>}
        </div>
        <div className="card">
          <h3 className="font-bold flex items-center gap-2"><Trophy className="w-4 h-4 text-brand-600" /> Riwayat Game</h3>
          {gameScores.length===0 ? <p className="text-sm text-zinc-500 mt-2">Belum ada</p> : <ul className="mt-3 space-y-2">{gameScores.map((g:any)=> <li key={g.id} className="text-sm flex justify-between bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2"><span>{g.gameId}</span><span className="font-bold">{g.skor}</span></li>)}</ul>}
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-zinc-200 p-2">
        <LogoutButton />
      </div>
    </div>
  );
}
