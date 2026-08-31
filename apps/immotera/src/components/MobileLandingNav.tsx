"use client";

import Link from "next/link";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";

export function MobileLandingNav() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return;
    const close = (event: KeyboardEvent) => event.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [open]);
  return <div className="ii-mobile-nav">
    <button className="ii-menu-button" type="button" aria-label={open ? "Fermer la navigation" : "Ouvrir la navigation"} aria-expanded={open} aria-controls="mobile-site-nav" onClick={() => setOpen((current) => !current)}>{open ? <X size={20}/> : <Menu size={20}/>}</button>
    {open && <nav id="mobile-site-nav" aria-label="Navigation mobile"><a href="#produit" onClick={()=>setOpen(false)}>Produit</a><a href="#intelligence" onClick={()=>setOpen(false)}>Intelligence AI</a><a href="#solutions" onClick={()=>setOpen(false)}>Solutions</a><a href="#tarifs" onClick={()=>setOpen(false)}>Tarifs</a><Link href="/login">Se connecter</Link><Link className="ii-button" href="/register" data-analytics="hero_start_trial">Commencer gratuitement</Link></nav>}
  </div>;
}
