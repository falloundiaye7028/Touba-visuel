import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { createSupplierAction } from "@/lib/sama/actions/suppliers";
import { PageHeader } from "@/components/sama/ui";
import SupplierForm from "@/components/sama/SupplierForm";

export const dynamic = "force-dynamic";

export default async function NouveauFournisseurPage() {
  await requireOnboardedTenant();
  return (
    <div>
      <PageHeader title="Nouveau fournisseur" subtitle="Ajoutez un fournisseur" />
      <div className="card p-4"><SupplierForm action={createSupplierAction} /></div>
    </div>
  );
}
