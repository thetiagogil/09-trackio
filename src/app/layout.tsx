import type { Metadata } from "next";

import { APP_NAME } from "@/shared/constants/app";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: APP_NAME,
  description: "A private tracker directory for the places you already track.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
