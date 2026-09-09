import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "ANKUSHMUSIC3 — Official Lyrics",
  description: "Official lyrics archive of ANKUSHMUSIC3 / Ankush X.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}