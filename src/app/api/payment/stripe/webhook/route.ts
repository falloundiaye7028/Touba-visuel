import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature") ?? "";

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, process.env.STRIPE_WEBHOOK_SECRET ?? "");
  } catch {
    return NextResponse.json({ error: "Signature invalide" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const orderNumber = session.metadata?.orderNumber;

    if (orderNumber) {
      await prisma.order.update({
        where: { orderNumber },
        data: {
          paymentStatus: "PAYE",
          status: "CONFIRME",
          paymentRef: session.payment_intent as string,
        },
      });

      await prisma.payment.updateMany({
        where: { stripeSessionId: session.id },
        data: { status: "PAYE", transactionId: session.payment_intent as string },
      });
    }
  }

  return NextResponse.json({ received: true });
}
