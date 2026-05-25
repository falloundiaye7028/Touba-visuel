import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: {
    template: '%s | VetAlert',
    default: 'VetAlert — Gestion vétérinaire intelligente',
  },
  description: 'Application de gestion vétérinaire et de suivi des animaux d\'élevage. Rappels automatiques, historique médical, tableau de bord pour vétérinaires et éleveurs.',
  keywords: ['vétérinaire', 'élevage', 'animaux', 'vaccin', 'rendez-vous', 'Sénégal', 'Afrique'],
};

export default function VetAlertLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
