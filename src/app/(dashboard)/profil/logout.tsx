"use client";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
export default function LogoutButton() {
  return <button onClick={()=> signOut({ callbackUrl:"/" })} className="w-full inline-flex items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-3 text-sm font-semibold hover:bg-zinc-50 transition-colors"><LogOut className="w-4 h-4" /> Keluar</button>;
}
