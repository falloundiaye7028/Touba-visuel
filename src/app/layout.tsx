import type { Metadata, Viewport } from "next";
import { headers } from "next/headers";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";

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
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "ATV",
    startupImage: [
      { url: "/splash/splash-640x1136.png",   media: "(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2)" },
      { url: "/splash/splash-750x1334.png",   media: "(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2)" },
      { url: "/splash/splash-1242x2208.png",  media: "(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash/splash-1125x2436.png",  media: "(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash/splash-828x1792.png",   media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 2)" },
      { url: "/splash/splash-1242x2688.png",  media: "(device-width: 414px) and (device-height: 896px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash/splash-1170x2532.png",  media: "(device-width: 390px) and (device-height: 844px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash/splash-1290x2796.png",  media: "(device-width: 430px) and (device-height: 932px) and (-webkit-device-pixel-ratio: 3)" },
      { url: "/splash/splash-1179x2556.png",  media: "(device-width: 393px) and (device-height: 852px) and (-webkit-device-pixel-ratio: 3)" },
    ],
  },
  icons: {
    icon: [
      { url: "/favicon.png", sizes: "32x32", type: "image/png" },
      { url: "/icon-192.png", sizes: "192x192", type: "image/png" },
      { url: "/icon-512.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
    shortcut: "/favicon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#07402b",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = (await headers()).get("x-pathname") || "";
  // SAMA PILOT et TOUBA INFOS sont des applications autonomes : elles
  // fournissent leur propre habillage et n'héritent pas de l'en-tête/pied ATV.
  const isSama = pathname.startsWith("/sama");
  const isInfos = pathname.startsWith("/touba-infos");
  const isTckConnect = pathname.startsWith("/tck-connect");

  if (isSama || isInfos || isTckConnect) {
    return (
      <html lang="fr">
        <body>{children}</body>
      </html>
    );
  }

  return (
    <html lang="fr">
      <body>
        <SiteChrome>{children}</SiteChrome>
        <script
          dangerouslySetInnerHTML={{
            __html: `if('serviceWorker' in navigator){navigator.serviceWorker.register('/sw.js')}`,
          }}
        />
      </body>
    </html>
  );
}
