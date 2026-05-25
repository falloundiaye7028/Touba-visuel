import { NextResponse } from 'next/server';
import { DEMO_RDV } from '@/lib/vetalert/data';

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/vetalert/rendez-vous/[id]
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const rdv = DEMO_RDV.find((r) => r.id === id);
    if (!rdv) return NextResponse.json({ success: false, error: 'Rendez-vous introuvable' }, { status: 404 });
    return NextResponse.json({ success: true, data: rdv });
  } catch (error) {
    console.error('[API] GET /vetalert/rendez-vous/[id] :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * PATCH /api/vetalert/rendez-vous/[id]
 * Modifier un rendez-vous (statut, heure, lieu, notes…)
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();
    const rdv = DEMO_RDV.find((r) => r.id === id);
    if (!rdv) return NextResponse.json({ success: false, error: 'Rendez-vous introuvable' }, { status: 404 });

    // Statuts autorisés
    if (body.statut && !['programme', 'confirme', 'termine', 'annule', 'urgent'].includes(body.statut)) {
      return NextResponse.json({ success: false, error: 'Statut invalide' }, { status: 400 });
    }

    // En production :
    // const rdvMisAJour = await prisma.rendezVous.update({
    //   where: { id },
    //   data: { ...body, updatedAt: new Date() },
    //   include: { animal: true },
    // });
    // Si annulé : envoyer notification à l'éleveur
    // if (body.statut === 'ANNULE') {
    //   await envoyerNotification(rdvMisAJour.eleveurId, `RDV annulé — ${rdvMisAJour.animal.nom}`);
    // }

    const rdvMisAJour = { ...rdv, ...body };
    return NextResponse.json({ success: true, data: rdvMisAJour, message: 'Rendez-vous mis à jour' });
  } catch (error) {
    console.error('[API] PATCH /vetalert/rendez-vous/[id] :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * DELETE /api/vetalert/rendez-vous/[id]
 * Annuler un rendez-vous
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const rdv = DEMO_RDV.find((r) => r.id === id);
    if (!rdv) return NextResponse.json({ success: false, error: 'Rendez-vous introuvable' }, { status: 404 });

    // En production :
    // await prisma.rendezVous.update({ where: { id }, data: { statut: 'ANNULE' } });

    return NextResponse.json({ success: true, message: 'Rendez-vous annulé' });
  } catch (error) {
    console.error('[API] DELETE /vetalert/rendez-vous/[id] :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
