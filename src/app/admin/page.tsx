import { getDb } from "@/lib/db";
import { users, materi, progresMateri } from "@/lib/db/schema";
import { Users, BookOpen, TrendingUp, AlertCircle } from "lucide-react";
import Link from "next/link";

export default async function AdminDashboard() {
  let siswaCount=0, materiCount=0, avgProgres=0;
  let dbError: string | null = null;
  try {
    const db = getDb();
    if (!db) throw new Error("DATABASE_URL belum diatur");
    const s = await db.select().from(users);
    siswaCount = s.filter(u=>u.role==="siswa").length;
    const m = await db.select().from(materi);
    materiCount = m.length;
    const prog = await db.select().from(progresMateri);
    const totalSiswa = s.length || 1;
    const selesai = prog.filter(p=> p.status==="selesai").length;
    avgProgres = materiCount ? Math.round((selesai / (totalSiswa * materiCount))*100) : 0;
  } catch (e:any) { dbError = e.message; }

  return (
    <div>
      <div>
        <h1 className="text-2xl font-extrabold tracking-tight text-ink-900">Dashboard Admin</h1>
        <p className="text-sm text-zinc-600">Kelola materi, soal, dan pantau progres siswa</p>
      </div>

      {dbError && (
        <div className="mt-4 flex gap-2 items-start bg-amber-50 border border-amber-200 rounded-xl px-4 py-3 text-sm text-amber-800">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <div><b>Database belum siap:</b> {dbError} — cek <Link href="/api/health" className="underline">/api/health</Link> dan jalankan <code className="bg-white px-1 rounded">npm run db:migrate</code></div>
        </div>
      )}

      <div className="grid md:grid-cols-3 gap-4 mt-6">
        <div className="card p-5">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 uppercase"><Users className="w-4 h-4 text-brand-600" /> Jumlah Siswa</div>
          <div className="text-3xl font-extrabold mt-2">{siswaCount}</div>
          <div className="text-xs text-zinc-500">Aktif & terdaftar</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 uppercase"><BookOpen className="w-4 h-4 text-teal-600" /> Materi Terbit</div>
          <div className="text-3xl font-extrabold mt-2">{materiCount}</div>
          <div className="text-xs text-zinc-500">Siap untuk siswa</div>
        </div>
        <div className="card p-5">
          <div className="flex items-center gap-2 text-xs font-bold tracking-widest text-zinc-500 uppercase"><TrendingUp className="w-4 h-4 text-emerald-600" /> Rata-rata Progres</div>
          <div className="text-3xl font-extrabold mt-2">{avgProgres}%</div>
          <div className="w-full h-2 bg-zinc-100 rounded-full mt-2"><div className="h-full bg-brand-600 rounded-full" style={{width: `${avgProgres}%`}} /></div>
        </div>
      </div>

      <div className="mt-6 grid md:grid-cols-3 gap-4">
        <Link href="/admin/materi" className="card card-hover p-5"><div className="font-bold">Kelola Materi →</div><div className="text-sm text-zinc-600">Tambah, ubah, urutkan</div></Link>
        <Link href="/admin/soal" className="card card-hover p-5"><div className="font-bold">Kelola Soal →</div><div className="text-sm text-zinc-600">Buat set & impor CSV</div></Link>
        <Link href="/admin/siswa" className="card card-hover p-5"><div className="font-bold">Pantau Siswa →</div><div className="text-sm text-zinc-600">Lihat progres & ekspor</div></Link>
      </div>
    </div>
  );
}
