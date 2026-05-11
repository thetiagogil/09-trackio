import { isSupabaseConfigured } from "@/lib/env";
import { requireUser } from "@/lib/server/data";

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
