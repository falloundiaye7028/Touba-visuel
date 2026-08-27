import type { Metadata, Viewport } from "next";
import "./tck-connect.css";
import "./mvp.css";

export const metadata: Metadata = {
  title: { absolute: "TCK CONNECT — Touba Ca Kanam" },
  description:
    "La plateforme numérique centrale de Touba Ca Kanam : membres, contributions, projets et transparence.",
  applicationName: "TCK CONNECT",
  openGraph: {
    title: "TCK CONNECT — Touba Ca Kanam",
    description:
      "La plateforme numérique centrale de Touba Ca Kanam : membres, contributions, projets et transparence.",
    siteName: "TCK CONNECT",
    locale: "fr_SN",
    type: "website",
    images: [],
  },
  twitter: {
    card: "summary",
    title: "TCK CONNECT — Touba Ca Kanam",
    description:
      "Membres, contributions, projets et transparence au sein d’un système numérique central.",
    images: [],
  },
};

export const viewport: Viewport = { themeColor: "#075c3c" };

export default function TckConnectLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="tck-app">{children}</div>;
}
