'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stethoscope, ArrowLeft, Loader2, CheckCircle } from 'lucide-react';

const PAYS_AFRIQUE = ['Sénégal', 'Mali', 'Guinée', 'Côte d\'Ivoire', 'Burkina Faso', 'Niger', 'Mauritanie', 'Gambie', 'Ghana', 'Cameroun'];

export default function InscriptionPage() {
  const router = useRouter();
  const [etape, setEtape] = useState<1 | 2>(1);
  const [role, setRole] = useState<'ELEVEUR' | 'VETERINAIRE'>('ELEVEUR');
  const [chargement, setChargement] = useState(false);
  const [form, setForm] = useState({
    nom: '', email: '', telephone: '', motDePasse: '', confirmerMdp: '',
    // éleveur
    nomFerme: '', localisation: '', pays: 'Sénégal',
    // vétérinaire
    specialite: '', numeroOrdre: '', cabinet: '',
  });

  const handleEtape1 = (e: React.FormEvent) => {
    e.preventDefault();
    setEtape(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChargement(true);
    await new Promise((r) => setTimeout(r, 1500));
    setChargement(false);
    router.push('/vetalert/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 md:p-8" style={{ background: '#f0fdf4' }}>
      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/vetalert" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour
          </Link>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>VetAlert</span>
          </div>
        </div>

        {/* Indicateur d'étapes */}
        <div className="flex items-center gap-3 mb-8">
          {[1, 2].map((n) => (
            <div key={n} className="flex items-center gap-3 flex-1">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold flex-shrink-0 transition-all"
                style={etape >= n
                  ? { background: '#0a6342', color: 'white' }
                  : { background: '#e5e7eb', color: '#6b7280' }}>
                {etape > n ? <CheckCircle className="w-4 h-4" /> : n}
              </div>
              <div>
                <div className="text-xs font-semibold" style={{ color: etape >= n ? '#0a6342' : '#9ca3af' }}>
                  {n === 1 ? 'Informations de base' : 'Profil professionnel'}
                </div>
              </div>
              {n < 2 && <div className="flex-1 h-0.5 ml-2" style={{ background: etape > 1 ? '#0a6342' : '#e5e7eb' }} />}
            </div>
          ))}
        </div>

        <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm">
          <h2 className="text-2xl font-black text-gray-900 mb-1" style={{ fontFamily: 'var(--font-display)' }}>
            {etape === 1 ? 'Créer votre compte' : 'Votre profil professionnel'}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {etape === 1 ? '30 jours d\'essai Premium gratuit — sans carte bancaire' : 'Aidez-nous à personnaliser votre expérience'}
          </p>

          {/* Étape 1 */}
          {etape === 1 && (
            <form onSubmit={handleEtape1} className="space-y-4">
              {/* Rôle */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Je suis un(e)…</label>
                <div className="flex rounded-xl p-1" style={{ background: '#e8f5ee' }}>
                  {(['ELEVEUR', 'VETERINAIRE'] as const).map((r) => (
                    <button key={r} type="button" onClick={() => setRole(r)}
                      className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                      style={role === r ? { background: '#0a6342', color: 'white', boxShadow: '0 2px 8px rgba(10,99,66,0.3)' } : { color: '#4b5563' }}>
                      {r === 'ELEVEUR' ? '👨‍🌾 Éleveur' : '🩺 Vétérinaire'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom complet</label>
                  <input type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                    placeholder="Ex: Mamadou Ndiaye" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresse email</label>
                  <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                    placeholder="votre@email.com" className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Téléphone (WhatsApp)</label>
                  <input type="tel" value={form.telephone} onChange={(e) => setForm({ ...form, telephone: e.target.value })}
                    placeholder="+221 77 000 00 00" className="input-field" required />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe</label>
                    <input type="password" value={form.motDePasse} onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
                      placeholder="8 caractères min." className="input-field" required minLength={8} />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Confirmer</label>
                    <input type="password" value={form.confirmerMdp} onChange={(e) => setForm({ ...form, confirmerMdp: e.target.value })}
                      placeholder="Répéter" className="input-field" required />
                  </div>
                </div>
              </div>

              <button type="submit"
                className="w-full py-3.5 rounded-xl font-black text-white transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
                Continuer →
              </button>
            </form>
          )}

          {/* Étape 2 */}
          {etape === 2 && (
            <form onSubmit={handleSubmit} className="space-y-4">
              {role === 'ELEVEUR' ? (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom de votre ferme / élevage</label>
                    <input type="text" value={form.nomFerme} onChange={(e) => setForm({ ...form, nomFerme: e.target.value })}
                      placeholder="Ex: Ferme Ndiaye — Kaolack" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Localisation</label>
                    <input type="text" value={form.localisation} onChange={(e) => setForm({ ...form, localisation: e.target.value })}
                      placeholder="Ville / Région" className="input-field" />
                  </div>
                </>
              ) : (
                <>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Spécialité</label>
                    <select value={form.specialite} onChange={(e) => setForm({ ...form, specialite: e.target.value })} className="input-field">
                      <option value="">Sélectionner…</option>
                      {['Bovins & Caprins', 'Équidés', 'Petits ruminants', 'Volailles', 'Général'].map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Numéro d&apos;ordre</label>
                    <input type="text" value={form.numeroOrdre} onChange={(e) => setForm({ ...form, numeroOrdre: e.target.value })}
                      placeholder="Ex: ONVS-2021-0456" className="input-field" />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1.5">Cabinet / Clinique</label>
                    <input type="text" value={form.cabinet} onChange={(e) => setForm({ ...form, cabinet: e.target.value })}
                      placeholder="Nom de votre cabinet vétérinaire" className="input-field" />
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Pays</label>
                <select value={form.pays} onChange={(e) => setForm({ ...form, pays: e.target.value })} className="input-field">
                  {PAYS_AFRIQUE.map((p) => <option key={p} value={p}>{p}</option>)}
                </select>
              </div>

              {/* CGU */}
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" required className="mt-0.5 accent-green-700" />
                <span className="text-sm text-gray-600">
                  J&apos;accepte les{' '}
                  <a href="#" className="font-semibold" style={{ color: '#0a6342' }}>Conditions d&apos;utilisation</a>
                  {' '}et la{' '}
                  <a href="#" className="font-semibold" style={{ color: '#0a6342' }}>Politique de confidentialité</a>
                </span>
              </label>

              <div className="flex gap-3">
                <button type="button" onClick={() => setEtape(1)}
                  className="flex-1 py-3.5 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  ← Retour
                </button>
                <button type="submit" disabled={chargement}
                  className="flex-1 py-3.5 rounded-xl font-black text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
                  style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
                  {chargement ? (
                    <><Loader2 className="w-5 h-5 animate-spin" /> Création...</>
                  ) : (
                    'Créer mon compte ✓'
                  )}
                </button>
              </div>
            </form>
          )}
        </div>

        <p className="text-center text-gray-500 text-sm mt-6">
          Déjà inscrit ?{' '}
          <Link href="/vetalert/auth/connexion" className="font-bold" style={{ color: '#0a6342' }}>
            Se connecter
          </Link>
        </p>
      </div>
    </div>
  );
}
