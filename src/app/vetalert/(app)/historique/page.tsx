'use client';

import { useState } from 'react';
import { Search, ClipboardList } from 'lucide-react';
import { DEMO_DOSSIERS, ESPECE_LABELS } from '@/lib/vetalert/data';
import type { TypeDossier } from '@/lib/vetalert/types';

const TYPE_CONFIG: Record<TypeDossier, { label: string; emoji: string; color: string; bg: string }> = {
  maladie:      { label: 'Maladie',       emoji: '🤒', color: '#dc2626', bg: '#fee2e2' },
  vaccin:       { label: 'Vaccination',   emoji: '💉', color: '#0a6342', bg: '#d9f2e3' },
  traitement:   { label: 'Traitement',    emoji: '💊', color: '#1d4ed8', bg: '#dbeafe' },
  operation:    { label: 'Opération',     emoji: '🔪', color: '#7c3aed', bg: '#ede9fe' },
  analyse:      { label: 'Analyse',       emoji: '🧪', color: '#b45309', bg: '#fef3c7' },
  prescription: { label: 'Prescription',  emoji: '📋', color: '#0891b2', bg: '#cffafe' },
};

export default function HistoriquePage() {
  const [recherche, setRecherche] = useState('');
  const [filtreType, setFiltreType] = useState<TypeDossier | 'tous'>('tous');
  const [dossierOuvert, setDossierOuvert] = useState<string | null>(null);

  const dossiersFiltres = DEMO_DOSSIERS
    .filter((d) => {
      const rechercheOk = recherche === '' ||
        d.animalNom.toLowerCase().includes(recherche.toLowerCase()) ||
        d.titre.toLowerCase().includes(recherche.toLowerCase()) ||
        d.description.toLowerCase().includes(recherche.toLowerCase());
      const typeOk = filtreType === 'tous' || d.type === filtreType;
      return rechercheOk && typeOk;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  return (
    <div className="p-4 md:p-6 max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
          📋 Historique médical
        </h1>
        <p className="text-gray-500 text-sm mt-0.5">{DEMO_DOSSIERS.length} dossiers au total</p>
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="relative mb-3">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" value={recherche} onChange={(e) => setRecherche(e.target.value)}
            placeholder="Rechercher dans l'historique…" className="input-field pl-10" />
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <button onClick={() => setFiltreType('tous')}
            className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
            style={filtreType === 'tous'
              ? { background: '#0a6342', color: 'white', borderColor: '#0a6342' }
              : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}>
            Tous
          </button>
          {Object.entries(TYPE_CONFIG).map(([val, conf]) => (
            <button key={val} onClick={() => setFiltreType(val as TypeDossier)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
              style={filtreType === val
                ? { background: conf.color, color: 'white', borderColor: conf.color }
                : { background: conf.bg, color: conf.color, borderColor: `${conf.color}40` }}>
              {conf.emoji} {conf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Timeline */}
      {dossiersFiltres.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <ClipboardList className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Aucun dossier trouvé</p>
        </div>
      ) : (
        <div className="relative">
          {/* Ligne verticale timeline */}
          <div className="absolute left-6 top-0 bottom-0 w-0.5 hidden md:block" style={{ background: '#d9f2e3' }} />

          <div className="space-y-4">
            {dossiersFiltres.map((dossier) => {
              const tc = TYPE_CONFIG[dossier.type];
              const ouvert = dossierOuvert === dossier.id;

              return (
                <div key={dossier.id} className="md:pl-16 relative">
                  {/* Point timeline */}
                  <div className="absolute left-3.5 top-5 w-5 h-5 rounded-full flex items-center justify-center text-xs hidden md:flex z-10"
                    style={{ background: tc.color, boxShadow: `0 0 0 3px white, 0 0 0 4px ${tc.color}40` }}>
                  </div>

                  <button
                    onClick={() => setDossierOuvert(ouvert ? null : dossier.id)}
                    className="w-full text-left bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md overflow-hidden"
                    style={{ borderColor: ouvert ? `${tc.color}50` : '#f0f0f0', borderLeftWidth: '4px', borderLeftColor: tc.color }}>
                    {/* En-tête carte */}
                    <div className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                          style={{ background: tc.bg }}>
                          {tc.emoji}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                            <span className="font-bold text-gray-900 text-sm">{dossier.titre}</span>
                            <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                              style={{ background: tc.bg, color: tc.color }}>
                              {tc.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-3 flex-wrap">
                            <span className="text-xs text-gray-500">
                              {ESPECE_LABELS[dossier.animalEspece]?.split(' ')[0]} {dossier.animalNom}
                            </span>
                            <span className="text-xs text-gray-400">
                              {new Date(dossier.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span className="text-xs text-gray-400">🩺 {dossier.veterinaire}</span>
                          </div>
                        </div>
                        <div className="text-gray-400 text-xs font-semibold flex-shrink-0">
                          {ouvert ? '▲ Masquer' : '▼ Détails'}
                        </div>
                      </div>
                    </div>

                    {/* Détails dépliés */}
                    {ouvert && (
                      <div className="px-4 pb-4 pt-0 border-t border-gray-100">
                        <div className="mt-3 space-y-3">
                          <div>
                            <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">Description</p>
                            <p className="text-sm text-gray-700 leading-relaxed">{dossier.description}</p>
                          </div>

                          {dossier.medicaments && dossier.medicaments.length > 0 && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">💊 Médicaments</p>
                              <div className="flex flex-wrap gap-1.5">
                                {dossier.medicaments.map((med) => (
                                  <span key={med} className="text-xs px-2.5 py-1 rounded-full font-semibold"
                                    style={{ background: '#dbeafe', color: '#1d4ed8' }}>
                                    {med}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}

                          {dossier.dose && (
                            <div>
                              <p className="text-xs font-bold text-gray-500 uppercase tracking-wide mb-1">📏 Posologie</p>
                              <p className="text-sm text-gray-700">{dossier.dose}</p>
                            </div>
                          )}

                          {dossier.prochainControle && (
                            <div className="inline-flex items-center gap-2 px-3 py-2 rounded-xl"
                              style={{ background: '#d9f2e3', color: '#0a6342' }}>
                              <span className="text-sm">📅</span>
                              <span className="text-xs font-bold">
                                Prochain contrôle : {new Date(dossier.prochainControle).toLocaleDateString('fr-FR', {
                                  weekday: 'long', day: 'numeric', month: 'long', year: 'numeric'
                                })}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
