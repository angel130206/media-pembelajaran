import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import * as schema from "./schema";

let _client: ReturnType<typeof postgres> | null = null;
let _db: ReturnType<typeof drizzle<typeof schema>> | null = null;

function getClient() {
  if (_client) return _client;
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Return dummy client that will fail gracefully when used, but not crash build
    // During build we won't query DB
    return null as any;
  }
  _client = postgres(url, { max: 5, idle_timeout: 20, max_lifetime: 60 * 10 });
  return _client;
}

export function getDb() {
  if (_db) return _db;
  const client = getClient();
  if (!client) {
    // Mock drizzle for build time
    return null as any;
  }
  _db = drizzle(client, { schema });
  return _db;
}

// For convenience, export db as getter proxy to avoid null checks everywhere
export const db = new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
  get(_, prop) {
    const real = getDb();
    if (!real) throw new Error("DATABASE_URL belum diatur");
    // @ts-ignore
    return real[prop];
  },
});
