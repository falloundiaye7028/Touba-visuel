import { redirect } from "next/navigation";
import { requireOnboardedTenant, memberCan } from "@/lib/sama/tenant";
import { canUseAI } from "@/lib/sama/ai";
import { PageHeader } from "@/components/sama/ui";
import NewCampaignForm from "@/components/sama/NewCampaignForm";

export const dynamic = "force-dynamic";

export default async function NouvelleCampagnePage() {
  const { business, member } = await requireOnboardedTenant();
  if (!memberCan(member, "marketing.manage")) redirect("/sama/marketing");
  return (
    <div>
      <PageHeader title="Nouvelle campagne" subtitle="Ciblez un segment et préparez votre message" />
      <NewCampaignForm canUseAI={canUseAI(business)} />
    </div>
  );
}
