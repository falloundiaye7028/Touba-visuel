import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateOrderNumber } from "@/lib/utils";
import Stripe from "stripe";

export const dynamic = "force-dynamic";

// ── Sécurité : sanitisation et validation ──────────────────────────────────

function sanitize(value: unknown): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, 500).replace(/[<>]/g, "");
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) && email.length <= 254;
}

function isValidPhone(phone: string): boolean {
  return /^[\d\s+\-().]{7,20}$/.test(phone);
}

function isValidPrice(price: unknown): boolean {
  const n = Number(price);
  return !isNaN(n) && n >= 0 && n <= 10_000_000;
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY ?? "", {
  apiVersion: "2024-06-20",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      clientName,
      clientEmail,
      clientPhone,
      support,
      category,
      quantity,
      format,
      description,
      fileUrl,
      prixUnitaire,
      prixTotal,
      paymentMethod,
      livraison,
      adresseLivraison,
    } = body;

    // Validation stricte
    if (!clientName || !clientEmail || !clientPhone || !support || !paymentMethod) {
      return NextResponse.json({ error: "Champs obligatoires manquants" }, { status: 400 });
    }
    if (!isValidEmail(sanitize(clientEmail))) {
      return NextResponse.json({ error: "Email invalide" }, { status: 400 });
    }
    if (!isValidPhone(sanitize(clientPhone))) {
      return NextResponse.json({ error: "Téléphone invalide" }, { status: 400 });
    }
    if (!isValidPrice(prixTotal) || !isValidPrice(prixUnitaire)) {
      return NextResponse.json({ error: "Prix invalide" }, { status: 400 });
    }
    const ALLOWED_PAYMENT_METHODS = ["CARTE_BANCAIRE", "WAVE", "ORANGE_MONEY", "LIVRAISON"];
    if (!ALLOWED_PAYMENT_METHODS.includes(paymentMethod)) {
      return NextResponse.json({ error: "Méthode de paiement invalide" }, { status: 400 });
    }

    const orderNumber = generateOrderNumber();

    const order = await prisma.order.create({
      data: {
        orderNumber,
        clientName,
        clientEmail,
        clientPhone,
        support,
        category: category ?? "",
        quantity: Number(quantity) || 1,
        format: format || null,
        description,
        fileUrl: fileUrl || null,
        prixUnitaire: Number(prixUnitaire) || 0,
        prixTotal: Number(prixTotal) || 0,
        paymentMethod,
        livraison: Boolean(livraison),
        adresseLivraison: adresseLivraison || null,
        status: "EN_ATTENTE",
        paymentStatus: paymentMethod === "LIVRAISON" ? "NON_PAYE" : "EN_ATTENTE_PAIEMENT",
      },
    });

    // Stripe — créer une session de paiement
    if (paymentMethod === "CARTE_BANCAIRE") {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "xof",
              product_data: {
                name: support,
                description: `Commande ${orderNumber} — ${quantity}×${support}`,
              },
              unit_amount: Math.round(prixTotal * 100),
            },
            quantity: 1,
          },
        ],
        mode: "payment",
        customer_email: clientEmail,
        metadata: { orderNumber, orderId: order.id },
        success_url: `${process.env.NEXTAUTH_URL}/suivi?commande=${orderNumber}&paiement=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/commande?paiement=cancel`,
      });

      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: prixTotal,
          method: "CARTE_BANCAIRE",
          status: "EN_ATTENTE_PAIEMENT",
          stripeSessionId: session.id,
        },
      });

      return NextResponse.json({ orderNumber, stripeUrl: session.url });
    }

    // Wave — redirection vers l'API Wave
    if (paymentMethod === "WAVE") {
      const waveUrl = await createWavePayment(order.id, orderNumber, prixTotal, clientPhone);

      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: prixTotal,
          method: "WAVE",
          status: "EN_ATTENTE_PAIEMENT",
        },
      });

      return NextResponse.json({ orderNumber, waveUrl });
    }

    // Orange Money
    if (paymentMethod === "ORANGE_MONEY") {
      await prisma.payment.create({
        data: {
          orderId: order.id,
          amount: prixTotal,
          method: "ORANGE_MONEY",
          status: "EN_ATTENTE_PAIEMENT",
        },
      });

      return NextResponse.json({
        orderNumber,
        instructions: `Envoyez ${prixTotal} FCFA au +221 76 800 17 17 (Orange Money) avec la référence : ${orderNumber}`,
      });
    }

    // Paiement à la livraison
    await prisma.payment.create({
      data: {
        orderId: order.id,
        amount: prixTotal,
        method: "LIVRAISON",
        status: "NON_PAYE",
      },
    });

    return NextResponse.json({ orderNumber });
  } catch (error) {
    console.error("Erreur création commande:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  const num = req.nextUrl.searchParams.get("num");

  if (!num) {
    return NextResponse.json({ error: "Numéro de commande requis" }, { status: 400 });
  }

  try {
    const order = await prisma.order.findUnique({
      where: { orderNumber: num.trim() },
    });

    if (!order) {
      return NextResponse.json({ error: "Commande introuvable" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

async function createWavePayment(
  orderId: string,
  orderNumber: string,
  amount: number,
  phone: string
): Promise<string> {
  try {
    const res = await fetch(`${process.env.WAVE_API_URL}/checkout/sessions`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.WAVE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: String(Math.round(amount)),
        currency: "XOF",
        client_reference: orderNumber,
        success_url: `${process.env.NEXTAUTH_URL}/suivi?commande=${orderNumber}&paiement=success`,
        cancel_url: `${process.env.NEXTAUTH_URL}/commande`,
        error_url: `${process.env.NEXTAUTH_URL}/commande?erreur=paiement`,
      }),
    });

    if (!res.ok) throw new Error("Wave API error");
    const data = await res.json();
    return data.wave_launch_url ?? `https://wave.com/pay/${orderId}`;
  } catch {
    return `${process.env.NEXTAUTH_URL}/suivi?commande=${orderNumber}`;
  }
}
