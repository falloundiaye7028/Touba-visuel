"use client";

import { useActionState, useState } from "react";
import { updateSettingsAction } from "@/lib/sama/actions/settings";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import ImageUpload from "@/components/sama/ImageUpload";
import type { FormState } from "@/lib/sama/actions/products";

interface Init {
  name: string; phone: string; whatsapp: string; email: string; address: string;
  city: string; description: string; openingHours: string; brandColor: string;
  invoiceFooter: string; logoUrl: string; bannerUrl: string;
}

export default function SettingsForm({ initial }: { initial: Init }) {
  const [state, formAction] = useActionState(updateSettingsAction, {} as FormState);
  const [color, setColor] = useState(initial.brandColor || "#0e7d52");

  return (
    <form action={formAction} className="space-y-3">
      <Field label="Nom de l'entreprise" required><input name="name" className="input-field" defaultValue={initial.name} required /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Téléphone"><input name="phone" className="input-field" defaultValue={initial.phone} /></Field>
        <Field label="WhatsApp"><input name="whatsapp" className="input-field" defaultValue={initial.whatsapp} placeholder="77 123 45 67" /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email"><input name="email" type="email" className="input-field" defaultValue={initial.email} /></Field>
        <Field label="Ville"><input name="city" className="input-field" defaultValue={initial.city} /></Field>
      </div>
      <Field label="Adresse"><input name="address" className="input-field" defaultValue={initial.address} /></Field>
      <Field label="Description (boutique)"><textarea name="description" className="input-field" rows={2} defaultValue={initial.description} /></Field>
      <Field label="Horaires"><input name="openingHours" className="input-field" defaultValue={initial.openingHours} placeholder="Lun-Sam 8h-20h" /></Field>
      <div className="grid grid-cols-2 gap-3">
        <ImageUpload name="logoUrl" initial={initial.logoUrl} label="Logo" />
        <ImageUpload name="bannerUrl" initial={initial.bannerUrl} label="Bannière" aspect="wide" maxSize={1000} />
      </div>
      <Field label="Couleur de marque">
        <div className="flex items-center gap-2">
          <input type="color" name="brandColor" value={color} onChange={(e) => setColor(e.target.value)} className="w-12 h-10 rounded-lg border border-gray-200" />
          <span className="text-sm text-gray-500">{color}</span>
        </div>
      </Field>
      <Field label="Mention de bas de facture"><input name="invoiceFooter" className="input-field" defaultValue={initial.invoiceFooter} placeholder="Merci de votre confiance." /></Field>

      {state.ok && <div className="bg-vert-50 text-vert-700 text-sm rounded-xl px-3 py-2">Paramètres enregistrés ✓</div>}
      {state.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}
      <SubmitButton className="btn-primary w-full">Enregistrer</SubmitButton>
    </form>
  );
}
