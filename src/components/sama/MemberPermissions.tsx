"use client";

import { useState } from "react";
import { ShieldCheck, ChevronDown } from "lucide-react";
import { updateMemberPermissionsAction } from "@/lib/sama/actions/employees";
import { ALL_PERMISSIONS } from "@/lib/sama/constants";

export default function MemberPermissions({
  memberId, current, custom,
}: { memberId: string; current: string[]; custom: boolean }) {
  const [open, setOpen] = useState(false);
  const currentSet = new Set(current);

  return (
    <div className="mt-2">
      <button onClick={() => setOpen((o) => !o)} className="inline-flex items-center gap-1.5 text-xs text-gray-500 hover:text-vert-700">
        <ShieldCheck className="w-3.5 h-3.5" /> Permissions {custom && <span className="text-vert-600">(personnalisées)</span>}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <form action={updateMemberPermissionsAction} className="mt-2 bg-gray-50 rounded-xl p-3">
          <input type="hidden" name="memberId" value={memberId} />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {ALL_PERMISSIONS.map((p) => (
              <label key={p.value} className="flex items-center gap-2 text-sm text-gray-600">
                <input type="checkbox" name="perm" value={p.value} defaultChecked={currentSet.has(p.value)} className="rounded border-gray-300 text-vert-600 focus:ring-vert-500" />
                {p.label}
              </label>
            ))}
          </div>
          <div className="flex gap-2 mt-3">
            <button type="submit" className="btn-primary !py-1.5 !px-3 text-xs">Enregistrer</button>
            <button type="submit" name="reset" value="true" className="btn-outline !py-1.5 !px-3 text-xs">Réinitialiser au rôle</button>
          </div>
        </form>
      )}
    </div>
  );
}
