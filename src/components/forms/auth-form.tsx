"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft, Loader2, LockKeyhole } from "lucide-react";
import { FormEvent, useMemo, useState } from "react";

import {
  BrandMark,
  PageMain,
  PageShell,
  SiteHeader,
} from "@/components/shared/page-shell";
import { Button, ButtonLink } from "@/components/ui/button";
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
  next = "/dashboard",
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

  const isSignup = mode === "signup";
  const emailValue = email.trim().toLowerCase();
  const continuePath = useMemo(
    () => `/auth/continue?next=${encodeURIComponent(next)}`,
    [next],
  );

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
    if (isSignup && password !== confirmPassword) {
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
      const result = isSignup
        ? await supabase.auth.signUp({
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
          })
        : await supabase.auth.signInWithPassword({
            email: emailValue,
            password,
          });

      if (result.error) {
        setError(result.error.message);
        return;
      }

      if (isSignup && !result.data.session) {
        setMessage(`Check ${emailValue} to confirm your account, then sign in.`);
        return;
      }

      router.replace(continuePath);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Supabase is not configured.",
      );
    } finally {
      setPending(false);
    }
  };

  return (
    <PageShell>
      <SiteHeader
        actions={<BrandMark size="sm" />}
        leading={
          <ButtonLink
            href="/"
            size="sm"
            variant="ghost"
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </ButtonLink>
        }
      />

      <PageMain className="flex flex-1 items-center justify-center py-12">
        <div className="w-full max-w-md">
          <div className="relative overflow-hidden rounded-lg border-2 border-primary/40 bg-card p-8 shadow-card">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-accent/10" />
            <div className="relative">
              <div className="mb-2 flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.25em] text-accent">
                <LockKeyhole className="h-3.5 w-3.5" />
                {isSignup ? "new player" : "returning player"}
              </div>
              <h1 className="mb-6 font-display text-2xl text-glow-primary">
                {isSignup ? "CREATE ACCOUNT" : "SIGN IN"}
              </h1>

              {error ? <AuthFeedback tone="error">{error}</AuthFeedback> : null}
              {message ? (
                <AuthFeedback tone="success">{message}</AuthFeedback>
              ) : null}

              <form className="space-y-4" onSubmit={handleSubmit}>
                {isSignup ? (
                  <div className="space-y-1.5">
                    <Label
                      className="font-mono text-[10px] uppercase tracking-wider text-accent"
                      htmlFor="displayName"
                    >
                      Display name
                    </Label>
                    <Input
                      autoComplete="name"
                      className="border-2 border-border bg-background/50 font-mono focus-visible:border-accent"
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
                  <Label
                    className="font-mono text-[10px] uppercase tracking-wider text-accent"
                    htmlFor="email"
                  >
                    Email
                  </Label>
                  <Input
                    autoComplete="email"
                    className="border-2 border-border bg-background/50 font-mono focus-visible:border-accent"
                    disabled={pending}
                    id="email"
                    onChange={(event) => setEmail(event.target.value)}
                    placeholder="you@trackio.local"
                    required
                    type="email"
                    value={email}
                  />
                </div>

                <div className="space-y-1.5">
                  <Label
                    className="font-mono text-[10px] uppercase tracking-wider text-accent"
                    htmlFor="password"
                  >
                    Password
                  </Label>
                  <Input
                    autoComplete={isSignup ? "new-password" : "current-password"}
                    className="border-2 border-border bg-background/50 font-mono focus-visible:border-accent"
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

                {isSignup ? (
                  <div className="space-y-1.5">
                    <Label
                      className="font-mono text-[10px] uppercase tracking-wider text-accent"
                      htmlFor="confirmPassword"
                    >
                      Confirm password
                    </Label>
                    <Input
                      autoComplete="new-password"
                      className="border-2 border-border bg-background/50 font-mono focus-visible:border-accent"
                      disabled={pending}
                      id="confirmPassword"
                      minLength={minimumPasswordLength}
                      onChange={(event) =>
                        setConfirmPassword(event.target.value)
                      }
                      placeholder="Confirm your password"
                      required
                      type="password"
                      value={confirmPassword}
                    />
                  </div>
                ) : null}

                <Button
                  className="w-full"
                  disabled={pending}
                  type="submit"
                >
                  {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                  {isSignup ? "Create Account" : "Enter HUD"}
                </Button>
              </form>

              <div className="mt-4 text-center font-mono text-xs text-muted-foreground">
                {isSignup ? "Already have an account?" : "No account yet?"}{" "}
                <button
                  className="text-accent underline-offset-4 hover:underline"
                  onClick={() => switchMode(isSignup ? "signin" : "signup")}
                  type="button"
                >
                  {isSignup ? "Sign in" : "Sign up"}
                </button>
              </div>

              <div className="my-6 flex items-center gap-3">
                <div className="h-px flex-1 bg-border" />
                <span className="font-mono text-[9px] uppercase tracking-wider text-muted-foreground">
                  or
                </span>
                <div className="h-px flex-1 bg-border" />
              </div>

              <ButtonLink
                className="w-full"
                href="/"
                variant="outline"
              >
                View landing page
              </ButtonLink>
              <p className="mt-3 text-center font-mono text-[10px] text-muted-foreground">
                Trackio uses Supabase Auth and your private database rows.
              </p>
            </div>
          </div>
        </div>
      </PageMain>
    </PageShell>
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
          ? "border-destructive/40 bg-destructive/10 text-destructive"
          : "border-accent/50 bg-accent/10 text-accent",
      )}
    >
      {tone === "error" ? "! " : null}
      {children}
    </div>
  );
}
