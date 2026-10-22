# Mulai Usaha dari Nol di Samarinda

Platform LMS mini kewirausahaan untuk pemula — belajar lewat **Materi**, **Game**, **Latihan Soal**, dan **Tanya AI**. Mobile-first, hangat & bersemangat, siap deploy ke **VPS (Docker)** maupun **serverless (Vercel + Neon + R2)** dengan kode yang sama.

## Daftar Isi
- Fitur & Peran
- Tech Stack
- Struktur Folder
- Env & Konfigurasi
- Instalasi Lokal
- Migrasi & Seed
- Deploy VPS (Docker)
- Deploy Serverless (Vercel + Neon + R2)
- Membuat Admin Pertama
- Menambah Game Baru
- Panduan Admin

## Fitur
- **Siswa**: Registrasi email/password (bcrypt) + Google OAuth, onboarding minat & pengalaman, beranda progres, materi dengan tandai selesai (+poin), game interaktif, latihan soal dengan pembahasan, Tanya AI streaming (rate limit 30/jam).
- **Admin/Guru**: Dashboard (jumlah siswa, materi, rata-rata progres), CRUD materi (editor Tiptap + upload S3), kelola soal + impor CSV, hubungkan game ke materi, pantau siswa (filter & ekspor CSV), kelola pengguna (role/aktif).
- **Gamifikasi**: Poin & lencana (Langkah Pertama, Rajin Belajar, Juara Game), riwayat skor.

## Tech Stack
- Next.js 14 App Router + TypeScript + Tailwind CSS
- Auth.js (NextAuth) — Credentials + Google, JWT session, hash bcrypt
- PostgreSQL + Drizzle ORM (postgres.js driver, serverless-friendly, max 5 koneksi)
- S3-compatible storage (AWS SDK v3 — MinIO lokal, R2/S3 serverless)
- Tiptap editor (simpan HTML/JSON)
- Claude API (Anthropic SDK) streaming, kunci hanya di server
- Zod validasi

### Arsitektur Stateless
- Tidak tulis file ke disk lokal, tidak simpan state di memori, tidak WebSocket — semua di PostgreSQL & S3.
- Output standalone, semua config via env.

## Struktur
```
src/
  app/
    page.tsx (landing)
    (auth)/login, register
    (dashboard)/beranda, materi, game, latihan, tanya-ai, profil, onboarding
    admin/dashboard, materi, soal, siswa, pengguna
    api/auth, materi, upload, chat, game-score, latihan-submit, progress
  components/
    ui, editor/TiptapEditor, games/(KasirWarung, UntungRugi, TebakIstilah), layout
  lib/
    db/(schema, index, migrate, seed), auth.ts, s3.ts, validation.ts, gamification.ts
drizzle/ (migrasi SQL)
Dockerfile, docker-compose.yml, Caddyfile
```

## Environment (.env.example)
```
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/samarinda_lms
AUTH_SECRET=your-random-secret-min-32-chars
AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAIL=admin@samarinda.id
ANTHROPIC_API_KEY=
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET=samarinda-lms
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
S3_PUBLIC_URL=http://localhost:9000/samarinda-lms
NEXT_PUBLIC_APP_URL=http://localhost:3000
```
> Semua dari env, tidak ada kunci di kode.

## Instalasi Lokal
```bash
git clone <repo>
cp .env.example .env
# isi DATABASE_URL, AUTH_SECRET, ADMIN_EMAIL

npm install
npm run db:migrate   # atau npm run db:push untuk dev
npm run db:seed       # buat admin + materi contoh
npm run dev           # http://localhost:3000
npm run build && npm start
```
Butuh Postgres lokal (atau docker):
```bash
docker run --name pg -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=samarinda_lms -p 5432:5432 -d postgres:16-alpine
# MinIO opsional:
docker run -p 9000:9000 -p 9001:9001 --name minio -e MINIO_ROOT_USER=minioadmin -e MINIO_ROOT_PASSWORD=minioadmin123 -d minio/minio server /data --console-address ":9001"
```

### Migrasi & Seed
```bash
npm run db:generate  # buat SQL baru setelah ubah schema
npm run db:migrate    # jalankan migrasi (sekali perintah)
npm run db:seed       # isi 1 materi + 1 set soal + admin dari ADMIN_EMAIL
```

## Deploy VPS (Docker)
Prasyarat: VPS dengan Docker & Compose.

```bash
# di server
git clone <repo> && cd media-pembelajaran
cp .env.example .env
nano .env # isi AUTH_SECRET (openssl rand -base64 32), AUTH_URL=https://domainmu.com, ADMIN_EMAIL, ANTHROPIC_API_KEY, GOOGLE_*

docker compose up -d --build
docker compose logs -f app
# migrasi otomatis dijalankan di command app; atau manual:
docker compose exec app npm run db:migrate
docker compose exec app npm run db:seed
```
Stack: `app (standalone) + postgres + minio + caddy`. Caddy otomatis HTTPS jika `Caddyfile` diganti domain:
```
samarinda.example.com {
  reverse_proxy app:3000
}
```
Buka `https://samarinda.example.com`.

## Deploy Serverless (Vercel + Neon/Supabase + R2)
1. **Database**: Buat Postgres di Neon/Supabase, copy `DATABASE_URL` (pooled, `?sslmode=require`).
2. **Storage**: Buat bucket R2 (Cloudflare) — dapatkan endpoint `https://<id>.r2.cloudflarestorage.com`, region `auto`, bucket, AccessKey/Secret, Public URL (custom domain atau `https://<bucket>.r2.dev`).
3. **Vercel**:
   - Import repo GitHub → Framework Next.js.
   - Env Vars: semua dari `.env.example` (DATABASE_URL, AUTH_SECRET, AUTH_URL=https://<vercel>.vercel.app, GOOGLE_*, ADMIN_EMAIL, ANTHROPIC_API_KEY, S3_ENDPOINT/REGION/BUCKET/KEY/SECRET/PUBLIC_URL).
   - Build command default `npm run build` (standalone tidak dipakai di Vercel, tapi tetap kompatibel).
   - Deploy → jalankan migrasi lokal sekali: `DATABASE_URL=... npm run db:migrate && npm run db:seed` (atau via Vercel CLI).
4. Google OAuth: tambah Authorized redirect URI `https://<vercel>/api/auth/callback/google`.

Driver `postgres.js` sudah serverless-friendly (max 5 koneksi, idle timeout). Tidak perlu WebSocket.

## Membuat Admin Pertama
- Atur `ADMIN_EMAIL=admin@samarinda.id` di env **sebelum** daftar pertama.
- Daftar via `/register` dengan email tersebut → otomatis `role=admin`.
- Atau setelah daftar, ubah via DB: `UPDATE users SET role='admin' WHERE email='...'`.
- Admin bisa ubah peran di `/admin/pengguna` (siswa/guru) & nonaktifkan akun.

## Menambah Game Baru (Registry)
1. Buat komponen React di `src/components/games/GameBaru.tsx`:
```tsx
"use client";
export default function GameBaru({ onFinish }: { onFinish:(score:number)=>void }) {
  // ... UI game, panggil onFinish(skor) saat selesai
  return <div>...</div>;
}
```
2. Daftarkan 1 baris di `src/components/games/registry.tsx`:
```ts
import GameBaru from "./GameBaru";
export const gameRegistry = [
  // ...
  { id:"game-baru", judul:"Game Baru", deskripsi:"...", kesulitan:"Mudah", komponen:GameBaru, icon:"🎯" },
];
```
3. Hubungkan ke materi di `/admin/materi/[id]` → pilih Game Baru → tampil di sisi siswa `/materi/[slug]` dan `/game`.

Tidak perlu ubah route lain — skor tersimpan otomatis via `/api/game-score`.

## Panduan Admin
- **Materi**: judul, slug, ringkasan, sampul (upload S3), isi (Tiptap: bold, list, quote, gambar), status draf/terbit, urutan (↑↓).
- **Soal**: per materi buat Set → tambah soal manual (pertanyaan, 4 opsi, kunci, pembahasan) atau Impor CSV. Template CSV bisa diunduh dari UI.
- **Game**: centang game di form materi.
- **Siswa**: tabel progres & poin, filter per materi, ekspor CSV.
- **Pengguna**: ubah role & aktif/nonaktif.

## Keamanan
- Password hash bcrypt, CSRF Auth.js, Zod di semua API, cek role di server (bukan hanya UI), sanitasi HTML, batas file 5MB & tipe image, rate limit login (Auth.js) & AI (30/jam di DB).

## Lisensi
MIT — untuk pembelajaran UMKM Samarinda.
