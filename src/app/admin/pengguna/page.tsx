import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import PenggunaTable from "./table";

export default async function PenggunaPage() {
  let list:any[]=[];
  try {
    const db = getDb();
    if (db) list = await db.select().from(users);
  } catch {}
  return (
    <div>
      <h1 className="text-2xl font-bold">Kelola Pengguna</h1>
      <PenggunaTable initial={list} />
    </div>
  );
}
