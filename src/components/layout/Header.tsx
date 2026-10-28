import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";

export function SiteHeader({ variant = "default" }: { variant?: "default" | "light" }) {
  return (
    <header className={`sticky top-0 z-50 backdrop-blur-md border-b ${variant === "light" ? "bg-white/80 border-orange-100" : "bg-[#FFFBEB]/80 border-orange-100/60"}`}>
      <div className="max-w-6xl mx-auto px-4 md:px-6 h-[64px] flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center shadow-soft">
            <BookOpen className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-[15px] tracking-tight text-ink-900">Mulai Usaha</div>
            <div className="text-xs font-semibold text-brand-700 -mt-0.5">di Samarinda</div>
          </div>
        </Link>
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-zinc-600">
          <a href="#materi" className="hover:text-brand-700 transition-colors">Materi</a>
          <a href="#permainan" className="hover:text-brand-700 transition-colors">Game</a>
          <a href="#faq" className="hover:text-brand-700 transition-colors">Tanya</a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="hidden md:inline-flex px-4 py-2.5 rounded-xl font-semibold text-sm text-zinc-700 hover:bg-white border border-transparent hover:border-orange-200 transition-all">Masuk</Link>
          <Link href="/register" className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-sm font-semibold shadow-soft transition-all hover:shadow-lifted">
            Daftar Gratis <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </header>
  );
}

export function SiteFooter() {
  return (
    <footer className="border-t border-orange-100 bg-white/60 backdrop-blur">
      <div className="max-w-6xl mx-auto px-4 md:px-6 py-8 flex flex-col md:flex-row justify-between gap-6 text-sm">
        <div>
          <div className="font-bold text-ink-900">Mulai Usaha dari Nol di Samarinda</div>
          <p className="text-zinc-600 mt-1 max-w-md">Platform belajar wirausaha untuk pemula — materi praktis, game interaktif, dan pendamping AI dengan contoh usaha lokal Samarinda.</p>
        </div>
        <div className="text-zinc-500">
          <div>© {new Date().getFullYear()} Dibuat untuk pemula di Samarinda</div>
          <div className="mt-1 text-xs">Warna: krem hangat • putih • oranye • ilustrasi warung & UMKM lokal</div>
        </div>
      </div>
    </footer>
  );
}
