'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Filter, PawPrint } from 'lucide-react';
import { DEMO_ANIMAUX, ESPECE_LABELS, ETAT_SANTE_CONFIG } from '@/lib/vetalert/data';
import type { EtatSante, AnimalEspece } from '@/lib/vetalert/types';

const FILTRES_SANTE: { val: EtatSante | 'tous'; label: string }[] = [
  { val: 'tous', label: 'Tous' },
  { val: 'bonne_sante', label: 'Bonne santé' },
  { val: 'surveillance', label: 'Surveillance' },
  { val: 'en_traitement', label: 'En traitement' },
  { val: 'malade', label: 'Malade' },
  { val: 'critique', label: 'Critique' },
];

export default function AnimauxPage() {
  const [recherche, setRecherche] = useState('');
  const [filtreEtat, setFiltreEtat] = useState<EtatSante | 'tous'>('tous');

  const animauxFiltres = DEMO_ANIMAUX.filter((a) => {
    const rechercheOk = recherche === '' ||
      a.nom.toLowerCase().includes(recherche.toLowerCase()) ||
      a.espece.toLowerCase().includes(recherche.toLowerCase()) ||
      a.race.toLowerCase().includes(recherche.toLowerCase()) ||
      a.numeroId.toLowerCase().includes(recherche.toLowerCase());
    const etatOk = filtreEtat === 'tous' || a.etatSante === filtreEtat;
    return rechercheOk && etatOk;
  });

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
            🐄 Mes animaux
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{DEMO_ANIMAUX.length} animaux enregistrés</p>
        </div>
        <Link href="/vetalert/animaux/nouveau"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Ajouter un animal</span>
          <span className="sm:hidden">Ajouter</span>
        </Link>
      </div>

      {/* ── Recherche + Filtres ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            value={recherche}
            onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher par nom, espèce, race, numéro…"
            className="input-field pl-10"
          />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {FILTRES_SANTE.map(({ val, label }) => {
            const conf = val !== 'tous' ? ETAT_SANTE_CONFIG[val] : null;
            const actif = filtreEtat === val;
            return (
              <button key={val} onClick={() => setFiltreEtat(val)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
                style={actif
                  ? { background: conf?.color ?? '#0a6342', color: 'white', borderColor: conf?.color ?? '#0a6342' }
                  : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}>
                {label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Statistiques rapides ── */}
      <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mb-5">
        {Object.entries(ETAT_SANTE_CONFIG).map(([key, conf]) => {
          const count = DEMO_ANIMAUX.filter((a) => a.etatSante === key).length;
          return (
            <button key={key} onClick={() => setFiltreEtat(key as EtatSante)}
              className="rounded-xl p-3 text-center border transition-all hover:shadow-sm"
              style={{ background: conf.bg, borderColor: `${conf.color}30` }}>
              <div className="text-xl font-black" style={{ color: conf.color, fontFamily: 'var(--font-display)' }}>{count}</div>
              <div className="text-xs mt-0.5 font-semibold" style={{ color: conf.color }}>{conf.label}</div>
            </button>
          );
        })}
      </div>

      {/* ── Liste des animaux ── */}
      {animauxFiltres.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <PawPrint className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Aucun animal trouvé</p>
          <p className="text-gray-400 text-sm mt-1">Essayez de modifier votre recherche ou vos filtres</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {animauxFiltres.map((animal) => {
            const etatConf = ETAT_SANTE_CONFIG[animal.etatSante];
            const especeLabel = ESPECE_LABELS[animal.espece] ?? animal.espece;
            return (
              <Link key={animal.id} href={`/vetalert/animaux/${animal.id}`}
                className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-green-200 transition-all overflow-hidden group">
                {/* Bande colorée selon état */}
                <div className="h-2 w-full" style={{ background: etatConf.color }} />
                <div className="p-5">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl flex-shrink-0 border"
                        style={{ background: etatConf.bg, borderColor: `${etatConf.color}25` }}>
                        {especeLabel.split(' ')[0]}
                      </div>
                      <div>
                        <h3 className="font-black text-gray-900 text-base">{animal.nom}</h3>
                        <p className="text-gray-500 text-xs">{especeLabel.split(' ').slice(1).join(' ')} · {animal.race}</p>
                      </div>
                    </div>
                    <span className="text-xs font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                      style={{ background: etatConf.bg, color: etatConf.color }}>
                      {etatConf.label}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 bg-gray-50 rounded-xl p-3">
                    <div>
                      <span className="font-semibold text-gray-700">N° ID</span>
                      <p className="truncate">{animal.numeroId}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Sexe</span>
                      <p>{animal.sexe === 'male' ? '♂ Mâle' : '♀ Femelle'}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Âge</span>
                      <p>{animal.ageAns > 0 ? `${animal.ageAns} an${animal.ageAns > 1 ? 's' : ''}` : `${animal.ageMois} mois`}</p>
                    </div>
                    <div>
                      <span className="font-semibold text-gray-700">Poids</span>
                      <p>{animal.poids} kg</p>
                    </div>
                  </div>

                  {animal.notes && (
                    <p className="mt-3 text-xs text-gray-500 italic line-clamp-2">{animal.notes}</p>
                  )}

                  <div className="mt-3 pt-3 border-t border-gray-100 flex items-center justify-between">
                    <span className="text-xs text-gray-400">👨‍⚕️ {animal.veterinaire.replace('Dr. ', 'Dr ')}</span>
                    <span className="text-xs font-semibold text-green-700 group-hover:underline">Voir le dossier →</span>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
