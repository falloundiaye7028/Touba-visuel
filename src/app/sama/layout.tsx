import type { Metadata } from "next";
import PwaRegister from "@/components/sama/PwaRegister";

export const metadata: Metadata = {
  manifest: "/sama-manifest.webmanifest",
  title: {
    default: "SAMA BUSINESS — Vendez. Gérez. Encaissez. Fidélisez.",
    template: "%s | SAMA BUSINESS",
  },
  description:
    "L'assistant intelligent de gestion commerciale pour commerçants et PME au Sénégal. Ventes, commandes, clients, stocks, factures et boutique en ligne depuis votre téléphone.",
  applicationName: "SAMA BUSINESS",
  appleWebApp: { capable: true, title: "SAMA BUSINESS", statusBarStyle: "default" },
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
