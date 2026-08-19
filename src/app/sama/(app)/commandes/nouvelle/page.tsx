import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/sama/ui";
import NewOrderForm from "@/components/sama/NewOrderForm";

export const dynamic = "force-dynamic";

export default async function NouvelleCommandePage() {
  const { business } = await requireOnboardedTenant();
  const [products, customers] = await Promise.all([
    prisma.samaProduct.findMany({ where: { businessId: business.id, archived: false }, select: { id: true, name: true, salePrice: true, stock: true }, orderBy: { name: "asc" }, take: 500 }),
    prisma.samaCustomer.findMany({ where: { businessId: business.id }, select: { id: true, name: true }, orderBy: { name: "asc" }, take: 500 }),
  ]);
  return (
    <div>
      <PageHeader title="Nouvelle commande" subtitle="Enregistrez une commande client" />
      <NewOrderForm products={products} customers={customers} currency={business.currency} />
    </div>
  );
}
