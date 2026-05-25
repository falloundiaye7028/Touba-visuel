import { NextResponse } from 'next/server';
// import bcrypt from 'bcryptjs';
// import { SignJWT } from 'jose';

const DEMO_COMPTES = [
  { id: 'vet-001', email: 'amadou.diallo@vetalert.sn', motDePasse: 'demo1234', role: 'VETERINAIRE', nom: 'Dr. Amadou Diallo', premium: true },
  { id: 'elev-001', email: 'mamadou.ndiaye@ferme.sn', motDePasse: 'demo1234', role: 'ELEVEUR', nom: 'Mamadou Ndiaye', premium: false },
];

/**
 * POST /api/vetalert/auth/connexion
 * Authentifier un utilisateur VetAlert
 *
 * Body : { email, motDePasse }
 * Retourne : { token, utilisateur }
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, motDePasse } = body;

    if (!email || !motDePasse) {
      return NextResponse.json({ success: false, error: 'Email et mot de passe requis' }, { status: 400 });
    }

    // En production :
    // const utilisateur = await prisma.vetUtilisateur.findUnique({ where: { email } });
    // if (!utilisateur) return NextResponse.json({ success: false, error: 'Identifiants incorrects' }, { status: 401 });
    // const motDePasseValide = await bcrypt.compare(motDePasse, utilisateur.motDePasse);
    // if (!motDePasseValide) return NextResponse.json({ success: false, error: 'Identifiants incorrects' }, { status: 401 });
    //
    // // Générer JWT
    // const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
    // const token = await new SignJWT({ sub: utilisateur.id, role: utilisateur.role })
    //   .setProtectedHeader({ alg: 'HS256' })
    //   .setExpirationTime('7d')
    //   .sign(secret);
    //
    // Réponse avec cookie httpOnly
    // const response = NextResponse.json({ success: true, data: { utilisateur, token } });
    // response.cookies.set('vetalert-token', token, { httpOnly: true, sameSite: 'strict', maxAge: 60 * 60 * 24 * 7 });
    // return response;

    // Demo : comptes hardcodés
    const compte = DEMO_COMPTES.find((c) => c.email === email && c.motDePasse === motDePasse);
    if (!compte) {
      return NextResponse.json({ success: false, error: 'Email ou mot de passe incorrect' }, { status: 401 });
    }

    const { motDePasse: _, ...utilisateur } = compte;

    return NextResponse.json({
      success: true,
      data: {
        utilisateur,
        token: `demo-jwt-${utilisateur.id}-${Date.now()}`,
        expiresIn: 604800, // 7 jours en secondes
      },
      message: `Bienvenue, ${utilisateur.nom} !`,
    });
  } catch (error) {
    console.error('[API] POST /vetalert/auth/connexion :', error);
    return NextResponse.json({ success: false, error: 'Erreur serveur' }, { status: 500 });
  }
}
