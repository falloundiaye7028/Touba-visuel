import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { PageHeader } from "@/components/sama/ui";
import NewSaleForm from "@/components/sama/NewSaleForm";

export const dynamic = "force-dynamic";

export default async function NouvelleVentePage() {
  const { business } = await requireOnboardedTenant();
  const [products, customers] = await Promise.all([
    prisma.samaProduct.findMany({
      where: { businessId: business.id, archived: false, active: true },
      select: { id: true, name: true, salePrice: true, stock: true, unit: true },
      orderBy: { name: "asc" },
      take: 500,
    }),
    prisma.samaCustomer.findMany({
      where: { businessId: business.id },
      select: { id: true, name: true },
      orderBy: { name: "asc" },
      take: 500,
    }),
  ]);

  return (
    <div>
      <PageHeader title="Nouvelle vente" subtitle="Ajoutez des produits, encaissez, générez le reçu" />
      <NewSaleForm products={products} customers={customers} currency={business.currency} />
    </div>
  );
}
