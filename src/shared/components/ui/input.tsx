import type { InputHTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

export const Input = ({
  className,
  ...props
}: InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <input
      className={cn(
        "border-border bg-background/50 text-foreground placeholder:text-muted-foreground focus-visible:border-accent focus-visible:ring-ring flex h-9 w-full rounded-md border-2 px-3 py-1 font-mono text-base shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
        className,
      )}
      {...props}
    />
  );
};
