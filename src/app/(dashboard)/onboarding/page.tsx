import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import OnboardingClient from "./client";

export default async function OnboardingPage() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const db = getDb();
  let user: any = null;
  try {
    if (db) {
      const [u] = await db.select().from(users).where(eq(users.id, (session.user as any).id)).limit(1);
      user = u;
      if (u?.onboardingDone) redirect("/beranda");
    }
  } catch {}
  return <OnboardingClient initialMinat={user?.minat} initialPengalaman={user?.pengalaman} />;
}
