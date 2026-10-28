"use client";
import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { AuthShell } from "@/components/auth/AuthShell";
import { TrendingUp, BookOpen, ShieldCheck, AlertCircle, CheckCircle2, Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const sp = useSearchParams();
  const registered = sp.get("registered");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  function validateLocal() {
    const e: Record<string, string> = {};
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Format email tidak valid";
    if (!form.password) e.password = "Kata sandi wajib diisi";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    if (!validateLocal()) return;
    setLoading(true);
    const res = await signIn("credentials", { email: form.email.trim(), password: form.password, redirect: false });
    setLoading(false);
    if (res?.error) {
      setServerError("Email atau kata sandi salah, atau akun dinonaktifkan. Coba lagi.");
    } else {
      router.push("/beranda");
    }
  }

  return (
    <AuthShell
      title="Selamat datang kembali"
      subtitle="Masuk untuk melanjutkan progres belajarmu dan lanjutkan materi terakhir."
      illustration="/illustrations/auth-login.png"
      sideTitle="Lanjutkan belajarmu"
      sidePoints={[
        { icon: <BookOpen className="w-5 h-5 text-brand-600" />, title: "Progres tersimpan otomatis", desc: "Lanjutkan dari materi terakhir, poin & lencana tetap ada." },
        { icon: <TrendingUp className="w-5 h-5 text-emerald-600" />, title: "Latihan & game", desc: "Uji pemahaman, naik level, dan lihat peringkat." },
        { icon: <ShieldCheck className="w-5 h-5 text-zinc-700" />, title: "Aman & privat", desc: "Data terenkripsi, hanya kamu yang bisa akses akunmu." },
      ]}
    >
      {registered && (
        <div className="mb-4 flex gap-2 items-start rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-800">
          <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
          <span>Akun berhasil dibuat. Silakan masuk dengan email & kata sandi barumu.</span>
        </div>
      )}

      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <Label required>Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="kamu@email.com"
            value={form.email}
            onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
            error={!!errors.email}
            autoComplete="email"
          />
          <FieldError message={errors.email} />
        </div>

        <div>
          <div className="flex items-center justify-between">
            <Label required>Kata sandi</Label>
            <Link href="#" className="text-xs font-semibold text-brand-700 hover:underline">Lupa kata sandi?</Link>
          </div>
          <div className="relative">
            <Input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="••••••••"
              value={form.password}
              onChange={e => setForm(s => ({ ...s, password: e.target.value }))}
              error={!!errors.password}
              autoComplete="current-password"
              className="pr-10"
            />
            <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-zinc-700">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <FieldError message={errors.password} />
        </div>

        {serverError && (
          <div className="flex gap-2 items-start rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {loading ? "Memproses..." : "Masuk ke Dashboard"}
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-xs font-semibold tracking-widest text-zinc-500 uppercase">Atau</span></div>
        </div>

        <button type="button" onClick={() => signIn("google", { callbackUrl: "/beranda" })} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-zinc-50 transition-colors">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="w-4 h-4" />
          Masuk dengan Google
        </button>
      </form>

      <p className="text-sm text-center mt-6 text-zinc-600">
        Belum punya akun?{" "}
        <Link href="/register" className="font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-4">
          Daftar gratis
        </Link>
      </p>
    </AuthShell>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#FFFBEB]"><div className="w-8 h-8 border-2 border-brand-200 border-t-brand-600 rounded-full animate-spin" /></div>}>
      <LoginForm />
    </Suspense>
  );
}
