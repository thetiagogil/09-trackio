import { Alert } from "@/shared/components/ui/alert";

type DashboardActionFeedbackProps = {
  message: string | null;
};

export const DashboardActionFeedback = ({
  message,
}: DashboardActionFeedbackProps) => {
  if (!message) return null;

  return (
    <Alert aria-live="assertive" className="mb-5" role="alert" tone="error">
      {message}
    </Alert>
  );
};
