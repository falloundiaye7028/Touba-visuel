'use client';

import { useState } from 'react';
import { Edit, Save, Phone, Mail, MapPin, Award, Stethoscope, Bell, Shield, LogOut, Crown } from 'lucide-react';
import Link from 'next/link';
import { DEMO_ANIMAUX, DEMO_RDV } from '@/lib/vetalert/data';

export default function ProfilPage() {
  const [editer, setEditer] = useState(false);
  const [profil, setProfil] = useState({
    nom: 'Dr. Amadou Diallo',
    email: 'amadou.diallo@vetalert.sn',
    telephone: '+221 77 123 45 67',
    specialite: 'Bovins & Petits Ruminants',
    numeroOrdre: 'ONVS-2021-0456',
    cabinet: 'Cabinet Vétérinaire Diallo',
    localisation: 'Thiès, Sénégal',
  });

  const statsCompte = [
    { val: DEMO_ANIMAUX.length, label: 'Animaux suivis', emoji: '🐄', color: '#0a6342' },
    { val: DEMO_RDV.length, label: 'RDV planifiés', emoji: '📅', color: '#1d4ed8' },
    { val: 12, label: 'Mois actif', emoji: '📆', color: '#7c3aed' },
    { val: 24, label: 'Dossiers créés', emoji: '📋', color: '#b45309' },
  ];

  return (
    <div className="p-4 md:p-6 max-w-3xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>
            👤 Mon profil
          </h1>
          <p className="text-gray-500 text-sm mt-0.5">Gérez vos informations professionnelles</p>
        </div>
        <button onClick={() => setEditer(!editer)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all"
          style={editer
            ? { background: 'linear-gradient(135deg, #0a6342, #1d9c68)', color: 'white' }
            : { background: '#d9f2e3', color: '#0a6342' }}>
          {editer ? <><Save className="w-4 h-4" /> Enregistrer</> : <><Edit className="w-4 h-4" /> Modifier</>}
        </button>
      </div>

      {/* Carte profil */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        {/* Bannière */}
        <div className="h-24 relative" style={{ background: 'linear-gradient(135deg, #042c1d, #07402b, #0a6342)' }}>
          <div className="absolute inset-0 opacity-10"
            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='30' viewBox='0 0 30 30' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='15' cy='15' r='2' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundSize: '30px 30px' }} />
        </div>

        <div className="px-6 pb-6">
          {/* Avatar */}
          <div className="flex items-end gap-4 -mt-10 mb-4">
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-black text-white border-4 border-white shadow-lg"
              style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
              D
            </div>
            <div className="pb-2">
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black text-gray-900">{profil.nom}</h2>
                <div className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold"
                  style={{ background: '#fef3c7', color: '#b45309' }}>
                  <Crown className="w-3.5 h-3.5" />
                  Premium
                </div>
              </div>
              <p className="text-gray-500 text-sm flex items-center gap-1.5 mt-0.5">
                <Stethoscope className="w-3.5 h-3.5" />
                {profil.specialite}
              </p>
            </div>
          </div>

          {/* Infos éditables */}
          <div className="grid grid-cols-1 gap-4">
            {[
              { icon: Mail, label: 'Email', key: 'email', type: 'email' },
              { icon: Phone, label: 'Téléphone', key: 'telephone', type: 'tel' },
              { icon: MapPin, label: 'Localisation', key: 'localisation', type: 'text' },
              { icon: Stethoscope, label: 'Spécialité', key: 'specialite', type: 'text' },
              { icon: Award, label: 'N° d\'ordre ONVS', key: 'numeroOrdre', type: 'text' },
            ].map(({ icon: Icon, label, key, type }) => (
              <div key={key} className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: '#f0fdf4' }}>
                  <Icon className="w-4 h-4" style={{ color: '#0a6342' }} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-500 mb-0.5">{label}</p>
                  {editer ? (
                    <input type={type} value={profil[key as keyof typeof profil]}
                      onChange={(e) => setProfil({ ...profil, [key]: e.target.value })}
                      className="input-field py-1.5 text-sm" />
                  ) : (
                    <p className="text-sm font-semibold text-gray-900">{profil[key as keyof typeof profil]}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {statsCompte.map(({ val, label, emoji, color }) => (
          <div key={label} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 text-center">
            <div className="text-2xl mb-1">{emoji}</div>
            <div className="text-2xl font-black mb-0.5" style={{ color, fontFamily: 'var(--font-display)' }}>{val}</div>
            <div className="text-xs text-gray-500 font-semibold">{label}</div>
          </div>
        ))}
      </div>

      {/* Abonnement */}
      <div className="mb-6 rounded-2xl p-5 border" style={{ background: 'linear-gradient(135deg, #042c1d, #07402b)', borderColor: '#0a6342' }}>
        <div className="flex items-center justify-between flex-wrap gap-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Crown className="w-5 h-5" style={{ color: '#ffc800' }} />
              <span className="font-black text-white">Abonnement Premium</span>
            </div>
            <p className="text-green-300 text-sm">Actif jusqu&apos;au 25 juin 2026 · 5 000 F CFA/mois</p>
            <p className="text-green-400 text-xs mt-0.5">✓ Animaux illimités · ✓ Alertes SMS · ✓ Rapports PDF</p>
          </div>
          <button className="px-4 py-2 rounded-xl text-sm font-bold text-gray-900 transition-all hover:opacity-90"
            style={{ background: 'linear-gradient(135deg, #ffc800, #ff7a2a)' }}>
            Gérer l&apos;abonnement
          </button>
        </div>
      </div>

      {/* Paramètres */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mb-6">
        <div className="p-5 border-b border-gray-50">
          <h2 className="font-black text-gray-900">⚙️ Paramètres</h2>
        </div>
        <div className="divide-y divide-gray-50">
          {[
            { icon: Bell, label: 'Notifications push', desc: 'Alertes temps réel sur votre téléphone', actif: true },
            { icon: Bell, label: 'Alertes SMS', desc: 'Messages SMS pour les rappels urgents', actif: true },
            { icon: Shield, label: 'Double authentification', desc: 'Sécurité renforcée pour votre compte', actif: false },
          ].map(({ icon: Icon, label, desc, actif }) => (
            <div key={label} className="flex items-center justify-between p-4">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#f0fdf4' }}>
                  <Icon className="w-4 h-4" style={{ color: '#0a6342' }} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-900">{label}</p>
                  <p className="text-xs text-gray-500">{desc}</p>
                </div>
              </div>
              <div className="relative">
                <input type="checkbox" defaultChecked={actif}
                  className="w-10 h-5 appearance-none rounded-full border-2 checked:border-green-700 transition-all cursor-pointer"
                  style={{ background: actif ? '#0a6342' : '#e5e7eb', borderColor: actif ? '#0a6342' : '#d1d5db' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Déconnexion */}
      <Link href="/vetalert/auth/connexion"
        className="flex items-center justify-center gap-2 w-full py-3.5 rounded-xl font-bold border-2 border-red-200 text-red-600 hover:bg-red-50 transition-colors">
        <LogOut className="w-5 h-5" />
        Se déconnecter
      </Link>
    </div>
  );
}
