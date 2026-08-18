import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { createProductAction } from "@/lib/sama/actions/products";
import { PageHeader } from "@/components/sama/ui";
import ProductForm from "@/components/sama/ProductForm";

export const dynamic = "force-dynamic";

export default async function NouveauProduitPage() {
  const { business } = await requireOnboardedTenant();
  const cats = await prisma.samaCategory.findMany({ where: { businessId: business.id }, orderBy: { name: "asc" } });
  return (
    <div>
      <PageHeader title="Nouveau produit" subtitle="Ajoutez un article à votre catalogue" />
      <div className="card p-4">
        <ProductForm action={createProductAction} categories={cats.map((c) => c.name)} />
      </div>
    </div>
  );
}
