import { AppHeader } from "@/shared/components/layout/app-header";
import { AppMain } from "@/shared/components/layout/app-main";
import { AppShell } from "@/shared/components/layout/app-shell";
import { SetupMissing } from "@/shared/components/setup-missing";
import { ButtonLink } from "@/shared/components/ui/button-link";
import { isSupabaseConfigured } from "@/lib/env";
import { HomeFeatureGrid } from "./_components/home-feature-grid";
import { HomeHero } from "./_components/home-hero";

export default function Home() {
  if (!isSupabaseConfigured()) {
    return <SetupMissing />;
  }

  return (
    <AppShell>
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

      <AppMain className="flex flex-1 flex-col justify-center pb-10 md:pb-14">
        <div className="flex w-full flex-col justify-center gap-10 md:gap-14">
          <HomeHero />
          <HomeFeatureGrid />
        </div>
      </AppMain>
    </AppShell>
  );
}
