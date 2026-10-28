import { cn } from "@/lib/utils";

export function Card({ className, hover = false, ...props }: React.HTMLAttributes<HTMLDivElement> & { hover?: boolean }) {
  return <div className={cn("bg-white rounded-[1.25rem] shadow-card border border-orange-100/80 p-5", hover && "card-hover", className)} {...props} />;
}
export function CardTitle({ className, ...props }: React.HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn("font-bold text-lg leading-tight tracking-tight", className)} {...props} />;
}
export function CardDescription({ className, ...props }: React.HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn("text-sm text-zinc-600 leading-relaxed", className)} {...props} />;
}
