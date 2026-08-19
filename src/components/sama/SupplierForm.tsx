"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import type { FormState } from "@/lib/sama/actions/products";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;
export interface SupplierInitial { id?: string; name?: string; contact?: string; phone?: string; email?: string; address?: string; notes?: string }

export default function SupplierForm({ action, initial, redirectTo = "/sama/fournisseurs" }: { action: Action; initial?: SupplierInitial; redirectTo?: string }) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {} as FormState);
  useEffect(() => { if (state.ok) router.push(redirectTo); }, [state.ok, router, redirectTo]);

  return (
    <form action={formAction} className="space-y-3">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <Field label="Nom / Entreprise" required><input name="name" className="input-field" defaultValue={initial?.name} required /></Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Responsable"><input name="contact" className="input-field" defaultValue={initial?.contact} /></Field>
        <Field label="Téléphone"><input name="phone" className="input-field" defaultValue={initial?.phone} /></Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Email"><input name="email" type="email" className="input-field" defaultValue={initial?.email} /></Field>
        <Field label="Adresse"><input name="address" className="input-field" defaultValue={initial?.address} /></Field>
      </div>
      <Field label="Notes"><textarea name="notes" className="input-field" rows={2} defaultValue={initial?.notes} /></Field>
      {state.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}
      <div className="flex gap-2">
        <SubmitButton className="btn-primary flex-1">{initial?.id ? "Enregistrer" : "Ajouter le fournisseur"}</SubmitButton>
        <button type="button" onClick={() => router.back()} className="btn-outline">Annuler</button>
      </div>
    </form>
  );
}
