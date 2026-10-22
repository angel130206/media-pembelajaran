"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, BookOpen, Gamepad2, ClipboardList, Bot, User2 } from "lucide-react";

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
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-orange-100 flex justify-around py-2 md:hidden">
      {items.map(it => {
        const active = path?.startsWith(it.href);
        const Icon = it.icon;
        return (
          <Link key={it.href} href={it.href} className={`flex flex-col items-center text-xs px-2 py-1 rounded-lg ${active ? "text-brand-600 bg-orange-50" : "text-zinc-500"}`}>
            <Icon size={20} />
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
    <aside className="hidden md:flex w-64 shrink-0 flex-col gap-2 bg-white border-r border-orange-100 p-4 min-h-screen sticky top-0">
      <Link href="/beranda" className="font-bold text-xl text-brand-600 mb-4">Mulai Usaha<br/>di Samarinda</Link>
      {items.map(it => {
        const active = path?.startsWith(it.href);
        const Icon = it.icon;
        return (
          <Link key={it.href} href={it.href} className={`flex items-center gap-3 px-4 py-3 rounded-xl ${active ? "bg-brand-500 text-white" : "hover:bg-orange-50 text-zinc-700"}`}>
            <Icon size={20} /> {it.label}
          </Link>
        );
      })}
      <Link href="/profil" className={`flex items-center gap-3 px-4 py-3 rounded-xl mt-auto ${path?.startsWith("/profil") ? "bg-brand-500 text-white" : "hover:bg-orange-50"}`}><User2 size={20}/> Profil</Link>
    </aside>
  );
}
