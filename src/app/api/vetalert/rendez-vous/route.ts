import { NextResponse } from 'next/server';
import { DEMO_RDV } from '@/lib/vetalert/data';

/**
 * GET /api/vetalert/rendez-vous
 * Liste les rendez-vous avec filtres
 *
 * Query params :
 *   - date          : YYYY-MM-DD — filtrer par jour
 *   - mois          : YYYY-MM   — filtrer par mois
 *   - animalId      : filtrer par animal
 *   - veterinaireId : filtrer par vétérinaire
 *   - eleveurId     : filtrer par éleveur
 *   - statut        : programme|confirme|urgent|termine|annule
 *   - type          : vaccination|vermifuge|…
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const date      = searchParams.get('date') ?? '';
    const mois      = searchParams.get('mois') ?? '';
    const animalId  = searchParams.get('animalId') ?? '';
    const statut    = searchParams.get('statut') ?? '';
    const type      = searchParams.get('type') ?? '';

    // En production :
    // const rdvs = await prisma.rendezVous.findMany({
    //   where: {
    //     ...(date ? { date: { gte: new Date(date), lt: new Date(new Date(date).getTime() + 86400000) } } : {}),
    //     ...(mois ? { date: { gte: new Date(`${mois}-01`), lt: new Date(`${mois}-31`) } } : {}),
    //     ...(animalId ? { animalId } : {}),
    //     ...(statut   ? { statut: statut.toUpperCase() as StatutRdv } : {}),
    //     ...(type     ? { type: type.toUpperCase() as TypeRdv } : {}),
    //   },
    //   include: {
    //     animal:       { select: { id: true, nom: true, espece: true, numeroId: true } },
    //     veterinaire:  { select: { id: true, nom: true } },
    //     eleveur:      { select: { id: true, nom: true } },
    //   },
    //   orderBy: [{ date: 'asc' }, { heure: 'asc' }],
    // });

    let rdvs = DEMO_RDV;
    if (date)     rdvs = rdvs.filter((r) => r.date === date);
    if (mois)     rdvs = rdvs.filter((r) => r.date.startsWith(mois));
    if (animalId) rdvs = rdvs.filter((r) => r.animalId === animalId);
    if (statut)   rdvs = rdvs.filter((r) => r.statut === statut);
    if (type)     rdvs = rdvs.filter((r) => r.type === type);

    const urgents  = rdvs.filter((r) => r.statut === 'urgent').length;
    const aVenir   = rdvs.filter((r) => ['programme', 'confirme'].includes(r.statut)).length;

    return NextResponse.json({ success: true, data: rdvs, total: rdvs.length, meta: { urgents, aVenir } });
  } catch (error) {
    console.error('[API] GET /vetalert/rendez-vous :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}

/**
 * POST /api/vetalert/rendez-vous
 * Crée un nouveau rendez-vous
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { animalId, veterinaireId, eleveurId, type, motif, date, heure, lieu, notes } = body;

    if (!animalId || !veterinaireId || !eleveurId || !type || !date || !heure) {
      return NextResponse.json(
        { success: false, error: 'Champs obligatoires : animalId, veterinaireId, eleveurId, type, date, heure' },
        { status: 400 }
      );
    }

    // Vérifier que la date n'est pas dans le passé
    const dateRdv = new Date(`${date}T${heure}`);
    if (dateRdv < new Date()) {
      return NextResponse.json({ success: false, error: 'La date du rendez-vous ne peut pas être dans le passé' }, { status: 422 });
    }

    // En production :
    // const rdv = await prisma.rendezVous.create({
    //   data: { animalId, veterinaireId, eleveurId, type: type.toUpperCase(), motif, date: new Date(date), heure, lieu, notes, statut: 'PROGRAMME' },
    //   include: { animal: true, veterinaire: true, eleveur: true },
    // });
    // Créer alerte automatique J-1
    // await prisma.alerte.createMany({ data: [
    //   { type: 'RENDEZ_VOUS', titre: `RDV demain — ${rdv.animal.nom}`, message: `Rappel : ${rdv.type} pour ${rdv.animal.nom} le ${date} à ${heure}`, animalId, utilisateurId: veterinaireId, priorite: 'HAUTE' },
    //   { type: 'RENDEZ_VOUS', titre: `Votre RDV vétérinaire demain`, message: `Rendez-vous pour ${rdv.animal.nom} le ${date} à ${heure}`, animalId, utilisateurId: eleveurId, priorite: 'HAUTE' },
    // ]});

    const rdv = {
      id: `rdv-${Date.now()}`,
      animalId, animalNom: 'Animal', animalEspece: 'boeuf',
      veterinaireId, veterinaire: 'Dr. Amadou Diallo',
      eleveurId, eleveur: 'Mamadou Ndiaye',
      type, motif: motif ?? '', date, heure,
      lieu: lieu ?? '', notes: notes ?? '',
      statut: 'programme',
    };

    return NextResponse.json({ success: true, data: rdv, message: 'Rendez-vous créé et rappels envoyés' }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /vetalert/rendez-vous :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
