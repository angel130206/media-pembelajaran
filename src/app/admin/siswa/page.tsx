import { getDb } from "@/lib/db";
import { users, progresMateri, hasilLatihan, poinLog, materi } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";

export default async function SiswaPage({ searchParams }: { searchParams:{ materi?:string } }) {
  let siswa:any[]=[]; let materiList:any[]=[]; let progres:any[]=[]; let poinMap=new Map(); let filterMateri = searchParams.materi;
  try {
    const db = getDb();
    if (db) {
      const allUsers = await db.select().from(users);
      siswa = allUsers.filter(u=> u.role==="siswa" || u.role==="admin"); // tampilkan semua untuk demo
      materiList = await db.select().from(materi);
      progres = await db.select().from(progresMateri);
      const poinRows = await db.select().from(poinLog);
      for (const p of poinRows) poinMap.set(p.userId, (poinMap.get(p.userId)||0)+p.jumlah);
    }
  } catch {}
  return (
    <div>
      <h1 className="text-2xl font-bold">Pantau Siswa</h1>
      <div className="flex gap-2 mt-4">
        <form className="flex gap-2">
          <select name="materi" defaultValue={filterMateri || ""} className="border rounded-xl px-3 py-2">
            <option value="">Semua materi</option>
            {materiList.map((m:any)=> <option key={m.id} value={m.id}>{m.judul}</option>)}
          </select>
          <button type="submit" className="btn-ghost text-sm">Filter</button>
        </form>
        <Link href="/api/admin/export-siswa" className="btn-primary text-sm">Ekspor CSV</Link>
      </div>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full text-sm bg-white rounded-xl overflow-hidden border">
          <thead className="bg-zinc-50"><tr><th className="p-3 text-left">Nama</th><th className="p-3">Email</th><th className="p-3">Progres</th><th className="p-3">Poin</th><th className="p-3">Minat</th></tr></thead>
          <tbody>
            {siswa.map(s=> {
              const progList = progres.filter(p=> p.userId===s.id);
              if (filterMateri) {
                const has = progList.find(p=> p.materiId===filterMateri);
                if (!has) return null;
              }
              const selesai = progList.filter(p=>p.status==="selesai").length;
              return (
                <tr key={s.id} className="border-t">
                  <td className="p-3">{s.name}</td>
                  <td className="p-3">{s.email}</td>
                  <td className="p-3 text-center">{selesai}/{materiList.length}</td>
                  <td className="p-3 text-center">{poinMap.get(s.id)||0}</td>
                  <td className="p-3 text-center">{s.minat || "-"}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
