import { NextResponse } from "next/server";
import { getDb, checkDbConnection } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { registerSchema } from "@/lib/validation";

export async function POST(req: Request) {
  try {
    let body: any;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Format data tidak valid. Pastikan mengirim JSON." }, { status: 400 });
    }

    // Normalisasi: trim string kosong jadi undefined agar Zod tangkap
    if (typeof body.email === "string") body.email = body.email.trim();
    if (typeof body.name === "string") body.name = body.name.trim();

    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const first = parsed.error.issues[0];
      // Pesan yang jelas per field
      return NextResponse.json({ error: first.message, field: first.path[0] }, { status: 400 });
    }

    const { name, email, password } = parsed.data;

    // Cek DB tersedia
    const db = getDb();
    if (!db) {
      const check = await checkDbConnection();
      return NextResponse.json({
        error: check.error || "Database belum siap. Hubungi admin atau periksa konfigurasi DATABASE_URL."
      }, { status: 500 });
    }

    // Cek email duplikat (case-insensitive karena sudah lowercase)
    try {
      const [exists] = await db.select().from(users).where(eq(users.email, email)).limit(1);
      if (exists) {
        return NextResponse.json({ error: "Email sudah terdaftar. Silakan masuk atau gunakan email lain." }, { status: 409 });
      }
    } catch (dbErr: any) {
      console.error("[register] cek email gagal:", dbErr);
      if (dbErr?.message?.includes("does not exist") || dbErr?.code === "42P01") {
        return NextResponse.json({
          error: "Database belum dimigrasi. Admin perlu menjalankan 'npm run db:migrate' di server."
        }, { status: 500 });
      }
      return NextResponse.json({ error: "Gagal memeriksa email. Coba lagi atau hubungi admin." }, { status: 500 });
    }

    const hash = await bcrypt.hash(password, 10);
    const role = (process.env.ADMIN_EMAIL && email.toLowerCase() === process.env.ADMIN_EMAIL.toLowerCase()) ? "admin" as const : "siswa" as const;

    try {
      await db.insert(users).values({ name, email, passwordHash: hash, role, onboardingDone: false });
    } catch (insertErr: any) {
      console.error("[register] insert gagal:", insertErr);
      // Tangani unique violation dari Postgres
      if (insertErr?.code === "23505" || insertErr?.message?.includes("duplicate")) {
        return NextResponse.json({ error: "Email sudah terdaftar. Silakan masuk." }, { status: 409 });
      }
      if (insertErr?.message?.includes("does not exist")) {
        return NextResponse.json({ error: "Tabel pengguna belum ada. Jalankan migrasi database." }, { status: 500 });
      }
      return NextResponse.json({ error: "Gagal menyimpan akun. Coba lagi." }, { status: 500 });
    }

    return NextResponse.json({ ok: true, message: "Akun berhasil dibuat. Silakan masuk." });

  } catch (e: any) {
    console.error("[register] unexpected:", e);
    return NextResponse.json({ error: "Terjadi kesalahan server. Coba lagi nanti." }, { status: 500 });
  }
}
