import { NextResponse } from 'next/server';
import { DEMO_DOSSIERS } from '@/lib/vetalert/data';

/**
 * GET /api/vetalert/dossiers
 * Récupère l'historique médical avec filtres
 *
 * Query params :
 *   - animalId       : filtrer par animal
 *   - veterinaireId  : filtrer par vétérinaire
 *   - type           : maladie|vaccin|traitement|operation|analyse|prescription
 *   - depuis         : YYYY-MM-DD — date de début
 *   - jusqua         : YYYY-MM-DD — date de fin
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const animalId = searchParams.get('animalId') ?? '';
    const type     = searchParams.get('type') ?? '';
    const depuis   = searchParams.get('depuis') ?? '';
    const jusqua   = searchParams.get('jusqua') ?? '';

    // En production :
    // const dossiers = await prisma.dossierMedical.findMany({
    //   where: {
    //     ...(animalId ? { animalId } : {}),
    //     ...(type     ? { type: type.toUpperCase() as TypeDossier } : {}),
    //     ...(depuis   ? { date: { gte: new Date(depuis) } } : {}),
    //     ...(jusqua   ? { date: { lte: new Date(jusqua) } } : {}),
    //   },
    //   include: {
    //     animal:      { select: { id: true, nom: true, espece: true, numeroId: true } },
    //     veterinaire: { select: { id: true, nom: true } },
    //   },
    //   orderBy: { date: 'desc' },
    // });

    let dossiers = [...DEMO_DOSSIERS];
    if (animalId) dossiers = dossiers.filter((d) => d.animalId === animalId);
    if (type)     dossiers = dossiers.filter((d) => d.type === type);
    if (depuis)   dossiers = dossiers.filter((d) => d.date >= depuis);
    if (jusqua)   dossiers = dossiers.filter((d) => d.date <= jusqua);

    dossiers.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return NextResponse.json({ success: true, data: dossiers, total: dossiers.length });
  } catch (error) {
    console.error('[API] GET /vetalert/dossiers :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * POST /api/vetalert/dossiers
 * Créer un nouveau dossier médical
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { animalId, veterinaireId, type, titre, description, medicaments, dose, prochainControle } = body;

    if (!animalId || !veterinaireId || !type || !titre || !description) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires : animalId, veterinaireId, type, titre, description' },
        { status: 400 }
      );
    }

    // En production :
    // const dossier = await prisma.dossierMedical.create({
    //   data: {
    //     animalId, veterinaireId,
    //     type: type.toUpperCase() as TypeDossier,
    //     titre, description,
    //     medicaments: medicaments ?? [],
    //     dose, date: new Date(),
    //     prochainControle: prochainControle ? new Date(prochainControle) : null,
    //   },
    //   include: { animal: true, veterinaire: true },
    // });
    //
    // Si prochainControle défini → créer une alerte automatique
    // if (prochainControle) {
    //   await prisma.alerte.create({ data: {
    //     type: 'CONTROLE', titre: `Prochain contrôle — ${dossier.animal.nom}`,
    //     message: `Contrôle prévu le ${prochainControle}`,
    //     animalId, utilisateurId: veterinaireId, priorite: 'NORMALE',
    //     dateEnvoi: new Date(prochainControle),
    //   }});
    // }

    const dossier = {
      id: `dos-${Date.now()}`,
      animalId, animalNom: 'Animal', animalEspece: 'boeuf',
      veterinaireId, veterinaire: 'Dr. Amadou Diallo',
      type, titre, description,
      medicaments: medicaments ?? [],
      dose: dose ?? null,
      prochainControle: prochainControle ?? null,
      date: new Date().toISOString().split('T')[0],
    };

    return NextResponse.json({ success: true, data: dossier, message: 'Dossier médical créé' }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /vetalert/dossiers :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
