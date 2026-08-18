"use client";

import { useActionState, useEffect, useRef } from "react";
import { createPromoAction, type PromoState } from "@/lib/sama/actions/campaigns";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";

export default function PromoForm() {
  const [state, formAction] = useActionState(createPromoAction, {} as PromoState);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.ok) ref.current?.reset(); }, [state.ok]);

  return (
    <form ref={ref} action={formAction} className="grid grid-cols-2 gap-2 items-end">
      <Field label="Code" required><input name="code" className="input-field !py-2 uppercase" placeholder="PROMO10" required /></Field>
      <Field label="Type"><select name="type" className="input-field !py-2"><option value="POURCENTAGE">Pourcentage (%)</option><option value="MONTANT">Montant (FCFA)</option></select></Field>
      <Field label="Valeur" required><input name="value" type="number" min="1" className="input-field !py-2" required /></Field>
      <Field label="Usages max (optionnel)"><input name="maxUsage" type="number" min="1" className="input-field !py-2" /></Field>
      {state.error && <div className="col-span-2 bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}
      <div className="col-span-2"><SubmitButton className="btn-primary w-full">Créer le code promo</SubmitButton></div>
    </form>
  );
}
