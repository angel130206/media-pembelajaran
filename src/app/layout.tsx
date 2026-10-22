import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mulai Usaha dari Nol di Samarinda",
  description: "Platform belajar kewirausahaan untuk pemula di Samarinda",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className="font-sans min-h-screen antialiased">
        {children}
      </body>
    </html>
  );
}
