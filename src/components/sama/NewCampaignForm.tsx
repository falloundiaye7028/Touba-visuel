"use client";

import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { createCampaignAction, generateCampaignTextAction, type CampaignState, type GenTextState } from "@/lib/sama/actions/campaigns";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import { SEGMENTS } from "@/lib/sama/constants";
import { TONES } from "@/lib/sama/ai";

export default function NewCampaignForm({ canUseAI }: { canUseAI: boolean }) {
  const router = useRouter();
  const [state, formAction] = useActionState(createCampaignAction, {} as CampaignState);
  const [message, setMessage] = useState("");
  const [tone, setTone] = useState("vendeur");
  const [genState, genAction] = useActionState(generateCampaignTextAction, {} as GenTextState);
  const [generating, setGenerating] = useState(false);

  useEffect(() => { if (state.ok && state.campaignId) router.push(`/sama/marketing/${state.campaignId}`); }, [state, router]);
  useEffect(() => { if (genState.text) { setMessage(genState.text); setGenerating(false); } if (genState.error) setGenerating(false); }, [genState]);

  return (
    <div className="space-y-4">
      <form action={formAction} className="card p-4 space-y-3">
        <Field label="Nom de la campagne" required><input name="name" className="input-field" placeholder="Ex : Promo Tabaski" required /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Canal"><select name="channel" className="input-field" defaultValue="WHATSAPP"><option value="WHATSAPP">WhatsApp</option><option value="SMS">SMS</option></select></Field>
          <Field label="Segment de clients"><select name="segment" className="input-field" defaultValue="all">{SEGMENTS.map((s) => <option key={s.value} value={s.value}>{s.label}</option>)}</select></Field>
        </div>
        <Field label="Message" required>
          <textarea name="message" value={message} onChange={(e) => setMessage(e.target.value)} rows={4} className="input-field" placeholder="Bonjour, profitez de nos offres…" required />
        </Field>
        {state.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}
        <SubmitButton className="btn-primary w-full">Créer la campagne</SubmitButton>
      </form>

      {canUseAI && (
        <form action={(fd) => { setGenerating(true); genAction(fd); }} className="card p-4">
          <h3 className="font-semibold text-gray-900 mb-2 flex items-center gap-2"><Sparkles className="w-4 h-4 text-or-500" /> Générer le texte avec l&apos;IA</h3>
          <div className="grid grid-cols-2 gap-2 items-end">
            <Field label="Objectif"><input name="objectif" className="input-field !py-2" placeholder="Promo, relance…" /></Field>
            <Field label="Ton"><select name="ton" value={tone} onChange={(e) => setTone(e.target.value)} className="input-field !py-2">{TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}</select></Field>
          </div>
          <button type="submit" disabled={generating} className="btn-gold w-full mt-3">{generating ? "Génération…" : "Générer le message"}</button>
          {genState.error && <div className="mt-2 bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{genState.error}</div>}
        </form>
      )}
    </div>
  );
}
