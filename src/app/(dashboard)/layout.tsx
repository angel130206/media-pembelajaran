import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BottomNav, Sidebar } from "@/components/layout/BottomNav";
import Link from "next/link";
import { Store } from "lucide-react";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  return (
    <div className="min-h-screen flex bg-[#FFFBEB]">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <header className="md:hidden sticky top-0 z-20 bg-white/90 backdrop-blur border-b border-orange-100 px-4 py-3 flex justify-between items-center">
          <Link href="/beranda" className="flex items-center gap-2 font-extrabold tracking-tight">
            <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center"><Store className="w-4 h-4 text-white" /></div>
            <span className="text-ink-900">Mulai Usaha <span className="text-brand-600">Samarinda</span></span>
          </Link>
          <Link href="/profil" className="w-9 h-9 rounded-full bg-brand-600 text-white flex items-center justify-center font-bold text-sm shadow-soft">
            {(session.user.name?.[0] || "U").toUpperCase()}
          </Link>
        </header>
        <main className="flex-1 pb-[76px] md:pb-0 min-w-0">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
