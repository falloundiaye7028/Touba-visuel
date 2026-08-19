import { notFound } from "next/navigation";
import { MessageCircle } from "lucide-react";
import { requireOnboardedTenant, memberCan } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { getSegmentCustomers, markCampaignSentAction } from "@/lib/sama/actions/campaigns";
import { SEGMENTS } from "@/lib/sama/constants";
import { PageHeader, Badge } from "@/components/sama/ui";
import { SubmitButton } from "@/components/sama/SubmitButton";

export const dynamic = "force-dynamic";

function waLink(phone: string, text: string) {
  const digits = phone.replace(/\D/g, "").replace(/^0/, "");
  const full = digits.startsWith("221") ? digits : `221${digits}`;
  return `https://wa.me/${full}?text=${encodeURIComponent(text)}`;
}

export default async function CampagneDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { business, member } = await requireOnboardedTenant();
  if (!memberCan(member, "marketing.manage")) notFound();
  const { id } = await params;

  const campaign = await prisma.samaCampaign.findFirst({ where: { id, businessId: business.id } });
  if (!campaign) notFound();

  const recipients = await getSegmentCustomers(business.id, campaign.segment);
  const withPhone = recipients.filter((r) => r.phone);

  return (
    <div className="space-y-4">
      <PageHeader title={campaign.name} subtitle={SEGMENTS.find((s) => s.value === campaign.segment)?.label ?? campaign.segment}
        action={<Badge className={campaign.status === "ENVOYEE" ? "bg-vert-100 text-vert-700" : "bg-amber-100 text-amber-700"}>{campaign.status === "ENVOYEE" ? "Envoyée" : "Brouillon"}</Badge>} />

      <div className="card p-4">
        <div className="text-xs text-gray-400 uppercase mb-1">Message</div>
        <p className="text-sm text-gray-700 whitespace-pre-line">{campaign.message}</p>
      </div>

      <div className="card p-4">
        <div className="flex items-center justify-between mb-2">
          <h2 className="font-semibold text-gray-900">Destinataires ({withPhone.length})</h2>
          <form action={markCampaignSentAction}>
            <input type="hidden" name="id" value={campaign.id} />
            {campaign.status !== "ENVOYEE" && <SubmitButton className="btn-outline !py-1.5 text-xs" pendingLabel="…">Marquer envoyée</SubmitButton>}
          </form>
        </div>
        {withPhone.length === 0 ? (
          <p className="text-sm text-gray-400">Aucun client avec numéro dans ce segment.</p>
        ) : (
          <ul className="divide-y divide-gray-100">
            {withPhone.map((r) => (
              <li key={r.id} className="py-2 flex items-center justify-between">
                <span className="text-sm text-gray-700">{r.name} <span className="text-gray-400">· {r.phone}</span></span>
                <a href={waLink(r.phone!, campaign.message)} target="_blank" className="btn-primary !py-1.5 !px-3 text-xs"><MessageCircle className="w-3.5 h-3.5" /> Envoyer</a>
              </li>
            ))}
          </ul>
        )}
        <p className="text-[11px] text-gray-400 mt-3">Cliquez sur « Envoyer » pour ouvrir WhatsApp avec le message pré-rempli pour chaque client. L&apos;envoi reste manuel, dans le respect des règles de WhatsApp.</p>
      </div>
    </div>
  );
}
