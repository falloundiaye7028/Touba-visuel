import { NextResponse } from 'next/server';
import { DEMO_ANIMAUX } from '@/lib/vetalert/data';

type Params = { params: Promise<{ id: string }> };

/**
 * GET /api/vetalert/animaux/[id]
 * Récupère la fiche complète d'un animal
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    // En production :
    // const animal = await prisma.animal.findUnique({
    //   where: { id },
    //   include: {
    //     proprietaire: { select: { id: true, nom: true, telephone: true, email: true } },
    //     veterinaire:  { select: { id: true, nom: true, specialite: true } },
    //     rendezVous:   { orderBy: { date: 'asc' }, where: { statut: { not: 'ANNULE' } } },
    //     dossiers:     { orderBy: { date: 'desc' } },
    //     alertes:      { orderBy: { dateEnvoi: 'desc' }, take: 5 },
    //   },
    // });
    // if (!animal) return NextResponse.json({ success: false, error: 'Animal introuvable' }, { status: 404 });

    const animal = DEMO_ANIMAUX.find((a) => a.id === id);
    if (!animal) return NextResponse.json({ success: false, error: 'Animal introuvable' }, { status: 404 });

    return NextResponse.json({ success: true, data: animal });
  } catch (error) {
    console.error('[API] GET /vetalert/animaux/[id] :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * PATCH /api/vetalert/animaux/[id]
 * Met à jour un animal (partiel)
 */
export async function PATCH(request: Request, { params }: Params) {
  try {
    const { id } = await params;
    const body = await request.json();

    // Validation basique
    const champsAutorisés = ['nom', 'race', 'poids', 'etatSante', 'notes', 'photoUrl', 'ageAns', 'ageMois', 'dateNaissance', 'veterinaireId'];
    const champsInconnus = Object.keys(body).filter((k) => !champsAutorisés.includes(k));
    if (champsInconnus.length > 0) {
      return NextResponse.json({ success: false, error: `Champs inconnus : ${champsInconnus.join(', ')}` }, { status: 400 });
    }

    // En production :
    // const animal = await prisma.animal.update({
    //   where: { id },
    //   data: { ...body, updatedAt: new Date() },
    // });

    // Demo : simuler la mise à jour
    const animal = DEMO_ANIMAUX.find((a) => a.id === id);
    if (!animal) return NextResponse.json({ success: false, error: 'Animal introuvable' }, { status: 404 });

    const animalMisAJour = { ...animal, ...body, updatedAt: new Date().toISOString() };
    return NextResponse.json({ success: true, data: animalMisAJour, message: 'Animal mis à jour' });
  } catch (error) {
    console.error('[API] PATCH /vetalert/animaux/[id] :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * DELETE /api/vetalert/animaux/[id]
 * Désactive un animal (soft delete)
 */
export async function DELETE(_req: Request, { params }: Params) {
  try {
    const { id } = await params;

    // En production :
    // await prisma.animal.update({ where: { id }, data: { actif: false } });

    const animal = DEMO_ANIMAUX.find((a) => a.id === id);
    if (!animal) return NextResponse.json({ success: false, error: 'Animal introuvable' }, { status: 404 });

    return NextResponse.json({ success: true, message: `Animal "${animal.nom}" archivé avec succès` });
  } catch (error) {
    console.error('[API] DELETE /vetalert/animaux/[id] :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
