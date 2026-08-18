import { Truck } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { PageHeader } from "@/components/sama/ui";
import { ComingSoon } from "@/components/sama/ComingSoon";

export const dynamic = "force-dynamic";

export default async function FournisseursPage() {
  await requireOnboardedTenant();
  return (
    <div className="space-y-4">
      <PageHeader title="Fournisseurs" subtitle="Gestion des achats et dettes fournisseurs" />
      <ComingSoon
        icon={<Truck className="w-6 h-6" />}
        title="Module Fournisseurs — Version 2"
        description="Suivez vos achats, réceptions, paiements et dettes fournisseurs."
        features={["Fiches fournisseurs", "Commandes d'achat", "Dettes & paiements", "Historique des réceptions"]}
      />
    </div>
  );
}
