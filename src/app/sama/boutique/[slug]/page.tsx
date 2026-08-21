import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { MapPin, Phone, Clock } from "lucide-react";
import { prisma } from "@/lib/db";
import StoreClient from "@/components/sama/StoreClient";

export const dynamic = "force-dynamic";

async function getStore(slug: string) {
  const business = await prisma.samaBusiness.findUnique({ where: { slug } });
  if (!business || !business.storePublished) return null;
  const products = await prisma.samaProduct.findMany({
    where: { businessId: business.id, archived: false, active: true },
    include: { category: true },
    orderBy: { createdAt: "desc" },
    take: 200,
  });
  return { business, products };
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getStore(slug);
  if (!data) return { title: "Boutique introuvable" };
  return {
    title: `${data.business.name} — Boutique en ligne`,
    description: data.business.description ?? `Découvrez le catalogue de ${data.business.name} et commandez en ligne.`,
    openGraph: { title: data.business.name, description: data.business.description ?? "", images: data.business.bannerUrl ? [data.business.bannerUrl] : [] },
  };
}

export default async function BoutiquePubliquePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getStore(slug);
  if (!data) notFound();
  const { business, products } = data;

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="h-32 sm:h-48 bg-cover bg-center" style={{ backgroundImage: business.bannerUrl ? `url(${business.bannerUrl})` : `linear-gradient(135deg, ${business.brandColor}, #0a6342)` }} />
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-sm -mt-10 p-4 flex items-center gap-3">
          <div className="w-16 h-16 rounded-2xl bg-gray-100 grid place-items-center overflow-hidden shrink-0" style={{ background: business.brandColor }}>
            {business.logoUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={business.logoUrl} alt={business.name} className="w-full h-full object-cover" />
            ) : <span className="text-white font-bold text-xl">{business.name.slice(0, 2).toUpperCase()}</span>}
          </div>
          <div className="min-w-0">
            <h1 className="font-bold text-lg text-gray-900 truncate">{business.name}</h1>
            {business.description && <p className="text-sm text-gray-500 line-clamp-2">{business.description}</p>}
            <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-400">
              {business.city && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{business.city}</span>}
              {business.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{business.phone}</span>}
              {business.openingHours && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{business.openingHours}</span>}
            </div>
          </div>
        </div>

        <div className="mt-5">
          {products.length === 0 ? (
            <p className="text-center text-gray-400 py-10">Aucun produit disponible pour le moment.</p>
          ) : (
            <StoreClient
              slug={business.slug}
              businessName={business.name}
              whatsapp={business.whatsapp ?? business.phone ?? ""}
              brandColor={business.brandColor}
              currency={business.currency}
              products={products.map((p) => ({ id: p.id, name: p.name, salePrice: p.salePrice, stock: p.stock, imageUrl: p.imageUrl, description: p.description, category: p.category?.name ?? null }))}
            />
          )}
        </div>
        <p className="text-center text-xs text-gray-300 mt-8">Propulsé par SAMA PILOT</p>
      </div>
    </div>
  );
}
