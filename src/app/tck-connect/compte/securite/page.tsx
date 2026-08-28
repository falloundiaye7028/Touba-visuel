"use client";

import { FormEvent, useState } from "react";
import { signOut } from "next-auth/react";
import { ArrowLeft, Check, Eye, EyeOff, KeyRound, ShieldCheck } from "lucide-react";

export default function TckSecurityPage() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState(false);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    const form = new FormData(event.currentTarget);
    const currentPassword = String(form.get("currentPassword") || "");
    const newPassword = String(form.get("newPassword") || "");
    const confirmation = String(form.get("confirmation") || "");
    if (newPassword !== confirmation) {
      setError("La confirmation ne correspond pas au nouveau mot de passe.");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/tck/account/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const payload = await response.json() as { error?: string };
      if (!response.ok) throw new Error(payload.error || "Modification refusée");
      setSuccess(true);
      window.setTimeout(() => void signOut({ callbackUrl: "/tck-connect/connexion" }), 1400);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Le mot de passe n’a pas été modifié.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="tck-security-shell">
    <a className="tck-security-back" href="/tck-connect"><ArrowLeft size={16} />Retour au tableau de bord</a>
    <section className="tck-security-card">
      <span className="tck-security-icon"><KeyRound size={24} /></span>
      <p className="tck-security-eyebrow">Sécurité du compte</p>
      <h1>Changer le mot de passe</h1>
      <p className="tck-security-copy">Après la modification, cette session sera fermée et la prochaine connexion nécessitera votre nouveau mot de passe.</p>

      {success ? <div className="tck-security-success"><Check size={24} /><div><strong>Mot de passe modifié</strong><span>Déconnexion sécurisée en cours…</span></div></div> : <form onSubmit={submit}>
        <label>Mot de passe actuel<input name="currentPassword" type={showPasswords ? "text" : "password"} required autoComplete="current-password" /></label>
        <label>Nouveau mot de passe<input name="newPassword" type={showPasswords ? "text" : "password"} required minLength={12} autoComplete="new-password" /></label>
        <label>Confirmer le nouveau mot de passe<input name="confirmation" type={showPasswords ? "text" : "password"} required minLength={12} autoComplete="new-password" /></label>
        <button className="tck-security-toggle" type="button" onClick={() => setShowPasswords((shown) => !shown)}>{showPasswords ? <EyeOff size={16} /> : <Eye size={16} />}{showPasswords ? "Masquer les mots de passe" : "Afficher les mots de passe"}</button>
        <div className="tck-security-rules"><ShieldCheck size={18} /><span>12 caractères minimum, avec majuscule, minuscule, chiffre et caractère spécial.</span></div>
        {error && <div className="tck-security-error" role="alert">{error}</div>}
        <button className="tck-security-submit" type="submit" disabled={loading}>{loading ? "Sécurisation…" : "Enregistrer le nouveau mot de passe"}</button>
      </form>}
    </section>
  </main>;
}
