'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, PawPrint } from 'lucide-react';
import { ESPECE_LABELS } from '@/lib/vetalert/data';

export default function NouvelAnimalPage() {
  const router = useRouter();
  const [chargement, setChargement] = useState(false);
  const [form, setForm] = useState({
    nom: '', espece: 'boeuf', race: '', sexe: 'male',
    ageAns: '', ageMois: '', poids: '', dateNaissance: '',
    etatSante: 'bonne_sante', notes: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChargement(true);
    await new Promise((r) => setTimeout(r, 1200));
    setChargement(false);
    router.push('/vetalert/animaux');
  };

  return (
    <div className="p-4 md:p-6 max-w-2xl mx-auto">
      <Link href="/vetalert/animaux"
        className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Retour à la liste
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
          <PawPrint className="w-5 h-5 text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
            Ajouter un animal
          </h1>
          <p className="text-gray-500 text-sm">Créez une nouvelle fiche animal</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 space-y-6">

        {/* Section : Identification */}
        <div>
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">
            🏷️ Identification
          </h2>
          <div className="grid grid-cols-1 gap-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Nom de l&apos;animal *</label>
                <input type="text" value={form.nom} onChange={(e) => setForm({ ...form, nom: e.target.value })}
                  placeholder="Ex: Boubou" className="input-field" required />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Espèce *</label>
                <select value={form.espece} onChange={(e) => setForm({ ...form, espece: e.target.value })} className="input-field" required>
                  {Object.entries(ESPECE_LABELS).map(([val, label]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Race</label>
                <input type="text" value={form.race} onChange={(e) => setForm({ ...form, race: e.target.value })}
                  placeholder="Ex: Gobra, Peul-Peul…" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Sexe *</label>
                <div className="flex rounded-xl p-1" style={{ background: '#e8f5ee' }}>
                  {[{ val: 'male', label: '♂ Mâle' }, { val: 'femelle', label: '♀ Femelle' }].map((s) => (
                    <button key={s.val} type="button"
                      onClick={() => setForm({ ...form, sexe: s.val })}
                      className="flex-1 py-2 rounded-lg text-sm font-bold transition-all"
                      style={form.sexe === s.val ? { background: '#0a6342', color: 'white' } : { color: '#4b5563' }}>
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Section : Caractéristiques */}
        <div>
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">⚖️ Caractéristiques</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Âge (années)</label>
              <input type="number" min="0" max="30" value={form.ageAns}
                onChange={(e) => setForm({ ...form, ageAns: e.target.value })}
                placeholder="0" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Âge (mois)</label>
              <input type="number" min="0" max="11" value={form.ageMois}
                onChange={(e) => setForm({ ...form, ageMois: e.target.value })}
                placeholder="0" className="input-field" />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Poids (kg)</label>
              <input type="number" min="0" step="0.1" value={form.poids}
                onChange={(e) => setForm({ ...form, poids: e.target.value })}
                placeholder="Ex: 45" className="input-field" />
            </div>
            <div className="col-span-2 md:col-span-3">
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date de naissance</label>
              <input type="date" value={form.dateNaissance}
                onChange={(e) => setForm({ ...form, dateNaissance: e.target.value })}
                className="input-field" />
            </div>
          </div>
        </div>

        {/* Section : État de santé */}
        <div>
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">❤️ État de santé</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
            {[
              { val: 'bonne_sante', label: '✅ Bonne santé',  color: '#0a6342', bg: '#d9f2e3' },
              { val: 'surveillance', label: '👁️ Surveillance', color: '#b45309', bg: '#fef3c7' },
              { val: 'en_traitement', label: '💊 En traitement', color: '#1d4ed8', bg: '#dbeafe' },
              { val: 'malade', label: '🤒 Malade',           color: '#dc2626', bg: '#fee2e2' },
              { val: 'critique', label: '🚨 Critique',        color: '#7f1d1d', bg: '#fca5a5' },
            ].map((s) => (
              <button key={s.val} type="button"
                onClick={() => setForm({ ...form, etatSante: s.val })}
                className="px-3 py-2.5 rounded-xl text-sm font-bold border-2 transition-all"
                style={form.etatSante === s.val
                  ? { background: s.color, color: 'white', borderColor: s.color }
                  : { background: s.bg, color: s.color, borderColor: `${s.color}40` }}>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Section : Notes */}
        <div>
          <h2 className="text-sm font-black text-gray-500 uppercase tracking-wider mb-4">📝 Notes</h2>
          <textarea value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
            placeholder="Observations, remarques particulières sur l'animal…"
            className="input-field resize-none" rows={3} />
        </div>

        {/* Boutons */}
        <div className="flex gap-3 pt-2">
          <Link href="/vetalert/animaux"
            className="flex-1 py-3.5 rounded-xl font-bold text-center border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
            Annuler
          </Link>
          <button type="submit" disabled={chargement}
            className="flex-1 py-3.5 rounded-xl font-black text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
            style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
            {chargement ? (
              <><Loader2 className="w-5 h-5 animate-spin" /> Enregistrement...</>
            ) : (
              '✓ Ajouter l\'animal'
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
