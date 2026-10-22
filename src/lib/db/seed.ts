// @ts-nocheck
import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";
import bcrypt from "bcryptjs";

async function main() {
  try {
    const envRaw = await import("fs").then(m => {
      try { return m.readFileSync(".env", "utf-8"); } catch { return ""; }
    });
    for (const line of envRaw.split("\n")) {
      const mm = line.match(/^([^#=]+)=(.*)$/);
      if (mm && !process.env[mm[1].trim()]) process.env[mm[1].trim()] = mm[2].trim();
    }
  } catch {}
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL belum diatur");
  const client = postgres(url, { max: 1 });
  const db = drizzle(client, { schema });

  const adminEmail = process.env.ADMIN_EMAIL || "admin@samarinda.id";
  console.log("Seed dengan ADMIN_EMAIL:", adminEmail);

  // Buat admin user jika belum ada
  const { eq } = await import("drizzle-orm");
  const found = await db.select().from(schema.users).where(eq(schema.users.email, adminEmail));
  let adminId: string;
  if (found.length === 0) {
    const hash = await bcrypt.hash("Admin123!", 10);
    const inserted = await db.insert(schema.users).values({
      email: adminEmail,
      name: "Admin Samarinda",
      passwordHash: hash,
      role: "admin",
      onboardingDone: true,
      minat: "kuliner",
      pengalaman: "pernah_jualan",
    }).returning();
    adminId = inserted[0].id;
    console.log("Admin dibuat:", adminEmail);
  } else {
    adminId = found[0].id;
    console.log("Admin sudah ada");
  }

  // 1 materi contoh
  const mat = await db.select().from(schema.materi).limit(1);
  if (mat.length === 0) {
    const materiId = crypto.randomUUID();
    await db.insert(schema.materi).values({
      id: materiId,
      judul: "Memulai Warung Kuliner di Samarinda",
      slug: "memulai-warung-kuliner-samarinda",
      ringkasan: "Belajar langkah awal membuka warung kuliner: modal, lokasi di Samarinda, dan strategi promosi.",
      sampulUrl: "https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80",
      isi: `<h2>Selamat datang calon pengusaha Samarinda!</h2><p>Membuka warung kuliner di Samarinda butuh <strong>perencanaan modal</strong> yang matang. Contoh: jika kamu jual nasi kuning di Jalan Pahlawan, hitung modal bahan, sewa lapak, dan tenaga.</p><ul><li>Hitung HPP (Harga Pokok Penjualan)</li><li>Tentukan harga jual agar untung 20-30%</li><li>Kenali pasar sasaran: mahasiswa, pekerja, keluarga</li></ul><blockquote>Tip: Mulai dari yang kecil, tes pasar dengan 20 porsi pertama!</blockquote><p>Setelah materi ini, coba <em>Game Kasir Warung</em> untuk latihan menghitung kembalian.</p>`,
      urutan: 1,
      status: "terbit",
    });
    console.log("Materi contoh dibuat");

    // Soal set
    const setId = crypto.randomUUID();
    await db.insert(schema.soalSet).values({ id: setId, materiId, judul: "Latihan: Dasar Warung Kuliner" });
    await db.insert(schema.soal).values([
      { setId, pertanyaan: "Apa itu HPP?", opsi: ["Harga Pokok Penjualan", "Harga Promo Penjualan", "Hasil Pendapatan Pasar", "Hitung Porsi Produk"], kunci: 0, pembahasan: "HPP adalah total biaya untuk membuat satu produk.", urutan: 1 },
      { setId, pertanyaan: "Jika modal Rp10.000 dan ingin untung 30%, harga jual?", opsi: ["Rp10.000", "Rp13.000", "Rp11.000", "Rp30.000"], kunci: 1, pembahasan: "10.000 + 30% = 13.000", urutan: 2 },
      { setId, pertanyaan: "Pasar sasaran warung di dekat kampus adalah?", opsi: ["Pensiunan", "Mahasiswa", "Wisatawan asing", "Pejabat"], kunci: 1, pembahasan: "Dekat kampus = mahasiswa", urutan: 3 },
    ]);
    console.log("Soal contoh dibuat");

    // hubungkan game
    await db.insert(schema.gameMateri).values({ materiId, gameId: "kasir-warung" });
    await db.insert(schema.gameMateri).values({ materiId, gameId: "untung-rugi" });
  } else {
    console.log("Materi sudah ada, skip seed materi");
  }

  await client.end();
  console.log("Seed selesai");
}
main().catch(e => { console.error(e); process.exit(1); });
