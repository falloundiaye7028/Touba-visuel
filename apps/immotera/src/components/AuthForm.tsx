"use client";

import { type FormEvent, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Check, Eye, EyeOff, LoaderCircle } from "lucide-react";

export function AuthForm({ mode }: { mode: "login" | "register" | "forgot" }) {
  const router = useRouter();
  const [loading,setLoading]=useState(false); const [error,setError]=useState(""); const [success,setSuccess]=useState(""); const [show,setShow]=useState(false);
  const submit=async(event:FormEvent<HTMLFormElement>)=>{event.preventDefault();setLoading(true);setError("");const data=new FormData(event.currentTarget);const email=String(data.get("email"));const password=String(data.get("password")??"");
    try { if(mode==="forgot"){await new Promise((resolve)=>setTimeout(resolve,500));setSuccess("Si cette adresse existe, un lien de réinitialisation a été envoyé.");return}
      if(mode==="register"){const response=await fetch("/api/register",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({name:String(data.get("name")),email,password})});if(!response.ok){const payload=await response.json() as {error?:string};throw new Error(payload.error??"Inscription impossible")}await signIn("credentials",{email,password,redirect:false});router.push("/onboarding");return}
      const result=await signIn("credentials",{email,password,redirect:false});if(result?.error)throw new Error("Email ou mot de passe incorrect");router.push("/dashboard");router.refresh();
    } catch(cause){setError(cause instanceof Error?cause.message:"Une erreur est survenue")} finally {setLoading(false)} };
  return <form className="auth-form" onSubmit={submit}>{mode==="register"&&<label><span>Nom complet</span><input name="name" required minLength={2} placeholder="Mamadou Kane" autoComplete="name"/></label>}<label><span>Adresse email</span><input name="email" required type="email" placeholder="vous@agence.sn" autoComplete="email" defaultValue={mode==="login"?"demo@intelligenceimmobilier.com":""}/></label>{mode!=="forgot"&&<label><span>Mot de passe</span><div className="password-field"><input name="password" required minLength={8} type={show?"text":"password"} placeholder="Au moins 8 caractères" defaultValue={mode==="login"?"Demo2026!":""} autoComplete={mode==="login"?"current-password":"new-password"}/><button type="button" onClick={()=>setShow((value)=>!value)} aria-label={show?"Masquer le mot de passe":"Afficher le mot de passe"}>{show?<EyeOff size={16}/>:<Eye size={16}/>}</button></div></label>}{mode==="login"&&<div className="form-meta"><label><input type="checkbox"/> Se souvenir de moi</label><Link href="/forgot-password">Mot de passe oublié ?</Link></div>}{mode==="register"&&<p className="password-hint"><Check size={13}/>10 caractères, une majuscule et un chiffre recommandés.</p>}{error&&<p className="form-error">{error}</p>}{success&&<p className="form-success">{success}</p>}<button className="auth-submit" disabled={loading}>{loading?<LoaderCircle className="spin" size={17}/>:null}{mode==="login"?"Se connecter":mode==="register"?"Créer mon espace":"Envoyer le lien"}<ArrowRight size={17}/></button></form>;
}
