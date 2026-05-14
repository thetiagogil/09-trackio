import { isSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/shared/server/auth";

export default async function ProtectedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  if (isSupabaseConfigured()) {
    await requireUser();
  }

  return children;
}
