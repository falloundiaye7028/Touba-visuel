import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, Bot } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { canUseAI } from "@/lib/sama/ai";
import { PageHeader } from "@/components/sama/ui";
import ProductContentGenerator from "@/components/sama/ProductContentGenerator";

export const dynamic = "force-dynamic";

export default async function ProductContentPage({ params }: { params: Promise<{ id: string }> }) {
  const { business } = await requireOnboardedTenant();
  const { id } = await params;
  const product = await prisma.samaProduct.findFirst({ where: { id, businessId: business.id } });
  if (!product) notFound();

  return (
    <div className="space-y-4">
      <Link href={`/sama/produits/${id}`} className="inline-flex items-center gap-1 text-sm text-gray-500"><ArrowLeft className="w-4 h-4" /> Retour au produit</Link>
      <PageHeader title="Contenu marketing IA" subtitle={product.name} />

      {!canUseAI(business) ? (
        <div className="card p-8 text-center flex flex-col items-center">
          <div className="w-14 h-14 rounded-2xl bg-vert-100 text-vert-700 grid place-items-center mb-4"><Bot className="w-6 h-6" /></div>
          <h3 className="font-semibold text-gray-900">Fonctionnalité Pro IA</h3>
          <p className="text-sm text-gray-500 mt-1 max-w-sm">Générez des publications prêtes à publier pour Facebook, Instagram, TikTok et WhatsApp.</p>
          <Link href="/sama/abonnement" className="btn-primary mt-4">Voir le plan Pro IA</Link>
        </div>
      ) : (
        <ProductContentGenerator productId={product.id} />
      )}
    </div>
  );
}
