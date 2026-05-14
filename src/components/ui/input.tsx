import type { InputHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Input({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) {
  return (
    <input
      className={cn(
        "flex h-9 w-full rounded-md border-2 border-border bg-background/50 px-3 py-1 font-mono text-base text-foreground shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:border-accent focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
}
