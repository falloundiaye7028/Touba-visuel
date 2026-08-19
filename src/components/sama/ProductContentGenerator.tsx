"use client";

import { useActionState, useState } from "react";
import { Copy, Check, Sparkles } from "lucide-react";
import { generateProductContentAction, type ContentState } from "@/lib/sama/actions/ai";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import { TONES } from "@/lib/sama/ai";

function CopyBlock({ label, text }: { label: string; text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="border border-gray-100 rounded-xl p-3">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-semibold uppercase tracking-wide text-gray-400">{label}</span>
        <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(() => setCopied(false), 1500); }} className="text-gray-400 hover:text-vert-600">
          {copied ? <Check className="w-4 h-4 text-vert-600" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
      <p className="text-sm text-gray-700 whitespace-pre-line">{text}</p>
    </div>
  );
}

export default function ProductContentGenerator({ productId }: { productId: string }) {
  const [state, formAction] = useActionState(generateProductContentAction, {} as ContentState);
  const c = state.content;

  return (
    <div className="space-y-4">
      <form action={formAction} className="card p-4">
        <input type="hidden" name="productId" value={productId} />
        <div className="flex gap-2 items-end">
          <Field label="Ton du message">
            <select name="tone" className="input-field !py-2" defaultValue="vendeur">
              {TONES.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <SubmitButton className="btn-primary !py-2.5" pendingLabel="Génération…"><Sparkles className="w-4 h-4" /> Générer</SubmitButton>
        </div>
        {state.error && <div className="mt-3 bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}
      </form>

      {c && (
        <div className="space-y-2">
          <CopyBlock label="Titre" text={c.title} />
          <CopyBlock label="Description" text={c.description} />
          <CopyBlock label="Slogan" text={c.slogan} />
          <CopyBlock label="Facebook" text={c.facebook} />
          <CopyBlock label="Instagram" text={c.instagram} />
          <CopyBlock label="TikTok" text={c.tiktok} />
          <CopyBlock label="WhatsApp" text={c.whatsapp} />
          <CopyBlock label="Hashtags" text={c.hashtags} />
          <CopyBlock label="Offre promotionnelle" text={c.promo} />
        </div>
      )}
    </div>
  );
}
