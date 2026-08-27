"use client";

import { FormEvent, useState } from "react";
import { signIn, signOut } from "next-auth/react";
import { ArrowLeft, Check, Eye, EyeOff, LockKeyhole, ShieldCheck } from "lucide-react";

export default function TckConnexionPage() {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setLoading(true);
    setError(null);
    const form = new FormData(event.currentTarget);
    try {
      const result = await signIn("credentials", {
        identifiant: String(form.get("identifiant") || "").trim(),
        password: String(form.get("password") || ""),
        redirect: false,
        callbackUrl: "/tck-connect",
      });
      if (!result?.ok) {
        setError("Identifiants incorrects. Vérifiez l’e-mail ou le téléphone et le mot de passe.");
        return;
      }
      const access = await fetch("/api/tck/bootstrap", { cache: "no-store" });
      if (access.ok) {
        window.location.assign("/tck-connect");
        return;
      }
      await signOut({ redirect: false });
      setError(access.status === 403 ? "Compte reconnu, mais l’accès TCK n’est pas encore activé par un administrateur." : "Le service sécurisé est temporairement indisponible.");
    } catch {
      setError("Connexion impossible pour le moment. Réessayez dans quelques instants.");
    } finally {
      setLoading(false);
    }
  }

  return <main className="tck-login-shell">
    <section className="tck-login-story">
      <a href="/tck-connect"><ArrowLeft size={16} />Retour à la plateforme</a>
      <div className="tck-login-brand"><span>TCK</span><div><strong>TCK CONNECT</strong><small>Touba Ca Kanam</small></div></div>
      <div className="tck-login-message"><span>Système numérique central</span><h1>Une gouvernance unifiée,<br />des opérations traçables.</h1><p>L’espace sécurisé relie les membres, les collecteurs, les commissions et les contrôleurs autour d’une donnée unique.</p></div>
      <ul><li><Check size={15} />Permissions adaptées à chaque responsabilité</li><li><Check size={15} />Journal d’audit central et immuable</li><li><Check size={15} />Indicateurs publics sans données personnelles</li></ul>
      <footer><ShieldCheck size={17} />Accès réservé aux comptes habilités</footer>
    </section>

    <section className="tck-login-panel">
      <div className="tck-login-card">
        <span className="tck-login-icon"><LockKeyhole size={23} /></span>
        <p className="tck-login-eyebrow">Accès professionnel</p>
        <h2>Se connecter à TCK CONNECT</h2>
        <p className="tck-login-copy">Utilisez le compte qui vous a été attribué par l’administrateur TCK.</p>
        <form onSubmit={submit}>
          <label>Adresse e-mail ou téléphone<input name="identifiant" required autoComplete="username" placeholder="agent@tck.sn" /></label>
          <label>Mot de passe<div className="tck-password"><input name="password" required minLength={8} type={showPassword ? "text" : "password"} autoComplete="current-password" placeholder="••••••••" /><button type="button" onClick={() => setShowPassword((shown) => !shown)} aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}>{showPassword ? <EyeOff size={17} /> : <Eye size={17} />}</button></div></label>
          {error && <div className="tck-login-error" role="alert">{error}</div>}
          <button className="tck-login-submit" type="submit" disabled={loading}>{loading ? "Connexion sécurisée…" : "Se connecter"}</button>
        </form>
        <div className="tck-login-note"><ShieldCheck size={17} /><p><strong>Protection des accès</strong><span>Les droits sont vérifiés côté serveur à chaque opération.</span></p></div>
        <a className="tck-login-demo" href="/tck-connect">Continuer en mode démonstration</a>
      </div>
    </section>
  </main>;
}
