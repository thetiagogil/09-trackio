import { HomeFeatureGrid } from "@/components/features/home/home-feature-grid";
import { HomeHero } from "@/components/features/home/home-hero";
import { PageMain, PageShell, SiteHeader } from "@/components/shared/page-shell";
import { SetupMissing } from "@/components/shared/setup-missing";
import { ButtonLink } from "@/components/ui/button";
import { isSupabaseConfigured } from "@/lib/env";

export default function Home() {
  if (!isSupabaseConfigured()) {
    return <SetupMissing />;
  }

  return (
    <PageShell className="h-[100dvh] min-h-[100vh] overflow-hidden">
      <SiteHeader
        actions={
          <>
            <ButtonLink href="/auth?next=/dashboard" size="sm" variant="ghost">
              Sign In
            </ButtonLink>
            <ButtonLink
              href="/auth?mode=signup&next=/dashboard"
              size="sm"
            >
              Start Quest
            </ButtonLink>
          </>
        }
      />

      <PageMain className="flex min-h-0 flex-1 flex-col justify-center overflow-y-auto py-6 md:py-10">
        <div className="flex w-full flex-col justify-center gap-10 md:gap-14">
          <HomeHero />
          <HomeFeatureGrid />
        </div>
      </PageMain>
    </PageShell>
  );
}
