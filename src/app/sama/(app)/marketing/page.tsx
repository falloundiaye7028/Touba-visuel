import { Megaphone } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { PageHeader } from "@/components/sama/ui";
import { ComingSoon } from "@/components/sama/ComingSoon";

export const dynamic = "force-dynamic";

export default async function MarketingPage() {
  await requireOnboardedTenant();
  return (
    <div className="space-y-4">
      <PageHeader title="Marketing" subtitle="Campagnes, segments et contenu IA" />
      <ComingSoon
        icon={<Megaphone className="w-6 h-6" />}
        title="Module Marketing — Versions 2 & 3"
        description="Segmentez vos clients, créez des campagnes et générez du contenu avec SAMA AI (plan Pro IA)."
        features={["Segments clients automatiques", "Codes promo", "Génération de contenu (Facebook, Instagram, TikTok, WhatsApp)", "Rapports hebdomadaires IA"]}
      />
    </div>
  );
}
