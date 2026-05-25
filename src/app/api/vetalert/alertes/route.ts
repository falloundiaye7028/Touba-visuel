import { NextResponse } from 'next/server';
import { DEMO_ALERTES } from '@/lib/vetalert/data';

/**
 * GET /api/vetalert/alertes
 * Liste les alertes d'un utilisateur
 *
 * Query params :
 *   - utilisateurId  : filtrer par destinataire
 *   - lue            : true|false — filtrer par état de lecture
 *   - priorite       : normale|haute|urgente
 *   - type           : vaccin|traitement|rendez_vous|urgence|controle|rappel
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const lue      = searchParams.get('lue');
    const priorite = searchParams.get('priorite') ?? '';
    const type     = searchParams.get('type') ?? '';

    // En production :
    // const alertes = await prisma.alerte.findMany({
    //   where: {
    //     utilisateurId,
    //     ...(lue !== null ? { lue: lue === 'true' } : {}),
    //     ...(priorite ? { priorite: priorite.toUpperCase() as PrioriteAlerte } : {}),
    //     ...(type     ? { type:     type.toUpperCase()     as TypeAlerte }     : {}),
    //   },
    //   include: { animal: { select: { id: true, nom: true, espece: true } } },
    //   orderBy: [
    //     { priorite: 'desc' },
    //     { dateEnvoi: 'desc' },
    //   ],
    // });

    let alertes = [...DEMO_ALERTES];
    if (lue !== null)  alertes = alertes.filter((a) => a.lue === (lue === 'true'));
    if (priorite)      alertes = alertes.filter((a) => a.priorite === priorite);
    if (type)          alertes = alertes.filter((a) => a.type === type);

    // Trier : urgentes d'abord, puis non lues, puis par date
    alertes.sort((a, b) => {
      const poids = { urgente: 3, haute: 2, normale: 1 } as Record<string, number>;
      const diffPriorite = (poids[b.priorite] ?? 0) - (poids[a.priorite] ?? 0);
      if (diffPriorite !== 0) return diffPriorite;
      if (!a.lue && b.lue) return -1;
      if (a.lue && !b.lue) return 1;
      return new Date(b.date).getTime() - new Date(a.date).getTime();
    });

    const nonLues = alertes.filter((a) => !a.lue).length;
    const urgentes = alertes.filter((a) => a.priorite === 'urgente').length;

    return NextResponse.json({ success: true, data: alertes, total: alertes.length, meta: { nonLues, urgentes } });
  } catch (error) {
    console.error('[API] GET /vetalert/alertes :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
