import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { createCustomerAction } from "@/lib/sama/actions/customers";
import { PageHeader } from "@/components/sama/ui";
import CustomerForm from "@/components/sama/CustomerForm";

export const dynamic = "force-dynamic";

export default async function NouveauClientPage() {
  await requireOnboardedTenant();
  return (
    <div>
      <PageHeader title="Nouveau client" subtitle="Ajoutez un client à votre fichier" />
      <div className="card p-4"><CustomerForm action={createCustomerAction} /></div>
    </div>
  );
}
