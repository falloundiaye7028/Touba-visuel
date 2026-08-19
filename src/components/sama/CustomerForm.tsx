"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import type { FormState } from "@/lib/sama/actions/products";
import { CHANNELS, SN_CITIES } from "@/lib/sama/constants";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

export interface CustomerInitial {
  id?: string; name?: string; phone?: string; email?: string;
  address?: string; city?: string; source?: string; notes?: string;
}

export default function CustomerForm({ action, initial, redirectTo = "/sama/clients" }: {
  action: Action; initial?: CustomerInitial; redirectTo?: string;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {} as FormState);
  useEffect(() => { if (state.ok) router.push(redirectTo); }, [state.ok, router, redirectTo]);

  return (
    <form action={formAction} className="space-y-3">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <Field label="Nom complet" required>
        <input name="name" className="input-field" defaultValue={initial?.name} required placeholder="Ex : Fatou Ndiaye" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Téléphone">
          <input name="phone" type="tel" className="input-field" defaultValue={initial?.phone} placeholder="77 123 45 67" />
        </Field>
        <Field label="Email">
          <input name="email" type="email" className="input-field" defaultValue={initial?.email} />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Ville">
          <input name="city" list="city-list" className="input-field" defaultValue={initial?.city} />
          <datalist id="city-list">{SN_CITIES.map((c) => <option key={c} value={c} />)}</datalist>
        </Field>
        <Field label="Source">
          <select name="source" className="input-field" defaultValue={initial?.source ?? ""}>
            <option value="">—</option>
            {CHANNELS.map((c) => <option key={c.value} value={c.label}>{c.label}</option>)}
          </select>
        </Field>
      </div>
      <Field label="Adresse">
        <input name="address" className="input-field" defaultValue={initial?.address} />
      </Field>
      <Field label="Notes">
        <textarea name="notes" className="input-field" rows={2} defaultValue={initial?.notes} />
      </Field>

      {state.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}
      <div className="flex gap-2">
        <SubmitButton className="btn-primary flex-1">{initial?.id ? "Enregistrer" : "Ajouter le client"}</SubmitButton>
        <button type="button" onClick={() => router.back()} className="btn-outline">Annuler</button>
      </div>
    </form>
  );
}
