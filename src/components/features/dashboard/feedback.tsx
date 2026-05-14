type FeedbackProps = {
  message: string | null;
};

export function Feedback({ message }: FeedbackProps) {
  if (!message) return null;

  return (
    <div className="mb-5 rounded-sm border border-destructive/40 bg-destructive/10 px-3 py-2 font-mono text-xs text-destructive">
      {message}
    </div>
  );
}
