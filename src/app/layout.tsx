import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default: "ATV — Agence Touba Visuel | Tous vos supports de communication",
    template: "%s | Agence Touba Visuel (ATV)",
  },
  description:
    "Commandez en ligne tous vos supports de communication : impression, signalétique, textile, digital et plus. Agence Touba Visuel — Livraison Touba, Dakar et partout au Sénégal.",
  keywords: [
    "Agence Touba Visuel",
    "ATV Touba",
    "impression Touba",
    "supports communication Sénégal",
    "flyers Touba",
    "banderole Sénégal",
    "t-shirt personnalisé",
    "signalétique",
    "agence communication Touba",
  ],
  openGraph: {
    title: "ATV — Agence Touba Visuel",
    description: "Votre agence de communication visuelle au Sénégal",
    locale: "fr_SN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr">
      <body>
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
