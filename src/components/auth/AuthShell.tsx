import Link from "next/link";
import { BookOpen, ShieldCheck, Users, Sparkles } from "lucide-react";

export function AuthShell({
  title,
  subtitle,
  children,
  illustration,
  sideTitle,
  sidePoints,
}: {
  title: string;
  subtitle: string;
  children: React.ReactNode;
  illustration: string;
  sideTitle: string;
  sidePoints: { icon: React.ReactNode; title: string; desc: string }[];
}) {
  return (
    <div className="min-h-screen bg-[#FFFBEB] flex flex-col">
      {/* top bar */}
      <header className="h-[60px] border-b border-orange-100 bg-white/70 backdrop-blur sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 md:px-6 h-full flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-brand-600 flex items-center justify-center shadow-soft">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <span className="font-extrabold tracking-tight text-ink-900">Mulai Usaha <span className="text-brand-600">Samarinda</span></span>
          </Link>
          <div className="hidden md:flex items-center gap-2 text-xs font-semibold text-zinc-600">
            <ShieldCheck className="w-4 h-4 text-emerald-600" /> Aman & gratis
          </div>
        </div>
      </header>

      <div className="flex-1 max-w-6xl mx-auto w-full px-4 md:px-6 py-6 md:py-10 grid lg:grid-cols-[1.05fr_0.95fr] gap-6 items-start">
        {/* left: form */}
        <div className="bg-white rounded-[1.5rem] border border-orange-100 shadow-card p-6 md:p-8">
          <div>
            <h1 className="text-2xl md:text-[28px] font-extrabold tracking-tight text-ink-900">{title}</h1>
            <p className="mt-2 text-sm text-zinc-600">{subtitle}</p>
          </div>
          <div className="mt-6">{children}</div>
        </div>

        {/* right: illustration */}
        <div className="lg:sticky lg:top-[84px]">
          <div className="bg-white rounded-[1.5rem] border border-orange-100 shadow-lifted overflow-hidden">
            <div className="aspect-[4/3] bg-gradient-to-br from-orange-50 via-white to-amber-50 p-3">
              <img src={illustration} alt="Ilustrasi UMKM Samarinda" className="w-full h-full object-contain rounded-2xl bg-white border border-orange-100" />
            </div>
            <div className="p-6">
              <h3 className="font-extrabold text-ink-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" /> {sideTitle}
              </h3>
              <div className="mt-4 grid gap-3">
                {sidePoints.map(p => (
                  <div key={p.title} className="flex gap-3 rounded-xl border border-orange-100 bg-orange-50/50 p-3">
                    <div className="w-9 h-9 rounded-xl bg-white border border-orange-100 flex items-center justify-center shrink-0">{p.icon}</div>
                    <div>
                      <div className="text-sm font-bold text-ink-900">{p.title}</div>
                      <div className="text-xs text-zinc-600 leading-relaxed">{p.desc}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 flex items-center gap-2 text-xs text-zinc-500 bg-zinc-50 border border-zinc-200 rounded-xl px-3 py-2">
                <Users className="w-4 h-4" /> Dipakai 1.200+ pemula di Samarinda • Data aman
              </div>
            </div>
          </div>
        </div>
      </div>

      <footer className="py-6 text-center text-xs text-zinc-500">© {new Date().getFullYear()} Mulai Usaha Samarinda • Belajar wirausaha lokal, langkah demi langkah</footer>
    </div>
  );
}
