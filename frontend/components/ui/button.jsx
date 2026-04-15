import { cn } from "@/lib/utils";
export function Button({ className, children, ...props }) {
  return <button className={cn("inline-flex items-center justify-center font-medium transition-colors focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50", className)} {...props}>{children}</button>;
}
