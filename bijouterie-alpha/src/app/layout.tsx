import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Alpha Amadou Thiam · Bijoux en Or · Marché Tilène",
  description:
    "Bijouterie Alpha Amadou Thiam — Achat, Vente, Échange et Travail sur Commande de bijoux en or au Marché Tilène. Expertise, confiance et qualité garanties.",
  keywords: "bijoux or, bijouterie Dakar, Marché Tilène, Alpha Amadou Thiam, achat or, vente or, travail sur commande",
  openGraph: {
    title: "Alpha Amadou Thiam · Bijoux en Or",
    description: "Maître bijoutier au Marché Tilène — Achat · Vente · Échange · Sur Commande",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr">
      <head>
        <link rel="icon" href="data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'><text y='.9em' font-size='90'>💍</text></svg>" />
      </head>
      <body>{children}</body>
    </html>
  );
}
