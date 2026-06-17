import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type FieldMessageTone = "error" | "muted";

type FieldMessageProps = ComponentPropsWithoutRef<"p"> & {
  tone?: FieldMessageTone;
};

const tones: Record<FieldMessageTone, string> = {
  error: "text-destructive",
  muted: "text-muted-foreground",
};

export const FieldMessage = ({
  className,
  tone = "muted",
  ...props
}: FieldMessageProps) => {
  return (
    <p
      className={cn("font-mono text-[11px] leading-5", tones[tone], className)}
      role={tone === "error" ? "alert" : undefined}
      {...props}
    />
  );
};
