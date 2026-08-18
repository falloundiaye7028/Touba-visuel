import { NextRequest, NextResponse } from "next/server";
import { getTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

function csvEscape(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",;\n]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

function toCsv(headers: string[], rows: (string | number | null)[][]): string {
  const lines = [headers.join(";"), ...rows.map((r) => r.map(csvEscape).join(";"))];
  return "﻿" + lines.join("\r\n"); // BOM pour Excel
}

export async function GET(req: NextRequest) {
  const tenant = await getTenant();
  if (!tenant) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  const businessId = tenant.business.id;
  const type = req.nextUrl.searchParams.get("type") || "produits";

  let csv = "";
  let filename = "export.csv";

  if (type === "produits") {
    const rows = await prisma.samaProduct.findMany({ where: { businessId, archived: false }, include: { category: true }, orderBy: { name: "asc" } });
    csv = toCsv(
      ["Nom", "SKU", "Categorie", "Prix achat", "Prix vente", "Prix grossiste", "Stock", "Seuil alerte", "Unite"],
      rows.map((p) => [p.name, p.sku ?? "", p.category?.name ?? "", p.costPrice, p.salePrice, p.wholesalePrice ?? "", p.stock, p.alertThreshold, p.unit])
    );
    filename = "produits.csv";
  } else if (type === "clients") {
    const rows = await prisma.samaCustomer.findMany({ where: { businessId }, include: { sales: { where: { cancelled: false }, select: { total: true, amountPaid: true } } }, orderBy: { name: "asc" } });
    csv = toCsv(
      ["Nom", "Telephone", "Email", "Ville", "Source", "Total achete", "Dette", "Nb ventes"],
      rows.map((c) => {
        const total = c.sales.reduce((a, s) => a + s.total, 0);
        const debt = c.sales.reduce((a, s) => a + (s.total - s.amountPaid), 0);
        return [c.name, c.phone ?? "", c.email ?? "", c.city ?? "", c.source ?? "", total, debt, c.sales.length];
      })
    );
    filename = "clients.csv";
  } else if (type === "ventes") {
    const rows = await prisma.samaSale.findMany({ where: { businessId }, include: { customer: { select: { name: true } } }, orderBy: { createdAt: "desc" }, take: 5000 });
    csv = toCsv(
      ["Numero", "Date", "Client", "Canal", "Total", "Cout", "Marge", "Paye", "Statut", "Annulee"],
      rows.map((s) => [s.number, s.createdAt.toISOString().slice(0, 10), s.customer?.name ?? "", s.channel, s.total, s.cost, s.margin, s.amountPaid, s.payStatus, s.cancelled ? "oui" : "non"])
    );
    filename = "ventes.csv";
  } else if (type === "depenses") {
    const rows = await prisma.samaExpense.findMany({ where: { businessId }, orderBy: { date: "desc" }, take: 5000 });
    csv = toCsv(["Date", "Categorie", "Montant", "Description"], rows.map((e) => [e.date.toISOString().slice(0, 10), e.category, e.amount, e.description ?? ""]));
    filename = "depenses.csv";
  } else if (type === "stock") {
    const rows = await prisma.samaProduct.findMany({ where: { businessId, archived: false }, orderBy: { stock: "asc" } });
    csv = toCsv(["Nom", "Stock", "Seuil", "Valeur stock (cout)"], rows.map((p) => [p.name, p.stock, p.alertThreshold, p.costPrice * p.stock]));
    filename = "stock.csv";
  } else {
    return NextResponse.json({ error: "Type inconnu" }, { status: 400 });
  }

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
      "Cache-Control": "no-store",
    },
  });
}
