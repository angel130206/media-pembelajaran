import Link from "next/link";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { SiteHeader, SiteFooter } from "@/components/layout/Header";
import { ArrowRight, BookOpen, Gamepad2, GraduationCap, MessageCircle, CheckCircle2, TrendingUp, Users, Sparkles, Play } from "lucide-react";

export default async function HomePage() {
  const session = await auth();
  if (session?.user) redirect("/beranda");

  return (
    <div className="min-h-screen">
      <SiteHeader />

      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 hero-pattern opacity-60" />
        <div className="absolute top-0 right-0 w-[520px] h-[520px] bg-orange-100 rounded-full blur-[90px] opacity-60 -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-[420px] h-[420px] bg-amber-100 rounded-full blur-[80px] opacity-50 translate-y-1/2 -translate-x-1/4" />

        <div className="relative max-w-6xl mx-auto px-4 md:px-6 pt-10 md:pt-14 pb-10">
          <div className="grid lg:grid-cols-[1.1fr_0.9fr] gap-8 items-center">
            <div>
              <div className="inline-flex items-center gap-2 bg-white border border-orange-200 rounded-full px-3 py-1.5 shadow-soft">
                <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
                <span className="text-xs font-semibold text-zinc-700">Untuk pemula di Samarinda • Tanpa modal besar</span>
              </div>

              <h1 className="mt-5 text-[32px] md:text-[44px] font-extrabold leading-[1.05] tracking-tight text-ink-900">
                Mulai usaha
                <span className="block text-brand-600">dari nol,</span>
                <span className="block">di Samarinda.</span>
              </h1>

              <p className="mt-4 text-[16px] md:text-[18px] leading-relaxed text-zinc-600 max-w-xl">
                Belajar langkah demi langkah: hitung modal, tentukan harga, kenali pelanggan, dan latihan lewat game kasir. Semua dengan contoh warung & UMKM asli Samarinda.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/register" className="inline-flex items-center gap-2 bg-brand-600 hover:bg-brand-700 text-white font-semibold px-6 py-3.5 rounded-xl shadow-lifted hover:shadow-lifted transition-all">
                  Mulai Belajar Gratis <ArrowRight className="w-4 h-4" />
                </Link>
                <Link href="/login" className="inline-flex items-center gap-2 bg-white border border-orange-200 hover:border-orange-300 hover:bg-orange-50 text-zinc-800 font-semibold px-6 py-3.5 rounded-xl transition-all">
                  <Play className="w-4 h-4 text-brand-600" /> Lihat Materi
                </Link>
              </div>

              <div className="mt-6 flex items-center gap-4 text-sm">
                <div className="flex -space-x-2">
                  {[1, 2, 3].map(i => (
                    <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-gradient-to-br from-orange-200 to-amber-100 flex items-center justify-center text-[10px] font-bold text-brand-800">S{i}</div>
                  ))}
                </div>
                <div className="text-zinc-600">
                  <span className="font-semibold text-ink-900">1.200+</span> pemula sudah mulai
                </div>
                <span className="hidden md:inline h-4 w-px bg-orange-200" />
                <div className="hidden md:flex items-center gap-1.5 text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-full px-2.5 py-1 text-xs font-semibold">
                  <CheckCircle2 className="w-4 h-4" /> Gratis selamanya
                </div>
              </div>

              <div className="mt-8 grid grid-cols-3 gap-3 max-w-md">
                {[
                  { v: "12+", k: "Materi praktis", sub: "HPP & omzet" },
                  { v: "3", k: "Game edukasi", sub: "Kasir & hitung" },
                  { v: "24 jam", k: "Tanya AI", sub: "Pendamping" },
                ].map(s => (
                  <div key={s.k} className="bg-white/80 backdrop-blur border border-orange-100 rounded-2xl p-3 text-center">
                    <div className="text-lg font-extrabold text-brand-700">{s.v}</div>
                    <div className="text-xs font-semibold text-ink-900">{s.k}</div>
                    <div className="text-[11px] text-zinc-500">{s.sub}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Illustration card */}
            <div className="relative">
              <div className="bg-white rounded-[1.75rem] shadow-lifted border border-orange-100 overflow-hidden">
                <div className="aspect-[4/3] relative bg-gradient-to-br from-orange-50 via-white to-amber-50 p-4">
                  <img src="/illustrations/hero-warung.png" alt="Warung Samarinda" className="w-full h-full object-contain rounded-2xl" />
                  {/* floating stats */}
                  <div className="absolute left-4 bottom-4 bg-white rounded-2xl shadow-card border border-orange-100 p-3 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-emerald-600" />
                    </div>
                    <div>
                      <div className="text-xs text-zinc-500">Omzet hari ini</div>
                      <div className="text-sm font-extrabold text-ink-900">Rp 248.000</div>
                    </div>
                  </div>
                  <div className="absolute right-4 top-4 bg-white rounded-xl shadow-card border border-orange-100 px-3 py-2 flex items-center gap-2">
                    <Users className="w-4 h-4 text-brand-600" />
                    <span className="text-xs font-semibold">8 pelanggan</span>
                  </div>
                </div>
                <div className="p-4 grid grid-cols-2 gap-3">
                  <div className="bg-cream-50 border border-orange-100 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-ink-900"><BookOpen className="w-4 h-4 text-brand-600" /> Materi</div>
                    <div className="text-xs text-zinc-600 mt-1">HPP, laba, pasar sasaran — contoh nasi kuning Pahlawan</div>
                  </div>
                  <div className="bg-tealBrand-50 border border-teal-100 rounded-xl p-3">
                    <div className="flex items-center gap-2 text-sm font-bold text-teal-800"><Gamepad2 className="w-4 h-4 text-tealBrand-600" /> Game</div>
                    <div className="text-xs text-zinc-600 mt-1">Jadi kasir warung, hitung kembalian 60 detik</div>
                  </div>
                </div>
              </div>

              <div className="absolute -z-10 -bottom-6 -right-6 w-32 h-32 bg-orange-200 rounded-full blur-2xl opacity-30" />
            </div>
          </div>
        </div>
      </section>

      {/* FITUR */}
      <section id="materi" className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="flex items-end justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-bold tracking-widest text-brand-700 uppercase">Cara belajar</div>
            <h2 className="mt-2 text-2xl md:text-3xl font-extrabold tracking-tight text-ink-900">4 langkah jadi pengusaha Samarinda</h2>
          </div>
          <div className="hidden md:flex items-center gap-2 text-sm text-zinc-600">
            <Sparkles className="w-4 h-4 text-brand-600" /> Dirancang untuk HP & laptop
          </div>
        </div>

        <div className="mt-6 grid md:grid-cols-4 gap-4">
          {[
            { icon: BookOpen, t: "Baca Materi", d: "Ringkas, pakai bahasa sehari-hari. Contoh: modal gorengan Rp 12rb, jual Rp 2rb.", c: "bg-orange-500", accent: "border-orange-200", num: "01" },
            { icon: Gamepad2, t: "Main Game", d: "Latihan kasir, hitung untung-rugi, tebak istilah sambil main.", c: "bg-tealBrand-600", accent: "border-teal-100", num: "02" },
            { icon: GraduationCap, t: "Latihan Soal", d: "Uji paham + pembahasan langsung. Nilai & poin tersimpan.", c: "bg-zinc-900", accent: "border-zinc-200", num: "03" },
            { icon: MessageCircle, t: "Tanya AI", d: "Asisten ramah 24 jam, jawab pakai konteks materimu.", c: "bg-amber-500", accent: "border-amber-200", num: "04" },
          ].map(f => (
            <div key={f.t} className={`bg-white rounded-[1.25rem] border p-5 shadow-card card-hover ${f.accent}`}>
              <div className="flex items-center justify-between">
                <div className={`w-10 h-10 rounded-xl ${f.c} text-white flex items-center justify-center shadow-soft`}>
                  <f.icon className="w-5 h-5" />
                </div>
                <span className="text-xs font-extrabold tracking-widest text-zinc-400">{f.num}</span>
              </div>
              <div className="mt-4 font-bold text-ink-900">{f.t}</div>
              <p className="mt-1 text-sm leading-relaxed text-zinc-600">{f.d}</p>
            </div>
          ))}
        </div>
      </section>

      {/* PREVIEW MATERI + GAME */}
      <section id="permainan" className="bg-white border-y border-orange-100">
        <div className="max-w-6xl mx-auto px-4 md:px-6 py-10 grid lg:grid-cols-2 gap-6">
          <div className="rounded-[1.5rem] border border-orange-100 overflow-hidden bg-gradient-to-br from-orange-50 to-white">
            <div className="p-6">
              <div className="text-xs font-bold tracking-widest text-brand-700 uppercase">Materi unggulan</div>
              <h3 className="mt-2 text-xl font-extrabold text-ink-900">Memulai Warung Kuliner di Jalan Pahlawan</h3>
              <p className="mt-2 text-sm text-zinc-600">Hitung HPP, tentukan harga 20-30% laba, kenali mahasiswa & pekerja sebagai pasar sasaran. Lengkap dengan template hitung.</p>
              <div className="mt-4 flex gap-2">
                <span className="badge badge-warm">Pemula</span>
                <span className="badge badge-neutral">12 menit • Gratis</span>
              </div>
            </div>
            <div className="px-6 pb-6">
              <div className="rounded-2xl overflow-hidden border border-orange-100 bg-white p-2">
                <div className="h-32 rounded-xl bg-gradient-to-br from-orange-100 via-white to-amber-100 flex items-center justify-center text-brand-700 font-bold">Pratinjau materi • Gambar sampul</div>
                <div className="mt-3 h-2 bg-orange-100 rounded-full overflow-hidden">
                  <div className="h-full w-[68%] bg-brand-600 rounded-full" />
                </div>
                <div className="mt-1 text-xs text-zinc-500">68% siswa menyelesaikan • 4.8/5</div>
              </div>
            </div>
          </div>

          <div className="rounded-[1.5rem] border border-zinc-200 overflow-hidden bg-white">
            <div className="p-6">
              <div className="text-xs font-bold tracking-widest text-tealBrand-700 uppercase">Game edukasi</div>
              <h3 className="mt-2 text-xl font-extrabold text-ink-900">Kasir Warung — 60 detik jadi kasir handal</h3>
              <p className="mt-2 text-sm text-zinc-600">Hitung kembalian, jaga stok, layani pelanggan. Skor masuk papan peringkat kelas.</p>
              <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                {[
                  { k: "Waktu", v: "60s" },
                  { k: "Level", v: "Mudah" },
                  { k: "Skor max", v: "1.240" },
                ].map(x => (
                  <div key={x.k} className="rounded-xl bg-zinc-50 border border-zinc-200 p-3">
                    <div className="text-xs text-zinc-500">{x.k}</div>
                    <div className="text-sm font-extrabold">{x.v}</div>
                  </div>
                ))}
              </div>
              <Link href="/register" className="mt-6 inline-flex w-full justify-center bg-zinc-900 hover:bg-black text-white font-semibold py-3 rounded-xl transition-colors">
                Coba Game Sekarang
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-6xl mx-auto px-4 md:px-6 py-10">
        <div className="rounded-[1.75rem] bg-gradient-to-br from-brand-600 to-orange-500 p-[1px]">
          <div className="rounded-[1.7rem] bg-gradient-to-br from-brand-600 to-orange-500 p-6 md:p-8 text-white relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
            <div className="relative grid md:grid-cols-[1.2fr_0.8fr] gap-6 items-center">
              <div>
                <h3 className="text-2xl md:text-3xl font-extrabold leading-tight">Siap buka warung pertama di Samarinda?</h3>
                <p className="mt-2 text-white/90">Daftar gratis, pilih minat (kuliner, fashion, jasa, kerajinan, digital), dan mulai dari materi 12 menit.</p>
                <div className="mt-6 flex gap-3">
                  <Link href="/register" className="bg-white text-brand-700 font-bold px-6 py-3 rounded-xl hover:bg-orange-50 transition-colors">Daftar Gratis</Link>
                  <Link href="/login" className="bg-white/10 border border-white/20 text-white font-semibold px-6 py-3 rounded-xl hover:bg-white/15 transition-colors">Masuk</Link>
                </div>
              </div>
              <div className="bg-white rounded-2xl p-4 text-zinc-800">
                <div className="text-sm font-bold text-ink-900">Progres belajar</div>
                <div className="mt-3 space-y-3">
                  <div className="flex justify-between text-xs"><span className="text-zinc-600">Materi 4/12</span><span className="font-bold">33%</span></div>
                  <div className="progress-track"><div className="progress-fill" style={{ width: "33%" }} /></div>
                  <div className="flex gap-2">
                    <span className="badge badge-success">🔥 3 hari streak</span>
                    <span className="badge badge-warm">+120 poin</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
