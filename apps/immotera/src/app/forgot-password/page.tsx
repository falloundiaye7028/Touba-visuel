import Link from "next/link";
import { AuthForm } from "@/components/AuthForm";
import { BrandLogo } from "@/components/BrandLogo";

export default function ForgotPage(){return <main className="auth-page simple-auth ii-auth-page"><section className="auth-main"><div><Link href="/" className="ii-simple-auth-brand" aria-label="Retour à l’accueil"><BrandLogo variant="wordmark"/></Link><p className="eyebrow">RÉINITIALISATION</p><h1>Retrouvez votre accès.</h1><p>Saisissez votre adresse. Le lien reçu expirera après 30 minutes.</p><AuthForm mode="forgot"/><p className="auth-switch"><Link href="/login">← Retour à la connexion</Link></p></div></section></main>}
