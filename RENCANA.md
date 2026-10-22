# Rencana Pembangunan — Mulai Usaha dari Nol di Samarinda

## Rencana Singkat (8 Tahapan)
1. **Setup Proyek** — Next.js 14 App Router + TS + Tailwind, struktur folder, Drizzle ORM + migrasi, .env.example, Dockerfile multi-stage standalone, docker-compose (app+postgres+minio+caddy), Caddyfile. Validasi build & compose.
2. **Auth & Onboarding** — Auth.js v5 Credentials+Google, JWT session, bcrypt, middleware proteksi /admin, role otomatis ADMIN_EMAIL, onboarding 2-3 layar (minat, pengalaman, pengenalan menu) simpan di users.
3. **Dashboard Admin** — CRUD materi (Tiptap editor + upload S3), kelola soal (pilihan ganda + impor CSV), hubungkan game ke materi, kelola pengguna (role/aktif).
4. **Area Siswa** — Beranda (sapaan, progres, lanjutkan belajar), Materi (kartu status + detail + tandai selesai), Latihan Soal, Profil.
5. **Registry Game + 3 Game** — Sistem registry `gameRegistry.ts` dengan props {onFinish}, 3 game: Kasir Warung, Untung/Rugi, Tebak Istilah. Simpan skor ke DB.
6. **Tanya AI** — API route streaming Anthropic Claude, konteks materi/soal, system prompt wirausaha Samarinda, rate limit 30/jam di DB, validasi Zod, kunci hanya di server.
7. **Pantau Siswa + Gamifikasi** — Dashboard admin pantau progres/skor/poin, filter, ekspor CSV, sistem poin & lencana.
8. **README Lengkap** — Instalasi lokal, deploy VPS Docker, deploy serverless Vercel+Neon+R2, buat admin pertama, tambah game baru.

Setiap tahap diakhiri `npm run build` untuk memastikan tidak error.

## Asumsi Teknis
- Node 20+, Next.js 14.2 (stabil, output standalone), React 18.
- Driver Postgres: `postgres` (postgres.js) — kompatibel serverless & VPS, max 10 koneksi, lazy connect agar build tidak butuh DB.
- Auth.js v5 beta (NextAuth) dengan DrizzleAdapter, session JWT (stateless, tanpa DB session).
- S3 via @aws-sdk/client-s3 dengan env endpoint/bucket/region/key/secret/publicUrl (mendukung MinIO dan R2).
- Editor Tiptap StarterKit + Image + Link, simpan JSON string di kolom `isi` (text), render dengan sanitasi HTML.
- Chat AI via @anthropic-ai/sdk streaming (`messages.stream`), system prompt Indonesia sederhana + contoh Samarinda.
- Validasi Zod di semua form & API, sanitasi HTML dengan `sanitize-html` di server.
- Tailwind 3, mobile-first, palet hangat (oranye/amber + teal), dark mode via class.
- Migrasi via `drizzle-kit migrate`, seed via `tsx` script.
- Docker multi-stage (deps → builder → runner non-root), compose dengan postgres:16-alpine, minio, caddy:2-alpine + Caddyfile.
- Data awal kosong, seed hanya 1 materi contoh + 1 set soal + admin dari ADMIN_EMAIL.
