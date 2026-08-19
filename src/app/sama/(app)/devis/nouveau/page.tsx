import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/sama/ui";
import QuoteForm from "@/components/sama/QuoteForm";

export const dynamic = "force-dynamic";

export default async function NouveauDevisPage() {
  const { business } = await requireOnboardedTenant();
  const [products, customers] = await Promise.all([
    prisma.samaProduct.findMany({ where: { businessId: business.id, archived: false }, select: { id: true, name: true, salePrice: true }, orderBy: { name: "asc" }, take: 500 }),
    prisma.samaCustomer.findMany({ where: { businessId: business.id }, select: { id: true, name: true }, orderBy: { name: "asc" }, take: 500 }),
  ]);
  return (
    <div>
      <PageHeader title="Nouveau devis" subtitle="Établissez un devis professionnel" />
      <QuoteForm products={products} customers={customers} currency={business.currency} />
    </div>
  );
}
