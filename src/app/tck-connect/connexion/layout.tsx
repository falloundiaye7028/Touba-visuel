import type { Metadata } from "next";
import "./connexion.css";

export const metadata: Metadata = {
  title: { absolute: "Connexion sécurisée — TCK CONNECT" },
  description: "Connexion des agents habilités au système central TCK CONNECT.",
};

export default function TckConnexionLayout({ children }: { children: React.ReactNode }) {
  return children;
}
