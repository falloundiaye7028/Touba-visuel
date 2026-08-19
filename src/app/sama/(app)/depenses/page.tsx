import { Wallet } from "lucide-react";
import { requireOnboardedTenant } from "@/lib/sama/tenant";
import { prisma } from "@/lib/db";
import { deleteExpenseAction } from "@/lib/sama/actions/expenses";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";
import { PageHeader, EmptyState, Badge, ExportButton } from "@/components/sama/ui";
import { ConfirmButton } from "@/components/sama/ConfirmButton";
import ExpenseForm from "@/components/sama/ExpenseForm";

export const dynamic = "force-dynamic";

export default async function DepensesPage() {
  const { business } = await requireOnboardedTenant();
  const cur = business.currency as CurrencyCode;
  const month = new Date(); month.setDate(1); month.setHours(0, 0, 0, 0);

  const [expenses, monthAgg] = await Promise.all([
    prisma.samaExpense.findMany({ where: { businessId: business.id }, orderBy: { date: "desc" }, take: 100 }),
    prisma.samaExpense.aggregate({ where: { businessId: business.id, date: { gte: month } }, _sum: { amount: true } }),
  ]);

  return (
    <div className="space-y-4">
      <PageHeader title="Dépenses" subtitle={`Ce mois : ${formatMoney(monthAgg._sum.amount ?? 0, cur)}`} action={<ExportButton type="depenses" />} />
      <div className="card p-4"><ExpenseForm /></div>

      {expenses.length === 0 ? (
        <EmptyState icon={<Wallet className="w-6 h-6" />} title="Aucune dépense enregistrée" description="Suivez vos charges (loyer, transport, achats…) pour connaître votre résultat réel." />
      ) : (
        <div className="space-y-2">
          {expenses.map((e) => (
            <div key={e.id} className="card p-3 flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900 flex items-center gap-2">
                  <Badge className="bg-amber-100 text-amber-700">{e.category}</Badge>
                  {e.description}
                </div>
                <div className="text-xs text-gray-500">{e.date.toLocaleDateString("fr-FR")}</div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-semibold">{formatMoney(e.amount, cur)}</span>
                <form action={deleteExpenseAction}>
                  <input type="hidden" name="id" value={e.id} />
                  <ConfirmButton className="text-red-400 text-sm px-2" message="Supprimer cette dépense ?">✕</ConfirmButton>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
