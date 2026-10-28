import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getClient() {
  if (_client) return _client;
  const url = process.env.DATABASE_URL;
  if (!url) return null as any;
  // Supabase pooler (pgbouncer) requires prepare: false, SSL untuk Vercel
  const isSupabase = url.includes("supabase") || url.includes("pooler");
  const useSSL = isSupabase || process.env.NODE_ENV === "production";
  try {
    _client = postgres(url, {
      max: 5,
      idle_timeout: 20,
      max_lifetime: 60 * 10,
      prepare: false, // penting untuk pgbouncer transaction mode
      ssl: useSSL ? { rejectUnauthorized: false } : undefined,
      connect_timeout: 10,
      onnotice: () => {},
    });
  } catch (e) {
    console.error("[DB] Gagal membuat koneksi postgres:", e);
    return null as any;
  }
  return _client;
}

export function getDb() {
  if (_db) return _db;
  const client = getClient();
  if (!client) return null as any;
  _db = drizzle(client, { schema });
  return _db;
}

export async function checkDbConnection(): Promise<{ ok: boolean; error?: string }> {
  const url = process.env.DATABASE_URL;
  if (!url) return { ok: false, error: "DATABASE_URL belum diatur di environment. Cek .env atau Vercel Env Variables." };
  try {
    const client = getClient();
    if (!client) return { ok: false, error: "Gagal inisialisasi koneksi database." };
    // simple query untuk test
    await client`SELECT 1`;
    return { ok: true };
  } catch (e: any) {
    const msg = e?.message || String(e);
    if (msg.includes("does not exist") || msg.includes("relation")) {
      return { ok: false, error: "Tabel database belum ada. Jalankan migrasi: npm run db:migrate" };
    }
    if (msg.includes("password") || msg.includes("authentication")) {
      return { ok: false, error: "Kredensial database salah. Periksa DATABASE_URL." };
    }
    if (msg.includes("ENOTFOUND") || msg.includes("getaddrinfo")) {
      return { ok: false, error: "Tidak dapat terhubung ke database. Periksa host DATABASE_URL." };
    }
    return { ok: false, error: `Koneksi database gagal: ${msg}` };
  }
}

export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    const real = getDb();
    if (!real) throw new Error("DATABASE_URL belum diatur");
    // @ts-ignore
    return real[prop];
  },
});
