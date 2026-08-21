import type { Metadata, Viewport } from "next";
import PwaRegister from "@/components/sama/PwaRegister";

const SAMA_DESCRIPTION =
  "L'assistant intelligent de gestion commerciale pour commerçants et PME au Sénégal. Ventes, commandes, clients, stocks, factures et boutique en ligne depuis votre téléphone.";

export const metadata: Metadata = {
  manifest: "/sama-manifest.webmanifest",
  title: {
    absolute: "SAMA BUSINESS — Vendez. Gérez. Encaissez. Fidélisez.",
    template: "%s | SAMA BUSINESS",
  },
  description: SAMA_DESCRIPTION,
  keywords: [
    "SAMA BUSINESS",
    "gestion commerciale Sénégal",
    "logiciel commerce Sénégal",
    "gestion stock",
    "facturation",
    "SAMA AI",
    "PME Sénégal",
    "commerce Touba",
  ],
  applicationName: "SAMA BUSINESS",
  alternates: { canonical: "/sama" },
  openGraph: {
    title: "SAMA BUSINESS — Votre entreprise dans votre poche",
    description: SAMA_DESCRIPTION,
    url: "/sama",
    siteName: "SAMA BUSINESS",
    locale: "fr_SN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SAMA BUSINESS — Votre entreprise dans votre poche",
    description: SAMA_DESCRIPTION,
  },
  appleWebApp: { capable: true, title: "SAMA BUSINESS", statusBarStyle: "default" },
};

export const viewport: Viewport = {
  themeColor: "#0e7d52",
};

export default function SamaLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Applique le thème avant le rendu pour éviter le flash clair/sombre */}
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){try{var t=localStorage.getItem('sama-theme');var d=t==='dark'||(!t&&window.matchMedia('(prefers-color-scheme: dark)').matches);document.documentElement.classList.toggle('dark',d);}catch(e){}})();`,
        }}
      />
      <PwaRegister />
      {children}
    </div>
  );
}
