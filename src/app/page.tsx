import { HomeFeatureGrid } from "@/components/features/home/home-feature-grid";
import { HomeHero } from "@/components/features/home/home-hero";
import { AppHeader } from "@/components/shared/app-header";
import { AppMain } from "@/components/shared/app-main";
import { AppShell } from "@/components/shared/app-shell";
import { SetupMissing } from "@/components/shared/setup-missing";
import { ButtonLink } from "@/components/ui/button-link";
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
