import Link from 'next/link';
import { Calendar, Bell, PawPrint, TrendingUp, ArrowRight, Clock, MapPin, AlertTriangle, CheckCircle2, Activity } from 'lucide-react';
import { DEMO_ANIMAUX, DEMO_RDV, DEMO_ALERTES, ETAT_SANTE_CONFIG, ESPECE_LABELS, TYPE_RDV_LABELS, STATUT_RDV_CONFIG } from '@/lib/vetalert/data';

export const metadata = { title: 'Tableau de bord' };

const aujourdhui = DEMO_RDV.filter((r) => r.date === '2026-05-25');
const alertesNonLues = DEMO_ALERTES.filter((a) => !a.lue);
const animauxMalades = DEMO_ANIMAUX.filter((a) => a.etatSante === 'malade' || a.etatSante === 'critique' || a.etatSante === 'en_traitement');

const statsCards = [
  { label: 'Animaux suivis',   val: DEMO_ANIMAUX.length,       icon: PawPrint,      color: '#0a6342', bg: '#d9f2e3' },
  { label: 'RDV aujourd\'hui', val: aujourdhui.length,          icon: Calendar,      color: '#1d4ed8', bg: '#dbeafe' },
  { label: 'Alertes urgentes', val: alertesNonLues.length,      icon: Bell,          color: '#dc2626', bg: '#fee2e2' },
  { label: 'En traitement',    val: animauxMalades.length,      icon: Activity,      color: '#d97706', bg: '#fef3c7' },
];

export default function DashboardPage() {
  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
            Bonjour, Dr. Diallo 👋
          </h1>
          <p className="text-gray-500 text-sm mt-1">Dimanche 25 mai 2026 · Thiès, Sénégal</p>
        </div>
        <Link href="/vetalert/rendez-vous"
          className="hidden md:inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white transition-all hover:opacity-90"
          style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
          <Calendar className="w-4 h-4" />
          Nouveau RDV
        </Link>
      </div>

      {/* ── Alerte urgente mise en avant ── */}
      <div className="mb-6 p-4 rounded-2xl border-2 flex items-start gap-4 animate-pulse-slow"
        style={{ background: '#fee2e2', borderColor: '#dc2626' }}>
        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: '#dc2626' }}>
          <AlertTriangle className="w-5 h-5 text-white" />
        </div>
        <div className="flex-1">
          <p className="font-bold text-red-800 text-sm">🚨 Urgence — Bella (chèvre)</p>
          <p className="text-red-700 text-sm mt-0.5">Fièvre à 41,5°C — Intervention immédiate recommandée</p>
        </div>
        <Link href="/vetalert/animaux/anim-004"
          className="flex-shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold text-white"
          style={{ background: '#dc2626' }}>
          Voir →
        </Link>
      </div>

      {/* ── Stats Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {statsCards.map(({ label, val, icon: Icon, color, bg }) => (
          <div key={label} className="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <TrendingUp className="w-4 h-4 text-gray-300" />
            </div>
            <div className="text-3xl font-black mb-1" style={{ color, fontFamily: 'var(--font-display)' }}>{val}</div>
            <div className="text-gray-500 text-xs font-semibold">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* ── RDV du jour ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-black text-gray-900 text-base">📅 Rendez-vous du jour</h2>
            <Link href="/vetalert/rendez-vous" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0a6342' }}>
              Tous les RDV <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {aujourdhui.length === 0 ? (
              <div className="p-8 text-center">
                <CheckCircle2 className="w-10 h-10 mx-auto mb-2 text-green-400" />
                <p className="text-gray-500 text-sm">Aucun rendez-vous aujourd&apos;hui</p>
              </div>
            ) : (
              aujourdhui.map((rdv) => {
                const typeConf = TYPE_RDV_LABELS[rdv.type];
                const statutConf = STATUT_RDV_CONFIG[rdv.statut];
                return (
                  <div key={rdv.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                      style={{ background: `${typeConf.color}18` }}>
                      {ESPECE_LABELS[rdv.animalEspece]?.split(' ')[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                        <span className="font-bold text-gray-900 text-sm">{rdv.animalNom}</span>
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full"
                          style={{ background: statutConf.bg, color: statutConf.color }}>
                          {statutConf.label}
                        </span>
                      </div>
                      <p className="text-gray-500 text-xs truncate">{rdv.motif}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1 text-xs text-gray-400">
                          <Clock className="w-3 h-3" /> {rdv.heure}
                        </span>
                        {rdv.lieu && (
                          <span className="flex items-center gap-1 text-xs text-gray-400 truncate">
                            <MapPin className="w-3 h-3" /> {rdv.lieu}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-xs font-semibold px-2 py-1 rounded-lg flex-shrink-0"
                      style={{ background: `${typeConf.color}15`, color: typeConf.color }}>
                      {typeConf.label}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>

        {/* ── Alertes récentes ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div className="flex items-center justify-between p-5 border-b border-gray-50">
            <h2 className="font-black text-gray-900 text-base">🔔 Alertes récentes</h2>
            <Link href="/vetalert/alertes" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0a6342' }}>
              Toutes <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
          <div className="divide-y divide-gray-50">
            {DEMO_ALERTES.slice(0, 4).map((alerte) => (
              <div key={alerte.id} className={`p-4 ${!alerte.lue ? 'bg-green-50/50' : ''}`}>
                <div className="flex items-start gap-2">
                  {!alerte.lue && (
                    <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#0a6342' }} />
                  )}
                  <div className="flex-1 min-w-0">
                    <p className={`text-xs leading-relaxed ${!alerte.lue ? 'font-semibold text-gray-900' : 'text-gray-600'}`}>
                      {alerte.titre}
                    </p>
                    <p className="text-xs text-gray-400 mt-0.5">
                      {new Date(alerte.date).toLocaleDateString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  {alerte.priorite === 'urgente' && (
                    <span className="text-xs bg-red-100 text-red-600 font-bold px-1.5 py-0.5 rounded-md flex-shrink-0">!</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Aperçu animaux ── */}
      <div className="mt-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <h2 className="font-black text-gray-900 text-base">🐄 Animaux nécessitant une attention</h2>
          <Link href="/vetalert/animaux" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0a6342' }}>
            Tous les animaux <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-5">
          {animauxMalades.map((animal) => {
            const etatConf = ETAT_SANTE_CONFIG[animal.etatSante];
            return (
              <Link key={animal.id} href={`/vetalert/animaux/${animal.id}`}
                className="flex items-center gap-3 p-3 rounded-xl border transition-all hover:shadow-sm"
                style={{ borderColor: `${etatConf.color}30`, background: etatConf.bg + '40' }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0 bg-white border"
                  style={{ borderColor: `${etatConf.color}20` }}>
                  {ESPECE_LABELS[animal.espece]?.split(' ')[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{animal.nom}</p>
                  <p className="text-xs text-gray-500 truncate">{ESPECE_LABELS[animal.espece]?.split(' ').slice(1).join(' ')} · {animal.race}</p>
                  <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full"
                    style={{ background: etatConf.bg, color: etatConf.color }}>
                    {etatConf.label}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
