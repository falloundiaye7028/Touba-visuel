import Link from 'next/link';
import { ArrowRight, Calendar, Bell, PawPrint, Phone, CheckCircle2, AlertTriangle, Clock, MapPin } from 'lucide-react';
import { DEMO_ANIMAUX, DEMO_RDV, DEMO_ALERTES, DEMO_DOSSIERS, ETAT_SANTE_CONFIG, ESPECE_LABELS, TYPE_RDV_LABELS, STATUT_RDV_CONFIG } from '@/lib/vetalert/data';

export const metadata = { title: 'Mon élevage — Tableau de bord' };

const rdvAVenir = DEMO_RDV
  .filter((r) => r.date >= '2026-05-25' && ['programme', 'confirme', 'urgent'].includes(r.statut))
  .sort((a, b) => a.date.localeCompare(b.date))
  .slice(0, 4);

const alertesRecentes = DEMO_ALERTES.slice(0, 4);
const animauxSante = DEMO_ANIMAUX.filter((a) => a.etatSante === 'bonne_sante').length;
const animauxProbleme = DEMO_ANIMAUX.filter((a) => ['malade', 'critique', 'en_traitement'].includes(a.etatSante));
const urgences = DEMO_ALERTES.filter((a) => a.priorite === 'urgente' && !a.lue);

export default function DashboardEleveurPage() {
  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      {/* Header éleveur */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
            Mon élevage 👨‍🌾
          </h1>
          <p className="text-gray-500 text-sm mt-1">Mamadou Ndiaye · Ferme Ndiaye — Kaolack</p>
        </div>
        <div className="flex items-center gap-2">
          <a href="tel:+221771234567"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
            <Phone className="w-4 h-4" />
            Appeler mon vétérinaire
          </a>
        </div>
      </div>

      {/* Urgences */}
      {urgences.length > 0 && (
        <div className="mb-6 space-y-2">
          {urgences.map((u) => (
            <div key={u.id} className="p-4 rounded-2xl border-2 flex items-start gap-3"
              style={{ background: '#fee2e2', borderColor: '#dc2626' }}>
              <AlertTriangle className="w-5 h-5 flex-shrink-0 mt-0.5 text-red-600" />
              <div className="flex-1">
                <p className="font-bold text-red-800 text-sm">{u.titre}</p>
                <p className="text-red-700 text-xs mt-0.5">{u.message}</p>
              </div>
              {u.animalId && (
                <Link href={`/vetalert/animaux/${u.animalId}`}
                  className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-white bg-red-600">
                  Voir →
                </Link>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Vétérinaire assigné */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black text-white flex-shrink-0"
            style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
            D
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-0.5">Mon vétérinaire</p>
            <p className="font-black text-gray-900 text-lg">Dr. Amadou Diallo</p>
            <p className="text-sm text-gray-500">🩺 Bovins & Petits Ruminants · Thiès</p>
          </div>
          <div className="flex flex-col gap-2">
            <a href="tel:+221771234567"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold text-white"
              style={{ background: '#0a6342' }}>
              <Phone className="w-4 h-4" />
              Appeler
            </a>
            <Link href="/vetalert/rendez-vous"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-bold border-2 text-center justify-center"
              style={{ borderColor: '#0a6342', color: '#0a6342' }}>
              <Calendar className="w-4 h-4" />
              RDV
            </Link>
          </div>
        </div>
      </div>

      {/* Stats du troupeau */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { val: DEMO_ANIMAUX.length, label: 'Animaux',           emoji: '🐄', color: '#0a6342', bg: '#d9f2e3' },
          { val: animauxSante,        label: 'En bonne santé',    emoji: '✅', color: '#0a6342', bg: '#d9f2e3' },
          { val: animauxProbleme.length, label: 'Nécessitent soins', emoji: '🏥', color: '#dc2626', bg: '#fee2e2' },
          { val: rdvAVenir.length,    label: 'RDV à venir',       emoji: '📅', color: '#1d4ed8', bg: '#dbeafe' },
        ].map(({ val, label, emoji, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 text-center">
            <div className="text-2xl mb-2">{emoji}</div>
            <div className="text-3xl font-black mb-1" style={{ color, fontFamily: 'var(--font-display)' }}>{val}</div>
            <div className="text-gray-500 text-xs font-semibold">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Prochains soins */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-black text-gray-900">📅 Prochains soins</h2>
            <Link href="/vetalert/rendez-vous" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0a6342' }}>
              Tous <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          {rdvAVenir.length === 0 ? (
            <div className="p-8 text-center">
              <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
              <p className="text-gray-500 text-sm">Aucun soin programmé prochainement</p>
            </div>
          ) : (
            <div className="divide-y divide-gray-50">
              {rdvAVenir.map((rdv) => {
                const typeConf = TYPE_RDV_LABELS[rdv.type];
                const statutConf = STATUT_RDV_CONFIG[rdv.statut];
                const dateObj = new Date(rdv.date);
                const estAujourd = rdv.date === '2026-05-25';
                const estDemain  = rdv.date === '2026-05-26';
                const labelDate = estAujourd ? "Aujourd'hui" : estDemain ? 'Demain' : dateObj.toLocaleDateString('fr-FR', { weekday: 'short', day: 'numeric', month: 'short' });
                return (
                  <div key={rdv.id} className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="text-2xl flex-shrink-0">{ESPECE_LABELS[rdv.animalEspece]?.split(' ')[0]}</div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                          <span className="font-bold text-gray-900 text-sm">{rdv.animalNom}</span>
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                            style={{ background: statutConf.bg, color: statutConf.color }}>
                            {statutConf.label}
                          </span>
                        </div>
                        <p className="text-xs font-semibold" style={{ color: typeConf.color }}>{typeConf.label}</p>
                        <p className="text-xs text-gray-500 mt-0.5 truncate">{rdv.motif}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs font-bold ${estAujourd ? 'text-red-600' : estDemain ? 'text-orange-600' : 'text-gray-500'}`}>
                            <Clock className="w-3 h-3 inline mr-0.5" />{labelDate} · {rdv.heure}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Alertes éleveur */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-black text-gray-900">🔔 Mes alertes</h2>
            <Link href="/vetalert/alertes" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0a6342' }}>
              Toutes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {alertesRecentes.map((alerte) => {
              const prioriteColor = alerte.priorite === 'urgente' ? '#dc2626' : alerte.priorite === 'haute' ? '#d97706' : '#6b7280';
              const prioriteBg   = alerte.priorite === 'urgente' ? '#fee2e2' : alerte.priorite === 'haute' ? '#fef3c7' : '#f3f4f6';
              return (
                <div key={alerte.id} className={`p-4 ${!alerte.lue ? 'bg-green-50/40' : ''}`}>
                  <div className="flex items-start gap-2">
                    {!alerte.lue && <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: prioriteColor }} />}
                    <div className="flex-1 min-w-0">
                      <p className={`text-xs leading-relaxed ${!alerte.lue ? 'font-bold text-gray-900' : 'text-gray-600'}`}>
                        {alerte.titre}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs font-semibold px-1.5 py-0.5 rounded-md"
                          style={{ background: prioriteBg, color: prioriteColor }}>
                          {alerte.priorite}
                        </span>
                        <span className="text-xs text-gray-400">
                          {new Date(alerte.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Mes animaux nécessitant une attention */}
      {animauxProbleme.length > 0 && (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-black text-gray-900">⚠️ Animaux à surveiller</h2>
            <Link href="/vetalert/animaux" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0a6342' }}>
              Tous mes animaux <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
            {animauxProbleme.map((a) => {
              const etatConf = ETAT_SANTE_CONFIG[a.etatSante];
              const dossierRecent = DEMO_DOSSIERS.find((d) => d.animalId === a.id);
              return (
                <Link key={a.id} href={`/vetalert/animaux/${a.id}`}
                  className="rounded-2xl p-4 border transition-all hover:shadow-sm"
                  style={{ background: etatConf.bg + '60', borderColor: `${etatConf.color}30` }}>
                  <div className="flex items-center gap-3 mb-2">
                    <div className="text-2xl">{ESPECE_LABELS[a.espece]?.split(' ')[0]}</div>
                    <div>
                      <p className="font-black text-gray-900 text-sm">{a.nom}</p>
                      <span className="text-xs font-bold px-2 py-0.5 rounded-full"
                        style={{ background: etatConf.bg, color: etatConf.color }}>
                        {etatConf.label}
                      </span>
                    </div>
                  </div>
                  {a.notes && <p className="text-xs text-gray-600 italic line-clamp-2">{a.notes}</p>}
                  {dossierRecent && (
                    <p className="text-xs text-gray-400 mt-1">
                      Dernier acte : {dossierRecent.titre}
                    </p>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* Prochain dossier médical à venir */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <h2 className="font-black text-gray-900">📋 Derniers soins reçus</h2>
          <Link href="/vetalert/historique" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0a6342' }}>
            Historique complet <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {DEMO_DOSSIERS.slice(0, 3).map((d) => {
            const typeEmojis: Record<string, string> = { vaccin: '💉', traitement: '💊', maladie: '🤒', analyse: '🧪', prescription: '📋', operation: '🔪' };
            const typeColors: Record<string, string> = { vaccin: '#0a6342', traitement: '#1d4ed8', maladie: '#dc2626', analyse: '#b45309', prescription: '#0891b2', operation: '#7c3aed' };
            const color = typeColors[d.type] ?? '#6b7280';
            return (
              <div key={d.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: `${color}18` }}>
                  {typeEmojis[d.type] ?? '📄'}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{d.animalNom} — {d.titre}</p>
                  <p className="text-xs text-gray-500 truncate">{d.description}</p>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className="text-xs font-bold text-gray-700">
                    {new Date(d.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                  </p>
                  {d.prochainControle && (
                    <p className="text-xs text-green-600 font-semibold">
                      → {new Date(d.prochainControle).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
