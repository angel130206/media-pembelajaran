-- Initial schema for LMS Samarinda
CREATE TABLE IF NOT EXISTS "users" (
	"id" text PRIMARY KEY NOT NULL,
	"name" text,
	"email" text NOT NULL UNIQUE,
	"emailVerified" timestamp,
	"image" text,
	"password_hash" text,
	"role" text DEFAULT 'siswa' NOT NULL,
	"minat" text,
	"pengalaman" text,
	"onboarding_done" boolean DEFAULT false NOT NULL,
	"aktif" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");
CREATE TABLE IF NOT EXISTS "accounts" (
	"userId" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"type" text NOT NULL,
	"provider" text NOT NULL,
	"providerAccountId" text NOT NULL,
	"refresh_token" text,
	"access_token" text,
	"expires_at" integer,
	"token_type" text,
	"scope" text,
	"id_token" text,
	"session_state" text,
	CONSTRAINT "accounts_provider_providerAccountId_pk" PRIMARY KEY("provider","providerAccountId")
);
CREATE TABLE IF NOT EXISTS "sessions" (
	"sessionToken" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"expires" timestamp NOT NULL
);
CREATE TABLE IF NOT EXISTS "verificationTokens" (
	"identifier" text NOT NULL,
	"token" text NOT NULL,
	"expires" timestamp NOT NULL,
	CONSTRAINT "verificationTokens_identifier_token_pk" PRIMARY KEY("identifier","token")
);
CREATE TABLE IF NOT EXISTS "materi" (
	"id" text PRIMARY KEY NOT NULL,
	"judul" text NOT NULL,
	"slug" text NOT NULL UNIQUE,
	"ringkasan" text,
	"sampul_url" text,
	"isi" text,
	"urutan" integer DEFAULT 0 NOT NULL,
	"status" text DEFAULT 'draf' NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "materi_slug_idx" ON "materi" USING btree ("slug");
CREATE INDEX IF NOT EXISTS "materi_status_idx" ON "materi" USING btree ("status");
CREATE TABLE IF NOT EXISTS "soal_set" (
	"id" text PRIMARY KEY NOT NULL,
	"materi_id" text REFERENCES "materi"("id") ON DELETE cascade,
	"judul" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "soal" (
	"id" text PRIMARY KEY NOT NULL,
	"set_id" text NOT NULL REFERENCES "soal_set"("id") ON DELETE cascade,
	"pertanyaan" text NOT NULL,
	"opsi" jsonb NOT NULL,
	"kunci" integer NOT NULL,
	"pembahasan" text,
	"urutan" integer DEFAULT 0 NOT NULL
);
CREATE TABLE IF NOT EXISTS "game_materi" (
	"materi_id" text NOT NULL REFERENCES "materi"("id") ON DELETE cascade,
	"game_id" text NOT NULL,
	CONSTRAINT "game_materi_materi_id_game_id_pk" PRIMARY KEY("materi_id","game_id")
);
CREATE TABLE IF NOT EXISTS "progres_materi" (
	"user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"materi_id" text NOT NULL REFERENCES "materi"("id") ON DELETE cascade,
	"status" text DEFAULT 'belum_mulai' NOT NULL,
	"selesai_pada" timestamp,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "progres_materi_user_id_materi_id_pk" PRIMARY KEY("user_id","materi_id")
);
CREATE INDEX IF NOT EXISTS "progres_user_idx" ON "progres_materi" USING btree ("user_id");
CREATE TABLE IF NOT EXISTS "hasil_latihan" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"set_id" text NOT NULL REFERENCES "soal_set"("id") ON DELETE cascade,
	"skor" integer NOT NULL,
	"total" integer NOT NULL,
	"jawaban" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "hasil_user_idx" ON "hasil_latihan" USING btree ("user_id");
CREATE TABLE IF NOT EXISTS "skor_game" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"game_id" text NOT NULL,
	"skor" integer NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE INDEX IF NOT EXISTS "skor_game_user_idx" ON "skor_game" USING btree ("user_id");
CREATE TABLE IF NOT EXISTS "poin_log" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"jumlah" integer NOT NULL,
	"alasan" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "lencana" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"nama" text NOT NULL,
	"deskripsi" text,
	"ikon" text,
	"created_at" timestamp DEFAULT now() NOT NULL
);
CREATE TABLE IF NOT EXISTS "ai_rate_limit" (
	"id" text PRIMARY KEY NOT NULL,
	"user_id" text NOT NULL REFERENCES "users"("id") ON DELETE cascade,
	"window_start" timestamp NOT NULL,
	"count" integer DEFAULT 0 NOT NULL
);
CREATE INDEX IF NOT EXISTS "ai_rate_user_window_idx" ON "ai_rate_limit" USING btree ("user_id","window_start");
