import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';

/**
 * POST /api/vetalert/auth/inscription
 * Créer un compte VetAlert (vétérinaire ou éleveur)
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { nom, email, telephone, motDePasse, role, specialite, numeroOrdre, cabinet, nomFerme, localisation, pays } = body;

    // Validation
    if (!nom || !email || !motDePasse || !role) {
      return NextResponse.json({ success: false, error: 'Champs obligatoires : nom, email, motDePasse, role' }, { status: 400 });
    }
    if (!['VETERINAIRE', 'ELEVEUR'].includes(role)) {
      return NextResponse.json({ success: false, error: 'Rôle invalide. Valeurs acceptées : VETERINAIRE, ELEVEUR' }, { status: 400 });
    }
    if (motDePasse.length < 8) {
      return NextResponse.json({ success: false, error: 'Le mot de passe doit contenir au moins 8 caractères' }, { status: 422 });
    }

    // Vérification email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ success: false, error: 'Adresse email invalide' }, { status: 422 });
    }

    // En production :
    // const emailExistant = await prisma.vetUtilisateur.findUnique({ where: { email } });
    // if (emailExistant) return NextResponse.json({ success: false, error: 'Cet email est déjà utilisé' }, { status: 409 });
    //
    // const hash = await bcrypt.hash(motDePasse, 12);
    // const utilisateur = await prisma.vetUtilisateur.create({
    //   data: {
    //     nom, email, telephone, motDePasse: hash, role,
    //     ...(role === 'VETERINAIRE' ? { specialite, numeroOrdre, cabinet } : { nomFerme, localisation }),
    //     pays: pays ?? 'Sénégal',
    //     premium: false,
    //   },
    //   select: { id: true, nom: true, email: true, role: true, createdAt: true },
    // });
    //
    // Envoyer email de bienvenue
    // await envoyerEmailBienvenue(utilisateur.email, utilisateur.nom, role);

    // Demo : simuler la création
    const utilisateur = {
      id: `vet-${Date.now()}`,
      nom, email, role,
      premium: false,
      createdAt: new Date().toISOString(),
    };

    return NextResponse.json({
      success: true,
      data: utilisateur,
      message: `Compte ${role === 'VETERINAIRE' ? 'vétérinaire' : 'éleveur'} créé avec succès ! Bienvenue sur VetAlert.`,
    }, { status: 201 });
  } catch (error) {
    console.error('[API] POST /vetalert/auth/inscription :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
