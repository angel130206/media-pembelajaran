"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Gamepad2, ClipboardList, Bot, User2, Store } from "lucide-react";

const items = [
  { href: "/beranda", label: "Beranda", icon: Home },
  { href: "/materi", label: "Materi", icon: BookOpen },
  { href: "/game", label: "Game", icon: Gamepad2 },
  { href: "/latihan", label: "Latihan", icon: ClipboardList },
  { href: "/tanya-ai", label: "Tanya AI", icon: Bot },
];

export function BottomNav() {
  const path = usePathname();
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-t border-orange-100 flex justify-around py-2 md:hidden pb-safe">
      {items.map(it => {
        const active = path?.startsWith(it.href);
        const Icon = it.icon as any;
        return (
          <Link key={it.href} href={it.href} className={`flex flex-col items-center gap-1 text-[11px] font-semibold px-3 py-1.5 rounded-xl transition-all ${active ? "text-brand-700 bg-orange-50" : "text-zinc-500"}`}>
            <Icon size={20} strokeWidth={active ? 2.2 : 1.8} />
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export function Sidebar() {
  const path = usePathname();
  return (
    <aside className="hidden md:flex w-[272px] shrink-0 flex-col bg-white border-r border-orange-100 min-h-screen sticky top-0">
      <div className="px-5 py-5 border-b border-orange-100">
        <Link href="/beranda" className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-600 to-brand-500 flex items-center justify-center shadow-soft">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div className="leading-tight">
            <div className="font-extrabold text-sm tracking-tight text-ink-900">Mulai Usaha</div>
            <div className="text-xs font-semibold text-brand-700 -mt-0.5">di Samarinda</div>
          </div>
        </Link>
        <div className="mt-3 text-xs text-zinc-500">Belajar wirausaha lokal • langkah demi langkah</div>
      </div>

      <nav className="p-3 space-y-1 flex-1">
        {items.map(it => {
          const active = path?.startsWith(it.href);
          const Icon = it.icon as any;
          return (
            <Link key={it.href} href={it.href} className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${active ? "bg-brand-600 text-white shadow-soft" : "text-zinc-700 hover:bg-orange-50 hover:text-ink-900"}`}>
              <Icon size={18} /> {it.label}
            </Link>
          );
        })}
        <div className="pt-4 mt-4 border-t border-orange-100">
          <div className="text-xs font-bold tracking-widest text-zinc-400 uppercase px-3 mb-2">Akun</div>
          <Link href="/profil" className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all ${path?.startsWith("/profil") ? "bg-brand-600 text-white" : "hover:bg-orange-50 text-zinc-700"}`}>
            <User2 size={18} /> Profil & Lencana
          </Link>
        </div>

        <div className="mt-6 rounded-xl bg-gradient-to-br from-orange-50 to-amber-50 border border-orange-200 p-4">
          <div className="text-xs font-bold text-brand-800">Progres mingguan</div>
          <div className="mt-2 h-2 bg-white rounded-full overflow-hidden border border-orange-100">
            <div className="h-full w-[42%] bg-brand-600 rounded-full" />
          </div>
          <div className="mt-2 text-xs text-zinc-600">Kamu lebih konsisten dari 68% pemula!</div>
        </div>
      </nav>
      <div className="p-3 border-t border-orange-100 text-xs text-zinc-500">© {new Date().getFullYear()} • Samarinda • v1</div>
    </aside>
  );
}
