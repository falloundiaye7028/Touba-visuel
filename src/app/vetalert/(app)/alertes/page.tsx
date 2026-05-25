'use client';

import { useState } from 'react';
import { Bell, CheckCheck, Trash2, Filter } from 'lucide-react';
import { DEMO_ALERTES } from '@/lib/vetalert/data';
import type { Alerte, TypeAlerte, PrioriteAlerte } from '@/lib/vetalert/types';

const TYPE_CONFIG: Record<TypeAlerte, { label: string; emoji: string; color: string; bg: string }> = {
  urgence:      { label: 'Urgence',        emoji: '🚨', color: '#dc2626', bg: '#fee2e2' },
  rendez_vous:  { label: 'Rendez-vous',    emoji: '📅', color: '#1d4ed8', bg: '#dbeafe' },
  vaccin:       { label: 'Vaccin',         emoji: '💉', color: '#0a6342', bg: '#d9f2e3' },
  traitement:   { label: 'Traitement',     emoji: '💊', color: '#7c3aed', bg: '#ede9fe' },
  controle:     { label: 'Contrôle',       emoji: '🔍', color: '#b45309', bg: '#fef3c7' },
  rappel:       { label: 'Rappel',         emoji: '⏰', color: '#0891b2', bg: '#cffafe' },
};

const PRIORITE_CONFIG: Record<PrioriteAlerte, { label: string; color: string; bg: string }> = {
  urgente: { label: 'Urgente', color: '#dc2626', bg: '#fee2e2' },
  haute:   { label: 'Haute',   color: '#d97706', bg: '#fef3c7' },
  normale: { label: 'Normale', color: '#6b7280', bg: '#f3f4f6' },
};

export default function AlertesPage() {
  const [alertes, setAlertes] = useState<Alerte[]>(DEMO_ALERTES);
  const [filtre, setFiltre] = useState<TypeAlerte | 'toutes' | 'non_lues'>('toutes');

  const alertesFiltrees = alertes.filter((a) => {
    if (filtre === 'non_lues') return !a.lue;
    if (filtre === 'toutes') return true;
    return a.type === filtre;
  });

  const nonLues = alertes.filter((a) => !a.lue).length;

  const marquerLue = (id: string) => setAlertes((prev) => prev.map((a) => a.id === id ? { ...a, lue: true } : a));
  const marquerToutesLues = () => setAlertes((prev) => prev.map((a) => ({ ...a, lue: true })));
  const supprimer = (id: string) => setAlertes((prev) => prev.filter((a) => a.id !== id));

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
            🔔 Alertes
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {nonLues > 0 ? (
              <span style={{ color: '#dc2626' }} className="font-semibold">{nonLues} non lue{nonLues > 1 ? 's' : ''}</span>
            ) : (
              <span className="text-green-600 font-semibold">✓ Tout à jour</span>
            )}
            {' '}· {alertes.length} alertes au total
          </p>
        </div>
        {nonLues > 0 && (
          <button onClick={marquerToutesLues}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors"
            style={{ borderColor: '#0a6342', color: '#0a6342' }}>
            <CheckCheck className="w-4 h-4" />
            Tout marquer lu
          </button>
        )}
      </div>

      {/* Filtres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 mb-5">
        <div className="flex items-center gap-2 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400 flex-shrink-0" />
          {[
            { val: 'toutes' as const, label: `Toutes (${alertes.length})` },
            { val: 'non_lues' as const, label: `Non lues (${nonLues})` },
          ].map(({ val, label }) => (
            <button key={val} onClick={() => setFiltre(val)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
              style={filtre === val
                ? { background: '#0a6342', color: 'white', borderColor: '#0a6342' }
                : { background: 'white', color: '#6b7280', borderColor: '#e5e7eb' }}>
              {label}
            </button>
          ))}
          {Object.entries(TYPE_CONFIG).map(([val, conf]) => (
            <button key={val} onClick={() => setFiltre(val as TypeAlerte)}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all border"
              style={filtre === val
                ? { background: conf.color, color: 'white', borderColor: conf.color }
                : { background: conf.bg, color: conf.color, borderColor: `${conf.color}40` }}>
              {conf.emoji} {conf.label}
            </button>
          ))}
        </div>
      </div>

      {/* Liste des alertes */}
      {alertesFiltrees.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">
          <Bell className="w-12 h-12 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500 font-medium">Aucune alerte</p>
          <p className="text-gray-400 text-sm mt-1">Vous êtes à jour !</p>
        </div>
      ) : (
        <div className="space-y-3">
          {alertesFiltrees
            .sort((a, b) => {
              const priorite = { urgente: 3, haute: 2, normale: 1 };
              const diff = (priorite[b.priorite] ?? 0) - (priorite[a.priorite] ?? 0);
              if (diff !== 0) return diff;
              return new Date(b.date).getTime() - new Date(a.date).getTime();
            })
            .map((alerte) => {
              const typeConf = TYPE_CONFIG[alerte.type];
              const prioriteConf = PRIORITE_CONFIG[alerte.priorite];
              return (
                <div key={alerte.id}
                  className="bg-white rounded-2xl border shadow-sm transition-all hover:shadow-md"
                  style={{
                    borderColor: !alerte.lue ? `${typeConf.color}40` : '#f0f0f0',
                    borderLeftWidth: !alerte.lue ? '4px' : '1px',
                    borderLeftColor: !alerte.lue ? typeConf.color : '#f0f0f0',
                  }}>
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: typeConf.bg }}>
                        {typeConf.emoji}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className={`text-sm ${!alerte.lue ? 'font-bold text-gray-900' : 'font-semibold text-gray-700'}`}>
                            {alerte.titre}
                          </span>
                          {!alerte.lue && (
                            <span className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: typeConf.color }} />
                          )}
                        </div>
                        <p className="text-xs text-gray-500 leading-relaxed mb-2">{alerte.message}</p>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: typeConf.bg, color: typeConf.color }}>
                            {typeConf.label}
                          </span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: prioriteConf.bg, color: prioriteConf.color }}>
                            {prioriteConf.label}
                          </span>
                          {alerte.animalNom && (
                            <span className="text-xs text-gray-400">🐾 {alerte.animalNom}</span>
                          )}
                          <span className="text-xs text-gray-400">
                            {new Date(alerte.date).toLocaleString('fr-FR', {
                              day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit'
                            })}
                          </span>
                        </div>
                      </div>
                    </div>

                    {!alerte.lue && (
                      <div className="flex items-center gap-2 mt-3 pt-3 border-t border-gray-100">
                        <button onClick={() => marquerLue(alerte.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors"
                          style={{ background: '#d9f2e3', color: '#0a6342' }}>
                          <CheckCheck className="w-3.5 h-3.5" />
                          Marquer comme lu
                        </button>
                        <button onClick={() => supprimer(alerte.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors text-gray-500 hover:bg-red-50 hover:text-red-600">
                          <Trash2 className="w-3.5 h-3.5" />
                          Supprimer
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
        </div>
      )}
    </div>
  );
}
