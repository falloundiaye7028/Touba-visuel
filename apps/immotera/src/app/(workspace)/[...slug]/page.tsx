import { notFound } from "next/navigation";
import { ModulePage } from "@/components/ModulePage";

const roots = new Set(["properties", "buildings", "owners", "tenants", "leads", "visits", "contracts", "payments", "arrears", "expenses", "commissions", "owner-statements", "maintenance", "vendors", "documents", "import", "reports", "settings", "ai"]);

export default async function WorkspaceCatchAll({ params, searchParams }: { params: Promise<{ slug: string[] }>; searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const { slug } = await params;
  const query = await searchParams;
  if (!roots.has(slug[0])) notFound();
  return <ModulePage slug={slug} initiallyOpen={query.new === "1" || slug.at(-1) === "new"}/>;
}
