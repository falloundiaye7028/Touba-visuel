"use client";

import { useActionState, useEffect, useRef } from "react";
import { createExpenseAction } from "@/lib/sama/actions/expenses";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import { EXPENSE_CATEGORIES } from "@/lib/sama/constants";
import type { FormState } from "@/lib/sama/actions/products";

export default function ExpenseForm() {
  const [state, formAction] = useActionState(createExpenseAction, {} as FormState);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.ok) ref.current?.reset(); }, [state.ok]);

  return (
    <form ref={ref} action={formAction} className="grid grid-cols-2 gap-2 items-end">
      <Field label="Catégorie" required>
        <select name="category" className="input-field !py-2" required defaultValue="">
          <option value="" disabled>Choisir…</option>
          {EXPENSE_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
      </Field>
      <Field label="Montant (FCFA)" required>
        <input name="amount" type="number" min="1" className="input-field !py-2" required />
      </Field>
      <Field label="Description">
        <input name="description" className="input-field !py-2" placeholder="Détail…" />
      </Field>
      <Field label="Date">
        <input name="date" type="date" className="input-field !py-2" defaultValue={new Date().toISOString().slice(0, 10)} />
      </Field>
      {state.error && <div className="col-span-2 bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}
      <div className="col-span-2"><SubmitButton className="btn-primary w-full">Ajouter la dépense</SubmitButton></div>
    </form>
  );
}
