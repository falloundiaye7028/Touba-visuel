import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { planByCode, ROLE_LABELS } from "@/lib/sama/constants";
import { PageHeader } from "@/components/sama/ui";
import SettingsForm from "@/components/sama/SettingsForm";

export const dynamic = "force-dynamic";

export default async function ParametresPage() {
  const { business, role } = await requireOnboardedTenant();
  return (
    <div className="space-y-4">
      <PageHeader title="Paramètres" subtitle={`Plan ${planByCode(business.planCode).name} · ${ROLE_LABELS[role]}`} />
      <div className="card p-4">
        <SettingsForm initial={{
          name: business.name, phone: business.phone ?? "", whatsapp: business.whatsapp ?? "", email: business.email ?? "",
          address: business.address ?? "", city: business.city ?? "", description: business.description ?? "",
          openingHours: business.openingHours ?? "", brandColor: business.brandColor, invoiceFooter: business.invoiceFooter ?? "",
          logoUrl: business.logoUrl ?? "", bannerUrl: business.bannerUrl ?? "",
        }} />
      </div>
      <p className="text-xs text-gray-400 text-center">Devise : {business.currency} · Fuseau : {business.timezone} · Boutique : /sama/boutique/{business.slug}</p>
    </div>
  );
}
