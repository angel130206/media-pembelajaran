import { cn } from "@/lib/utils";
export function Input(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={cn("w-full rounded-xl border border-zinc-200 bg-white px-4 py-2.5 outline-none focus:ring-2 focus:ring-brand-500 focus:border-brand-500", props.className)} />;
}
export function Label(props: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return <label {...props} className={cn("text-sm font-medium text-zinc-700", props.className)} />;
}
export function Textarea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={cn("w-full rounded-xl border border-zinc-200 bg-white px-4 py-3 outline-none focus:ring-2 focus:ring-brand-500", props.className)} />;
}
