import { Alert } from "@/shared/components/ui/alert";

type DashboardActionFeedbackProps = {
  message: string | null;
};

export function DashboardActionFeedback({
  message,
}: DashboardActionFeedbackProps) {
  if (!message) return null;

  return (
    <Alert className="mb-5" tone="error">
      {message}
    </Alert>
  );
}
