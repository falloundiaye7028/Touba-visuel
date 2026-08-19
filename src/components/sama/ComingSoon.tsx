import type { ReactNode } from "react";
import { Rocket } from "lucide-react";

export function ComingSoon({ title, description, features, icon }: { title: string; description: string; features?: string[]; icon?: ReactNode }) {
  return (
    <div className="card p-8 text-center flex flex-col items-center">
      <div className="w-14 h-14 rounded-2xl bg-or-50 text-or-600 grid place-items-center mb-4">{icon ?? <Rocket className="w-6 h-6" />}</div>
      <h3 className="font-semibold text-gray-900">{title}</h3>
      <p className="text-sm text-gray-500 mt-1 max-w-sm">{description}</p>
      <span className="mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-or-100 text-or-700">Bientôt disponible</span>
      {features && (
        <ul className="mt-4 text-sm text-gray-600 space-y-1 text-left">
          {features.map((f) => <li key={f}>• {f}</li>)}
        </ul>
      )}
    </div>
  );
}
