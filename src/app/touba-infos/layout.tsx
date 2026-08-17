import type { Metadata } from "next";
import BreakingBar from "./_components/BreakingBar";
import InfosHeader from "./_components/InfosHeader";
import InfosFooter from "./_components/InfosFooter";
import MobileBottomNav from "./_components/MobileBottomNav";
import InfosWhatsApp from "./_components/InfosWhatsApp";

export const metadata: Metadata = {
  title: {
    default:
      "Touba Infos — L'actualité de Touba, du Sénégal et du monde",
    template: "%s · Touba Infos",
  },
  description:
    "Touba Infos, média numérique d'information générale. Suivez l'actualité de Touba, du Sénégal, de l'Afrique et du monde : politique, société, économie, religion, Grand Magal, sport, culture, vidéos et interviews.",
  applicationName: "Touba Infos",
  openGraph: {
    siteName: "Touba Infos",
    locale: "fr_SN",
    type: "website",
    title: "Touba Infos — L'actualité de Touba, du Sénégal et du monde",
    description:
      "Média numérique d'information générale. L'information au cœur de Touba, ouverte sur le monde.",
    images: [{ url: "/touba-infos-logo.png", alt: "Touba Infos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Touba Infos",
    description:
      "L'actualité de Touba, du Sénégal, de l'Afrique et du monde.",
    images: ["/touba-infos-logo.png"],
  },
};

export default function ToubaInfosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ti-root min-h-screen bg-[#ffffff] text-neutral-900">
      <BreakingBar />
      <InfosHeader />
      <main className="pb-16 lg:pb-0">{children}</main>
      <InfosFooter />
      <MobileBottomNav />
      <InfosWhatsApp />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            name: "Touba Infos",
            url: "https://touba-visuel.vercel.app/touba-infos",
            logo: "https://touba-visuel.vercel.app/touba-infos-logo.png",
            slogan: "L'information au cœur de Touba, ouverte sur le monde.",
            areaServed: ["Touba", "Sénégal", "Afrique", "Monde"],
            sameAs: [
              "https://facebook.com",
              "https://youtube.com",
              "https://instagram.com",
            ],
          }),
        }}
      />
    </div>
  );
}
