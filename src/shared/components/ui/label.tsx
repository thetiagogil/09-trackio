import type { LabelHTMLAttributes } from "react";

import { cn } from "@/shared/utils/cn";

type LabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
  required?: boolean;
};

export function Label({ children, className, required, ...props }: LabelProps) {
  return (
    <label
      className={cn(
        "font-mono text-xs uppercase tracking-wider text-foreground",
        className,
      )}
      {...props}
    >
      {children}
      {required ? (
        <>
          <span aria-hidden="true" className="ml-1 text-primary">
            *
          </span>
          <span className="sr-only"> required</span>
        </>
      ) : null}
    </label>
  );
}
