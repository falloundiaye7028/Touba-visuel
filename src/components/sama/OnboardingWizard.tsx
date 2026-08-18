"use client";

import { useActionState, useEffect, useState } from "react";
import { Check, Package, User, ShoppingCart, PartyPopper } from "lucide-react";
import { createProductAction } from "@/lib/sama/actions/products";
import { createCustomerAction } from "@/lib/sama/actions/customers";
import { completeOnboardingAction } from "@/lib/sama/actions/account";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import type { FormState } from "@/lib/sama/actions/products";

export default function OnboardingWizard({
  businessName, hasProduct, hasCustomer,
}: { businessName: string; hasProduct: boolean; hasCustomer: boolean }) {
  const [step, setStep] = useState(hasProduct ? (hasCustomer ? 3 : 2) : 1);
  const [prodState, prodAction] = useActionState(createProductAction, {} as FormState);
  const [custState, custAction] = useActionState(createCustomerAction, {} as FormState);

  useEffect(() => { if (prodState.ok) setStep(2); }, [prodState.ok]);
  useEffect(() => { if (custState.ok) setStep(3); }, [custState.ok]);

  const steps = [
    { n: 1, label: "Premier produit", icon: Package },
    { n: 2, label: "Premier client", icon: User },
    { n: 3, label: "C'est parti !", icon: ShoppingCart },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        {steps.map((s, i) => {
          const done = step > s.n;
          const active = step === s.n;
          const Icon = s.icon;
          return (
            <div key={s.n} className="flex-1 flex items-center">
              <div className="flex flex-col items-center">
                <div className={`w-9 h-9 rounded-full grid place-items-center ${done ? "bg-vert-600 text-white" : active ? "bg-vert-100 text-vert-700 ring-2 ring-vert-500" : "bg-gray-100 text-gray-400"}`}>
                  {done ? <Check className="w-4 h-4" /> : <Icon className="w-4 h-4" />}
                </div>
                <span className={`text-[10px] mt-1 ${active ? "text-vert-700 font-medium" : "text-gray-400"}`}>{s.label}</span>
              </div>
              {i < steps.length - 1 && <div className={`flex-1 h-0.5 mx-1 ${done ? "bg-vert-500" : "bg-gray-200"}`} />}
            </div>
          );
        })}
      </div>

      {step === 1 && (
        <form action={prodAction} className="space-y-3">
          <p className="text-sm text-gray-500">Ajoutez un article que vous vendez. Vous pourrez en ajouter d&apos;autres ensuite.</p>
          <Field label="Nom du produit" required><input name="name" className="input-field" placeholder="Ex : Sneakers Premium" required /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Prix de vente (FCFA)" required><input name="salePrice" type="number" min="0" className="input-field" required /></Field>
            <Field label="Stock initial"><input name="stock" type="number" min="0" className="input-field" defaultValue={0} /></Field>
          </div>
          {prodState.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{prodState.error}</div>}
          <SubmitButton className="btn-primary w-full">Ajouter le produit</SubmitButton>
        </form>
      )}

      {step === 2 && (
        <form action={custAction} className="space-y-3">
          <p className="text-sm text-gray-500">Ajoutez un premier client pour suivre ses achats.</p>
          <Field label="Nom du client" required><input name="name" className="input-field" placeholder="Ex : Fatou Ndiaye" required /></Field>
          <Field label="Téléphone"><input name="phone" type="tel" className="input-field" placeholder="77 123 45 67" /></Field>
          {custState.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{custState.error}</div>}
          <div className="flex gap-2">
            <SubmitButton className="btn-primary flex-1">Ajouter le client</SubmitButton>
            <button type="button" onClick={() => setStep(3)} className="btn-outline">Passer</button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="text-center py-4">
          <div className="w-16 h-16 rounded-2xl bg-vert-100 text-vert-700 grid place-items-center mx-auto mb-4">
            <PartyPopper className="w-8 h-8" />
          </div>
          <h2 className="text-lg font-bold text-gray-900">Félicitations ! 🎉</h2>
          <p className="text-sm text-gray-500 mt-1">Votre entreprise <strong>{businessName}</strong> est prête sur SAMA BUSINESS.</p>
          <form action={completeOnboardingAction} className="mt-5">
            <SubmitButton className="btn-primary w-full" pendingLabel="Ouverture…">Accéder au tableau de bord</SubmitButton>
          </form>
        </div>
      )}
    </div>
  );
}
