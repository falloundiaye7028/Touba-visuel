import type { Metadata } from "next";

export const metadata: Metadata = {
  title: { absolute: "Transparence publique — TCK CONNECT" },
  description: "Indicateurs publics de mobilisation et d'impact de Touba Ca Kanam.",
};

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return children;
}
