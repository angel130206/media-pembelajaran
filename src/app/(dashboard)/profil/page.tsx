import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users, progresMateri, poinLog, lencana, hasilLatihan, skorGame } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import LogoutButton from "./logout";

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
      <div className="card flex gap-4 items-center">
        <div className="w-16 h-16 rounded-full bg-brand-500 text-white flex items-center justify-center text-2xl font-bold">{user?.name?.[0]?.toUpperCase() || "U"}</div>
        <div>
          <div className="font-bold text-lg">{user?.name}</div>
          <div className="text-sm text-zinc-500">{user?.email} • {user?.role}</div>
          <div className="text-sm">Minat: {user?.minat || "-"} • Pengalaman: {user?.pengalaman || "-"}</div>
        </div>
      </div>
      <div className="grid md:grid-cols-3 gap-4">
        <div className="card"><div className="text-sm text-zinc-500">Poin</div><div className="text-2xl font-bold text-brand-600">{poinTotal}</div></div>
        <div className="card"><div className="text-sm text-zinc-500">Materi selesai</div><div className="text-2xl font-bold">{progresList.filter(p=>p.status==="selesai").length}</div></div>
        <div className="card"><div className="text-sm text-zinc-500">Lencana</div><div className="text-2xl font-bold">{lencanaList.length}</div></div>
      </div>
      <div className="card">
        <h3 className="font-bold">Lencana</h3>
        {lencanaList.length===0 ? <p className="text-sm text-zinc-500 mt-2">Belum ada</p> : <div className="flex flex-wrap gap-2 mt-2">{lencanaList.map((l:any)=> <span key={l.id} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">{l.ikon} {l.nama}</span>)}</div>}
      </div>
      <div className="card">
        <h3 className="font-bold">Riwayat Latihan</h3>
        {latihan.length===0 ? <p className="text-sm text-zinc-500 mt-2">Belum ada</p> : <ul className="mt-2 space-y-1">{latihan.map((h:any)=> <li key={h.id} className="text-sm flex justify-between"><span>{h.setId.slice(0,8)}...</span><span className="font-semibold">{h.skor}/{h.total}</span></li>)}</ul>}
      </div>
      <div className="card">
        <h3 className="font-bold">Riwayat Game</h3>
        {gameScores.length===0 ? <p className="text-sm text-zinc-500 mt-2">Belum ada</p> : <ul className="mt-2 space-y-1">{gameScores.map((g:any)=> <li key={g.id} className="text-sm flex justify-between"><span>{g.gameId}</span><span className="font-semibold">{g.skor}</span></li>)}</ul>}
      </div>
      <LogoutButton />
    </div>
  );
}
