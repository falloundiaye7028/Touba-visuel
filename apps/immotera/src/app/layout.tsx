import type { Metadata, Viewport } from "next";
import Script from "next/script";
import "./globals.css";
import "./brand-system.css";

export const metadata: Metadata = {
  title: { default: "INTELLIGENCE IMMOBILIER — La plateforme intelligente de gestion immobilière.", template: "%s · INTELLIGENCE IMMOBILIER" },
  description: "La plateforme intelligente pour gérer vos biens, loyers, propriétaires, locataires et opérations immobilières.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://intelligenceimmobilier.com"),
  openGraph: {
    title: "INTELLIGENCE IMMOBILIER — La plateforme intelligente de gestion immobilière.",
    description: "Centralisez vos opérations immobilières et prenez de meilleures décisions grâce à l’intelligence métier.",
    locale: "fr_SN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "INTELLIGENCE IMMOBILIER", description: "La plateforme intelligente de gestion immobilière." },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#f4f7fa" },
    { media: "(prefers-color-scheme: dark)", color: "#020b18" },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr" data-scroll-behavior="smooth" suppressHydrationWarning>
      <body>
        <Script id="ii-theme-init" strategy="beforeInteractive">{`try{document.documentElement.dataset.theme=localStorage.getItem("ii-theme")==="dark"?"dark":"light"}catch(e){document.documentElement.dataset.theme="light"}`}</Script>
        {children}
      </body>
    </html>
  );
}
