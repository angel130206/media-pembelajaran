import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { BottomNav, Sidebar } from "@/components/layout/BottomNav";
import Link from "next/link";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  // if onboarding not done, redirect unless already on onboarding
  // handled in middleware as well; here simple check via session
  return (
    <div className="min-h-screen flex bg-orange-50/30">
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="md:hidden bg-white border-b border-orange-100 px-4 py-3 flex justify-between items-center sticky top-0 z-10">
          <Link href="/beranda" className="font-bold text-brand-600">Mulai Usaha Samarinda</Link>
          <Link href="/profil" className="w-8 h-8 rounded-full bg-brand-100 flex items-center justify-center text-brand-600 font-bold">{(session.user.name?.[0] || "U").toUpperCase()}</Link>
        </header>
        <main className="flex-1 pb-20 md:pb-0">{children}</main>
        <BottomNav />
      </div>
    </div>
  );
}
