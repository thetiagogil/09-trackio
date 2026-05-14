import { HomeFeatureGrid } from "@/features/home/components/home-feature-grid";
import { HomeHero } from "@/features/home/components/home-hero";
import { AppHeader } from "@/shared/components/layout/app-header";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { SetupMissing } from "@/shared/components/setup-missing";
import { ButtonLink } from "@/shared/components/ui/button-link";
import { isSupabaseConfigured } from "@/lib/env";

export default function Home() {
  if (!isSupabaseConfigured()) {
    return <SetupMissing />;
  }

  return (
    <AppShell className="h-dvh min-h-screen overflow-hidden">
      <AppHeader
        actions={
          <>
            <ButtonLink href="/auth?next=/dashboard" size="sm" variant="ghost">
              Sign In
            </ButtonLink>
            <ButtonLink href="/auth?mode=signup&next=/dashboard" size="sm">
              Start Quest
            </ButtonLink>
          </>
        }
      />

      <AppMain className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto pb-6 md:pb-10">
        <div className="flex w-full flex-col justify-center gap-10 md:gap-14">
          <HomeHero />
          <HomeFeatureGrid />
        </div>
      </AppMain>
    </AppShell>
  );
}
