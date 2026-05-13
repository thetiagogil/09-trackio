import type { ReactNode } from "react";

type FeatureCardProps = {
  body: string;
  icon: ReactNode;
  title: string;
  tone: "pink" | "cyan" | "amber";
};

export function FeatureCard({ body, icon, title, tone }: FeatureCardProps) {
  const toneClass =
    tone === "pink"
      ? "text-primary"
      : tone === "cyan"
        ? "text-accent"
        : "text-neon-amber";

  return (
    <div className="rounded-lg border-2 border-border bg-card p-5 shadow-card">
      <div
        className={`mb-3 flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider ${toneClass}`}
      >
        {icon} {title}
      </div>
      <p className="font-mono text-sm leading-relaxed text-muted-foreground">
        {body}
      </p>
    </div>
  );
}
