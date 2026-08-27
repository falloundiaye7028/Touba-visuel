import type { Metadata, Viewport } from "next";
import "./tck.css";

export const metadata: Metadata = {
  title: "TCK CONNECT — Piloter. Servir. Rendre compte.",
  description: "Le système numérique central de Touba Ca Kanam.",
};

export const viewport: Viewport = { themeColor: "#073c2b" };

export default function TckLayout({ children }: { children: React.ReactNode }) {
  return children;
}
