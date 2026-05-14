import { redirect } from "next/navigation";

import { AuthForm } from "@/components/forms/auth-form";
import { SetupMissing } from "@/components/shared/setup-missing";
import { isSupabaseConfigured } from "@/lib/env";
import { safeRedirectPath } from "@/lib/routing/redirect";
import { getCurrentUser } from "@/lib/server/data";

type AuthPageProps = {
  searchParams: Promise<{
    error?: string;
    mode?: string;
    next?: string;
  }>;
};

export default async function AuthPage({ searchParams }: AuthPageProps) {
  if (!isSupabaseConfigured()) {
    return <SetupMissing />;
  }

  const currentUser = await getCurrentUser();

  if (currentUser) {
    redirect("/dashboard");
  }

  const params = await searchParams;
  const safeNext = safeRedirectPath(params.next, "/dashboard");

  return (
    <AuthForm
      initialError={params.error ?? null}
      initialMode={params.mode === "signup" ? "signup" : "signin"}
      next={safeNext}
    />
  );
}
