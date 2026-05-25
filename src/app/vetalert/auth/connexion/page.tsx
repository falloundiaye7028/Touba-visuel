'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Stethoscope, Eye, EyeOff, ArrowLeft, Loader2 } from 'lucide-react';

export default function ConnexionPage() {
  const router = useRouter();
  const [role, setRole] = useState<'ELEVEUR' | 'VETERINAIRE'>('ELEVEUR');
  const [showMdp, setShowMdp] = useState(false);
  const [chargement, setChargement] = useState(false);
  const [form, setForm] = useState({ email: '', motDePasse: '' });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setChargement(true);
    // Simulation d'une connexion
    await new Promise((r) => setTimeout(r, 1200));
    setChargement(false);
    router.push('/vetalert/dashboard');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#f0fdf4' }}>
      {/* Panneau gauche — décoratif */}
      <div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center p-12 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #042c1d 0%, #07402b 40%, #0a6342 70%, #1d9c68 100%)' }}>
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='20' cy='20' r='2' fill='%23ffffff'/%3E%3C/svg%3E")`, backgroundSize: '40px 40px' }} />
        <div className="relative text-center">
          <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}>
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-black text-white mb-4" style={{ fontFamily: 'var(--font-display)' }}>VetAlert</h1>
          <p className="text-green-200 text-lg max-w-sm leading-relaxed">
            La santé de vos animaux entre de bonnes mains — gestion vétérinaire intelligente pour l&apos;Afrique.
          </p>
          <div className="mt-10 grid grid-cols-2 gap-4">
            {[
              { val: '380+', label: 'Éleveurs', emoji: '👨‍🌾' },
              { val: '95%', label: 'Rappels envoyés', emoji: '🔔' },
              { val: '6', label: 'Pays couverts', emoji: '🌍' },
              { val: '2 400+', label: 'Animaux suivis', emoji: '🐄' },
            ].map((s) => (
              <div key={s.label} className="rounded-xl p-4 border text-center" style={{ background: 'rgba(255,255,255,0.07)', borderColor: 'rgba(255,255,255,0.15)' }}>
                <div className="text-xl mb-1">{s.emoji}</div>
                <div className="text-xl font-black text-white" style={{ fontFamily: 'var(--font-display)' }}>{s.val}</div>
                <div className="text-green-300 text-xs mt-0.5">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Panneau droit — formulaire */}
      <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 md:p-12">
        <div className="w-full max-w-md">
          <Link href="/vetalert" className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-8 transition-colors">
            <ArrowLeft className="w-4 h-4" />
            Retour à l&apos;accueil
          </Link>

          {/* Logo mobile */}
          <div className="flex items-center gap-3 mb-8 lg:hidden">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black" style={{ color: '#0a6342', fontFamily: 'var(--font-display)' }}>VetAlert</span>
          </div>

          <h2 className="text-3xl font-black text-gray-900 mb-2" style={{ fontFamily: 'var(--font-display)' }}>Bon retour ! 👋</h2>
          <p className="text-gray-500 mb-8">Connectez-vous à votre espace VetAlert</p>

          {/* Sélecteur de rôle */}
          <div className="flex rounded-xl p-1 mb-6" style={{ background: '#e8f5ee' }}>
            {(['ELEVEUR', 'VETERINAIRE'] as const).map((r) => (
              <button key={r} onClick={() => setRole(r)}
                className="flex-1 py-2.5 rounded-lg text-sm font-bold transition-all"
                style={role === r ? { background: '#0a6342', color: 'white', boxShadow: '0 2px 8px rgba(10,99,66,0.3)' } : { color: '#4b5563' }}>
                {r === 'ELEVEUR' ? '👨‍🌾 Éleveur' : '🩺 Vétérinaire'}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Adresse email</label>
              <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder={role === 'ELEVEUR' ? 'mamadou.ndiaye@ferme.sn' : 'dr.diallo@cabinet.sn'}
                className="input-field" required />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">Mot de passe</label>
              <div className="relative">
                <input type={showMdp ? 'text' : 'password'} value={form.motDePasse}
                  onChange={(e) => setForm({ ...form, motDePasse: e.target.value })}
                  placeholder="Votre mot de passe" className="input-field pr-12" required />
                <button type="button" onClick={() => setShowMdp(!showMdp)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors">
                  {showMdp ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>
            <div className="flex justify-end">
              <a href="#" className="text-sm font-semibold transition-colors" style={{ color: '#0a6342' }}>
                Mot de passe oublié ?
              </a>
            </div>

            <button type="submit" disabled={chargement}
              className="w-full py-3.5 rounded-xl font-black text-white flex items-center justify-center gap-2 transition-all hover:opacity-90 disabled:opacity-70"
              style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
              {chargement ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Connexion en cours...
                </>
              ) : (
                'Se connecter'
              )}
            </button>
          </form>

          {/* Comptes de démo */}
          <div className="mt-6 p-4 rounded-xl border" style={{ background: '#f0fdf4', borderColor: '#b3e5c8' }}>
            <p className="text-xs font-bold text-green-700 mb-2 uppercase tracking-wider">Comptes de démonstration</p>
            <div className="space-y-1">
              <button onClick={() => { setRole('VETERINAIRE'); setForm({ email: 'amadou.diallo@vetalert.sn', motDePasse: 'demo1234' }); }}
                className="w-full text-left text-xs text-green-700 hover:text-green-900 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors">
                🩺 Vétérinaire : amadou.diallo@vetalert.sn
              </button>
              <button onClick={() => { setRole('ELEVEUR'); setForm({ email: 'mamadou.ndiaye@ferme.sn', motDePasse: 'demo1234' }); }}
                className="w-full text-left text-xs text-green-700 hover:text-green-900 px-2 py-1 rounded-lg hover:bg-green-100 transition-colors">
                👨‍🌾 Éleveur : mamadou.ndiaye@ferme.sn
              </button>
            </div>
          </div>

          <p className="text-center text-gray-500 text-sm mt-6">
            Pas encore de compte ?{' '}
            <Link href="/vetalert/auth/inscription" className="font-bold transition-colors" style={{ color: '#0a6342' }}>
              Créer un compte gratuitement
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
