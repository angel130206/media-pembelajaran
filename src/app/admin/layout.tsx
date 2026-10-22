import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const role = (session?.user as any)?.role;
  if (!session) redirect("/login");
  if (role!=="admin" && role!=="guru") redirect("/beranda");
  return (
    <div className="min-h-screen bg-zinc-50 flex">
      <aside className="w-64 bg-white border-r p-4 hidden md:block">
        <Link href="/admin" className="font-bold text-lg text-brand-600">Admin Panel</Link>
        <nav className="mt-6 space-y-1">
          <Link href="/admin" className="block px-3 py-2 rounded-lg hover:bg-zinc-100">Dashboard</Link>
          <Link href="/admin/materi" className="block px-3 py-2 rounded-lg hover:bg-zinc-100">Materi</Link>
          <Link href="/admin/soal" className="block px-3 py-2 rounded-lg hover:bg-zinc-100">Soal</Link>
          <Link href="/admin/siswa" className="block px-3 py-2 rounded-lg hover:bg-zinc-100">Siswa</Link>
          <Link href="/admin/pengguna" className="block px-3 py-2 rounded-lg hover:bg-zinc-100">Pengguna</Link>
          <Link href="/beranda" className="block px-3 py-2 rounded-lg hover:bg-orange-50 mt-6">← Kembali ke Siswa</Link>
        </nav>
      </aside>
      <div className="flex-1">
        <header className="bg-white border-b px-6 py-3 flex justify-between md:hidden">
          <Link href="/admin" className="font-bold">Admin</Link>
          <Link href="/admin/materi" className="text-sm text-brand-600">Materi</Link>
        </header>
        <main className="p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
