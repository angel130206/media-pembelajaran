import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const path = req.nextUrl.pathname;
  // protect /admin
  if (path.startsWith("/admin")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.nextUrl));
    const role = (req.auth?.user as any)?.role;
    if (role !== "admin" && role !== "guru") {
      return NextResponse.redirect(new URL("/beranda", req.nextUrl));
    }
  }
  // protect dashboard
  if (path.startsWith("/beranda") || path.startsWith("/materi") || path.startsWith("/game") || path.startsWith("/latihan") || path.startsWith("/tanya-ai") || path.startsWith("/profil") || path.startsWith("/onboarding")) {
    if (!isLoggedIn) return NextResponse.redirect(new URL("/login", req.nextUrl));
  }
  return NextResponse.next();
});

export const config = { matcher: ["/admin/:path*", "/beranda/:path*", "/materi/:path*", "/game/:path*", "/latihan/:path*", "/tanya-ai/:path*", "/profil/:path*", "/onboarding/:path*", "/beranda", "/materi", "/game", "/latihan", "/tanya-ai", "/profil", "/onboarding"] };
