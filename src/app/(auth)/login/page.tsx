"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function LoginPage() {
  const router = useRouter();
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", { email: fd.get("email"), password: fd.get("password"), redirect: false });
    setLoading(false);
    if (res?.error) setErr("Email atau kata sandi salah, atau akun nonaktif.");
    else router.push("/beranda");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-teal-50 p-6">
      <div className="w-full max-w-md card">
        <h1 className="text-2xl font-bold">Masuk</h1>
        <p className="text-sm text-zinc-500">Masuk untuk lanjut belajar wirausaha</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div><Label>Email</Label><Input name="email" type="email" required placeholder="kamu@email.com" /></div>
          <div><Label>Kata Sandi</Label><Input name="password" type="password" required placeholder="••••••" /></div>
          {err && <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{err}</div>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Memproses..." : "Masuk"}</Button>
          <button type="button" onClick={()=>signIn("google", { callbackUrl: "/beranda" })} className="w-full btn-ghost flex items-center justify-center gap-2">Lanjutkan dengan Google</button>
        </form>
        <p className="text-sm text-center mt-4">Belum punya akun? <Link href="/register" className="text-brand-600 font-semibold">Daftar</Link></p>
      </div>
    </div>
  );
}
