import { NextResponse } from 'next/server';
import { DEMO_ALERTES } from '@/lib/vetalert/data';

type Params = { params: Promise<{ id: string }> };

/**
 * PATCH /api/vetalert/alertes/[id]
 * Marquer une alerte comme lue / modifier son état
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    const alerte = DEMO_ALERTES.find((a) => a.id === id);
    if (!alerte) return NextResponse.json({ success: false, error: 'Alerte introuvable' }, { status: 404 });

    // En production :
    // const alerteMisAJour = await prisma.alerte.update({
    //   where: { id },
    //   data: { lue: body.lue ?? alerte.lue },
    // });

    const alerteMisAJour = { ...alerte, ...body };
    return NextResponse.json({ success: true, data: alerteMisAJour, message: body.lue ? 'Alerte marquée comme lue' : 'Alerte mise à jour' });
  } catch (error) {
    console.error('[API] PATCH /vetalert/alertes/[id] :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * DELETE /api/vetalert/alertes/[id]
 * Supprimer une alerte
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;
    const alerte = DEMO_ALERTES.find((a) => a.id === id);
    if (!alerte) return NextResponse.json({ success: false, error: 'Alerte introuvable' }, { status: 404 });

    // En production :
    // await prisma.alerte.delete({ where: { id } });

    return NextResponse.json({ success: true, message: 'Alerte supprimée' });
  } catch (error) {
    console.error('[API] DELETE /vetalert/alertes/[id] :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
