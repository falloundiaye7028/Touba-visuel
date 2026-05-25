import Link from 'next/link';
import { Bell, Shield, Calendar, Activity, Users, TrendingUp, CheckCircle, ArrowRight, Stethoscope, Heart } from 'lucide-react';

const fonctionnalites = [
  {
    icon: <Bell className="w-7 h-7" style={{ color: '#ffc800' }} />,
    titre: 'Alertes automatiques',
    desc: 'Rappels vaccins, traitements et rendez-vous envoyés automatiquement par SMS et notification mobile.',
  },
  {
    icon: <Activity className="w-7 h-7" style={{ color: '#ffc800' }} />,
    titre: 'Suivi médical complet',
    desc: 'Historique des maladies, vaccins, traitements et analyses pour chaque animal.',
  },
  {
    icon: <Calendar className="w-7 h-7" style={{ color: '#ffc800' }} />,
    titre: 'Gestion des rendez-vous',
    desc: 'Planifiez, modifiez et annulez les consultations vétérinaires depuis votre téléphone.',
  },
  {
    icon: <Shield className="w-7 h-7" style={{ color: '#ffc800' }} />,
    titre: 'Données sécurisées',
    desc: 'Toutes les informations de vos animaux sont protégées et sauvegardées dans le cloud.',
  },
  {
    icon: <Users className="w-7 h-7" style={{ color: '#ffc800' }} />,
    titre: 'Multi-utilisateurs',
    desc: 'Vétérinaires et éleveurs collaborent en temps réel sur le même dossier animal.',
  },
  {
    icon: <TrendingUp className="w-7 h-7" style={{ color: '#ffc800' }} />,
    titre: 'Tableaux de bord',
    desc: 'Statistiques et rapports clairs pour piloter la santé de votre élevage.',
  },
];

const avantages = [
  'Réduction des oublis de rendez-vous vétérinaires',
  'Meilleure santé des animaux grâce aux rappels',
  'Gain de temps pour les vétérinaires et éleveurs',
  'Historique médical complet et accessible partout',
  'Communication simplifiée éleveur-vétérinaire',
  'Conformité aux normes sanitaires nationales',
];

const stats = [
  { val: '2 400+', label: 'Animaux suivis', emoji: '🐄' },
  { val: '380+',   label: 'Éleveurs inscrits', emoji: '👨‍🌾' },
  { val: '95%',    label: 'Rappels envoyés', emoji: '🔔' },
  { val: '12',     label: 'Pays d\'Afrique', emoji: '🌍' },
];

export default function VetAlertLanding() {
  return (
    <div className="min-h-screen" style={{ background: '#f0fdf4' }}>

      {/* ── Header ── */}
      <header className="sticky top-0 z-50 border-b border-green-100" style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(10px)' }}>
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black" style={{ color: '#0a6342', fontFamily: 'var(--font-display)' }}>VetAlert</span>
          </div>
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-600">
            <a href="#fonctionnalites" className="hover:text-green-700 transition-colors">Fonctionnalités</a>
            <a href="#tarifs" className="hover:text-green-700 transition-colors">Tarifs</a>
            <a href="#contact" className="hover:text-green-700 transition-colors">Contact</a>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/vetalert/auth/connexion" className="text-sm font-semibold px-4 py-2 rounded-xl border border-green-700 text-green-700 hover:bg-green-50 transition-colors">
              Connexion
            </Link>
            <Link href="/vetalert/auth/inscription" className="text-sm font-bold px-4 py-2 rounded-xl text-white transition-all hover:opacity-90" style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
              Commencer
            </Link>
          </div>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #042c1d 0%, #07402b 40%, #0a6342 70%, #1d9c68 100%)' }}>
        {/* Motif décoratif */}
        <div className="absolute inset-0 opacity-5 pointer-events-none"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='3' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundSize: '40px 40px' }}
        />
        <div className="relative max-w-7xl mx-auto px-4 py-24 md:py-32">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider mb-6 border"
                style={{ background: 'rgba(255,200,0,0.15)', borderColor: 'rgba(255,200,0,0.4)', color: '#ffc800' }}>
                <Heart className="w-3.5 h-3.5" />
                Santé animale intelligente
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white mb-6 leading-tight" style={{ fontFamily: 'var(--font-display)' }}>
                Gérez la santé
                <span className="block" style={{ WebkitTextStroke: '2px #ffc800', color: 'transparent' }}>
                  de votre élevage
                </span>
                avec VetAlert
              </h1>
              <p className="text-green-200 text-lg mb-8 leading-relaxed max-w-lg">
                L&apos;application vétérinaire qui connecte éleveurs et vétérinaires.
                Rappels automatiques, dossiers médicaux et suivi complet de vos animaux — partout, à tout moment.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/vetalert/auth/inscription" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-black text-gray-900 transition-all hover:scale-105"
                  style={{ background: 'linear-gradient(135deg, #ffc800, #ff7a2a)' }}>
                  Essai gratuit — 30 jours
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <Link href="/vetalert/dashboard" className="inline-flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-white border-2 border-white/30 hover:bg-white/10 transition-all">
                  Voir la démo
                </Link>
              </div>
              <p className="text-green-400 text-sm mt-4">✓ Sans carte bancaire · ✓ Jusqu&apos;à 5 animaux gratuits</p>
            </div>

            {/* Dashboard preview */}
            <div className="relative">
              <div className="rounded-3xl p-6 border" style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
                {/* Header card */}
                <div className="flex items-center justify-between mb-5">
                  <div>
                    <p className="text-green-300 text-xs font-semibold uppercase tracking-wider">Tableau de bord</p>
                    <p className="text-white font-bold text-lg">Bonjour, Dr. Diallo 👋</p>
                  </div>
                  <div className="relative">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: 'rgba(255,200,0,0.2)' }}>
                      <Bell className="w-5 h-5" style={{ color: '#ffc800' }} />
                    </div>
                    <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center font-bold">3</span>
                  </div>
                </div>
                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                  {[
                    { val: '6', label: 'Animaux suivis', color: '#1d9c68' },
                    { val: '3', label: 'RDV aujourd\'hui', color: '#ffc800' },
                    { val: '2', label: 'Alertes urgentes', color: '#dc2626' },
                    { val: '1', label: 'En traitement', color: '#1d4ed8' },
                  ].map((s) => (
                    <div key={s.label} className="rounded-2xl p-3 border text-center" style={{ background: `${s.color}18`, borderColor: `${s.color}30` }}>
                      <div className="text-2xl font-black" style={{ color: s.color }}>{s.val}</div>
                      <div className="text-green-300 text-xs mt-0.5">{s.label}</div>
                    </div>
                  ))}
                </div>
                {/* Alert preview */}
                <div className="rounded-xl p-3 border" style={{ background: 'rgba(220,38,38,0.08)', borderColor: 'rgba(220,38,38,0.25)' }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-base">🚨</span>
                    <span className="text-red-300 text-xs font-bold uppercase tracking-wide">Urgence</span>
                  </div>
                  <p className="text-white text-sm font-medium">Bella (chèvre) — Fièvre 41.5°C</p>
                  <p className="text-red-300 text-xs mt-0.5">Intervention immédiate recommandée</p>
                </div>
              </div>
              {/* Glow */}
              <div className="absolute -bottom-10 -right-10 w-48 h-48 rounded-full opacity-20 blur-3xl pointer-events-none" style={{ background: '#1d9c68' }} />
            </div>
          </div>
        </div>
      </section>

      {/* ── Stats ── */}
      <section className="py-12 bg-white border-y border-green-100">
        <div className="max-w-5xl mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((s) => (
              <div key={s.label}>
                <div className="text-3xl mb-1">{s.emoji}</div>
                <div className="text-3xl font-black mb-1" style={{ color: '#0a6342', fontFamily: 'var(--font-display)' }}>{s.val}</div>
                <div className="text-gray-500 text-sm">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Fonctionnalités ── */}
      <section id="fonctionnalites" className="py-20 px-4" style={{ background: '#f0fdf4' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3" style={{ color: '#0a6342', fontFamily: 'var(--font-display)' }}>
              Tout ce dont vous avez besoin
            </h2>
            <p className="text-gray-500 text-lg max-w-2xl mx-auto">
              VetAlert simplifie la gestion vétérinaire pour les éleveurs et les vétérinaires d&apos;Afrique.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {fonctionnalites.map((f) => (
              <div key={f.titre} className="bg-white rounded-2xl p-6 border border-green-100 shadow-sm hover:shadow-md transition-shadow">
                <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
                  {f.icon}
                </div>
                <h3 className="font-bold text-gray-900 text-base mb-2">{f.titre}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Avantages ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-14 items-center">
            <div>
              <h2 className="text-4xl font-black mb-6" style={{ color: '#0a6342', fontFamily: 'var(--font-display)' }}>
                Pourquoi choisir VetAlert ?
              </h2>
              <ul className="space-y-3">
                {avantages.map((a) => (
                  <li key={a} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: '#1d9c68' }} />
                    <span className="text-gray-700">{a}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/vetalert/auth/inscription" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-bold text-white transition-all hover:opacity-90"
                  style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
                  Créer mon compte
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Vétérinaires', desc: 'Gérez vos clients, programmez les soins et suivez les dossiers médicaux depuis votre smartphone.', emoji: '🩺', bg: '#d9f2e3', color: '#0a6342' },
                { label: 'Éleveurs', desc: 'Recevez les rappels de soins, visualisez l\'état de santé de votre troupeau en temps réel.', emoji: '👨‍🌾', bg: '#fef3c7', color: '#b45309' },
                { label: 'Cliniques', desc: 'Coordonnez une équipe de vétérinaires et gérez des milliers de dossiers patients.', emoji: '🏥', bg: '#dbeafe', color: '#1d4ed8' },
                { label: 'Fermes', desc: 'Optimisez la santé de votre élevage avec des statistiques et des rapports automatiques.', emoji: '🌾', bg: '#fce7f3', color: '#db2777' },
              ].map((c) => (
                <div key={c.label} className="rounded-2xl p-5 border" style={{ background: c.bg, borderColor: `${c.color}25` }}>
                  <div className="text-3xl mb-3">{c.emoji}</div>
                  <div className="font-bold mb-1" style={{ color: c.color }}>{c.label}</div>
                  <p className="text-sm text-gray-600 leading-relaxed">{c.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Tarifs ── */}
      <section id="tarifs" className="py-20 px-4" style={{ background: '#f0fdf4' }}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-black mb-3" style={{ color: '#0a6342', fontFamily: 'var(--font-display)' }}>Nos tarifs</h2>
            <p className="text-gray-500 text-lg">Simple, transparent, adapté à l&apos;Afrique</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {/* Gratuit */}
            <div className="bg-white rounded-3xl p-8 border border-green-100 shadow-sm">
              <div className="text-sm font-bold uppercase tracking-wider text-gray-500 mb-2">Gratuit</div>
              <div className="text-5xl font-black mb-1" style={{ color: '#0a6342' }}>0 F</div>
              <div className="text-gray-400 text-sm mb-6">Pour toujours</div>
              <ul className="space-y-3 mb-8">
                {['Jusqu\'à 5 animaux', 'Notifications mobile', 'Calendrier de base', 'Historique 3 mois'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-gray-700 text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#1d9c68' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/vetalert/auth/inscription" className="block text-center py-3 rounded-xl font-bold border-2 border-green-700 text-green-700 hover:bg-green-50 transition-colors">
                Commencer gratuitement
              </Link>
            </div>
            {/* Premium */}
            <div className="rounded-3xl p-8 shadow-xl relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
              <div className="absolute top-4 right-4 bg-or-400 text-gray-900 text-xs font-black px-3 py-1 rounded-full" style={{ background: '#ffc800' }}>
                Recommandé
              </div>
              <div className="text-sm font-bold uppercase tracking-wider text-green-300 mb-2">Premium</div>
              <div className="text-5xl font-black mb-1 text-white">5 000 F</div>
              <div className="text-green-300 text-sm mb-6">par mois · FCFA</div>
              <ul className="space-y-3 mb-8">
                {['Animaux illimités', 'Alertes SMS incluses', 'Rapports avancés PDF', 'Multi-utilisateurs', 'Support prioritaire 24/7', 'Historique illimité'].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-white text-sm">
                    <CheckCircle className="w-4 h-4 flex-shrink-0" style={{ color: '#ffc800' }} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href="/vetalert/auth/inscription" className="block text-center py-3 rounded-xl font-black text-gray-900 transition-all hover:opacity-90"
                style={{ background: 'linear-gradient(135deg, #ffc800, #ff7a2a)' }}>
                Démarrer l&apos;essai gratuit
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA Final ── */}
      <section className="py-20 px-4" style={{ background: 'linear-gradient(135deg, #042c1d, #07402b)' }}>
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-black text-white mb-5" style={{ fontFamily: 'var(--font-display)' }}>
            Prêt à moderniser votre élevage ?
          </h2>
          <p className="text-green-300 text-lg mb-8">
            Rejoignez plus de 380 éleveurs et vétérinaires qui font confiance à VetAlert en Afrique.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/vetalert/auth/inscription" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-black text-gray-900 text-base transition-all hover:scale-105"
              style={{ background: 'linear-gradient(135deg, #ffc800, #ff7a2a)' }}>
              Créer mon compte gratuit
              <ArrowRight className="w-5 h-5" />
            </Link>
            <Link href="/vetalert/dashboard" className="inline-flex items-center gap-2 px-8 py-4 rounded-xl font-bold text-white border-2 border-white/25 hover:bg-white/10 transition-all text-base">
              Voir la démo →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer id="contact" className="bg-black/30 border-t border-white/10 py-10" style={{ background: '#042c1d' }}>
        <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #1d9c68, #0a6342)' }}>
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>VetAlert</span>
          </div>
          <p className="text-green-400 text-sm">© 2026 VetAlert — Santé animale intelligente pour l&apos;Afrique</p>
          <div className="flex gap-5 text-green-400 text-sm">
            <a href="mailto:contact@vetalert.sn" className="hover:text-white transition-colors">contact@vetalert.sn</a>
            <a href="https://wa.me/221768001717" className="hover:text-white transition-colors">WhatsApp</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
