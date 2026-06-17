"use client";

import { useRouter } from "next/navigation";
import { type FormEvent, useMemo, useState } from "react";

import { createClient } from "@/lib/supabase/browser";

export type AuthMode = "signin" | "signup";

type UseAuthFormOptions = {
  initialError?: string | null;
  initialMode: AuthMode;
  next: string;
};

export const minimumPasswordLength = 8;

export const useAuthForm = ({
  initialError,
  initialMode,
  next,
}: UseAuthFormOptions) => {
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
  const passwordsMismatch =
    isSignup && confirmPassword.length > 0 && password !== confirmPassword;

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
        setMessage(
          `Check ${emailValue} to confirm your account, then sign in.`,
        );
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

  return {
    confirmPassword,
    displayName,
    email,
    error,
    handleSubmit,
    isSignup,
    message,
    password,
    passwordsMismatch,
    pending,
    setConfirmPassword,
    setDisplayName,
    setEmail,
    setPassword,
    switchMode,
  };
};
