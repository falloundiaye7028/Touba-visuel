import { cn } from "@/lib/utils";
import type { OrderStatus, PaymentStatus } from "@/types";

const statusColors: Record<string, string> = {
  EN_ATTENTE: "bg-yellow-100 text-yellow-800",
  CONFIRME: "bg-blue-100 text-blue-800",
  EN_PRODUCTION: "bg-purple-100 text-purple-800",
  PRET: "bg-green-100 text-green-800",
  LIVRE: "bg-vert-100 text-vert-800",
  ANNULE: "bg-red-100 text-red-800",
  NON_PAYE: "bg-gray-100 text-gray-700",
  EN_ATTENTE_PAIEMENT: "bg-orange-100 text-orange-800",
  PAYE: "bg-green-100 text-green-800",
  REMBOURSE: "bg-blue-100 text-blue-800",
  ECHOUE: "bg-red-100 text-red-800",
};

const statusLabels: Record<string, string> = {
  EN_ATTENTE: "En attente",
  CONFIRME: "Confirmé",
  EN_PRODUCTION: "En production",
  PRET: "Prêt",
  LIVRE: "Livré",
  ANNULE: "Annulé",
  NON_PAYE: "Non payé",
  EN_ATTENTE_PAIEMENT: "Paiement en attente",
  PAYE: "Payé",
  REMBOURSE: "Remboursé",
  ECHOUE: "Échoué",
};

interface Props {
  status: OrderStatus | PaymentStatus;
  className?: string;
}

export default function OrderStatusBadge({ status, className }: Props) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold",
        statusColors[status] ?? "bg-gray-100 text-gray-700",
        className
      )}
    >
      {statusLabels[status] ?? status}
    </span>
  );
}
