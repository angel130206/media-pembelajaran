import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { materi, progresMateri, poinLog, lencana } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

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
        const last = prog.sort((a,b)=> new Date(b.updatedAt).getTime()-new Date(a.updatedAt).getTime())[0];
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
      <div className="card bg-gradient-to-r from-brand-500 to-orange-400 text-white border-0">
        <h1 className="text-2xl font-bold">Halo, {name} 👋</h1>
        <p className="opacity-90 text-sm mt-1">Semangat belajar wirausaha hari ini!</p>
        <div className="mt-4 bg-white/20 rounded-full h-3 overflow-hidden">
          <div className="bg-white h-full rounded-full" style={{ width: `${progres}%` }} />
        </div>
        <div className="text-sm mt-2">{progres}% progres • {poin} poin • {lencanaList.length} lencana</div>
        {lastMateri && <Link href={`/materi/${lastMateri.slug}`} className="inline-block mt-4 bg-white text-brand-600 font-semibold px-5 py-2 rounded-xl">Lanjutkan belajar →</Link>}
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { href:"/materi", title:"Materi", desc:"Baca & pahami", icon:"📚", color:"bg-orange-100" },
          { href:"/game", title:"Game", desc:"Main & latih skill", icon:"🎮", color:"bg-teal-100" },
          { href:"/latihan", title:"Latihan Soal", desc:"Uji pemahaman", icon:"📝", color:"bg-violet-100" },
          { href:"/tanya-ai", title:"Tanya AI", desc:"Chat asisten", icon:"🤖", color:"bg-amber-100" },
        ].map(c=> (
          <Link key={c.href} href={c.href} className="card hover:shadow-lg transition p-4">
            <div className={`w-12 h-12 rounded-xl ${c.color} flex items-center justify-center text-xl`}>{c.icon}</div>
            <div className="font-bold mt-3">{c.title}</div>
            <div className="text-xs text-zinc-500">{c.desc}</div>
          </Link>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="card">
          <h3 className="font-bold">Ringkasan poin</h3>
          <div className="text-3xl font-extrabold text-brand-600 mt-2">{poin}</div>
          <p className="text-sm text-zinc-500">Kumpulkan poin dari materi, latihan & game</p>
        </div>
        <div className="card">
          <h3 className="font-bold">Lencana</h3>
          {lencanaList.length===0 ? <p className="text-sm text-zinc-500 mt-2">Belum ada lencana. Selesaikan materi pertama!</p> : <div className="flex flex-wrap gap-2 mt-2">{lencanaList.map((l:any)=> <span key={l.id} className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm">{l.nama}</span>)}</div>}
          <Link href="/profil" className="text-sm text-brand-600 font-medium mt-3 inline-block">Lihat profil →</Link>
        </div>
      </div>
    </div>
  );
}
