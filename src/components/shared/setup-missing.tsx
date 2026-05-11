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
    <main className="flex min-h-screen w-full items-center justify-center px-0 py-12">
      <section
        className="panel-corners min-w-0 rounded-lg border-2 border-accent/50 bg-card p-6 shadow-card"
        style={{ width: "min(42rem, calc(100vw - 5rem))" }}
      >
        <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.28em] text-accent">
          setup required
        </p>
        <h1 className="font-display text-xl leading-relaxed text-glow-cyan">
          Configure Supabase
        </h1>
        <p className="mt-4 text-sm leading-6 text-muted-foreground">
          Trackio is ready to use the shared Supabase project, but the local app
          needs public client credentials in <code>.env.local</code>.
        </p>

        <div className="mt-5 rounded-sm border border-border bg-background/70 p-3">
          {envRows.map((row) => (
            <div
              className="flex min-w-0 flex-col gap-1 border-b border-border/70 py-3 first:pt-1 last:border-b-0 last:pb-1 sm:flex-row sm:items-center sm:justify-between"
              key={row.name}
            >
              <span className="break-all font-mono text-xs font-bold text-foreground">
                {row.name}
              </span>
              <span className="font-mono text-[11px] uppercase tracking-wider text-accent">
                {row.value}
              </span>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
