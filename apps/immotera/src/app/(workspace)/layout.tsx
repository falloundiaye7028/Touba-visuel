import type { Metadata } from "next";
import { AppChrome } from "@/components/AppChrome";

export const metadata: Metadata = { robots: { index: false, follow: false } };

export default function WorkspaceLayout({ children }: { children: React.ReactNode }) {
  return <AppChrome>{children}</AppChrome>;
}
