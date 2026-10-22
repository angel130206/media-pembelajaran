"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Label } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";

export default function RegisterPage() {
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setErr(""); setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await fetch("/api/auth/register", {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: fd.get("name"), email: fd.get("email"), password: fd.get("password") })
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) { setErr(data.error || "Gagal daftar"); return; }
    // auto login
    const login = await signIn("credentials", { email: fd.get("email"), password: fd.get("password"), redirect: false });
    if (login?.error) router.push("/login");
    else router.push("/onboarding");
  }
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-teal-50 p-6">
      <div className="w-full max-w-md card">
        <h1 className="text-2xl font-bold">Daftar Akun</h1>
        <p className="text-sm text-zinc-500">Gratis, mulai belajar hari ini</p>
        <form onSubmit={onSubmit} className="mt-6 space-y-4">
          <div><Label>Nama</Label><Input name="name" required placeholder="Budi" /></div>
          <div><Label>Email</Label><Input name="email" type="email" required placeholder="kamu@email.com" /></div>
          <div><Label>Kata Sandi</Label><Input name="password" type="password" required minLength={6} placeholder="Minimal 6 karakter" /></div>
          {err && <div className="text-sm text-red-600 bg-red-50 p-2 rounded-lg">{err}</div>}
          <Button type="submit" className="w-full" disabled={loading}>{loading ? "Mendaftar..." : "Daftar"}</Button>
          <button type="button" onClick={()=>signIn("google", { callbackUrl: "/onboarding" })} className="w-full btn-ghost">Lanjutkan dengan Google</button>
        </form>
        <p className="text-sm text-center mt-4">Sudah punya akun? <Link href="/login" className="text-brand-600 font-semibold">Masuk</Link></p>
      </div>
    </div>
  );
}
