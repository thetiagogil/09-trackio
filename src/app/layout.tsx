import type { Metadata } from "next";
import {
  JetBrains_Mono,
  Press_Start_2P,
  Space_Grotesk,
} from "next/font/google";

import { APP_NAME } from "@/shared/constants/app";
import { Providers } from "./providers";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-space-grotesk",
});

const jetBrainsMono = JetBrains_Mono({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-jetbrains-mono",
  weight: ["400", "500", "700"],
});

const pressStart = Press_Start_2P({
  display: "swap",
  subsets: ["latin"],
  variable: "--font-press-start",
  weight: "400",
});

export const metadata: Metadata = {
  title: APP_NAME,
  description: "A private tracker directory for the places you already track.",
  icons: {
    icon: [{ url: "/favicon.svg", type: "image/svg+xml" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={`${spaceGrotesk.variable} ${jetBrainsMono.variable} ${pressStart.variable}`}
      lang="en"
      suppressHydrationWarning
    >
      <body suppressHydrationWarning>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
