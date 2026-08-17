"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MockupLateral from "@/components/MockupLateral";
import BannierePromo from "@/components/BannierePromo";
import WhatsAppFloat from "@/components/WhatsAppFloat";
import ScrollProgress from "@/components/ScrollProgress";
import ChatbotIA from "@/components/ChatbotIA";

/**
 * Enveloppe l'application. Sur les routes « Touba Infos », le média possède
 * sa propre identité (header, navigation, footer) : on masque donc entièrement
 * l'habillage de l'Agence Touba Visuel pour offrir une expérience autonome.
 */
export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isToubaInfos = pathname?.startsWith("/touba-infos");

  if (isToubaInfos) {
    // Touba Infos fournit son propre habillage via son layout dédié.
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgress />
      <BannierePromo />
      <MockupLateral />
      <Header />
      <main className="min-h-screen">{children}</main>
      <Footer />
      <WhatsAppFloat />
      <ChatbotIA />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "LocalBusiness",
            name: "Agence Touba Visuel",
            alternateName: "ATV",
            url: "https://touba-visuel.vercel.app",
            telephone: "+221768001717",
            address: {
              "@type": "PostalAddress",
              addressLocality: "Touba",
              addressRegion: "Diourbel",
              addressCountry: "SN",
            },
            geo: {
              "@type": "GeoCoordinates",
              latitude: 14.8505,
              longitude: -15.8833,
            },
            description:
              "Agence de communication à Touba — impression, signalétique, textile, digital et conception de sites web professionnels.",
            priceRange: "$$",
            openingHours: "Mo-Su 08:00-20:00",
            sameAs: ["https://www.tiktok.com/@toubavisuel"],
            image:
              "https://touba-visuel.vercel.app/images/atv-tiktok-cover.jpg",
            hasMap: "https://maps.google.com/?q=Touba,Senegal",
          }),
        }}
      />
    </>
  );
}
