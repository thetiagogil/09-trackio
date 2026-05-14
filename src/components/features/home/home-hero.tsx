import { ArrowRight, Zap } from "lucide-react";

import { ButtonLink } from "@/components/ui/button";

export function HomeHero() {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <div className="mb-5 font-mono text-[10px] uppercase tracking-[0.3em] text-accent text-glow-accent md:mb-6">
        &gt; press start <span className="animate-blink">_</span>
      </div>
      <h1 className="mb-5 font-display text-3xl leading-tight tracking-tight md:mb-6 md:text-5xl">
        <span className="text-glow-primary">LEVEL UP</span>
        <br />
        <span className="text-foreground">YOUR TRACKER HUD</span>
      </h1>
      <p className="mx-auto mb-8 max-w-xl font-mono text-sm leading-6 text-muted-foreground md:mb-10 md:text-lg md:leading-8">
        Save every external tracker you already use in one private HUD. Launch a
        tracker from Trackio to give it 1 XP and keep your tracker directory
        worth opening.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/auth?mode=signup&next=/dashboard" size="lg">
          Create Account
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
        <ButtonLink href="/auth?next=/dashboard" size="lg" variant="outline">
          <Zap className="h-4 w-4" />
          Continue as test user
        </ButtonLink>
      </div>
    </section>
  );
}
