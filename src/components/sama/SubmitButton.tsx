"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Bouton de soumission qui affiche automatiquement un état de chargement
 * pendant l'exécution d'une Server Action (aucun faux bouton).
 */
export function SubmitButton({
  children,
  className,
  pendingLabel = "Enregistrement…",
}: {
  children: ReactNode;
  className?: string;
  pendingLabel?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(className ?? "btn-primary", pending && "opacity-70 cursor-wait")}
    >
      {pending ? (
        <span className="inline-flex items-center gap-2">
          <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
          {pendingLabel}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
