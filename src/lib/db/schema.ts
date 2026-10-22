import { pgTable, text, varchar, integer, boolean, timestamp, uuid, primaryKey, jsonb, index } from "drizzle-orm/pg-core";

// Users
export const users = pgTable("users", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").notNull().unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
  passwordHash: text("password_hash"),
  role: text("role", { enum: ["siswa", "guru", "admin"] }).notNull().default("siswa"),
  minat: text("minat"), // kuliner,fashion,jasa,kerajinan,digital,lainnya
  pengalaman: text("pengalaman", { enum: ["pemula", "pernah_jualan"] }),
  onboardingDone: boolean("onboarding_done").default(false).notNull(),
  aktif: boolean("aktif").default(true).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({ emailIdx: index("users_email_idx").on(t.email) }));

export const accounts = pgTable("accounts", {
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  type: text("type").notNull(),
  provider: text("provider").notNull(),
  providerAccountId: text("providerAccountId").notNull(),
  refresh_token: text("refresh_token"),
  access_token: text("access_token"),
  expires_at: integer("expires_at"),
  token_type: text("token_type"),
  scope: text("scope"),
  id_token: text("id_token"),
  session_state: text("session_state"),
}, (a) => ({ compoundKey: primaryKey({ columns: [a.provider, a.providerAccountId] }) }));

export const sessions = pgTable("sessions", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId").notNull().references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable("verificationTokens", {
  identifier: text("identifier").notNull(),
  token: text("token").notNull(),
  expires: timestamp("expires", { mode: "date" }).notNull(),
}, (vt) => ({ compoundKey: primaryKey({ columns: [vt.identifier, vt.token] }) }));

// Materi
export const materi = pgTable("materi", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  judul: text("judul").notNull(),
  slug: text("slug").notNull().unique(),
  ringkasan: text("ringkasan"),
  sampulUrl: text("sampul_url"),
  isi: text("isi"), // JSON string dari Tiptap atau HTML
  urutan: integer("urutan").notNull().default(0),
  status: text("status", { enum: ["draf", "terbit"] }).notNull().default("draf"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({ slugIdx: index("materi_slug_idx").on(t.slug), statusIdx: index("materi_status_idx").on(t.status) }));

export const soalSet = pgTable("soal_set", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  materiId: text("materi_id").references(() => materi.id, { onDelete: "cascade" }),
  judul: text("judul").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const soal = pgTable("soal", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  setId: text("set_id").notNull().references(() => soalSet.id, { onDelete: "cascade" }),
  pertanyaan: text("pertanyaan").notNull(),
  opsi: jsonb("opsi").notNull(), // ["A","B","C","D"]
  kunci: integer("kunci").notNull(), // 0-3
  pembahasan: text("pembahasan"),
  urutan: integer("urutan").notNull().default(0),
});

export const gameMateri = pgTable("game_materi", {
  materiId: text("materi_id").notNull().references(() => materi.id, { onDelete: "cascade" }),
  gameId: text("game_id").notNull(),
}, (t) => ({ pk: primaryKey({ columns: [t.materiId, t.gameId] }) }));

export const progresMateri = pgTable("progres_materi", {
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  materiId: text("materi_id").notNull().references(() => materi.id, { onDelete: "cascade" }),
  status: text("status", { enum: ["belum_mulai", "sedang", "selesai"] }).notNull().default("belum_mulai"),
  selesaiPada: timestamp("selesai_pada"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (t) => ({ pk: primaryKey({ columns: [t.userId, t.materiId] }), userIdx: index("progres_user_idx").on(t.userId) }));

export const hasilLatihan = pgTable("hasil_latihan", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  setId: text("set_id").notNull().references(() => soalSet.id, { onDelete: "cascade" }),
  skor: integer("skor").notNull(),
  total: integer("total").notNull(),
  jawaban: jsonb("jawaban"), // { soalId: chosenIdx }
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({ userIdx: index("hasil_user_idx").on(t.userId) }));

export const skorGame = pgTable("skor_game", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  gameId: text("game_id").notNull(),
  skor: integer("skor").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
}, (t) => ({ userIdx: index("skor_game_user_idx").on(t.userId) }));

export const poinLog = pgTable("poin_log", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  jumlah: integer("jumlah").notNull(),
  alasan: text("alasan").notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const lencana = pgTable("lencana", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  nama: text("nama").notNull(),
  deskripsi: text("deskripsi"),
  ikon: text("ikon"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const aiRateLimit = pgTable("ai_rate_limit", {
  id: text("id").primaryKey().$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  windowStart: timestamp("window_start").notNull(),
  count: integer("count").notNull().default(0),
}, (t) => ({ userWindowIdx: index("ai_rate_user_window_idx").on(t.userId, t.windowStart) }));
