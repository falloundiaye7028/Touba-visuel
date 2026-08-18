import type { Metadata } from "next";

export const metadata: Metadata = {
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
  return <div className="min-h-screen bg-gray-50 text-gray-900">{children}</div>;
}
