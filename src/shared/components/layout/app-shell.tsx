import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type AppShellProps = ComponentPropsWithoutRef<"div">;

export const AppShell = ({ className, ...props }: AppShellProps) => {
  return (
    <div
      className={cn("scanline flex min-h-screen flex-col", className)}
      {...props}
    />
  );
};
