import { cn } from "@/lib/utils";
import * as React from "react";

export function Input({ className, error, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { error?: boolean }) {
  return (
    <input
      {...props}
      className={cn(
        "w-full rounded-xl border bg-white px-4 py-3 text-[15px] outline-none transition-all placeholder:text-zinc-400",
        error
          ? "border-red-300 focus:border-red-400 focus:ring-4 focus:ring-red-500/10"
          : "border-zinc-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10",
        className
      )}
    />
  );
}
export function Label({ className, required, ...props }: React.LabelHTMLAttributes<HTMLLabelElement> & { required?: boolean }) {
  return (
    <label {...props} className={cn("text-sm font-semibold text-zinc-700 flex items-center gap-1", className)}>
      {props.children} {required && <span className="text-red-500">*</span>}
    </label>
  );
}
export function Textarea({ className, error, ...props }: React.TextareaHTMLAttributes<HTMLTextAreaElement> & { error?: boolean }) {
  return (
    <textarea
      {...props}
      className={cn(
        "w-full rounded-xl border bg-white px-4 py-3 text-[15px] outline-none transition-all",
        error ? "border-red-300 focus:ring-red-500/10" : "border-zinc-200 focus:border-brand-300 focus:ring-4 focus:ring-brand-500/10",
        className
      )}
    />
  );
}
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs font-medium text-red-600 flex items-center gap-1"><span className="w-1 h-1 bg-red-500 rounded-full" />{message}</p>;
}
