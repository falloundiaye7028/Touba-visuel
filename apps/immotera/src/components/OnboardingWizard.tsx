"use client";

import { type FormEvent, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Building2, Check, FileSpreadsheet, House, LoaderCircle, Users } from "lucide-react";

const steps = ["Organisation", "Propriétaire", "Premier bien", "Import", "Terminé"];
const initialDraft = {
  organizationName: "IMMOTERA Demo Dakar", country: "SN", currency: "XOF", organizationPhone: "+221 ",
  ownerFirstName: "Aminata", ownerLastName: "Fall", ownerPhone: "+221 77 450 18 32", ownerEmail: "",
  propertyName: "Villa Ndar", propertyType: "Villa", monthlyRent: "850000", propertyAddress: "Route des Almadies, Dakar",
};

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState(initialDraft);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const update = (field: keyof typeof draft, value: string) => setDraft((current) => ({ ...current, [field]: value }));
  const next = async (event?: FormEvent) => {
    event?.preventDefault();
    if (step < 4) { setStep((value) => value + 1); return; }
    setSaving(true); setError("");
    try {
      const response = await fetch("/api/onboarding", { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ ...draft, monthlyRent: Number(draft.monthlyRent) }) });
      if (!response.ok) { const payload = await response.json() as { error?: string }; throw new Error(payload.error ?? "Configuration impossible"); }
      router.push("/dashboard"); router.refresh();
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Une erreur est survenue"); }
    finally { setSaving(false); }
  };

  return <div className="onboarding-card"><aside><div className="landing-brand"><span><Building2 size={19}/></span>IMMOTERA</div><h2>Configurons votre espace.</h2><p>Quelques informations suffisent pour commencer à gérer votre activité.</p><div>{steps.map((label,index)=><span className={step>=index?"active":""} key={label}><i>{step>index?<Check size={12}/>:index+1}</i>{label}</span>)}</div></aside><form onSubmit={(event)=>void next(event)}><p className="eyebrow">ÉTAPE {step+1} SUR 5</p>
    {step===0&&<><h1>Votre organisation</h1><p>Ces informations apparaîtront sur vos documents et rapports.</p><label><span>Nom de l’agence</span><input required value={draft.organizationName} onChange={(event)=>update("organizationName",event.target.value)}/></label><div className="form-two"><label><span>Pays</span><select value={draft.country} onChange={(event)=>update("country",event.target.value)}><option value="SN">Sénégal</option><option value="CI">Côte d’Ivoire</option></select></label><label><span>Devise</span><select value={draft.currency} onChange={(event)=>update("currency",event.target.value)}><option value="XOF">XOF — FCFA</option><option value="EUR">EUR — Euro</option></select></label></div><label><span>Téléphone</span><input value={draft.organizationPhone} onChange={(event)=>update("organizationPhone",event.target.value)}/></label></>}
    {step===1&&<><div className="step-icon"><Users/></div><h1>Premier propriétaire</h1><p>Associez les biens à leur propriétaire pour calculer les reversements.</p><div className="form-two"><label><span>Prénom</span><input value={draft.ownerFirstName} onChange={(event)=>update("ownerFirstName",event.target.value)}/></label><label><span>Nom</span><input required value={draft.ownerLastName} onChange={(event)=>update("ownerLastName",event.target.value)}/></label></div><label><span>Téléphone</span><input value={draft.ownerPhone} onChange={(event)=>update("ownerPhone",event.target.value)}/></label><label><span>Email</span><input type="email" value={draft.ownerEmail} onChange={(event)=>update("ownerEmail",event.target.value)} placeholder="proprietaire@exemple.sn"/></label></>}
    {step===2&&<><div className="step-icon"><House/></div><h1>Votre premier bien</h1><p>Ajoutez les informations essentielles. Vous pourrez compléter la fiche ensuite.</p><label><span>Nom du bien</span><input required value={draft.propertyName} onChange={(event)=>update("propertyName",event.target.value)}/></label><div className="form-two"><label><span>Type</span><select value={draft.propertyType} onChange={(event)=>update("propertyType",event.target.value)}><option>Villa</option><option>Appartement</option><option>Immeuble</option></select></label><label><span>Loyer mensuel</span><input inputMode="numeric" value={draft.monthlyRent} onChange={(event)=>update("monthlyRent",event.target.value.replace(/\D/g,""))}/></label></div><label><span>Adresse</span><input value={draft.propertyAddress} onChange={(event)=>update("propertyAddress",event.target.value)}/></label></>}
    {step===3&&<><div className="step-icon"><FileSpreadsheet/></div><h1>Avez-vous déjà des données ?</h1><p>Importez plus tard vos biens, propriétaires, locataires et contrats depuis CSV ou Excel.</p><button type="button" className="onboarding-import"><FileSpreadsheet size={22}/><span><b>Importer un fichier</b><small>CSV ou XLSX · 10 Mo maximum</small></span></button><small className="skip-note">Cette étape est facultative.</small></>}
    {step===4&&<><div className="completion-icon"><Check/></div><h1>Votre espace est prêt.</h1><p>Vous avez posé les bases de {draft.organizationName}. Validez pour créer l’organisation et son premier portefeuille.</p><div className="completion-list"><span><Check/>Organisation configurée</span><span><Check/>Propriétaire prêt à être créé</span><span><Check/>Premier bien prêt à être enregistré</span></div>{error&&<p className="form-error">{error}</p>}</>}
    <footer>{step>0&&step<4?<button type="button" className="button secondary" onClick={()=>setStep((value)=>value-1)}>Retour</button>:<span/>}<button className="button primary" disabled={saving}>{saving?<LoaderCircle className="spin" size={15}/>:null}{step===4?"Ouvrir mon dashboard":"Continuer"}<ArrowRight size={15}/></button></footer>
  </form></div>;
}
