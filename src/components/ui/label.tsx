import type { LabelHTMLAttributes } from "react";

import { cn } from "@/lib/cn";

export function Label({
  className,
  ...props
}: LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label
      className={cn(
        "font-mono text-xs uppercase tracking-wider text-foreground",
        className,
      )}
      {...props}
    />
  );
}
