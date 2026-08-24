import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Sénégal Atlas — Explorer, comprendre, voyager",
  description: "Une porte d’entrée contemporaine pour découvrir les régions, cultures et itinéraires du Sénégal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
