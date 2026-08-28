import type { Metadata } from "next";
import "./securite.css";

export const metadata: Metadata = {
  title: { absolute: "Sécurité du compte — TCK CONNECT" },
  description: "Gestion sécurisée du mot de passe TCK CONNECT.",
};

export default function TckSecurityLayout({ children }: { children: React.ReactNode }) {
  return children;
}
