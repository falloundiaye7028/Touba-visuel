"use client";

import { useActionState } from "react";
import { createBusinessAction, type ActionState } from "@/lib/sama/actions/account";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import { ACTIVITY_TYPES, COUNTRIES, SN_CITIES } from "@/lib/sama/constants";

export default function NewBusinessForm() {
  const [state, formAction] = useActionState(createBusinessAction, {} as ActionState);
  return (
    <form action={formAction} className="mt-5 space-y-3">
      <Field label="Nom de l'entreprise" required>
        <input name="entreprise" className="input-field" required placeholder="Ex : Sama Fashion" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Type d'activité">
          <select name="activityType" className="input-field"><option value="">Choisir…</option>{ACTIVITY_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}</select>
        </Field>
        <Field label="Ville">
          <select name="city" className="input-field" defaultValue="Dakar">{SN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}</select>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Pays"><select name="country" className="input-field" defaultValue="SN">{COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}</select></Field>
        <Field label="Devise"><select name="currency" className="input-field" defaultValue="XOF"><option value="XOF">FCFA (XOF)</option><option value="XAF">FCFA (XAF)</option><option value="MRU">Ouguiya</option></select></Field>
      </div>
      <Field label="Téléphone"><input name="phone" type="tel" className="input-field" placeholder="77 123 45 67" /></Field>
      {state.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}
      <SubmitButton className="btn-primary w-full">Créer l&apos;entreprise</SubmitButton>
    </form>
  );
}
