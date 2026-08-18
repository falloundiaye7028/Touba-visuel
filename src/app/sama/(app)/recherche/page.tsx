import Link from "next/link";
import { Search, Package, Users, ShoppingCart, FileText, ClipboardList } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader } from "@/components/sama/ui";

export const dynamic = "force-dynamic";

export default async function RecherchePage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const { q } = await searchParams;
  const term = (q ?? "").trim();

  let products: { id: string; name: string; salePrice: number }[] = [];
  let customers: { id: string; name: string; phone: string | null }[] = [];
  let sales: { id: string; number: string; total: number }[] = [];
  let invoices: { id: string; number: string; type: string }[] = [];
  let orders: { id: string; number: string; total: number }[] = [];

  if (term.length >= 1) {
    const like = { contains: term, mode: "insensitive" as const };
    [products, customers, sales, invoices, orders] = await Promise.all([
      prisma.samaProduct.findMany({ where: { businessId: business.id, archived: false, OR: [{ name: like }, { sku: like }] }, select: { id: true, name: true, salePrice: true }, take: 10 }),
      prisma.samaCustomer.findMany({ where: { businessId: business.id, OR: [{ name: like }, { phone: { contains: term } }] }, select: { id: true, name: true, phone: true }, take: 10 }),
      prisma.samaSale.findMany({ where: { businessId: business.id, number: like }, select: { id: true, number: true, total: true }, take: 10 }),
      prisma.samaInvoice.findMany({ where: { businessId: business.id, number: like }, select: { id: true, number: true, type: true }, take: 10 }),
      prisma.samaOrder.findMany({ where: { businessId: business.id, OR: [{ number: like }, { guestPhone: { contains: term } }, { guestName: like }] }, select: { id: true, number: true, total: true }, take: 10 }),
    ]);
  }

  const total = products.length + customers.length + sales.length + invoices.length + orders.length;

  return (
    <div className="space-y-4">
      <PageHeader title="Recherche" subtitle={term ? `${total} résultat(s) pour « ${term} »` : "Trouvez un client, un produit, une vente…"} />

      <form>
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input name="q" defaultValue={term} autoFocus placeholder="Nom, téléphone, référence, N° facture…" className="input-field !pl-9 !py-2.5" />
        </div>
      </form>

      {term && total === 0 && <p className="text-center text-gray-400 py-8">Aucun résultat.</p>}

      {customers.length > 0 && <Section title="Clients" icon={<Users className="w-4 h-4" />}>
        {customers.map((c) => <Row key={c.id} href={`/sama/clients/${c.id}`} main={c.name} sub={c.phone ?? ""} />)}
      </Section>}
      {products.length > 0 && <Section title="Produits" icon={<Package className="w-4 h-4" />}>
        {products.map((p) => <Row key={p.id} href={`/sama/produits/${p.id}`} main={p.name} sub={formatMoney(p.salePrice, cur)} />)}
      </Section>}
      {sales.length > 0 && <Section title="Ventes" icon={<ShoppingCart className="w-4 h-4" />}>
        {sales.map((s) => <Row key={s.id} href={`/sama/ventes/${s.id}`} main={s.number} sub={formatMoney(s.total, cur)} />)}
      </Section>}
      {invoices.length > 0 && <Section title="Factures & devis" icon={<FileText className="w-4 h-4" />}>
        {invoices.map((i) => <Row key={i.id} href={`/sama/${i.type === "DEVIS" ? "devis" : "factures"}/${i.id}`} main={i.number} sub={i.type} />)}
      </Section>}
      {orders.length > 0 && <Section title="Commandes" icon={<ClipboardList className="w-4 h-4" />}>
        {orders.map((o) => <Row key={o.id} href={`/sama/commandes/${o.id}`} main={o.number} sub={formatMoney(o.total, cur)} />)}
      </Section>}
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-1.5 flex items-center gap-1.5">{icon} {title}</h2>
      <div className="card divide-y divide-gray-100">{children}</div>
    </section>
  );
}

function Row({ href, main, sub }: { href: string; main: string; sub: string }) {
  return (
    <Link href={href} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50">
      <span className="font-medium text-gray-800">{main}</span>
      <span className="text-sm text-gray-400">{sub}</span>
    </Link>
  );
}
