import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

/**
 * Webhook de confirmation de paiement d'abonnement (intégration Wave/OM future).
 *
 * Sécurité : ne fait rien tant que SAMA_PAYMENT_WEBHOOK_SECRET n'est pas défini.
 * Quand il l'est, l'appelant (le fournisseur) doit fournir l'en-tête
 * `x-sama-signature` égal au secret. On confirme alors le paiement en attente
 * correspondant (par référence) et on active le plan.
 *
 * Corps attendu : { "reference": "...", "providerRef": "...", "status": "SUCCESS" }
 */
export async function POST(req: NextRequest) {
  const secret = process.env.SAMA_PAYMENT_WEBHOOK_SECRET;
  if (!secret) {
    return NextResponse.json({ error: "Webhook non configuré" }, { status: 501 });
  }
  if (req.headers.get("x-sama-signature") !== secret) {
    return NextResponse.json({ error: "Signature invalide" }, { status: 401 });
  }

  let body: { reference?: string; providerRef?: string; status?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  if (body.status && body.status !== "SUCCESS") {
    return NextResponse.json({ ok: true, ignored: true });
  }

  const payment = await prisma.samaSubscriptionPayment.findFirst({
    where: {
      status: "EN_ATTENTE",
      OR: [
        ...(body.reference ? [{ reference: body.reference }] : []),
        ...(body.providerRef ? [{ providerRef: body.providerRef }] : []),
      ],
    },
  });
  if (!payment) {
    return NextResponse.json({ error: "Paiement introuvable" }, { status: 404 });
  }

  const end = new Date(Date.now() + payment.months * 30 * 86400000);
  await prisma.$transaction([
    prisma.samaSubscriptionPayment.update({ where: { id: payment.id }, data: { status: "CONFIRME", confirmedBy: "webhook", confirmedAt: new Date(), providerRef: body.providerRef ?? payment.providerRef } }),
    prisma.samaBusiness.update({ where: { id: payment.businessId }, data: { planCode: payment.planCode, subscriptionStatus: "ACTIVE", subEndsAt: end, trialEndsAt: null } }),
    prisma.samaNotification.create({ data: { businessId: payment.businessId, type: "SUBSCRIPTION", title: "Abonnement activé ✓", body: `Votre plan ${payment.planCode} est actif jusqu'au ${end.toLocaleDateString("fr-FR")}.` } }),
  ]);

  return NextResponse.json({ ok: true, activated: payment.businessId });
}
