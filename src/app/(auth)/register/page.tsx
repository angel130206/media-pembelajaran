"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Input, Label, FieldError } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { AuthShell } from "@/components/auth/AuthShell";
import { Store, Calculator, Users, AlertCircle, CheckCircle2, Loader2, Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });

  function validateLocal() {
    const e: Record<string, string> = {};
    if (!form.name.trim() || form.name.trim().length < 2) e.name = "Nama minimal 2 huruf";
    if (!form.email.trim()) e.email = "Email wajib diisi";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email.trim())) e.email = "Format email tidak valid";
    if (!form.password) e.password = "Kata sandi wajib diisi";
    else if (form.password.length < 6) e.password = "Kata sandi minimal 6 karakter";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setServerError("");
    setSuccess("");
    if (!validateLocal()) return;
    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), password: form.password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        // tangani error spesifik
        if (res.status === 409) {
          setErrors(prev => ({ ...prev, email: data.error }));
          setServerError(data.error);
        } else if (data.field) {
          setErrors(prev => ({ ...prev, [data.field]: data.error }));
          setServerError(data.error);
        } else {
          setServerError(data.error || "Gagal mendaftar. Coba lagi.");
        }
        setLoading(false);
        return;
      }
      setSuccess("Akun berhasil dibuat! Mengalihkan ke onboarding...");
      // auto login
      const login = await signIn("credentials", { email: form.email.trim(), password: form.password, redirect: false });
      setLoading(false);
      if (login?.error) {
        router.push("/login?registered=1");
      } else {
        router.push("/onboarding");
      }
    } catch (err: any) {
      setLoading(false);
      setServerError("Gagal terhubung ke server. Periksa koneksi internet.");
    }
  }

  return (
    <AuthShell
      title="Buat akun gratis"
      subtitle="Mulai perjalanan wirausaha — materi, game, dan pendamping AI dengan contoh warung Samarinda."
      illustration="/illustrations/auth-register.png"
      sideTitle="Kenapa daftar di sini?"
      sidePoints={[
        { icon: <Store className="w-5 h-5 text-brand-600" />, title: "Materi praktis lokal", desc: "Contoh nyata: hitung HPP nasi kuning Rp 12rb di Jalan Pahlawan." },
        { icon: <Calculator className="w-5 h-5 text-teal-600" />, title: "Game & latihan interaktif", desc: "Jadi kasir 60 detik, dapat poin & lencana." },
        { icon: <Users className="w-5 h-5 text-zinc-700" />, title: "Komunitas pemula", desc: "1.200+ warga Samarinda sudah mulai. Kamu selanjutnya." },
      ]}
    >
      <form onSubmit={onSubmit} className="space-y-4" noValidate>
        <div>
          <Label required>Nama lengkap</Label>
          <Input
            name="name"
            placeholder="Contoh: Andi Samarinda"
            value={form.name}
            onChange={e => setForm(s => ({ ...s, name: e.target.value }))}
            error={!!errors.name}
            autoComplete="name"
          />
          <FieldError message={errors.name} />
        </div>

        <div>
          <Label required>Email</Label>
          <Input
            name="email"
            type="email"
            placeholder="andi@email.com"
            value={form.email}
            onChange={e => setForm(s => ({ ...s, email: e.target.value }))}
            error={!!errors.email}
            autoComplete="email"
          />
          <FieldError message={errors.email} />
        </div>

        <div>
          <Label required>Kata sandi</Label>
          <div className="relative">
            <Input
              name="password"
              type={showPass ? "text" : "password"}
              placeholder="Minimal 6 karakter"
              value={form.password}
              onChange={e => setForm(s => ({ ...s, password: e.target.value }))}
              error={!!errors.password}
              autoComplete="new-password"
              className="pr-10"
            />
            <button type="button" onClick={() => setShowPass(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-zinc-500 hover:text-zinc-700">
              {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
          <FieldError message={errors.password} />
          <p className="mt-1.5 text-xs text-zinc-500">Gunakan kombinasi huruf & angka untuk keamanan.</p>
        </div>

        {serverError && (
          <div className="flex gap-2 items-start rounded-xl border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700">
            <AlertCircle className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{serverError}</span>
          </div>
        )}
        {success && (
          <div className="flex gap-2 items-start rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-sm text-emerald-700">
            <CheckCircle2 className="w-4 h-4 mt-0.5 shrink-0" />
            <span>{success}</span>
          </div>
        )}

        <Button type="submit" loading={loading} className="w-full">
          {loading ? "Mendaftarkan..." : "Daftar & Mulai Belajar"}
        </Button>

        <div className="relative py-1">
          <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-zinc-200" /></div>
          <div className="relative flex justify-center"><span className="bg-white px-3 text-xs font-semibold tracking-widest text-zinc-500 uppercase">Atau</span></div>
        </div>

        <button type="button" onClick={() => signIn("google", { callbackUrl: "/onboarding" })} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-zinc-50 transition-colors">
          <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="" className="w-4 h-4" />
          Lanjutkan dengan Google
        </button>
      </form>

      <p className="text-sm text-center mt-6 text-zinc-600">
        Sudah punya akun?{" "}
        <Link href="/login" className="font-semibold text-brand-700 hover:text-brand-800 underline underline-offset-4">
          Masuk di sini
        </Link>
      </p>

      <p className="text-xs text-center text-zinc-500 mt-3">Dengan mendaftar, kamu menyetujui syarat penggunaan & kebijakan privasi.</p>
    </AuthShell>
  );
}
