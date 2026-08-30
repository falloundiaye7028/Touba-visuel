import Link from "next/link";
import { Building2 } from "lucide-react";
import { AuthForm } from "@/components/AuthForm";

export default function ForgotPage(){return <main className="auth-page simple-auth"><section className="auth-main"><div><Link href="/" className="landing-brand"><span><Building2 size={19}/></span>IMMOTERA</Link><p className="eyebrow">RÉINITIALISATION</p><h1>Retrouvez votre accès.</h1><p>Saisissez votre adresse. Le lien reçu expirera après 30 minutes.</p><AuthForm mode="forgot"/><p className="auth-switch"><Link href="/login">← Retour à la connexion</Link></p></div></section></main>}
