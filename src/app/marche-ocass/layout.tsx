import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "MARCHÉ OCASS — Le portail commercial de Touba",
  description:
    "Ouvrez votre cantine en ligne sur MARCHÉ OCASS : le premier portail marketplace de Touba. Exposez vos produits, attirez des clients locaux et de la diaspora. Abonnement à partir de 5 000 F CFA/mois.",
  keywords: [
    "marché en ligne Touba",
    "marketplace Touba Sénégal",
    "cantine en ligne Touba",
    "vente en ligne Sénégal",
    "MARCHÉ OCASS",
    "boutique en ligne Touba",
    "commerce Touba",
    "vendeurs Touba",
    "marché sénégalais en ligne",
  ],
  openGraph: {
    title: "MARCHÉ OCASS — Le portail commercial de Touba",
    description:
      "Ouvrez votre cantine en ligne et vendez à Touba et partout au Sénégal. Abonnement à partir de 5 000 F CFA/mois.",
    url: "https://touba-visuel.vercel.app/marche-ocass",
    siteName: "Agence Touba Visuel",
    locale: "fr_SN",
    type: "website",
  },
};

export default function MarcheOcassLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
