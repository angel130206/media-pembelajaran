import { getDb } from "@/lib/db";
import { materi, progresMateri } from "@/lib/db/schema";
import { eq, asc } from "drizzle-orm";
import { auth } from "@/lib/auth";
import Link from "next/link";

export default async function MateriListPage() {
  const session = await auth();
  let list: any[] = [];
  let progMap = new Map();
  try {
    const db = getDb();
    if (db) {
      list = await db.select().from(materi).where(eq(materi.status, "terbit")).orderBy(asc(materi.urutan));
      const prog = await db.select().from(progresMateri).where(eq(progresMateri.userId, (session!.user as any).id));
      progMap = new Map(prog.map(p=>[p.materiId, p.status]));
    }
  } catch {}
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-6">
      <h1 className="text-2xl font-bold">Materi Belajar</h1>
      <p className="text-sm text-zinc-500">Pilih materi dan mulai belajar</p>
      {list.length===0 ? <div className="card mt-6 text-center py-10"><p className="text-zinc-500">Belum ada materi. Admin akan segera menambahkannya.</p></div> : (
        <div className="grid md:grid-cols-2 gap-4 mt-6">
          {list.map(m=> {
            const status = progMap.get(m.id) || "belum_mulai";
            const badge = status==="selesai" ? "✅ Selesai" : status==="sedang" ? "📖 Sedang" : "🆕 Baru";
            return (
              <Link key={m.id} href={`/materi/${m.slug}`} className="card overflow-hidden hover:shadow-lg transition p-0">
                {m.sampulUrl && <img src={m.sampulUrl} alt={m.judul} className="w-full h-40 object-cover" />}
                <div className="p-4">
                  <div className={`inline-block text-xs px-2 py-1 rounded-full ${status==="selesai"?"bg-green-100 text-green-700":status==="sedang"?"bg-orange-100 text-orange-700":"bg-zinc-100"}`}>{badge}</div>
                  <h3 className="font-bold mt-2">{m.judul}</h3>
                  <p className="text-sm text-zinc-500 line-clamp-2 mt-1">{m.ringkasan}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
