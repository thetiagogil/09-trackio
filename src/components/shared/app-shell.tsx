import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/lib/cn";

type AppShellProps = ComponentPropsWithoutRef<"div">;

export function AppShell({ className, ...props }: AppShellProps) {
  return (
    <div
      className={cn("flex min-h-screen flex-col scanline", className)}
      {...props}
    />
  );
}
