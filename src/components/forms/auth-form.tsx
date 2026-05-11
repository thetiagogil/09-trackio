"use client";

import { Loader2, LockKeyhole, Sparkles } from "lucide-react";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input, Label } from "@/components/ui/field";
import { cn } from "@/lib/cn";
import { createClient } from "@/lib/supabase/browser";

type AuthMode = "signin" | "signup";

type AuthFormProps = {
  initialMode?: AuthMode;
  initialError?: string | null;
  next?: string;
};

const minimumPasswordLength = 8;

export function AuthForm({
  initialError,
  initialMode = "signin",
  next = "/",
}: AuthFormProps) {
  const router = useRouter();
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(initialError ?? null);
  const [pending, setPending] = useState(false);

  const emailValue = email.trim().toLowerCase();
  const continuePath = useMemo(
    () => `/auth/continue?next=${encodeURIComponent(next)}`,
    [next],
  );

  const title = mode === "signin" ? "Sign in to Trackio" : "Create Trackio account";

  const switchMode = (value: AuthMode) => {
    setMode(value);
    setError(null);
    setMessage(null);
    setPassword("");
    setConfirmPassword("");
  };

  const validate = () => {
    if (!emailValue) return "Email is required.";
    if (password.length < minimumPasswordLength) {
      return `Password must be at least ${minimumPasswordLength} characters.`;
    }
    if (mode === "signup" && password !== confirmPassword) {
      return "Passwords do not match.";
    }

    return null;
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const validationError = validate();
    if (validationError) {
      setError(validationError);
      return;
    }

    setPending(true);
    setError(null);
    setMessage(null);

    try {
      const supabase = createClient();
      const result =
        mode === "signin"
          ? await supabase.auth.signInWithPassword({
              email: emailValue,
              password,
            })
          : await supabase.auth.signUp({
              email: emailValue,
              password,
              options: {
                data: displayName.trim()
                  ? { display_name: displayName.trim() }
                  : undefined,
                emailRedirectTo:
                  typeof window !== "undefined"
                    ? `${window.location.origin}/auth/callback?next=${encodeURIComponent(
                        continuePath,
                      )}`
                    : undefined,
              },
            });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (mode === "signup" && !result.data.session) {
        setMessage(`Check ${emailValue} to confirm your account, then sign in.`);
        return;
      }

      router.replace(continuePath);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Supabase is not configured.");
    } finally {
      setPending(false);
    }
  };

  return (
    <main className="grid min-h-screen place-items-center px-6 py-12">
      <section className="grid w-full max-w-5xl gap-6 lg:grid-cols-[1fr_420px] lg:items-center">
        <div className="max-w-2xl">
          <p className="mb-3 font-mono text-[11px] uppercase tracking-[0.3em] text-accent text-glow-cyan">
            private tracker directory
          </p>
          <h1 className="font-display text-3xl leading-relaxed text-glow-pink sm:text-4xl">
            TRACKIO
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-muted-foreground">
            Save the apps, sites, profiles, docs, and custom URLs where you
            already track things. Launching a tracker from Trackio awards that
            tracker one XP.
          </p>
          <div className="mt-8 grid gap-3 sm:grid-cols-3">
            <AuthMetric label="Scope" value="Private" />
            <AuthMetric label="XP Rule" value="+1 launch" />
            <AuthMetric label="V1" value="Directory" />
          </div>
        </div>

        <div className="panel-corners rounded-lg border-2 border-primary/45 bg-card p-5 shadow-card">
          <div className="mb-5 flex items-center gap-3">
            <div className="grid h-11 w-11 place-items-center rounded-sm border-2 border-accent/50 bg-accent/10 text-accent">
              <LockKeyhole className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-sm uppercase tracking-wider">
                {title}
              </h2>
              <p className="mt-1 font-mono text-[11px] text-muted-foreground">
                Supabase Auth
              </p>
            </div>
          </div>

          <div className="mb-5 grid grid-cols-2 gap-2 rounded-sm border border-border bg-background/50 p-1">
            <ModeButton active={mode === "signin"} onClick={() => switchMode("signin")}>
              Sign in
            </ModeButton>
            <ModeButton active={mode === "signup"} onClick={() => switchMode("signup")}>
              Sign up
            </ModeButton>
          </div>

          {error ? <AuthFeedback tone="error">{error}</AuthFeedback> : null}
          {message ? <AuthFeedback tone="success">{message}</AuthFeedback> : null}

          <form className="space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <div className="space-y-1.5">
                <Label htmlFor="displayName">Display name</Label>
                <Input
                  autoComplete="name"
                  disabled={pending}
                  id="displayName"
                  maxLength={80}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder="optional"
                  value={displayName}
                />
              </div>
            ) : null}

            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input
                autoComplete="email"
                disabled={pending}
                id="email"
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                required
                type="email"
                value={email}
              />
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password">Password</Label>
              <Input
                autoComplete={
                  mode === "signin" ? "current-password" : "new-password"
                }
                disabled={pending}
                id="password"
                minLength={minimumPasswordLength}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                required
                type="password"
                value={password}
              />
            </div>

            {mode === "signup" ? (
              <div className="space-y-1.5">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <Input
                  autoComplete="new-password"
                  disabled={pending}
                  id="confirmPassword"
                  minLength={minimumPasswordLength}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Confirm your password"
                  required
                  type="password"
                  value={confirmPassword}
                />
              </div>
            ) : null}

            <Button className="w-full" disabled={pending} size="lg" type="submit">
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {mode === "signin" ? "Sign in" : "Create account"}
            </Button>
          </form>
        </div>
      </section>
    </main>
  );
}

function AuthFeedback({
  children,
  tone,
}: {
  children: React.ReactNode;
  tone: "error" | "success";
}) {
  return (
    <div
      className={cn(
        "mb-5 rounded-sm border px-3 py-2 font-mono text-xs leading-5",
        tone === "error"
          ? "border-destructive/50 bg-destructive/10 text-destructive"
          : "border-accent/50 bg-accent/10 text-accent",
      )}
    >
      {children}
    </div>
  );
}

function ModeButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: React.ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      className={cn(
        "rounded-sm px-3 py-2 font-display text-[11px] uppercase tracking-wider transition-colors",
        active
          ? "bg-accent text-accent-foreground shadow-neon-cyan"
          : "text-muted-foreground hover:text-foreground",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}

function AuthMetric({ label, value }: { label: string; value: string }) {
  return (
    <div className="border-l-2 border-accent/50 bg-card/60 px-3 py-2">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
        {label}
      </div>
      <div className="mt-1 flex items-center gap-1.5 font-display text-[11px] uppercase tracking-wider">
        <Sparkles className="h-3.5 w-3.5 text-primary" />
        {value}
      </div>
    </div>
  );
}
