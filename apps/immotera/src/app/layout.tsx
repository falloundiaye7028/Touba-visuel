import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: { default: "IntelligenceImmobilier — L’intelligence immobilière", template: "%s · IntelligenceImmobilier" },
  description: "Gérez vos biens, loyers, propriétaires, locataires et opérations depuis une seule plateforme intelligente.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://intelligenceimmobilier.com"),
  openGraph: {
    title: "IntelligenceImmobilier — L’intelligence immobilière",
    description: "La plateforme de gestion immobilière pensée pour l’Afrique francophone.",
    locale: "fr_SN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "IntelligenceImmobilier — L’intelligence immobilière", description: "La plateforme de gestion immobilière pensée pour l’Afrique francophone." },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fr">
      <body>{children}</body>
    </html>
  );
}
