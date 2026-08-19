import Link from "next/link";
import { Store, ExternalLink, Package } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { toggleStoreAction } from "@/lib/sama/actions/settings";
import { PageHeader, Badge } from "@/components/sama/ui";
import { SubmitButton } from "@/components/sama/SubmitButton";

export const dynamic = "force-dynamic";

export default async function BoutiquePage() {
  const { business } = await requireOnboardedTenant();
  const productCount = await prisma.samaProduct.count({ where: { businessId: business.id, archived: false, active: true } });
  const url = `/sama/boutique/${business.slug}`;

  return (
    <div className="space-y-4">
      <PageHeader title="Boutique en ligne" subtitle="Votre catalogue accessible par lien public" />

      <div className="card p-5 text-center">
        <div className="w-14 h-14 rounded-2xl bg-vert-50 text-vert-600 grid place-items-center mx-auto mb-3"><Store className="w-6 h-6" /></div>
        <div className="font-semibold text-gray-900">{business.name}</div>
        <div className="mt-1">
          {business.storePublished ? <Badge className="bg-vert-100 text-vert-700">En ligne</Badge> : <Badge className="bg-gray-100 text-gray-500">Hors ligne</Badge>}
        </div>
        <code className="block mt-3 text-xs bg-gray-50 rounded-lg px-3 py-2 text-gray-600 break-all">samabusiness.sn/boutique/{business.slug}</code>

        <div className="flex gap-2 mt-4 justify-center">
          <Link href={url} target="_blank" className="btn-outline !py-2 text-sm"><ExternalLink className="w-4 h-4" /> Aperçu</Link>
          <form action={toggleStoreAction}>
            <input type="hidden" name="publish" value={business.storePublished ? "false" : "true"} />
            <SubmitButton className={business.storePublished ? "btn-outline !py-2 text-sm" : "btn-primary !py-2 text-sm"} pendingLabel="…">
              {business.storePublished ? "Mettre hors ligne" : "Publier la boutique"}
            </SubmitButton>
          </form>
        </div>
      </div>

      <div className="card p-4 flex items-center gap-3">
        <Package className="w-5 h-5 text-gray-400" />
        <div className="flex-1 text-sm text-gray-600">{productCount} produit(s) actif(s) affiché(s) dans la boutique.</div>
        <Link href="/sama/produits" className="text-vert-700 text-sm font-medium">Gérer</Link>
      </div>

      <p className="text-xs text-gray-400">Les clients passent commande directement depuis la boutique ou via WhatsApp. Les commandes reçues apparaissent dans l&apos;onglet Commandes.</p>
    </div>
  );
}
