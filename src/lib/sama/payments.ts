/**
 * Paiement des abonnements SAMA PILOT.
 *
 * Conformément au cahier des charges : on n'effectue PAS de fausse transaction
 * Wave/Orange Money. Le flux réel fonctionnel est :
 *   1. le commerçant paie vers le numéro/lien de la plateforme (Wave, OM…) ;
 *   2. il saisit la référence de sa transaction ;
 *   3. le super administrateur confirme → le plan est activé.
 *
 * L'architecture est prête pour une intégration API (webhook + provider) :
 * si des clés API sont configurées, `providerCheckoutUrl()` renverra un lien de
 * paiement automatique ; sinon on retombe sur le flux manuel ci-dessus.
 */

export interface PayInstruction {
  method: string;
  label: string;
  number?: string;
  link?: string;
}

/** Retourne les moyens de paiement configurés pour la plateforme. */
export function getPaymentInstructions(): PayInstruction[] {
  const out: PayInstruction[] = [];
  if (process.env.SAMA_WAVE_NUMBER || process.env.SAMA_WAVE_LINK) {
    out.push({ method: "WAVE", label: "Wave", number: process.env.SAMA_WAVE_NUMBER, link: process.env.SAMA_WAVE_LINK });
  }
  if (process.env.SAMA_OM_NUMBER) {
    out.push({ method: "ORANGE_MONEY", label: "Orange Money", number: process.env.SAMA_OM_NUMBER });
  }
  if (process.env.SAMA_BANK_INFO) {
    out.push({ method: "VIREMENT", label: "Virement bancaire", number: process.env.SAMA_BANK_INFO });
  }
  if (out.length === 0) {
    out.push({ method: "WAVE", label: "Wave", number: "à communiquer par SAMA PILOT" });
    out.push({ method: "ORANGE_MONEY", label: "Orange Money", number: "à communiquer par SAMA PILOT" });
  }
  return out;
}

/** Indique si une intégration API automatique est disponible (future). */
export function hasAutomaticProvider(): boolean {
  return Boolean(process.env.SAMA_WAVE_API_KEY || process.env.SAMA_OM_API_KEY);
}

/**
 * Point d'extension pour l'intégration API (Wave Checkout / OM WebPayment).
 * Retourne une URL de paiement si un fournisseur est configuré, sinon null
 * (le flux manuel avec référence prend alors le relais).
 */
export async function providerCheckoutUrl(_params: {
  amount: number; method: string; reference: string; label: string;
}): Promise<string | null> {
  // TODO (V4+) : appeler l'API Wave/OM ici lorsque les clés sont fournies,
  // créer une session de paiement et renvoyer son URL de redirection.
  // Laisse la validation finale au webhook (/api/sama/payment/webhook).
  return null;
}
