import { NextRequest, NextResponse } from "next/server";
import type { SamaProduct, SamaCustomer } from "@prisma/client";
import { prisma } from "@/lib/db";
import { hashPassword } from "@/lib/sama/auth";
import { ensurePlans } from "@/lib/sama/plans";
import { nextNumber, uniqueSlug } from "@/lib/sama/numbering";

export const dynamic = "force-dynamic";

/**
 * Crée (ou réinitialise) le compte de démonstration « Sama Fashion ».
 * Protégé par ADMIN_SECRET. Identifiants de démo : demo@sama.local / demo1234
 *
 *   curl -X POST /api/sama/seed -H "x-admin-secret: <ADMIN_SECRET>"
 */
export async function POST(req: NextRequest) {
  const secret = req.headers.get("x-admin-secret");
  if (!process.env.ADMIN_SECRET || secret !== process.env.ADMIN_SECRET) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  await ensurePlans();
  const email = "demo@sama.local";

  // Réinitialisation : on supprime l'ancienne entreprise démo (cascade).
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    await prisma.samaBusiness.deleteMany({ where: { ownerId: existingUser.id } });
  }

  const user = await prisma.user.upsert({
    where: { email },
    update: {},
    create: { name: "Aïcha Diop", email, phone: "770000000", password: await hashPassword("demo1234") },
  });

  const slug = await uniqueSlug(prisma, "Sama Fashion");
  const business = await prisma.samaBusiness.create({
    data: {
      ownerId: user.id, name: "Sama Fashion", slug, activityType: "Vêtements & Mode",
      city: "Dakar", country: "SN", currency: "XOF", phone: "770000000", whatsapp: "770000000",
      description: "Prêt-à-porter, chaussures et accessoires tendance à Dakar.",
      planCode: "BUSINESS", subscriptionStatus: "TRIAL", trialEndsAt: new Date(Date.now() + 14 * 86400000),
      onboardingDone: true, storePublished: true, brandColor: "#0e7d52",
    },
  });
  const member = await prisma.samaMember.create({ data: { businessId: business.id, userId: user.id, role: "OWNER" } });

  const catMode = await prisma.samaCategory.create({ data: { businessId: business.id, name: "Mode" } });
  const catAcc = await prisma.samaCategory.create({ data: { businessId: business.id, name: "Accessoires" } });

  const productSpecs = [
    { name: "Sneakers Premium", cat: catMode.id, cost: 12000, sale: 25000, stock: 40 },
    { name: "Ensemble Femme", cat: catMode.id, cost: 9000, sale: 18000, stock: 30 },
    { name: "Sac Élégance", cat: catAcc.id, cost: 7000, sale: 15000, stock: 25 },
    { name: "Parfum Royal", cat: catAcc.id, cost: 5000, sale: 12000, stock: 50 },
    { name: "Montre Classique", cat: catAcc.id, cost: 8000, sale: 20000, stock: 15 },
    { name: "Boubou Brodé", cat: catMode.id, cost: 15000, sale: 35000, stock: 12 },
  ];
  const products: SamaProduct[] = [];
  for (const s of productSpecs) {
    const p = await prisma.samaProduct.create({
      data: { businessId: business.id, name: s.name, categoryId: s.cat, costPrice: s.cost, salePrice: s.sale, stock: s.stock, alertThreshold: 5, unit: "pièce", active: true },
    });
    await prisma.samaInventoryMovement.create({ data: { businessId: business.id, productId: p.id, type: "ENTREE", quantity: s.stock, stockAfter: s.stock, reason: "Stock initial" } });
    products.push(p);
  }

  const firstNames = ["Fatou", "Awa", "Mariama", "Aminata", "Khady", "Ndeye", "Rokhaya", "Sokhna", "Bineta", "Adama", "Moussa", "Ibrahima", "Cheikh", "Modou", "Ousmane"];
  const lastNames = ["Ndiaye", "Diop", "Fall", "Sow", "Ba", "Gueye", "Sarr", "Faye", "Mbaye", "Diallo", "Sy", "Cissé", "Ndour", "Seck", "Thiam"];
  const customers: SamaCustomer[] = [];
  for (let i = 0; i < 15; i++) {
    const c = await prisma.samaCustomer.create({
      data: {
        businessId: business.id, name: `${firstNames[i]} ${lastNames[i]}`,
        phone: `7${7 + (i % 2)}${String(1000000 + i * 13579).slice(0, 7)}`, city: "Dakar",
        source: ["WhatsApp", "Instagram", "Boutique physique", "TikTok"][i % 4],
        createdAt: new Date(Date.now() - (30 - i) * 86400000),
      },
    });
    customers.push(c);
  }

  // 25 ventes réparties sur 30 jours
  const channels = ["BOUTIQUE", "WHATSAPP", "INSTAGRAM", "TIKTOK"] as const;
  const methods = ["ESPECES", "WAVE", "ORANGE_MONEY"] as const;
  for (let i = 0; i < 25; i++) {
    const when = new Date(Date.now() - Math.floor(Math.random() * 30) * 86400000 - Math.floor(Math.random() * 12) * 3600000);
    const nItems = 1 + (i % 3);
    const chosen: SamaProduct[] = [];
    for (let k = 0; k < nItems; k++) chosen.push(products[Math.floor(Math.random() * products.length)]);

    let subtotal = 0, cost = 0;
    const lines = chosen.map((p) => {
      const qty = 1 + Math.floor(Math.random() * 2);
      subtotal += p.salePrice * qty; cost += p.costPrice * qty;
      return { productId: p.id, name: p.name, quantity: qty, unitPrice: p.salePrice, costPrice: p.costPrice, total: p.salePrice * qty };
    });
    const total = subtotal;
    const margin = subtotal - cost;
    const credit = i % 6 === 0;
    const amountPaid = credit ? Math.round(total * 0.5) : total;
    const cust = customers[Math.floor(Math.random() * customers.length)];

    await prisma.$transaction(async (tx) => {
      const number = await nextNumber(tx, business.id, "VTE");
      const sale = await tx.samaSale.create({
        data: {
          businessId: business.id, number, customerId: cust.id, sellerId: member.id,
          channel: channels[i % channels.length], subtotal, discount: 0, deliveryFee: 0, total, cost, margin,
          amountPaid, payStatus: amountPaid >= total ? "PAYE" : "PARTIEL", createdAt: when,
          items: { create: lines },
        },
      });
      for (const ln of lines) {
        await tx.samaProduct.update({ where: { id: ln.productId }, data: { stock: { decrement: ln.quantity } } });
        await tx.samaInventoryMovement.create({ data: { businessId: business.id, productId: ln.productId, type: "VENTE", quantity: -ln.quantity, stockAfter: 0, reason: number, createdAt: when } });
      }
      await tx.samaPayment.create({ data: { businessId: business.id, saleId: sale.id, amount: amountPaid, method: methods[i % methods.length], createdAt: when } });
      const rec = await nextNumber(tx, business.id, "REC");
      await tx.samaInvoice.create({ data: { businessId: business.id, number: rec, type: "RECU", saleId: sale.id, customerId: cust.id, total, amountPaid, status: amountPaid >= total ? "PAYEE" : "PARTIELLE", data: JSON.stringify({ items: lines }), createdAt: when } });
    });
  }

  // 10 commandes
  const statuses = ["NOUVELLE", "CONFIRMEE", "EN_PREPARATION", "LIVREE", "EXPEDIEE"] as const;
  for (let i = 0; i < 10; i++) {
    const p = products[i % products.length];
    const qty = 1 + (i % 3);
    await prisma.$transaction(async (tx) => {
      const number = await nextNumber(tx, business.id, "CMD");
      await tx.samaOrder.create({
        data: {
          businessId: business.id, number, customerId: customers[i % customers.length].id,
          channel: "WHATSAPP", status: statuses[i % statuses.length],
          subtotal: p.salePrice * qty, total: p.salePrice * qty,
          items: { create: [{ productId: p.id, name: p.name, quantity: qty, unitPrice: p.salePrice, total: p.salePrice * qty }] },
          createdAt: new Date(Date.now() - i * 2 * 86400000),
        },
      });
    });
  }

  // Dépenses
  const expenses = [
    { category: "Loyer", amount: 150000 }, { category: "Transport", amount: 25000 },
    { category: "Publicité", amount: 40000 }, { category: "Électricité", amount: 18000 },
    { category: "Achats marchandises", amount: 200000 },
  ];
  for (const e of expenses) {
    await prisma.samaExpense.create({ data: { businessId: business.id, category: e.category, amount: e.amount, date: new Date(Date.now() - Math.floor(Math.random() * 20) * 86400000) } });
  }

  await prisma.samaNotification.create({ data: { businessId: business.id, type: "STOCK", title: "Bienvenue sur la démo", body: "Explorez Sama Fashion : ventes, stock, clients, factures et boutique." } });

  return NextResponse.json({
    ok: true,
    message: "Compte démo créé.",
    login: { url: "/sama/connexion", email, password: "demo1234" },
    store: `/sama/boutique/${slug}`,
  });
}
