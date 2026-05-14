import type { ReactNode } from "react";

import { cn } from "@/lib/cn";

type AuthFeedbackProps = {
  children: ReactNode;
  tone: "error" | "success";
};

export function AuthFeedback({ children, tone }: AuthFeedbackProps) {
  return (
    <div
      className={cn(
        "mb-5 rounded-sm border px-3 py-2 font-mono text-xs leading-5",
        tone === "error"
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-accent/50 bg-accent/10 text-accent",
      )}
    >
      {tone === "error" ? "! " : null}
      {children}
    </div>
  );
}
