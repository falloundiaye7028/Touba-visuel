"use client";

import { Printer } from "lucide-react";

export function PrintButton({ label = "Imprimer" }: { label?: string }) {
  return (
    <button onClick={() => window.print()} className="btn-outline !py-2 text-sm no-print">
      <Printer className="w-4 h-4" /> {label}
    </button>
  );
}
