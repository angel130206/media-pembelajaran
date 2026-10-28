import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { LayoutDashboard, BookOpen, ClipboardList, Users, UserCog, ArrowLeft, Store } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session) redirect("/login");
  if (role!=="admin" && role!=="guru") redirect("/beranda");
  const nav = [
    { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
    { href: "/admin/materi", label: "Materi", icon: BookOpen },
    { href: "/admin/soal", label: "Soal", icon: ClipboardList },
    { href: "/admin/siswa", label: "Siswa", icon: Users },
    { href: "/admin/pengguna", label: "Pengguna", icon: UserCog },
  ];
  return (
    <div className="min-h-screen bg-[#FFFBEB] flex">
      <aside className="w-[264px] bg-white border-r border-orange-100 hidden md:flex flex-col sticky top-0 h-screen">
        <div className="px-5 py-5 border-b border-orange-100">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-ink-900 text-white flex items-center justify-center"><Store className="w-5 h-5" /></div>
            <div>
              <div className="font-extrabold text-sm leading-none">Admin Panel</div>
              <div className="text-xs text-zinc-500">Samarinda LMS</div>
            </div>
          </Link>
          <div className="mt-3 text-xs bg-orange-50 border border-orange-200 rounded-lg px-2.5 py-1.5 text-brand-800 font-semibold">Masuk sebagai {role}</div>
        </div>
        <nav className="p-3 space-y-1 flex-1">
          {nav.map(n => {
            const Icon = n.icon as any;
            return <Link key={n.href} href={n.href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-700 hover:bg-orange-50 hover:text-ink-900 transition-colors"><Icon className="w-4 h-4" /> {n.label}</Link>;
          })}
          <Link href="/beranda" className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm font-semibold text-zinc-600 hover:bg-zinc-50 mt-6 border-t border-zinc-100 pt-4"><ArrowLeft className="w-4 h-4" /> Kembali ke Siswa</Link>
        </nav>
        <div className="p-3 border-t border-orange-100 text-xs text-zinc-500">
          <div className="font-semibold text-ink-900">{session.user.name}</div>
          <div className="truncate">{session.user.email}</div>
        </div>
      </aside>
      <div className="flex-1 min-w-0">
        <header className="bg-white border-b border-orange-100 px-4 py-3 flex justify-between items-center md:hidden sticky top-0 z-10">
          <Link href="/admin" className="font-extrabold flex items-center gap-2"><Store className="w-5 h-5 text-brand-600" /> Admin</Link>
          <Link href="/admin/materi" className="text-sm font-semibold text-brand-700">Materi</Link>
        </header>
        <main className="p-4 md:p-6 max-w-5xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
