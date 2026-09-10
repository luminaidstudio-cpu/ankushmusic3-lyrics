import "./globals.css";
import InteractionFX from "./InteractionFX";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ANKUSHMUSIC3 — Lyrics",
  description: "Official lyrics by ANKUSHMUSIC3 / Ankush X.",
  verification: {
    google: "bWNZ83Ayuzug9FyG5Fy-aJjRP32kMrVWVYmO_lmHRcY"
  }
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body><InteractionFX />{children}</body></html>;
}