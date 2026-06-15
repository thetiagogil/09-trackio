import { Button } from "@/shared/components/ui/button";
import { ButtonLink } from "@/shared/components/ui/button-link";

export function HomeHero() {
  return (
    <section className="mx-auto max-w-3xl text-center">
      <div className="text-accent text-glow-accent mb-5 font-mono text-[10px] tracking-[0.3em] uppercase md:mb-6">
        &gt; press start <span className="animate-blink">_</span>
      </div>
      <h1 className="font-display mb-5 text-3xl leading-tight tracking-tight text-balance md:mb-6 md:text-5xl">
        <span className="text-glow-primary">LEVEL UP</span>
        <br />
        <span className="text-foreground">YOUR TRACKER HUD</span>
      </h1>
      <p className="text-muted-foreground mx-auto mb-8 max-w-xl font-mono text-sm leading-6 text-balance md:mb-10 md:text-lg md:leading-8">
        Save every external tracker you already use in one private HUD. No more
        switching between tabs or apps to check your stats. Your trackers, your
        way.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-3">
        <ButtonLink
          className="w-full sm:w-auto"
          href="/auth?mode=signup&next=/dashboard"
          size="lg"
        >
          Create Account
        </ButtonLink>
        <form
          action="/api/auth/demo"
          className="w-full sm:w-auto"
          method="post"
        >
          <input type="hidden" name="next" value="/dashboard" />
          <Button
            className="w-full sm:w-auto"
            size="lg"
            type="submit"
            variant="outline"
          >
            Continue with demo account
          </Button>
        </form>
      </div>
    </section>
  );
}
