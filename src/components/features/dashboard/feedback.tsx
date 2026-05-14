import { Alert } from "@/components/ui/alert";

type FeedbackProps = {
  message: string | null;
};

export function Feedback({ message }: FeedbackProps) {
  if (!message) return null;

  return (
    <Alert className="mb-5" tone="error">
      {message}
    </Alert>
  );
}
