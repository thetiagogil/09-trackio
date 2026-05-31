import { ArrowRight, Zap } from "lucide-react";

import { Button } from "@/shared/components/ui/button";
import { ButtonLink } from "@/shared/components/ui/button-link";

export function HomeHero() {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <div className="text-accent text-glow-accent mb-5 font-mono text-[10px] tracking-[0.3em] uppercase md:mb-6">
        &gt; press start <span className="animate-blink">_</span>
      </div>
      <h1 className="font-display mb-5 text-3xl leading-tight tracking-tight md:mb-6 md:text-5xl">
        <span className="text-glow-primary">LEVEL UP</span>
        <br />
        <span className="text-foreground">YOUR TRACKER HUD</span>
      </h1>
      <p className="text-muted-foreground mx-auto mb-8 max-w-xl font-mono text-sm leading-6 md:mb-10 md:text-lg md:leading-8">
        Save every external tracker you already use in one private HUD. No more
        switching between tabs or apps to check your stats. Your trackers, your
        way.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ButtonLink href="/auth?mode=signup&next=/dashboard" size="lg">
          Create Account
          <ArrowRight className="h-4 w-4" />
        </ButtonLink>
        <form action="/api/auth/demo" method="post">
          <input type="hidden" name="next" value="/dashboard" />
          <Button size="lg" type="submit" variant="outline">
            <Zap className="h-4 w-4" />
            Continue with test user
          </Button>
        </form>
      </div>
    </section>
  );
}
