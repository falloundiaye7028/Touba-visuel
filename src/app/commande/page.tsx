"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { ShoppingBag, Upload, AlertCircle, CheckCircle } from "lucide-react";
import { CATALOGUE, getAllSupports } from "@/lib/supports";
import { formatPrix } from "@/lib/utils";
import type { PaymentMethod } from "@/types";

const METHODES_PAIEMENT: { value: PaymentMethod; label: string; desc: string; couleur: string }[] = [
  { value: "CARTE_BANCAIRE", label: "Carte Bancaire", desc: "Visa / Mastercard via Stripe (sécurisé)", couleur: "border-blue-400 bg-blue-50 text-blue-700" },
  { value: "WAVE", label: "Wave", desc: "Paiement mobile Wave (Sénégal)", couleur: "border-teal-400 bg-teal-50 text-teal-700" },
  { value: "ORANGE_MONEY", label: "Orange Money", desc: "Paiement mobile Orange Money", couleur: "border-orange-400 bg-orange-50 text-orange-700" },
  { value: "LIVRAISON", label: "À la livraison", desc: "Payer en cash à la réception", couleur: "border-green-400 bg-green-50 text-green-700" },
];

function CommandeForm() {
  const searchParams = useSearchParams();
  const supportSlug = searchParams.get("support") ?? "";
  const categorieSlug = searchParams.get("categorie") ?? "";

  const allSupports = getAllSupports();
  const supportPreselect = allSupports.find((s) => s.slug === supportSlug);

  const [form, setForm] = useState({
    clientName: "",
    clientEmail: "",
    clientPhone: "",
    categorie: categorieSlug || "",
    support: supportSlug || "",
    quantity: 1,
    format: "",
    description: "",
    paymentMethod: "" as PaymentMethod | "",
    livraison: false,
    adresseLivraison: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const categorieSelectionnee = CATALOGUE.find((c) => c.slug === form.categorie);
  const supportSelectionne = allSupports.find((s) => s.slug === form.support) ?? supportPreselect;
  const prixUnitaire = supportSelectionne?.prixBase ?? 0;
  const prixTotal = prixUnitaire * form.quantity;

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.paymentMethod) {
      setError("Veuillez sélectionner un mode de paiement.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          prixUnitaire,
          prixTotal,
          category: form.categorie,
        }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Erreur lors de la commande");

      if (form.paymentMethod === "CARTE_BANCAIRE" && data.stripeUrl) {
        window.location.href = data.stripeUrl;
        return;
      }

      if (form.paymentMethod === "WAVE" && data.waveUrl) {
        window.location.href = data.waveUrl;
        return;
      }

      setSuccess(data.orderNumber);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-xl p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle className="text-green-600" size={32} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Commande reçue !</h2>
          <p className="text-gray-500 mb-4">
            Votre commande <strong className="text-vert-700">{success}</strong> a été enregistrée.
            Vous recevrez une confirmation par email et WhatsApp.
          </p>
          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-600">
              Numéro de commande : <strong>{success}</strong>
            </p>
          </div>
          <div className="flex flex-col gap-3">
            <Link href={`/suivi?commande=${success}`} className="btn-primary justify-center">
              Suivre ma commande
            </Link>
            <Link href="/" className="btn-outline justify-center">
              Retour à l&apos;accueil
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="bg-vert-900 text-white py-10">
        <div className="max-w-4xl mx-auto px-4">
          <nav className="text-vert-400 text-sm mb-4">
            <Link href="/" className="hover:text-or-400">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Passer une commande</span>
          </nav>
          <div className="flex items-center gap-3">
            <ShoppingBag size={28} className="text-or-400" />
            <h1 className="text-3xl font-bold">Passer une commande</h1>
          </div>
          <p className="text-vert-300 mt-2">
            Remplissez le formulaire ci-dessous. Notre équipe vous contactera sous 2h.
          </p>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-10">
        <form onSubmit={handleSubmit} className="grid lg:grid-cols-3 gap-8">
          {/* Formulaire principal */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations client */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Vos informations</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nom complet *</label>
                  <input name="clientName" value={form.clientName} onChange={handleChange} required
                    className="input-field" placeholder="Mamadou Diallo" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Téléphone / WhatsApp *</label>
                  <input name="clientPhone" value={form.clientPhone} onChange={handleChange} required
                    className="input-field" placeholder="+221 77 800 17 17" type="tel" />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
                  <input name="clientEmail" value={form.clientEmail} onChange={handleChange} required
                    className="input-field" placeholder="email@exemple.com" type="email" />
                </div>
              </div>
            </div>

            {/* Sélection du support */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-5">Votre support</h2>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                  <select name="categorie" value={form.categorie} onChange={handleChange} required className="input-field">
                    <option value="">— Choisir une catégorie —</option>
                    {CATALOGUE.map((c) => (
                      <option key={c.slug} value={c.slug}>{c.emoji} {c.nom}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Support *</label>
                  <select name="support" value={form.support} onChange={handleChange} required className="input-field"
                    disabled={!form.categorie}>
                    <option value="">— Choisir un support —</option>
                    {(categorieSelectionnee?.supports ?? []).map((s) => (
                      <option key={s.slug} value={s.slug}>{s.emoji} {s.nom} — {formatPrix(s.prixBase)} / {s.unite}</option>
                    ))}
                  </select>
                </div>
                {supportSelectionne?.formats && supportSelectionne.formats.length > 0 && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Format</label>
                    <select name="format" value={form.format} onChange={handleChange} className="input-field">
                      <option value="">— Choisir un format —</option>
                      {supportSelectionne.formats.map((f) => (
                        <option key={f} value={f}>{f}</option>
                      ))}
                    </select>
                  </div>
                )}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantité *</label>
                  <input name="quantity" value={form.quantity} onChange={handleChange} required
                    className="input-field" type="number" min={1} max={10000} />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description / Instructions *</label>
                  <textarea name="description" value={form.description} onChange={handleChange} required
                    className="input-field resize-none" rows={4}
                    placeholder="Décrivez votre projet, vos couleurs, vos textes, vos préférences... Plus vous êtes précis, meilleur sera le résultat." />
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <Upload size={14} className="inline mr-1" />
                    Fichiers (lien WeTransfer, Drive, Dropbox...)
                  </label>
                  <input name="fileUrl" onChange={handleChange} className="input-field"
                    placeholder="https://wetransfer.com/..." type="url" />
                  <p className="text-xs text-gray-400 mt-1">
                    Vous pouvez aussi envoyer vos fichiers par WhatsApp après la commande.
                  </p>
                </div>
              </div>
            </div>

            {/* Livraison */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Livraison</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="livraison" checked={form.livraison}
                  onChange={handleChange} className="w-5 h-5 accent-vert-600 rounded" />
                <div>
                  <span className="font-medium text-gray-800">Je souhaite être livré</span>
                  <p className="text-gray-500 text-xs">Des frais de livraison s&apos;appliquent selon la destination</p>
                </div>
              </label>
              {form.livraison && (
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Adresse de livraison *</label>
                  <textarea name="adresseLivraison" value={form.adresseLivraison} onChange={handleChange}
                    className="input-field resize-none" rows={2}
                    placeholder="Quartier, ville, pays..." required={form.livraison} />
                </div>
              )}
            </div>

            {/* Mode de paiement */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Mode de paiement *</h2>
              <div className="grid sm:grid-cols-2 gap-3">
                {METHODES_PAIEMENT.map((m) => (
                  <label key={m.value}
                    className={`flex items-start gap-3 border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      form.paymentMethod === m.value
                        ? m.couleur + " border-current"
                        : "border-gray-200 hover:border-gray-300 bg-white"
                    }`}>
                    <input type="radio" name="paymentMethod" value={m.value}
                      checked={form.paymentMethod === m.value}
                      onChange={handleChange} className="mt-1 accent-vert-600" />
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{m.label}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{m.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Récapitulatif */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 p-6 sticky top-24">
              <h2 className="font-bold text-gray-900 text-lg mb-4">Récapitulatif</h2>

              {supportSelectionne ? (
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
                    <span className="text-3xl">{supportSelectionne.emoji}</span>
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{supportSelectionne.nom}</p>
                      {form.format && <p className="text-xs text-gray-500">{form.format}</p>}
                    </div>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between text-gray-600">
                      <span>Prix unitaire</span>
                      <span className="font-medium">{formatPrix(prixUnitaire)}</span>
                    </div>
                    <div className="flex justify-between text-gray-600">
                      <span>Quantité</span>
                      <span className="font-medium">× {form.quantity}</span>
                    </div>
                    {form.livraison && (
                      <div className="flex justify-between text-gray-600">
                        <span>Livraison</span>
                        <span className="text-orange-600 font-medium">Sur devis</span>
                      </div>
                    )}
                    <div className="border-t border-gray-100 pt-2 flex justify-between font-bold text-gray-900 text-base">
                      <span>Total estimé</span>
                      <span className="text-vert-700">{formatPrix(prixTotal)}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="bg-gray-50 rounded-xl p-4 text-center text-gray-400 text-sm mb-5">
                  Sélectionnez un support pour voir le prix
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-3 mb-4">
                  <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                  {error}
                </div>
              )}

              <button type="submit" disabled={loading}
                className="btn-gold w-full justify-center text-base py-3.5 disabled:opacity-60 disabled:cursor-not-allowed">
                {loading ? "Envoi en cours..." : "Confirmer la commande"}
              </button>

              <p className="text-center text-xs text-gray-400 mt-3">
                Paiement 100% sécurisé &bull; Confirmation par email et WhatsApp
              </p>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function CommandePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Chargement...</div>}>
      <CommandeForm />
    </Suspense>
  );
}
