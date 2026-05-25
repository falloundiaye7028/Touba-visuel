'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, PawPrint, Calendar, Bell, ClipboardList, User, Stethoscope, LogOut, ChevronRight, BarChart3,
} from 'lucide-react';

const navItems = [
  { href: '/vetalert/dashboard',   label: 'Tableau de bord', icon: LayoutDashboard },
  { href: '/vetalert/animaux',     label: 'Mes animaux',     icon: PawPrint },
  { href: '/vetalert/rendez-vous', label: 'Rendez-vous',     icon: Calendar },
  { href: '/vetalert/alertes',     label: 'Alertes',         icon: Bell, badge: 2 },
  { href: '/vetalert/historique',  label: 'Historique',      icon: ClipboardList },
  { href: '/vetalert/stats',       label: 'Statistiques',    icon: BarChart3 },
  { href: '/vetalert/profil',      label: 'Mon profil',      icon: User },
];

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="min-h-screen flex" style={{ background: '#f0fdf4' }}>

      {/* ── Sidebar desktop ── */}
      <aside className="hidden lg:flex lg:flex-col w-64 fixed top-0 left-0 h-full border-r border-green-100 bg-white z-40">
        {/* Logo */}
        <div className="p-5 border-b border-green-100">
          <Link href="/vetalert" className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
              <Stethoscope className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-black" style={{ color: '#0a6342', fontFamily: 'var(--font-display)' }}>VetAlert</span>
          </Link>
        </div>

        {/* Profil rapide */}
        <div className="p-4 border-b border-green-50">
          <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f0fdf4' }}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold text-white flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
              D
            </div>
            <div className="min-w-0">
              <div className="font-bold text-gray-900 text-sm truncate">Dr. Amadou Diallo</div>
              <div className="text-xs text-green-700 font-medium">🩺 Vétérinaire</div>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ href, label, icon: Icon, badge }) => {
            const actif = pathname === href || pathname.startsWith(href + '/');
            return (
              <Link key={href} href={href}
                className="flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl transition-all group"
                style={actif
                  ? { background: 'linear-gradient(135deg, #0a6342, #1d9c68)', color: 'white' }
                  : { color: '#374151' }}>
                <div className="flex items-center gap-3">
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="text-sm font-semibold">{label}</span>
                </div>
                <div className="flex items-center gap-1">
                  {badge && (
                    <span className="w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center"
                      style={actif ? { background: 'rgba(255,255,255,0.3)' } : { background: '#dc2626', color: 'white' }}>
                      {badge}
                    </span>
                  )}
                  <ChevronRight className={`w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity ${actif ? 'opacity-60' : ''}`} />
                </div>
              </Link>
            );
          })}
        </nav>

        {/* Déconnexion */}
        <div className="p-3 border-t border-green-100">
          <Link href="/vetalert/auth/connexion"
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-500 hover:text-red-600 hover:bg-red-50 transition-all text-sm font-semibold">
            <LogOut className="w-5 h-5" />
            Déconnexion
          </Link>
        </div>
      </aside>

      {/* ── Contenu principal ── */}
      <main className="flex-1 lg:ml-64 pb-20 lg:pb-0 min-h-screen">
        {/* Header mobile */}
        <header className="lg:hidden sticky top-0 z-30 border-b border-green-100 bg-white flex items-center justify-between px-4 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #0a6342, #1d9c68)' }}>
              <Stethoscope className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-gray-900" style={{ fontFamily: 'var(--font-display)' }}>VetAlert</span>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/vetalert/alertes" className="relative w-9 h-9 flex items-center justify-center rounded-xl hover:bg-green-50 transition-colors">
              <Bell className="w-5 h-5 text-gray-600" />
              <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-bold">2</span>
            </Link>
          </div>
        </header>

        {children}
      </main>

      {/* ── Navigation bottom mobile ── */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 border-t border-green-100 bg-white flex">
        {navItems.slice(0, 5).map(({ href, label, icon: Icon, badge }) => {
          const actif = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link key={href} href={href}
              className="flex-1 flex flex-col items-center justify-center py-2.5 gap-0.5 transition-colors relative"
              style={{ color: actif ? '#0a6342' : '#9ca3af' }}>
              <div className="relative">
                <Icon className="w-5 h-5" />
                {badge && (
                  <span className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-red-500 text-white text-xs flex items-center justify-center rounded-full font-bold" style={{ fontSize: '9px' }}>
                    {badge}
                  </span>
                )}
              </div>
              <span className="text-xs font-semibold leading-none" style={{ fontSize: '10px' }}>{label.split(' ')[0]}</span>
              {actif && (
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{ background: '#0a6342' }} />
              )}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
