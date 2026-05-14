import { AppHeader } from "@/components/shared/app-header";
import { AppMain } from "@/components/shared/app-main";
import { AppShell } from "@/components/shared/app-shell";

const envRows = [
  {
    name: "NEXT_PUBLIC_SUPABASE_URL",
    value: "Required",
  },
  {
    name: "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
    value: "Required",
  },
];

export function SetupMissing() {
  return (
    <AppShell>
      <AppHeader
        actions={
          <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
            setup
          </span>
        }
      />

      <AppMain className="flex flex-1 items-center justify-center pb-12">
        <section className="relative w-full max-w-md overflow-hidden rounded-lg border-2 border-primary/40 bg-card p-8 shadow-card">
          <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-primary/10 via-transparent to-accent/10" />
          <div className="relative">
            <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
              &gt; setup required
            </div>
            <h1 className="mb-5 font-display text-2xl text-glow-primary">
              CONFIGURE SUPABASE
            </h1>
            <p className="text-sm leading-6 text-muted-foreground">
              Trackio is ready to use the shared Supabase project. Add these
              public client credentials to <code>.env.local</code>.
            </p>

            <div className="mt-6 overflow-hidden rounded-md border border-border bg-background/50">
              {envRows.map((row) => (
                <div
                  className="flex min-w-0 flex-col gap-1 border-b border-border px-3 py-3 last:border-b-0 sm:flex-row sm:items-center sm:justify-between"
                  key={row.name}
                >
                  <span className="break-all font-mono text-xs text-foreground">
                    {row.name}
                  </span>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-accent">
                    {row.value}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </AppMain>
    </AppShell>
  );
}
