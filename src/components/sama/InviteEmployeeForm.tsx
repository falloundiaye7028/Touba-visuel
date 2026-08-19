"use client";

import { useActionState, useRef, useEffect } from "react";
import { inviteEmployeeAction, type InviteState } from "@/lib/sama/actions/employees";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import { ROLE_LABELS } from "@/lib/sama/constants";

const ROLES: (keyof typeof ROLE_LABELS)[] = ["MANAGER", "SELLER", "CASHIER", "STOCK", "COMMERCIAL"];

export default function InviteEmployeeForm() {
  const [state, formAction] = useActionState(inviteEmployeeAction, {} as InviteState);
  const ref = useRef<HTMLFormElement>(null);
  useEffect(() => { if (state.ok) ref.current?.reset(); }, [state.ok]);

  return (
    <div>
      <form ref={ref} action={formAction} className="grid grid-cols-2 gap-2 items-end">
        <Field label="Nom" required><input name="name" className="input-field !py-2" required /></Field>
        <Field label="Téléphone" required><input name="phone" type="tel" className="input-field !py-2" required placeholder="77 123 45 67" /></Field>
        <Field label="Rôle" required>
          <select name="role" className="input-field !py-2" defaultValue="SELLER">
            {ROLES.map((r) => <option key={r} value={r}>{ROLE_LABELS[r]}</option>)}
          </select>
        </Field>
        <SubmitButton className="btn-primary !py-2.5" pendingLabel="…">Inviter</SubmitButton>
        {state.error && <div className="col-span-2 bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}
      </form>

      {state.ok && state.tempPassword && (
        <div className="mt-3 bg-vert-50 border border-vert-200 rounded-xl px-3 py-3 text-sm">
          <p className="font-medium text-vert-800">Employé créé ✓ Communiquez-lui ces identifiants :</p>
          <div className="mt-1 font-mono text-gray-700">Identifiant : {state.identifiant}<br />Mot de passe : <strong>{state.tempPassword}</strong></div>
          <p className="text-xs text-gray-500 mt-1">Il pourra le changer après connexion. Ce mot de passe ne sera plus affiché.</p>
        </div>
      )}
      {state.ok && state.existing && (
        <div className="mt-3 bg-blue-50 border border-blue-200 rounded-xl px-3 py-2 text-sm text-blue-800">
          Compte existant ({state.identifiant}) ajouté à l&apos;équipe. La personne utilise son mot de passe habituel.
        </div>
      )}
    </div>
  );
}
