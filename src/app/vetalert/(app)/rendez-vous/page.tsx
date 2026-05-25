'use client';

import { useState } from 'react';
import { Plus, Clock, MapPin, ChevronLeft, ChevronRight, X, Loader2 } from 'lucide-react';
import { DEMO_RDV, ESPECE_LABELS, TYPE_RDV_LABELS, STATUT_RDV_CONFIG, DEMO_ANIMAUX } from '@/lib/vetalert/data';

const MOIS = ['Janvier','Février','Mars','Avril','Mai','Juin','Juillet','Août','Septembre','Octobre','Novembre','Décembre'];
const JOURS = ['Lun','Mar','Mer','Jeu','Ven','Sam','Dim'];

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  const day = new Date(year, month, 1).getDay();
  return day === 0 ? 6 : day - 1;
}

export default function RendezVousPage() {
  const today = new Date('2026-05-25');
  const [annee, setAnnee] = useState(2026);
  const [mois, setMois] = useState(4); // mai = index 4
  const [jourSelectionne, setJourSelectionne] = useState<number | null>(25);
  const [afficherModal, setAfficherModal] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [newRdv, setNewRdv] = useState({
    animal: '', type: 'vaccination', date: '', heure: '09:00', motif: '', lieu: '',
  });

  const nbJours = getDaysInMonth(annee, mois);
  const premierJour = getFirstDayOfWeek(annee, mois);

  const rdvParJour = (jour: number) => {
    const dateStr = `${annee}-${String(mois + 1).padStart(2, '0')}-${String(jour).padStart(2, '0')}`;
    return DEMO_RDV.filter((r) => r.date === dateStr);
  };

  const rdvSelectionnes = jourSelectionne
    ? DEMO_RDV.filter((r) => {
        const dateStr = `${annee}-${String(mois + 1).padStart(2, '0')}-${String(jourSelectionne).padStart(2, '0')}`;
        return r.date === dateStr;
      })
    : [];

  const handleSaveRdv = async (e: React.FormEvent) => {
    e.preventDefault();
    setChargement(true);
    await new Promise((r) => setTimeout(r, 1000));
    setChargement(false);
    setAfficherModal(false);
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
            📅 Rendez-vous
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">{DEMO_RDV.length} rendez-vous planifiés</p>
        </div>
        <button onClick={() => setAfficherModal(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">Nouveau RDV</span>
          <span className="sm:hidden">Nouveau</span>
        </button>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── Calendrier ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          {/* Navigation mois */}
          <div className="flex items-center justify-between p-5 border-b border-gray-100">
            <button onClick={() => { if (mois === 0) { setMois(11); setAnnee(a => a - 1); } else setMois(m => m - 1); }}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <h2 className="font-black text-gray-900 text-lg" style={{ fontFamily: 'var(--font-display)' }}>
              {MOIS[mois]} {annee}
            </h2>
            <button onClick={() => { if (mois === 11) { setMois(0); setAnnee(a => a + 1); } else setMois(m => m + 1); }}
              className="w-9 h-9 rounded-xl flex items-center justify-center hover:bg-gray-100 transition-colors">
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>

          <div className="p-4">
            {/* En-têtes jours */}
            <div className="grid grid-cols-7 mb-2">
              {JOURS.map((j) => (
                <div key={j} className="text-center text-xs font-bold text-gray-400 py-1">{j}</div>
              ))}
            </div>

            {/* Grille calendrier */}
            <div className="grid grid-cols-7 gap-1">
              {Array.from({ length: premierJour }).map((_, i) => (
                <div key={`empty-${i}`} />
              ))}
              {Array.from({ length: nbJours }).map((_, i) => {
                const jour = i + 1;
                const rdvsJour = rdvParJour(jour);
                const estAujourdhui = annee === today.getFullYear() && mois === today.getMonth() && jour === today.getDate();
                const estSelectionne = jourSelectionne === jour;
                const aUrgence = rdvsJour.some((r) => r.statut === 'urgent');

                return (
                  <button key={jour} onClick={() => setJourSelectionne(jour === jourSelectionne ? null : jour)}
                    className="relative aspect-square rounded-xl flex flex-col items-center justify-center transition-all hover:bg-green-50"
                    style={estSelectionne
                      ? { background: 'linear-gradient(135deg, #0a6342, #1d9c68)', color: 'white' }
                      : estAujourdhui
                        ? { background: '#d9f2e3', color: '#0a6342' }
                        : {}}>
                    <span className={`text-sm font-bold ${estSelectionne ? 'text-white' : estAujourdhui ? 'text-green-800' : 'text-gray-700'}`}>
                      {jour}
                    </span>
                    {rdvsJour.length > 0 && (
                      <div className="flex gap-0.5 mt-0.5">
                        {rdvsJour.slice(0, 3).map((_, di) => (
                          <div key={di} className="w-1 h-1 rounded-full"
                            style={{ background: aUrgence && di === 0 ? '#dc2626' : estSelectionne ? 'rgba(255,255,255,0.8)' : '#0a6342' }} />
                        ))}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Légende */}
          <div className="flex items-center gap-4 px-5 pb-4 text-xs text-gray-500">
            <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-full" style={{ background: '#d9f2e3', border: '1px solid #0a6342' }} /> Aujourd&apos;hui</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full" style={{ background: '#0a6342' }} /> Rendez-vous</div>
            <div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-red-500" /> Urgent</div>
          </div>
        </div>

        {/* ── Liste du jour sélectionné ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="p-5 border-b border-gray-100">
            <h2 className="font-black text-gray-900">
              {jourSelectionne
                ? `${jourSelectionne} ${MOIS[mois]} ${annee}`
                : 'Sélectionner un jour'}
            </h2>
            <p className="text-gray-500 text-sm">{rdvSelectionnes.length} rendez-vous</p>
          </div>

          {rdvSelectionnes.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-4xl mb-2">📭</div>
              <p className="text-gray-400 text-sm">
                {jourSelectionne ? 'Aucun rendez-vous ce jour' : 'Cliquez sur un jour pour voir les RDV'}
              </p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {rdvSelectionnes.map((rdv) => {
                const typeConf = TYPE_RDV_LABELS[rdv.type];
                const statutConf = STATUT_RDV_CONFIG[rdv.statut];
                return (
                  <div key={rdv.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">{ESPECE_LABELS[rdv.animalEspece]?.split(' ')[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm">{rdv.animalNom}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: statutConf.bg, color: statutConf.color }}>
                            {statutConf.label}
                          </span>
                        </div>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md"
                          style={{ background: `${typeConf.color}18`, color: typeConf.color }}>
                          {typeConf.label}
                        </span>
                        <p className="text-xs text-gray-500 mt-1.5">{rdv.motif}</p>
                        <div className="flex flex-col gap-0.5 mt-1.5">
                          <span className="flex items-center gap-1 text-xs text-gray-400">
                            <Clock className="w-3 h-3" />{rdv.heure}
                          </span>
                          {rdv.lieu && (
                            <span className="flex items-center gap-1 text-xs text-gray-400">
                              <MapPin className="w-3 h-3" />{rdv.lieu}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* ── Tous les RDV à venir ── */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="p-5 border-b border-gray-100">
          <h2 className="font-black text-gray-900">📋 Tous les rendez-vous à venir</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {DEMO_RDV.filter((r) => r.statut !== 'termine' && r.statut !== 'annule').map((rdv) => {
            const typeConf = TYPE_RDV_LABELS[rdv.type];
            const statutConf = STATUT_RDV_CONFIG[rdv.statut];
            return (
              <div key={rdv.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                  style={{ background: `${typeConf.color}12` }}>
                  {ESPECE_LABELS[rdv.animalEspece]?.split(' ')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <span className="font-bold text-gray-900 text-sm">{rdv.animalNom}</span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                      style={{ background: statutConf.bg, color: statutConf.color }}>
                      {statutConf.label}
                    </span>
                    <span className="text-xs font-semibold px-2 py-0.5 rounded-md"
                      style={{ background: `${typeConf.color}18`, color: typeConf.color }}>
                      {typeConf.label}
                    </span>
                  </div>
                  <p className="text-xs text-gray-500 truncate">{rdv.motif}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-sm font-bold text-gray-900">
                    {new Date(rdv.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </p>
                  <p className="text-xs text-gray-400">{rdv.heure}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Modal nouveau RDV ── */}
      {afficherModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.5)' }}>
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between p-6 border-b border-gray-100">
              <h2 className="text-xl font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
                Nouveau rendez-vous
              </h2>
              <button onClick={() => setAfficherModal(false)}
                className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-gray-100 transition-colors">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>
            <form onSubmit={handleSaveRdv} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Animal *</label>
                <select value={newRdv.animal} onChange={(e) => setNewRdv({ ...newRdv, animal: e.target.value })}
                  className="input-field" required>
                  <option value="">Sélectionner un animal…</option>
                  {DEMO_ANIMAUX.map((a) => (
                    <option key={a.id} value={a.id}>{a.nom} ({ESPECE_LABELS[a.espece]?.split(' ').slice(1).join(' ')})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Type de rendez-vous *</label>
                <select value={newRdv.type} onChange={(e) => setNewRdv({ ...newRdv, type: e.target.value })}
                  className="input-field" required>
                  {Object.entries(TYPE_RDV_LABELS).map(([val, { label }]) => (
                    <option key={val} value={val}>{label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Date *</label>
                  <input type="date" value={newRdv.date} onChange={(e) => setNewRdv({ ...newRdv, date: e.target.value })}
                    className="input-field" required />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">Heure *</label>
                  <input type="time" value={newRdv.heure} onChange={(e) => setNewRdv({ ...newRdv, heure: e.target.value })}
                    className="input-field" required />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Motif</label>
                <input type="text" value={newRdv.motif} onChange={(e) => setNewRdv({ ...newRdv, motif: e.target.value })}
                  placeholder="Raison du rendez-vous…" className="input-field" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">Lieu</label>
                <input type="text" value={newRdv.lieu} onChange={(e) => setNewRdv({ ...newRdv, lieu: e.target.value })}
                  placeholder="Clinique, ferme…" className="input-field" />
              </div>
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setAfficherModal(false)}
                  className="flex-1 py-3 rounded-xl font-bold border-2 border-gray-200 text-gray-600 hover:bg-gray-50 transition-colors">
                  Annuler
                </button>
                <button type="submit" disabled={chargement}
                  className="flex-1 py-3 rounded-xl font-black text-white flex items-center justify-center gap-2 transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
                  {chargement ? <><Loader2 className="w-4 h-4 animate-spin" /> Enregistrement…</> : '✓ Confirmer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
