import type { ReactNode } from "react";

import { Alert } from "@/shared/components/ui/alert";

type AuthFeedbackProps = {
  children: ReactNode;
  tone: "error" | "success";
};

export function AuthFeedback({ children, tone }: AuthFeedbackProps) {
  return (
    <Alert
      aria-live={tone === "error" ? "assertive" : "polite"}
      className="mb-5"
      role={tone === "error" ? "alert" : "status"}
      tone={tone}
    >
      {tone === "error" ? "! " : null}
      {children}
    </Alert>
  );
}
