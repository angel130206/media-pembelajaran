import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/beranda");
  return (
    <main className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-white">
      <header className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">
        <div className="font-bold text-brand-600 text-xl">Mulai Usaha<span className="text-tealBrand-600"> Samarinda</span></div>
        <div className="flex gap-3">
          <Link href="/login" className="px-4 py-2 rounded-xl border border-orange-200 bg-white font-medium">Masuk</Link>
          <Link href="/register" className="px-5 py-2 rounded-xl bg-brand-500 text-white font-semibold">Daftar</Link>
        </div>
      </header>
      <section className="max-w-6xl mx-auto px-6 py-12 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 bg-orange-100 text-brand-700 px-3 py-1 rounded-full text-sm font-medium">🌟 Untuk pemula di Samarinda</div>
          <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-4" style={{fontFamily:"var(--font-poppins)"}}>Mulai Usaha<br /><span className="text-brand-500">dari Nol</span> di Samarinda</h1>
          <p className="mt-4 text-lg text-zinc-600">Belajar kewirausahaan langkah demi langkah — materi ringkas, game seru, latihan soal, dan tanya AI kapan saja. Cocok untuk kamu yang baru mau jualan!</p>
          <div className="mt-6 flex gap-3">
            <Link href="/register" className="btn-primary">Mulai Gratis →</Link>
            <Link href="/login" className="btn-ghost">Sudah punya akun? Masuk</Link>
          </div>
          <div className="mt-8 flex gap-6 text-sm">
            <div><div className="font-bold text-2xl text-brand-600">4</div><div className="text-zinc-500">Menu Belajar</div></div>
            <div><div className="font-bold text-2xl text-tealBrand-600">3</div><div className="text-zinc-500">Game Interaktif</div></div>
            <div><div className="font-bold text-2xl">∞</div><div className="text-zinc-500">Tanya AI</div></div>
          </div>
        </div>
        <div className="relative">
          <div className="card p-6">
            <img src="https://images.unsplash.com/photo-1556761175-b413da4baf72?w=600&q=80" alt="Usaha Samarinda" className="rounded-xl w-full h-64 object-cover" />
            <div className="mt-4 grid grid-cols-2 gap-3">
              <div className="bg-orange-50 rounded-xl p-4"><div className="font-bold">Materi</div><div className="text-sm text-zinc-500">Belajar HPP, omzet, pasar sasaran</div></div>
              <div className="bg-teal-50 rounded-xl p-4"><div className="font-bold">Game</div><div className="text-sm text-zinc-500">Kasir Warung & Tebak Istilah</div></div>
            </div>
          </div>
          <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-soft p-4 border border-orange-100 hidden md:block">
            <div className="text-sm font-semibold">Halo, calon pengusaha! 👋</div><div className="text-xs text-zinc-500">Yuk mulai langkah pertama</div>
          </div>
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-6 py-10 grid md:grid-cols-3 gap-6">
        {[
          { t:"Materi Ringkas", d:"Bahasa sederhana, contoh warung & UMKM Samarinda." },
          { t:"Game Seru", d:"Latihan hitung untung-rugi sambil main." },
          { t:"Tanya AI", d:"Asisten belajar ramah, jawab langsung dengan konteks materi." },
        ].map(c=> <div key={c.t} className="card"><h3 className="font-bold">{c.t}</h3><p className="text-sm text-zinc-600 mt-1">{c.d}</p></div>)}
      </section>
      <footer className="text-center text-sm text-zinc-500 py-8">© {new Date().getFullYear()} Mulai Usaha Samarinda • Dibuat untuk pemula</footer>
    </main>
  );
}
