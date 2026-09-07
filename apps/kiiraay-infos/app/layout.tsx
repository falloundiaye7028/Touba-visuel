import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "KIIRAAY INFOS — Actualités du parti",
  description: "Les actualités de Kiiraay au Sénégal et dans la diaspora. National, régions, Touba, communiqués et agenda.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/kiiraay-logo.jpeg",
    shortcut: "/kiiraay-logo.jpeg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="antialiased">{children}</body>
    </html>
  );
}
