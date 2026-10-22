import { getDb } from "@/lib/db";
import { users, materi, progresMateri } from "@/lib/db/schema";
import { eq, count, avg } from "drizzle-orm";

export default async function AdminDashboard() {
  let siswaCount=0, materiCount=0, avgProgres=0;
  try {
    const db = getDb();
    if (db) {
      const s = await db.select().from(users);
      siswaCount = s.filter(u=>u.role==="siswa").length;
      const m = await db.select().from(materi);
      materiCount = m.length;
      const prog = await db.select().from(progresMateri);
      const totalSiswa = s.length || 1;
      // avg progres = avg selesai per siswa / total materi
      const selesai = prog.filter(p=> p.status==="selesai").length;
      avgProgres = materiCount ? Math.round((selesai / (totalSiswa * materiCount))*100) : 0;
    }
  } catch {}
  return (
    <div>
      <h1 className="text-2xl font-bold">Dashboard Admin</h1>
      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="card"><div className="text-sm text-zinc-500">Jumlah Siswa</div><div className="text-3xl font-bold">{siswaCount}</div></div>
        <div className="card"><div className="text-sm text-zinc-500">Materi Terbit</div><div className="text-3xl font-bold">{materiCount}</div></div>
        <div className="card"><div className="text-sm text-zinc-500">Rata-rata Progres</div><div className="text-3xl font-bold">{avgProgres}%</div></div>
      </div>
    </div>
  );
}
