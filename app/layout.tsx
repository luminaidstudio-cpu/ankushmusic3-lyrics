import "./globals.css";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "ANKUSHMUSIC3 — Lyrics",
  description: "Official lyrics by ANKUSHMUSIC3 / Ankush X."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="en"><body>{children}</body></html>;
}