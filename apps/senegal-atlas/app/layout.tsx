import type { Metadata } from "next";
import "./styles.css";

export const metadata: Metadata = {
  title: "Sénégal Atlas — Explorer le Sénégal",
  description: "Un guide vivant des régions, cultures et destinations du Sénégal.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="fr"><body>{children}</body></html>;
}
