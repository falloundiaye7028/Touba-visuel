import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { PageHeader } from "@/components/sama/ui";
import ImportClient from "@/components/sama/ImportClient";

export const dynamic = "force-dynamic";

export default async function ImportsPage() {
  await requireOnboardedTenant();
  return (
    <div className="space-y-4">
      <PageHeader title="Importer des données" subtitle="Ajoutez vos produits et clients en masse depuis un fichier CSV / Excel" />
      <ImportClient />
      <p className="text-xs text-gray-400">Astuce : depuis Excel, enregistrez votre feuille au format CSV. La première ligne doit contenir les noms de colonnes.</p>
    </div>
  );
}
