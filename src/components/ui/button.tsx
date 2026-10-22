import { cn } from "@/lib/utils";
import * as React from "react";
export function Button({ className, variant="primary", size="md", ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { variant?: "primary"|"ghost"|"outline", size?:"sm"|"md"|"lg"}) {
  const base = "inline-flex items-center justify-center rounded-xl font-semibold transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 disabled:opacity-50";
  const variants: any = { primary: "bg-brand-500 hover:bg-brand-600 text-white shadow-soft", ghost: "bg-white border border-orange-200 hover:bg-orange-50", outline: "border border-zinc-300 bg-transparent hover:bg-zinc-50" };
  const sizes: any = { sm:"px-3 py-1.5 text-sm", md:"px-5 py-2.5", lg:"px-6 py-3 text-lg" };
  return <button className={cn(base, variants[variant], sizes[size], className)} {...props} />;
}
