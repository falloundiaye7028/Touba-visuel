import type { Metadata } from "next";
import { MEDIA_URL } from "@/lib/touba-infos";
import BreakingBar from "./_components/BreakingBar";
import InfosHeader from "./_components/InfosHeader";
import InfosFooter from "./_components/InfosFooter";
import MobileBottomNav from "./_components/MobileBottomNav";
import InfosWhatsApp from "./_components/InfosWhatsApp";
import InfosChrome from "./_components/InfosChrome";

export const metadata: Metadata = {
  title: {
    default:
      "Touba Infos — L'actualité de Touba, du Sénégal et du monde",
    template: "%s · Touba Infos",
  },
  description:
    "Touba Infos, média numérique d'information générale. Suivez l'actualité de Touba, du Sénégal, de l'Afrique et du monde : politique, société, économie, religion, Grand Magal, sport, culture, vidéos et interviews.",
  applicationName: "Touba Infos",
  metadataBase: new URL(MEDIA_URL),
  openGraph: {
    siteName: "Touba Infos",
    locale: "fr_SN",
    type: "website",
    url: MEDIA_URL,
    title: "Touba Infos — L'actualité de Touba, du Sénégal et du monde",
    description:
      "Média numérique d'information générale. L'information au cœur de Touba, ouverte sur le monde.",
    images: [{ url: `${MEDIA_URL}/touba-infos-logo.png`, alt: "Touba Infos" }],
  },
  twitter: {
    card: "summary_large_image",
    title: "Touba Infos",
    description:
      "L'actualité de Touba, du Sénégal, de l'Afrique et du monde.",
    images: [`${MEDIA_URL}/touba-infos-logo.png`],
  },
};

export default function ToubaInfosLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="ti-root min-h-screen bg-[#ffffff] text-neutral-900">
      <InfosChrome
        breaking={<BreakingBar />}
        header={<InfosHeader />}
        footer={<InfosFooter />}
        bottomNav={<MobileBottomNav />}
        whatsapp={<InfosWhatsApp />}
        jsonLd={
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify({
                "@context": "https://schema.org",
                "@type": "NewsMediaOrganization",
                name: "Touba Infos",
                url: MEDIA_URL,
                logo: `${MEDIA_URL}/touba-infos-logo.png`,
                slogan:
                  "L'information au cœur de Touba, ouverte sur le monde.",
                areaServed: ["Touba", "Sénégal", "Afrique", "Monde"],
                sameAs: [
                  "https://www.facebook.com/toubainfos/?locale=fr_FR",
                  "https://www.youtube.com/@toubainfostv183",
                  "https://www.tiktok.com/@yoonu_murid_digital",
                ],
              }),
            }}
          />
        }
      >
        {children}
      </InfosChrome>
    </div>
  );
}
