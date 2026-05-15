import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MockupLateral from "@/components/MockupLateral";

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
  metadataBase: new URL("https://touba-visuel.vercel.app"),
  openGraph: {
    title: "ATV — Agence Touba Visuel | Image & Communication",
    description:
      "🎨 Conception graphique, impression tous formats, sites web professionnels. L'image qui donne de la puissance à votre marque. Touba, Sénégal.",
    url: "https://touba-visuel.vercel.app",
    siteName: "Agence Touba Visuel",
    locale: "fr_SN",
    type: "website",
    images: [
      {
        url: "/images/atv-tiktok-cover.jpg",
        width: 800,
        height: 1422,
        alt: "ATV — Agence Touba Visuel | Image & Communication",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ATV — Agence Touba Visuel",
    description: "Conception graphique, impression, sites web. Touba, Sénégal.",
    images: ["/images/atv-tiktok-cover.jpg"],
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
        <MockupLateral />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
