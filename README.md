# Mulai Usaha dari Nol di Samarinda

Platform LMS mini kewirausahaan untuk pemula — **Materi, Game, Latihan Soal, Tanya AI**. Mobile-first, siap deploy **gratis tanpa kartu** ke **Vercel (Hobby) + Supabase Free** dan tetap kompatibel **Docker/VPS** dengan kode yang sama.

> **Prioritas gratis tanpa kartu terpenuhi**: hosting Vercel Free, DB + Storage Supabase Free, AI Groq/Gemini Free — semuanya tanpa kartu kredit/debit. R2 dan Anthropic Claude tidak dipakai untuk deployment gratis karena mensyaratkan kartu.

## Daftar Isi
- Status Gratis Tanpa Kartu (verifikasi)
- Tech Stack
- Fitur
- Struktur Folder
- Env (.env.example)
- Instalasi Lokal
- Deploy Gratis: Vercel + Supabase + Groq/Gemini (tanpa kartu)
- Deploy VPS/Docker (opsional)
- Membuat Admin Pertama
- Menambah Game Baru

## Status Gratis Tanpa Kartu — Apa yang Perlu Akun & Keterbatasannya

Semua klaim di bawah diverifikasi Oktober 2026:

| Layanan | Akun diperlukan? | Kartu kredit untuk free tier? | Batas free tier (aktual) | Keterbatasan utama |
|---|---|---|---|---|
| **Vercel Hobby (hosting)** | Ya, akun Vercel (email/GitHub) | **Tidak** — Hobby gratis selamanya, tanpa kartu [2](https://zplatform.ai/guides/is-vercel-free/) [3](https://supadrop.host/blog/vercel-pricing-free-tier-limits/) | 100 GB Fast Data Transfer, 1 juta function invocations, 1 juta edge requests/bulan, durasi fungsi 5 menit [3](https://supadrop.host/blog/vercel-pricing-free-tier-limits/) | **Hanya proyek personal, non-komersial**. Jika ada pembayaran/iklan, harus Pro $20/bulan. Melebihi limit = fitur pause 30 hari, tidak ditagih [3](https://supadrop.host/blog/vercel-pricing-free-tier-limits/) |
| **Supabase Free (Postgres + Auth + Storage)** | Ya, akun Supabase | **Tidak** — Free selamanya, tanpa kartu [1](https://www.itpathsolutions.com/supabase-free-tier-limits) [2](https://mykavo.app/blog/supabase-free-tier-limits) | Per project: 500 MB DB, 1 GB file storage, 5 GB egress + 5 GB cached egress, 50.000 MAU, 500K Edge Function invocations, max 50 MB per file, 2 project aktif [1](https://www.itpathsolutions.com/supabase-free-tier-limits) [11](https://supabase.com/pricing) | Project pause setelah 7 hari tanpa request — harus unpause manual di dashboard. Tidak ada backup otomatis, log 1 hari, compute shared [1](https://www.itpathsolutions.com/supabase-free-tier-limits) [8](https://www.ssdnodes.com/learn/is-supabase-free-cloud-vs-self-hosted) |
| **Supabase Storage Free** | Termasuk Supabase (sama) | **Tidak** | 1 GB storage termasuk di atas, CDN basic [11](https://supabase.com/pricing) | 50 MB per file, tidak ada image transformation di Free [11](https://supabase.com/pricing) |
| **Cloudflare R2** | Ya, akun Cloudflare | **Ya, wajib kartu** meski free tier 10 GB tersedia [2](https://www.reddit.com/r/CloudFlare/comments/1s4bdml/i_was_thrilled_to_use_cloudflare_pagesd1_until/) [4](https://community.cloudflare.com/t/why-using-r2-free-tier-involves-giving-card-info/945179) [5](https://developers.cloudflare.com/r2/pricing/) | 10 GB-month storage, 1 juta Class A, 10 juta Class B, egress gratis [5](https://developers.cloudflare.com/r2/pricing/) | Free hanya Standard storage; melebihi = langsung ditagih — alasan Cloudflare meminta kartu [4](https://community.cloudflare.com/t/why-using-r2-free-tier-involves-giving-card-info/945179) |
| **Anthropic Claude API** | Ya, console.anthropic.com | **Ya** — API tidak punya free tier ongoing, hanya kredit trial $5 yang kedaluwarsa [2](https://www.ssdnodes.com/learn/claude-api-free-tier) [5](https://www.ssdnodes.com/learn/claude-free-tier-limits) | Tidak ada alokasi bulanan gratis; setelah trial = pay-as-you-go [2](https://www.ssdnodes.com/learn/claude-api-free-tier) | Harga $3/15 per MTok (Sonnet). Max/Team dapat kredit $100-200/bulan tapi itu paket berbayar $100-200/bulan [9](https://aicatchup.com/news/claude-max-team-free-monthly-api-credits) |
| **Groq API Free** | Ya, console.groq.com (email/GitHub/Google) | **Tidak** — free tier no card [1](https://www.cloudzero.com/blog/groq-pricing/) [2](https://www.eesel.ai/blog/groq-pricing) | Model populer `llama-3.1-8b-instant`: 30 RPM, 14.400 RPD, 6K TPM, 500K TPD. Model besar `llama-3.3-70b` / `gpt-oss-120b`: 30 RPM, 1.000 RPD, 8-12K TPM [2](https://www.eesel.ai/blog/groq-pricing) [3](https://localaimaster.com/blog/groq-api-free-guide) | Limit per organisasi (banyak key tidak menambah kuota). Cukup untuk prototype, kurang untuk produksi berat [1](https://www.cloudzero.com/blog/groq-pricing/) |
| **Google Gemini API Free** | Ya, Google AI Studio | **Tidak** — API key gratis tanpa kartu [1](https://tokenmix.ai/blog/gemini-api-free-tier-limits) [3](https://blog.laozhang.ai/en/posts/gemini-api-free-tier) | Flash/Flash-Lite gratis, quota per-project tampil di AI Studio (bervariasi, ±10 RPM, ratusan-ribuan RPD), reset tengah malam PT [3](https://blog.laozhang.ai/en/posts/gemini-api-free-tier) | Hanya Flash/Flash-Lite; Pro, image/video model berbayar. Mengaktifkan billing di project menghapus free tier-nya [8](https://felloai.com/is-gemini-free/) [10](https://kathanpatel.vercel.app/blog/free-gemini-api-access-google-ai-studio-developer-guide) |

**Kesimpulan:** Untuk deployment **100% tanpa kartu**, gunakan **Vercel Hobby + Supabase (DB+Storage) + Groq (atau Gemini)**. R2 dan Claude tetap didukung kode-nya untuk VPS, tapi **tidak wajib** dan **tidak disarankan** untuk skenario gratis tanpa kartu.

## Tech Stack
- Next.js 14 App Router + TypeScript + Tailwind CSS (output `standalone` untuk Docker, juga jalan di Vercel)
- Auth.js (NextAuth) — Credentials + Google, JWT stateless, bcrypt
- PostgreSQL + Drizzle ORM (driver `postgres.js`, `max:5`, serverless-friendly)
- Storage adapter `src/lib/storage.ts`: **Supabase Storage** (prioritas, free tanpa kartu) → fallback **S3-compatible** (MinIO di Docker / R2/S3 jika ada kartu)
- AI adapter `src/lib/ai.ts`: **Groq** (prioritas, OpenAI-compatible streaming) → fallback **Gemini** → fallback mock. Kunci hanya di server (`process.env`), tidak bocor ke client
- Tiptap, Zod, `sanitize.ts`

### Stateless
- Tidak tulis disk lokal, tidak state di memori, tidak WebSocket — semua di Postgres & Storage. Config via env saja.

## Fitur (tetap lengkap)
- **Siswa**: daftar/masuk email+Google, onboarding (minat, pengalaman), beranda progres, materi (tandai selesai +poin), game 3 judul, latihan soal + pembahasan, Tanya AI streaming (rate limit 30/jam di DB), profil & lencana
- **Admin**: dashboard (siswa, materi, avg progres), CRUD materi (Tiptap + upload), kelola soal (+ impor CSV), hubungkan game, pantau siswa (filter/ekspor CSV), kelola pengguna (role/aktif)
- **Gamifikasi**: poin & lencana tetap

## Struktur
```
src/
  app/(auth)/login,register | (dashboard)/beranda,materi,game,latihan,tanya-ai,profil,onboarding | admin/... | api/auth,chat,upload,game-score,latihan-submit,progress
  components/ui, editor/TiptapEditor, games/(KasirWarung,UntungRugi,TebakIstilah,registry), layout
  lib/db/schema,index,migrate,seed | auth.ts | storage.ts (Supabase→S3) | ai.ts (Groq→Gemini→mock) | validation.ts
drizzle/0000_init.sql
Dockerfile, docker-compose.yml (app+postgres+minio+caddy), Caddyfile
```

## Env (.env.example) — Hanya yang Diperlukan
```ini
# DB Supabase Free (pooling) atau lokal
DATABASE_URL=postgresql://postgres.PROJECT:[PASSWORD]@aws-0-ap-southeast-1.pooler.supabase.com:6543/postgres?pgbouncer=true

# Auth
AUTH_SECRET=your-random-secret-32chars
AUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=
GOOGLE_CLIENT_SECRET=
ADMIN_EMAIL=admin@samarinda.id

# AI gratis tanpa kartu — isi salah satu (Groq diprioritaskan)
GROQ_API_KEY=        # dari console.groq.com, no card
GROQ_MODEL=llama-3.1-8b-instant
GEMINI_API_KEY=      # dari aistudio.google.com/app/apikey, no card
GEMINI_MODEL=gemini-2.0-flash

# Storage — isi yang dipakai saja
SUPABASE_URL=https://PROJECT.supabase.co
SUPABASE_SERVICE_ROLE_KEY=
SUPABASE_STORAGE_BUCKET=uploads
# S3 opsional (Docker VPS): isi otomatis dari compose, kosongkan di Vercel
S3_ENDPOINT=http://localhost:9000
S3_REGION=us-east-1
S3_BUCKET=samarinda-lms
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin123
S3_PUBLIC_URL=http://localhost:9000/samarinda-lms
```
`ANTHROPIC_API_KEY` dan kredensial R2 dihapus — tidak wajib untuk deployment gratis.

## Instalasi Lokal
```bash
git clone <repo> && cd media-pembelajaran
cp .env.example .env
# isi DATABASE_URL (lokal atau Supabase), AUTH_SECRET, ADMIN_EMAIL
# isi GROQ_API_KEY atau GEMINI_API_KEY untuk Tanya AI nyata (opsional, tanpa itu mode mock)
npm install
npm run db:migrate
npm run db:seed      # admin + 1 materi + 1 soal
npm run dev          # http://localhost:3000
npm run build        # verifikasi
```
Jika pakai Supabase, pastikan `DATABASE_URL` menggunakan **pooler** (port 6543 + `?pgbouncer=true`) agar tidak exhaust koneksi serverless.

## Deploy Gratis Tanpa Kartu: Vercel + Supabase + Groq (Rekomendasi)

### 1) Siapkan Supabase (Free, tanpa kartu)
1. Daftar di **supabase.com** (email/GitHub) — tidak minta kartu.
2. New Project → pilih region terdekat (Singapore), set password DB.
3. Di **Project Settings → Database**, copy **Connection string → URI (pooling, pgbouncer)**. Format: `postgresql://postgres.PROJECT:...@aws-0-...pooler.supabase.com:6543/postgres?pgbouncer=true` — gunakan ini untuk `DATABASE_URL`.
4. Di **Storage**, buat bucket `uploads` (public). Jika ingin private, biarkan public untuk kemudahan LMS pemula.
5. Di **Project Settings → API**, copy `Project URL` → `SUPABASE_URL` dan `service_role` (secret) → `SUPABASE_SERVICE_ROLE_KEY`. Jangan pakai `anon` untuk upload server.

> Batas Free: 500 MB DB, 1 GB storage, 50K MAU, 5 GB egress. Project pause 7 hari idle — unpause di dashboard. Cukup untuk kelas kecil.

### 2) Siapkan Groq (Free, tanpa kartu)
1. Daftar di **console.groq.com** (email/GitHub/Google) — tidak minta kartu.
2. **API Keys → Create** → copy `GROQ_API_KEY`.
3. Default model `llama-3.1-8b-instant` (30 RPM / 14.400 RPD, paling longgar). Alternatif `llama-3.3-70b-versatile` lebih pintar tapi 1.000 RPD.

Alternatif: **Gemini** — buat key di **aistudio.google.com/app/apikey** (Google account, tanpa kartu), model `gemini-2.0-flash`, quota lihat di **AI Studio → Rate limits**. Hanya Flash/Flash-Lite gratis.

### 3) Deploy ke Vercel (Hobby, tanpa kartu)
1. Fork repo ini ke GitHub kamu.
2. Daftar di **vercel.com** → **Add New Project → Import** repo.
3. **Environment Variables**: isi semua dari `.env.example` (DATABASE_URL pooler, AUTH_SECRET, AUTH_URL=`https://<project>.vercel.app`, GOOGLE_* (opsional), GROQ_API_KEY, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY).
   - Generate `AUTH_SECRET`: `openssl rand -base64 32`
4. Deploy. Setelah deploy, jalankan migrasi sekali dari lokal:
   ```bash
   DATABASE_URL="postgresql://..." npm run db:migrate
   DATABASE_URL="postgresql://..." npm run db:seed
   ```
   Atau via Vercel CLI: `vercel env pull && npm run db:migrate`.
5. (Opsional) Google OAuth: di Cloud Console tambah redirect `https://<project>.vercel.app/api/auth/callback/google`.

Tidak perlu setup R2 — upload materi langsung ke Supabase Storage.

### Catatan Vercel Free
- Gratis selamanya, tanpa kartu, tapi personal non-komersial. Jika LMS untuk instansi komersial, perlu Pro.
- Jika melebihi limit, deploy pause 30 hari — bukan tagihan.

## Deploy VPS/Docker (tetap kompatibel)
```bash
git clone <repo> && cd media-pembelajaran
cp .env.example .env
# untuk VPS: isi DATABASE_URL lokal, AUTH_SECRET, GROQ_API_KEY atau biarkan mock
docker compose up -d --build
docker compose logs -f app
# migrasi sudah auto di command app, atau manual:
docker compose exec app npx tsx src/lib/db/migrate.ts
docker compose exec app npx tsx src/lib/db/seed.ts
```
Stack: `app:3000 + postgres:16 + minio:9000/9001 + caddy:80/443`. MinIO tetap (S3) untuk VPS tanpa Supabase. Caddy HTTPS: ganti `:80` dengan domain di `Caddyfile`.

## Membuat Admin Pertama
Atur `ADMIN_EMAIL=admin@samarinda.id` sebelum daftar. Daftar dengan email itu → otomatis `role=admin`. Atau ubah di DB: `UPDATE users SET role='admin' WHERE email='...'`. Kelola role di `/admin/pengguna`.

## Menambah Game Baru
1. Buat `src/components/games/GameBaru.tsx` dengan props `{onFinish(score:number)}`
2. Tambah 1 baris di `src/components/games/registry.tsx`: `{id:"game-baru", judul:"Game Baru", ..., komponen: GameBaru}`
3. Hubungkan di `/admin/materi/[id]` → tampil di siswa.

## Keamanan & Keterbatasan Free Tier
- Password bcrypt, CSRF Auth.js, Zod di API, cek role server, sanitasi HTML `src/lib/sanitize.ts`, max 5 MB image, rate limit AI 30/jam.
- Tanpa kartu = batas ketat (pause Supabase 7 hari, Vercel 1M invocations, Groq 1K RPD). Untuk kelas besar, perlu upgrade atau jaga idle dengan cron ping.
- Drizzle pakai `postgres.js` dengan pooling; untuk Supabase wajib pooler agar tidak `too many connections` di serverless.

## Lisensi
MIT — untuk pembelajaran UMKM Samarinda.
