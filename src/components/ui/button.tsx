import { cn } from "@/lib/utils";
import * as React from "react";

export function Button({
  className,
  variant = "primary",
  size = "md",
  loading = false,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "ghost" | "outline" | "secondary";
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50 disabled:cursor-not-allowed";
  const variants: Record<string, string> = {
    primary: "bg-brand-600 hover:bg-brand-700 text-white shadow-soft hover:shadow-lifted hover:-translate-y-0.5 active:translate-y-0",
    secondary: "bg-white border border-orange-200 hover:bg-orange-50 text-zinc-800 hover:border-orange-300",
    ghost: "bg-white border border-orange-200 hover:bg-orange-50 text-zinc-700",
    outline: "border border-zinc-300 bg-transparent hover:bg-zinc-50 text-zinc-700",
  };
  const sizes: Record<string, string> = {
    sm: "px-3.5 py-2 text-sm",
    md: "px-5 py-3 text-[15px]",
    lg: "px-6 py-3.5 text-base",
  };
  return (
    <button className={cn(base, variants[variant], sizes[size], className)} disabled={loading || props.disabled} {...props}>
      {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
      {props.children}
    </button>
  );
}
