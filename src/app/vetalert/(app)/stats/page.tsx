'use client';

import { useState } from 'react';
import Link from 'next/link';
import { TrendingUp, TrendingDown, BarChart3, PieChart, Download, FileText, ArrowRight, Calendar, Activity } from 'lucide-react';
import { DEMO_ANIMAUX, DEMO_RDV, DEMO_DOSSIERS, DEMO_ALERTES, ETAT_SANTE_CONFIG, TYPE_RDV_LABELS, ESPECE_LABELS } from '@/lib/vetalert/data';

const PERIODES = [
  { val: '7j',    label: '7 jours' },
  { val: '30j',   label: '30 jours' },
  { val: '90j',   label: '3 mois' },
  { val: 'annee', label: 'Année' },
];

// Simulation des données d'évolution mensuelle
const EVOLUTION = [
  { mois: 'Déc', rdv: 8,  dossiers: 5,  animauxNouveaux: 1 },
  { mois: 'Jan', rdv: 12, dossiers: 7,  animauxNouveaux: 2 },
  { mois: 'Fév', rdv: 10, dossiers: 6,  animauxNouveaux: 0 },
  { mois: 'Mar', rdv: 15, dossiers: 9,  animauxNouveaux: 3 },
  { mois: 'Avr', rdv: 11, dossiers: 8,  animauxNouveaux: 1 },
  { mois: 'Mai', rdv: 6,  dossiers: 4,  animauxNouveaux: 0 },
];

const maxRdv = Math.max(...EVOLUTION.map((e) => e.rdv));

export default function StatsPage() {
  const [periode, setPeriode] = useState('30j');

  // Calculs
  const animauxBonneSante    = DEMO_ANIMAUX.filter((a) => a.etatSante === 'bonne_sante').length;
  const animauxProbleme      = DEMO_ANIMAUX.filter((a) => ['malade', 'critique', 'en_traitement'].includes(a.etatSante)).length;
  const tauxBonneSante       = Math.round((animauxBonneSante / DEMO_ANIMAUX.length) * 100);
  const alertesNonLues       = DEMO_ALERTES.filter((a) => !a.lue).length;
  const rdvUrgents           = DEMO_RDV.filter((r) => r.statut === 'urgent').length;
  const prochainControles    = DEMO_DOSSIERS.filter((d) => d.prochainControle).length;

  // Distribution par espèce
  const parEspece = Object.entries(
    DEMO_ANIMAUX.reduce((acc, a) => { acc[a.espece] = (acc[a.espece] ?? 0) + 1; return acc; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  // Distribution par type de RDV
  const parTypeRdv = Object.entries(
    DEMO_RDV.reduce((acc, r) => { acc[r.type] = (acc[r.type] ?? 0) + 1; return acc; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  // Distribution par type de dossier
  const parTypeDossier = Object.entries(
    DEMO_DOSSIERS.reduce((acc, d) => { acc[d.type] = (acc[d.type] ?? 0) + 1; return acc; }, {} as Record<string, number>)
  ).sort((a, b) => b[1] - a[1]);

  const DOSSIER_COLORS: Record<string, string> = {
    vaccin: '#0a6342', traitement: '#1d4ed8', maladie: '#dc2626',
    analyse: '#b45309', prescription: '#0891b2', operation: '#7c3aed',
  };

  return (
    <div className="p-4 md:p-6 max-w-6xl mx-auto">
      {/* ── Header ── */}
      <div className="flex items-start justify-between mb-6 flex-wrap gap-3">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
            📊 Statistiques & Rapports
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Vue analytique de votre activité vétérinaire</p>
        </div>
        <div className="flex items-center gap-2">
          <button className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold border-2 transition-colors"
            style={{ borderColor: '#0a6342', color: '#0a6342' }}
            onClick={() => alert('Export PDF en cours de développement — disponible en version Premium')}>
            <Download className="w-4 h-4" />
            Exporter PDF
          </button>
        </div>
      </div>

      {/* ── Sélecteur de période ── */}
      <div className="flex items-center gap-2 mb-6 bg-white rounded-xl p-1 border border-gray-100 shadow-sm w-fit">
        {PERIODES.map(({ val, label }) => (
          <button key={val} onClick={() => setPeriode(val)}
            className="px-4 py-2 rounded-lg text-sm font-semibold transition-all"
            style={periode === val
              ? { background: '#0a6342', color: 'white' }
              : { color: '#6b7280' }}>
            {label}
          </button>
        ))}
      </div>

      {/* ── KPI Principaux ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {[
          { val: `${tauxBonneSante}%`, label: 'Animaux en bonne santé', icon: Activity, color: '#0a6342', bg: '#d9f2e3', trend: '+5%', hausse: true },
          { val: DEMO_RDV.length,      label: 'RDV total',             icon: Calendar, color: '#1d4ed8', bg: '#dbeafe', trend: '+3',   hausse: true },
          { val: DEMO_DOSSIERS.length, label: 'Dossiers médicaux',     icon: FileText, color: '#7c3aed', bg: '#ede9fe', trend: '+2',   hausse: true },
          { val: alertesNonLues,       label: 'Alertes en attente',    icon: BarChart3, color: rdvUrgents > 0 ? '#dc2626' : '#6b7280', bg: rdvUrgents > 0 ? '#fee2e2' : '#f3f4f6', trend: rdvUrgents > 0 ? '⚠️ Urgent' : 'Aucune urgence', hausse: rdvUrgents > 0 },
        ].map(({ val, label, icon: Icon, color, bg, trend, hausse }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: bg }}>
                <Icon className="w-5 h-5" style={{ color }} />
              </div>
              <div className={`flex items-center gap-0.5 text-xs font-bold ${hausse ? 'text-green-600' : 'text-gray-400'}`}>
                {hausse ? <TrendingUp className="w-3.5 h-3.5" /> : <TrendingDown className="w-3.5 h-3.5" />}
                {trend}
              </div>
            </div>
            <div className="text-3xl font-black mb-1" style={{ color, fontFamily: 'var(--font-display)' }}>{val}</div>
            <div className="text-gray-500 text-xs font-semibold">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6 mb-6">
        {/* ── Évolution mensuelle ── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-1">📈 Évolution des 6 derniers mois</h2>
          <p className="text-gray-400 text-xs mb-5">Rendez-vous et dossiers médicaux par mois</p>
          <div className="flex items-end gap-3 h-40">
            {EVOLUTION.map(({ mois, rdv, dossiers }) => (
              <div key={mois} className="flex-1 flex flex-col items-center gap-1">
                <div className="w-full flex flex-col gap-0.5 justify-end" style={{ height: '120px' }}>
                  {/* Barre RDV */}
                  <div className="w-full rounded-t-lg relative group cursor-default transition-all"
                    style={{ height: `${(rdv / maxRdv) * 100}%`, background: 'linear-gradient(180deg, #0a6342, #1d9c68)' }}>
                    <div className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
                      {rdv} RDV
                    </div>
                  </div>
                </div>
                <div className="w-full rounded-t-lg"
                  style={{ height: `${(dossiers / maxRdv) * 60}px`, background: 'linear-gradient(180deg, #1d4ed8, #3b82f6)', marginTop: '-4px' }} />
                <span className="text-xs text-gray-400 font-semibold mt-1">{mois}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 mt-3">
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-sm" style={{ background: '#0a6342' }} /> Rendez-vous
            </div>
            <div className="flex items-center gap-1.5 text-xs text-gray-500">
              <div className="w-3 h-3 rounded-sm" style={{ background: '#1d4ed8' }} /> Dossiers
            </div>
          </div>
        </div>

        {/* ── État de santé du troupeau ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-1">🏥 Santé du troupeau</h2>
          <p className="text-gray-400 text-xs mb-4">{DEMO_ANIMAUX.length} animaux au total</p>

          {/* Barre de progression globale */}
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs mb-1.5">
              <span className="font-semibold text-green-700">Bonne santé</span>
              <span className="font-black" style={{ color: '#0a6342' }}>{tauxBonneSante}%</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden" style={{ background: '#e5e7eb' }}>
              <div className="h-full rounded-full transition-all"
                style={{ width: `${tauxBonneSante}%`, background: 'linear-gradient(90deg, #0a6342, #1d9c68)' }} />
            </div>
          </div>

          <div className="space-y-2">
            {Object.entries(ETAT_SANTE_CONFIG).map(([key, conf]) => {
              const count = DEMO_ANIMAUX.filter((a) => a.etatSante === key).length;
              const pct = Math.round((count / DEMO_ANIMAUX.length) * 100);
              return (
                <div key={key}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold" style={{ color: conf.color }}>{conf.label}</span>
                    <span className="font-bold text-gray-700">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: `${conf.color}20` }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: conf.color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-6">
        {/* ── Espèces ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-4">🐄 Répartition des espèces</h2>
          <div className="space-y-3">
            {parEspece.map(([espece, count]) => {
              const pct = Math.round((count / DEMO_ANIMAUX.length) * 100);
              const label = ESPECE_LABELS[espece] ?? espece;
              return (
                <div key={espece}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold text-gray-700">{label}</span>
                    <span className="font-bold text-gray-900">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: '#e8f5ee' }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: 'linear-gradient(90deg, #0a6342, #1d9c68)' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Types de RDV ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-4">📅 Types de rendez-vous</h2>
          <div className="space-y-3">
            {parTypeRdv.map(([type, count]) => {
              const conf = TYPE_RDV_LABELS[type];
              const pct = Math.round((count / DEMO_RDV.length) * 100);
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold" style={{ color: conf?.color ?? '#6b7280' }}>{conf?.label ?? type}</span>
                    <span className="font-bold text-gray-900">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: `${conf?.color ?? '#9ca3af'}20` }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: conf?.color ?? '#9ca3af' }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* ── Types de dossiers ── */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
          <h2 className="font-black text-gray-900 mb-4">📋 Actes médicaux</h2>
          <div className="space-y-3">
            {parTypeDossier.map(([type, count]) => {
              const color = DOSSIER_COLORS[type] ?? '#6b7280';
              const pct = Math.round((count / DEMO_DOSSIERS.length) * 100);
              const emojis: Record<string, string> = { vaccin: '💉', traitement: '💊', maladie: '🤒', analyse: '🧪', prescription: '📋', operation: '🔪' };
              return (
                <div key={type}>
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="font-semibold" style={{ color }}>
                      {emojis[type] ?? '📄'} {type.charAt(0).toUpperCase() + type.slice(1)}
                    </span>
                    <span className="font-bold text-gray-900">{count} ({pct}%)</span>
                  </div>
                  <div className="h-2.5 rounded-full overflow-hidden" style={{ background: `${color}20` }}>
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── Prochains contrôles ── */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm mb-6">
        <div className="flex items-center justify-between p-5 border-b border-gray-50">
          <h2 className="font-black text-gray-900">⏰ Prochains contrôles programmés</h2>
          <Link href="/vetalert/historique" className="text-xs font-semibold flex items-center gap-1" style={{ color: '#0a6342' }}>
            Voir l&apos;historique <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
        <div className="divide-y divide-gray-50">
          {DEMO_DOSSIERS.filter((d) => d.prochainControle).map((d) => {
            const dateControle = new Date(d.prochainControle!);
            const aujourd = new Date('2026-05-25');
            const jours = Math.ceil((dateControle.getTime() - aujourd.getTime()) / 86400000);
            const color = jours <= 2 ? '#dc2626' : jours <= 7 ? '#d97706' : '#0a6342';
            return (
              <div key={d.id} className="flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 font-black text-white text-sm"
                  style={{ background: color }}>
                  J{jours >= 0 ? `+${jours}` : jours}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-gray-900 text-sm">{d.animalNom} — {d.titre}</p>
                  <p className="text-xs text-gray-500">{new Date(d.prochainControle!).toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' })}</p>
                </div>
                <div className="text-xs font-bold px-3 py-1 rounded-full" style={{ background: `${color}18`, color }}>
                  {jours <= 0 ? 'Échu' : jours <= 2 ? 'Urgent' : jours <= 7 ? 'Proche' : 'Planifié'}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Export et rapports ── */}
      <div className="grid md:grid-cols-3 gap-4">
        {[
          { icon: '📄', titre: 'Rapport mensuel', desc: 'Résumé complet de l\'activité de mai 2026', couleur: '#0a6342', bg: '#d9f2e3' },
          { icon: '💉', titre: 'Carnet vaccinal', desc: 'Historique complet de toutes les vaccinations', couleur: '#7c3aed', bg: '#ede9fe' },
          { icon: '📊', titre: 'Bilan sanitaire', desc: 'État de santé global du troupeau en PDF', couleur: '#b45309', bg: '#fef3c7' },
        ].map(({ icon, titre, desc, couleur, bg }) => (
          <button key={titre}
            onClick={() => alert(`Export "${titre}" — Disponible en version Premium (5 000 F CFA/mois)`)}
            className="text-left p-5 rounded-2xl border transition-all hover:shadow-md"
            style={{ background: bg, borderColor: `${couleur}25` }}>
            <div className="text-3xl mb-3">{icon}</div>
            <p className="font-black text-gray-900 text-sm mb-1">{titre}</p>
            <p className="text-xs text-gray-500 mb-3">{desc}</p>
            <div className="inline-flex items-center gap-1 text-xs font-bold" style={{ color: couleur }}>
              <Download className="w-3.5 h-3.5" />
              Télécharger PDF
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
