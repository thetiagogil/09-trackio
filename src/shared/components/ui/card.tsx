import type { ComponentPropsWithoutRef, ReactNode } from "react";

import { cn } from "@/shared/utils/cn";
import {
  RARITY_BORDER_CLASS,
  RARITY_TEXT_CLASS,
} from "@/shared/constants/rarity";
import type { Rarity } from "@/shared/types";

type CardElement = "article" | "div" | "section";
type CardTone = "accent" | "danger" | "default" | "primary";

type CardProps = ComponentPropsWithoutRef<"div"> & {
  as?: CardElement;
  children: ReactNode;
  corners?: boolean;
  gradient?: boolean;
  interactive?: boolean;
  rarity?: Rarity;
  tone?: CardTone;
};

const borders: Record<CardTone, string> = {
  accent: "border-accent/60",
  danger: "border-destructive/50",
  default: "border-border",
  primary: "border-primary/40",
};

const cornerTones: Record<CardTone, string> = {
  accent: "text-accent",
  danger: "text-destructive",
  default: "text-border",
  primary: "text-primary",
};

export function Card({
  as: Component = "div",
  children,
  className,
  corners = true,
  gradient = false,
  interactive = false,
  rarity,
  tone = "default",
  ...props
}: CardProps) {
  const borderClass = rarity
    ? RARITY_BORDER_CLASS[rarity]
    : borders[tone];
  const cornerClass = rarity
    ? RARITY_TEXT_CLASS[rarity]
    : cornerTones[tone];

  return (
    <Component
      className={cn(
        "relative rounded-lg border-2 bg-card p-5 text-foreground shadow-card transition-all",
        gradient && "overflow-hidden",
        interactive && "hover:-translate-y-1",
        borderClass,
        className,
      )}
      {...props}
    >
      {gradient ? (
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10" />
      ) : null}
      {corners ? (
        <>
          <span
            className={cn(
              "absolute left-1.5 top-1.5 h-2 w-2 border-l-2 border-t-2 border-current opacity-60",
              cornerClass,
            )}
          />
          <span
            className={cn(
              "absolute right-1.5 top-1.5 h-2 w-2 border-r-2 border-t-2 border-current opacity-60",
              cornerClass,
            )}
          />
          <span
            className={cn(
              "absolute bottom-1.5 left-1.5 h-2 w-2 border-b-2 border-l-2 border-current opacity-60",
              cornerClass,
            )}
          />
          <span
            className={cn(
              "absolute bottom-1.5 right-1.5 h-2 w-2 border-b-2 border-r-2 border-current opacity-60",
              cornerClass,
            )}
          />
        </>
      ) : null}
      {children}
    </Component>
  );
}
