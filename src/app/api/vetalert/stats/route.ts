import { NextResponse } from 'next/server';
import { DEMO_ANIMAUX, DEMO_RDV, DEMO_ALERTES, DEMO_DOSSIERS } from '@/lib/vetalert/data';

/**
 * GET /api/vetalert/stats
 * Tableau de bord analytique — chiffres clés pour vétérinaire ou éleveur
 *
 * Query params :
 *   - role          : VETERINAIRE|ELEVEUR
 *   - utilisateurId : ID de l'utilisateur
 *   - periode       : 7j|30j|90j|annee  (défaut: 30j)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const role    = searchParams.get('role') ?? 'VETERINAIRE';
    const periode = searchParams.get('periode') ?? '30j';

    // En production : requêtes Prisma agrégées
    // const [nbAnimaux, nbRdv, nbAlertes, nbDossiers, rdvParType, etatSante, timeline] = await Promise.all([
    //   prisma.animal.count({ where: { actif: true } }),
    //   prisma.rendezVous.count({ where: { date: { gte: dateDebut } } }),
    //   prisma.alerte.count({ where: { lue: false } }),
    //   prisma.dossierMedical.count({ where: { date: { gte: dateDebut } } }),
    //   prisma.rendezVous.groupBy({ by: ['type'], _count: true }),
    //   prisma.animal.groupBy({ by: ['etatSante'], _count: true }),
    //   // timeline mensuelle
    // ]);

    // Calculs demo
    const etatSanteStats = Object.entries(
      DEMO_ANIMAUX.reduce((acc, a) => {
        acc[a.etatSante] = (acc[a.etatSante] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([etat, count]) => ({ etat, count }));

    const rdvParTypeStats = Object.entries(
      DEMO_RDV.reduce((acc, r) => {
        acc[r.type] = (acc[r.type] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([type, count]) => ({ type, count }));

    const dossierParTypeStats = Object.entries(
      DEMO_DOSSIERS.reduce((acc, d) => {
        acc[d.type] = (acc[d.type] ?? 0) + 1;
        return acc;
      }, {} as Record<string, number>)
    ).map(([type, count]) => ({ type, count }));

    const rdvAVenir   = DEMO_RDV.filter((r) => ['programme', 'confirme'].includes(r.statut)).length;
    const rdvUrgents  = DEMO_RDV.filter((r) => r.statut === 'urgent').length;
    const alertesNonLues = DEMO_ALERTES.filter((a) => !a.lue).length;
    const animauxSousTraitement = DEMO_ANIMAUX.filter((a) => ['malade', 'critique', 'en_traitement'].includes(a.etatSante)).length;

    // Prochains contrôles
    const prochainControles = DEMO_DOSSIERS
      .filter((d) => d.prochainControle && d.prochainControle >= new Date().toISOString().split('T')[0])
      .sort((a, b) => (a.prochainControle ?? '').localeCompare(b.prochainControle ?? ''))
      .slice(0, 5);

    const stats = {
      resume: {
        nbAnimaux:             DEMO_ANIMAUX.length,
        animauxSousTraitement,
        nbRdvAVenir:           rdvAVenir,
        rdvUrgents,
        alertesNonLues,
        nbDossiers:            DEMO_DOSSIERS.length,
        tauxBonneSante:        Math.round((DEMO_ANIMAUX.filter((a) => a.etatSante === 'bonne_sante').length / DEMO_ANIMAUX.length) * 100),
      },
      graphiques: {
        etatSante:       etatSanteStats,
        rdvParType:      rdvParTypeStats,
        dossierParType:  dossierParTypeStats,
        // Évolution mensuelle sur 6 mois (simulée)
        evolutionMensuelle: [
          { mois: 'Déc', rdv: 8,  dossiers: 5 },
          { mois: 'Jan', rdv: 12, dossiers: 7 },
          { mois: 'Fév', rdv: 10, dossiers: 6 },
          { mois: 'Mar', rdv: 15, dossiers: 9 },
          { mois: 'Avr', rdv: 11, dossiers: 8 },
          { mois: 'Mai', rdv: 6,  dossiers: 4 },
        ],
      },
      prochainControles,
      role,
      periode,
    };

    return NextResponse.json({ success: true, data: stats });
  } catch (error) {
    console.error('[API] GET /vetalert/stats :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
