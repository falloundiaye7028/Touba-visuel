import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { BRAND_NAME, BRAND_SIGNATURE, BRAND_TITLE } from "@/lib/brand";
import "./globals.css";
import "./brand-system.css";

export const metadata: Metadata = {
  title: { default: BRAND_TITLE, template: `%s · ${BRAND_NAME}` },
  description: BRAND_SIGNATURE,
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? "https://intelligenceimmobilier.com"),
  openGraph: {
    title: BRAND_TITLE,
    description: BRAND_SIGNATURE,
    locale: "fr_SN",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: BRAND_NAME, description: BRAND_SIGNATURE },
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
