import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import Google from "next-auth/providers/google";
import { DrizzleAdapter } from "@auth/drizzle-adapter";
import bcrypt from "bcryptjs";
import { getDb } from "./db";
import { users } from "./db/schema";
import { eq } from "drizzle-orm";
import { loginSchema } from "./validation";

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: (() => {
    try {
      const db = getDb();
      if (!db) return undefined as any;
      return DrizzleAdapter(db as any);
    } catch { return undefined as any; }
  })(),
  session: { strategy: "jwt" },
  secret: process.env.AUTH_SECRET,
  trustHost: true,
  providers: [
    Google({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
    Credentials({
      name: "Email dan Kata Sandi",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Kata Sandi", type: "password" },
      },
      async authorize(creds) {
        const parsed = loginSchema.safeParse(creds);
        if (!parsed.success) return null;
        const { email, password } = parsed.data;
        try {
          const db = getDb();
          if (!db) return null;
          const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
          if (!user || !user.passwordHash) return null;
          if (!user.aktif) return null;
          const ok = await bcrypt.compare(password, user.passwordHash);
          if (!ok) return null;
          return { id: user.id, email: user.email, name: user.name, image: user.image } as any;
        } catch { return null; }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user?.id) {
        token.sub = user.id;
        // fetch role
        try {
          const db = getDb();
          if (db) {
            const [u] = await db.select().from(users).where(eq(users.id, user.id as string)).limit(1);
            if (u) {
              (token as any).role = u.role;
              (token as any).onboardingDone = u.onboardingDone;
            }
          }
        } catch {}
      }
      // refresh role on each request if sub exists
      if (token.sub && !(token as any).role) {
        try {
          const db = getDb();
          if (db) {
            const [u] = await db.select().from(users).where(eq(users.id, token.sub as string)).limit(1);
            if (u) {
              (token as any).role = u.role;
              (token as any).onboardingDone = u.onboardingDone;
            }
          }
        } catch {}
      }
      return token;
    },
    async session({ session, token }) {
      if (token.sub) (session.user as any).id = token.sub;
      if ((token as any).role) (session.user as any).role = (token as any).role;
      if ((token as any).onboardingDone !== undefined) (session.user as any).onboardingDone = (token as any).onboardingDone;
      return session;
    },
    async signIn({ user, account }) {
      // Auto admin assignment
      try {
        const db = getDb();
        if (db && user.email) {
          const adminEmail = process.env.ADMIN_EMAIL;
          if (adminEmail && user.email.toLowerCase() === adminEmail.toLowerCase()) {
            const [existing] = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
            if (existing && existing.role !== "admin") {
              await db.update(users).set({ role: "admin" }).where(eq(users.id, existing.id));
            }
          }
          // ensure active
          const [u] = await db.select().from(users).where(eq(users.email, user.email)).limit(1);
          if (u && !u.aktif) return false;
        }
      } catch {}
      return true;
    },
  },
  pages: {
    signIn: "/login",
  },
});
