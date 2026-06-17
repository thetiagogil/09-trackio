import type { ComponentPropsWithoutRef } from "react";

import { cn } from "@/shared/utils/cn";

type AppMainProps = ComponentPropsWithoutRef<"main"> & {
  constrained?: boolean;
};

export const AppMain = ({
  children,
  className,
  constrained = true,
  ...props
}: AppMainProps) => {
  return (
    <main
      className={cn(
        "w-full px-6 pt-32 md:pt-28",
        constrained && "mx-auto max-w-7xl",
        className,
      )}
      {...props}
    >
      {children}
    </main>
  );
};
