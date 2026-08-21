"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Field } from "@/components/sama/ui";

export default function ConnexionPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    const fd = new FormData(e.currentTarget);
    const res = await signIn("credentials", {
      identifiant: String(fd.get("identifiant") || ""),
      password: String(fd.get("password") || ""),
      redirect: false,
    });
    setLoading(false);
    if (res?.ok) router.push("/sama/dashboard");
    else setError("Identifiants incorrects. Vérifiez votre email/téléphone et mot de passe.");
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-900">Connexion</h1>
      <p className="text-sm text-gray-500 mt-1">Accédez à votre espace SAMA PILOT</p>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        <Field label="Email ou téléphone" required>
          <input name="identifiant" className="input-field" placeholder="77 123 45 67" required autoComplete="username" />
        </Field>
        <Field label="Mot de passe" required>
          <input name="password" type="password" className="input-field" placeholder="••••••" required autoComplete="current-password" />
        </Field>

        {error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{error}</div>}

        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <p className="text-center text-sm text-gray-500 mt-4">
        Pas encore de compte ?{" "}
        <Link href="/sama/inscription" className="text-vert-700 font-semibold">Créer un compte</Link>
      </p>
    </div>
  );
}
