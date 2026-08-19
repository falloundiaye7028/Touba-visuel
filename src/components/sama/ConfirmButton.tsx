"use client";

import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import type { ReactNode } from "react";

/**
 * Bouton de soumission avec confirmation (actions destructrices / sensibles).
 * S'utilise à l'intérieur d'un <form action={serverAction}>.
 */
export function ConfirmButton({
  children,
  message,
  className,
}: {
  children: ReactNode;
  message: string;
  className?: string;
}) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      onClick={(e) => {
        if (!window.confirm(message)) e.preventDefault();
      }}
      className={cn(className ?? "btn-outline", pending && "opacity-60")}
    >
      {pending ? "…" : children}
    </button>
  );
}
