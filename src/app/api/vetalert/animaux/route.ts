import { NextResponse } from 'next/server';
import { DEMO_ANIMAUX } from '@/lib/vetalert/data';

/**
 * GET /api/vetalert/animaux
 * Récupère la liste des animaux (filtrée par propriétaire ou vétérinaire)
 *
 * Query params :
 *   - proprietaireId   : filtrer par éleveur
 *   - veterinaireId    : filtrer par vétérinaire
 *   - etatSante        : filtrer par état de santé
 *   - espece           : filtrer par espèce
 *   - q                : recherche textuelle (nom, race, numéroId)
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const q             = searchParams.get('q')?.toLowerCase() ?? '';
    const etatSante     = searchParams.get('etatSante') ?? '';
    const espece        = searchParams.get('espece') ?? '';

    // En production : requête Prisma
    // const animaux = await prisma.animal.findMany({
    //   where: {
    //     actif: true,
    //     ...(proprietaireId ? { proprietaireId } : {}),
    //     ...(veterinaireId  ? { veterinaireId }  : {}),
    //     ...(etatSante      ? { etatSante: etatSante as EtatSante } : {}),
    //     ...(espece         ? { espece: espece as AnimalEspece }    : {}),
    //     ...(q ? {
    //       OR: [
    //         { nom:      { contains: q, mode: 'insensitive' } },
    //         { race:     { contains: q, mode: 'insensitive' } },
    //         { numeroId: { contains: q, mode: 'insensitive' } },
    //       ],
    //     } : {}),
    //   },
    //   include: {
    //     proprietaire: { select: { id: true, nom: true } },
    //     veterinaire:  { select: { id: true, nom: true } },
    //     _count: { select: { rendezVous: true, dossiers: true } },
    //   },
    //   orderBy: { createdAt: 'desc' },
    // });

    // Demo : données statiques filtrées
    let animaux = DEMO_ANIMAUX;
    if (q)          animaux = animaux.filter((a) => a.nom.toLowerCase().includes(q) || a.race.toLowerCase().includes(q) || a.numeroId.toLowerCase().includes(q));
    if (etatSante)  animaux = animaux.filter((a) => a.etatSante === etatSante);
    if (espece)     animaux = animaux.filter((a) => a.espece === espece);

    return NextResponse.json({ success: true, data: animaux, total: animaux.length });
  } catch (error) {
    console.error('[API] GET /vetalert/animaux :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * POST /api/vetalert/animaux
 * Crée un nouvel animal
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, espece, race, sexe, ageAns, ageMois, poids, dateNaissance, etatSante, notes, proprietaireId, veterinaireId } = body;

    // Validation
    if (!nom || !espece || !sexe || !proprietaireId) {
      return NextResponse.json({ success: false, error: 'Champs obligatoires manquants : nom, espece, sexe, proprietaireId' }, { status: 400 });
    }

    // En production : création Prisma
    // const numeroId = `SN-${new Date().getFullYear()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
    // const animal = await prisma.animal.create({
    //   data: { numeroId, nom, espece, race, sexe, ageAns: ageAns ?? 0, ageMois: ageMois ?? 0, poids, dateNaissance: dateNaissance ? new Date(dateNaissance) : null, etatSante: etatSante ?? 'BONNE_SANTE', notes, proprietaireId, veterinaireId },
    //   include: { proprietaire: true, veterinaire: true },
    // });

    // Demo : simuler la création
    const animal = {
      id: `anim-${Date.now()}`,
      numeroId: `SN-KAO-${new Date().getFullYear()}-${String(Math.floor(Math.random() * 9999)).padStart(4, '0')}`,
      nom, espece, race: race ?? '', sexe,
      ageAns: ageAns ?? 0, ageMois: ageMois ?? 0, poids: poids ?? 0,
      etatSante: etatSante ?? 'bonne_sante', notes,
      dateNaissance: dateNaissance ?? null,
      proprietaireId, proprietaireNom: 'Mamadou Ndiaye',
      veterinaire: 'Dr. Amadou Diallo',
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({ success: true, data: animal, message: 'Animal créé avec succès' }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /vetalert/animaux :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
