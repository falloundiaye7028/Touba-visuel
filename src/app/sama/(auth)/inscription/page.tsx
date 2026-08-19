"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { registerAction, type ActionState } from "@/lib/sama/actions/account";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import { ACTIVITY_TYPES, COUNTRIES, SN_CITIES } from "@/lib/sama/constants";

const initial: ActionState = {};

export default function InscriptionPage() {
  const router = useRouter();
  const [state, formAction] = useActionState(registerAction, initial);

  useEffect(() => {
    if (state.ok && state.identifiant) {
      const pwd = (document.getElementById("password") as HTMLInputElement | null)?.value ?? "";
      signIn("credentials", {
        identifiant: state.identifiant,
        password: pwd,
        redirect: false,
      }).then((res) => {
        if (res?.ok) router.push("/sama/onboarding");
        else router.push("/sama/connexion");
      });
    }
  }, [state, router]);

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Créer votre compte</h1>
      <p className="text-sm text-gray-500 mt-1">Gratuit · 14 jours d&apos;essai Business · sans carte bancaire</p>

      <form action={formAction} className="mt-5 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Prénom" required>
            <input name="prenom" className="input-field" required autoComplete="given-name" />
          </Field>
          <Field label="Nom" required>
            <input name="nom" className="input-field" required autoComplete="family-name" />
          </Field>
        </div>
        <Field label="Nom de l'entreprise" required>
          <input name="entreprise" className="input-field" placeholder="Ex : Sama Fashion" required />
        </Field>
        <Field label="Téléphone" required hint="Sert d'identifiant de connexion">
          <input name="phone" type="tel" className="input-field" placeholder="77 123 45 67" required autoComplete="tel" />
        </Field>
        <Field label="Email (facultatif)">
          <input name="email" type="email" className="input-field" placeholder="vous@exemple.com" autoComplete="email" />
        </Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Type d'activité">
            <select name="activityType" className="input-field">
              <option value="">Choisir…</option>
              {ACTIVITY_TYPES.map((a) => <option key={a} value={a}>{a}</option>)}
            </select>
          </Field>
          <Field label="Ville">
            <select name="city" className="input-field" defaultValue="Dakar">
              {SN_CITIES.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Pays">
            <select name="country" className="input-field" defaultValue="SN">
              {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Devise">
            <select name="currency" className="input-field" defaultValue="XOF">
              <option value="XOF">FCFA (XOF)</option>
              <option value="XAF">FCFA (XAF)</option>
              <option value="MRU">Ouguiya (MRU)</option>
            </select>
          </Field>
        </div>
        <Field label="Mot de passe" required>
          <input id="password" name="password" type="password" className="input-field" placeholder="••••••" required minLength={6} autoComplete="new-password" />
        </Field>

        {state.error && (
          <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>
        )}

        <SubmitButton className="btn-primary w-full" pendingLabel="Création…">
          Commencer gratuitement
        </SubmitButton>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Déjà un compte ?{" "}
        <Link href="/sama/connexion" className="text-vert-700 font-semibold">Se connecter</Link>
      </p>
    </div>
  );
}
