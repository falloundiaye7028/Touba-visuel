import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sénégal Atlas — Intelligence territoriale",
  description: "Plateforme nationale d’intelligence territoriale pour explorer, comprendre et valoriser les territoires du Sénégal.",
  applicationName: "Sénégal Atlas",
  keywords: ["Sénégal Atlas", "intelligence territoriale", "régions du Sénégal", "voyage Sénégal"],
  icons: { icon: "/senegal-atlas-icon.svg", apple: "/senegal-atlas-icon.svg" },
  openGraph: {
    title: "Sénégal Atlas — Intelligence territoriale",
    description: "Explorer, comprendre et valoriser les territoires du Sénégal.",
    locale: "fr_SN",
    type: "website",
    images: [{ url: "/senegal-atlas-logo.svg", alt: "Sénégal Atlas" }],
  },
};

export const viewport: Viewport = { themeColor: "#005c32", colorScheme: "light" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
