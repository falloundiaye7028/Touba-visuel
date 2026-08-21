import type { Metadata, Viewport } from "next";
import PwaRegister from "@/components/sama/PwaRegister";

const SAMA_DESCRIPTION =
  "Le copilote intelligent de gestion pour commerçants et PME au Sénégal. Ventes, commandes, clients, stocks, factures et décisions assistées par l’IA depuis votre téléphone.";

export const metadata: Metadata = {
  manifest: "/sama-manifest.webmanifest",
  title: {
    absolute: "SAMA PILOT — Votre entreprise dans votre poche.",
    template: "%s | SAMA PILOT",
  },
  description: SAMA_DESCRIPTION,
  keywords: [
    "SAMA PILOT",
    "gestion commerciale Sénégal",
    "logiciel commerce Sénégal",
    "gestion stock",
    "facturation",
    "SAMA AI",
    "PME Sénégal",
    "commerce Touba",
  ],
  applicationName: "SAMA PILOT",
  alternates: { canonical: "https://samapilot.com" },
  openGraph: {
    title: "SAMA PILOT — Votre entreprise dans votre poche",
    description: SAMA_DESCRIPTION,
    url: "https://samapilot.com",
    siteName: "SAMA PILOT",
    locale: "fr_SN",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "SAMA PILOT — Votre entreprise dans votre poche",
    description: SAMA_DESCRIPTION,
  },
  appleWebApp: { capable: true, title: "SAMA PILOT", statusBarStyle: "default" },
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
