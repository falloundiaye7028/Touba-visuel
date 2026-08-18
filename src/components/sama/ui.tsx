/**
 * Kit d'UI réutilisable SAMA BUSINESS — mobile-first, lisible, premium sobre.
 */
import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { formatMoney, type CurrencyCode } from "@/lib/sama/money";

export function PageHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-3 mb-4">
      <div>
        <h1 className="text-xl font-bold text-gray-900">{title}</h1>
        {subtitle && <p className="text-sm text-gray-500 mt-0.5">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

export function StatCard({
  label,
  value,
  hint,
  tone = "default",
  icon,
}: {
  label: string;
  value: string;
  hint?: string;
  tone?: "default" | "green" | "amber" | "red" | "blue";
  icon?: ReactNode;
}) {
  const tones: Record<string, string> = {
    default: "bg-white",
    green: "bg-vert-50",
    amber: "bg-amber-50",
    red: "bg-red-50",
    blue: "bg-blue-50",
  };
  return (
    <div className={cn("card p-4", tones[tone])}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-500 uppercase tracking-wide">{label}</span>
        {icon && <span className="text-vert-600">{icon}</span>}
      </div>
      <div className="mt-1 text-2xl font-bold text-gray-900 tabular-nums">{value}</div>
      {hint && <div className="text-xs text-gray-500 mt-0.5">{hint}</div>}
    </div>
  );
}

export function Money({ amount, currency = "XOF", className }: { amount: number; currency?: CurrencyCode; className?: string }) {
  return <span className={cn("tabular-nums", className)}>{formatMoney(amount, currency)}</span>;
}

export function EmptyState({
  title,
  description,
  actionLabel,
  actionHref,
  icon,
}: {
  title: string;
  description: string;
  actionLabel?: string;
  actionHref?: string;
  icon?: ReactNode;
}) {
  return (
    <div className="card p-8 text-center flex flex-col items-center">
      {icon && <div className="w-14 h-14 rounded-2xl bg-vert-50 text-vert-600 flex items-center justify-center mb-4">{icon}</div>}
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-xs">{description}</p>
      {actionLabel && actionHref && (
        <Link href={actionHref} className="btn-primary mt-4">
          {actionLabel}
        </Link>
      )}
    </div>
  );
}

export function Badge({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium", className ?? "bg-gray-100 text-gray-700")}>
      {children}
    </span>
  );
}

export function ExportButton({ type, label = "Exporter" }: { type: string; label?: string }) {
  return (
    <a href={`/api/sama/export?type=${type}`} className="btn-outline !py-2 text-sm">
      {label}
    </a>
  );
}

export function Field({
  label,
  children,
  hint,
  required,
}: {
  label: string;
  children: ReactNode;
  hint?: string;
  required?: boolean;
}) {
  return (
    <label className="block">
      <span className="text-sm font-medium text-gray-700">
        {label} {required && <span className="text-red-500">*</span>}
      </span>
      <div className="mt-1">{children}</div>
      {hint && <span className="text-xs text-gray-400 mt-1 block">{hint}</span>}
    </label>
  );
}
