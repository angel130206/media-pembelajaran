import postgres from "postgres";
import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import * as dotenv from "fs";
import { readFileSync } from "fs";

async function main() {
  // load .env manually if needed
  try {
    const env = readFileSync(".env", "utf-8");
    for (const line of env.split("\n")) {
      const m = line.match(/^([^#=]+)=(.*)$/);
      if (m && !process.env[m[1].trim()]) process.env[m[1].trim()] = m[2].trim();
    }
  } catch {}
  const url = process.env.DATABASE_URL;
  if (!url) throw new Error("DATABASE_URL belum diatur");
  const client = postgres(url, { max: 1 });
  const db = drizzle(client);
  console.log("Menjalankan migrasi...");
  await migrate(db, { migrationsFolder: "./drizzle" });
  console.log("Migrasi selesai.");
  await client.end();
}
main().catch((e) => { console.error(e); process.exit(1); });
