"use client";

import { useActionState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import ImageUpload from "@/components/sama/ImageUpload";
import type { FormState } from "@/lib/sama/actions/products";

type Action = (prev: FormState, fd: FormData) => Promise<FormState>;

export interface ProductInitial {
  id?: string;
  name?: string;
  sku?: string;
  categoryName?: string;
  description?: string;
  costPrice?: number;
  salePrice?: number;
  wholesalePrice?: number | null;
  stock?: number;
  alertThreshold?: number;
  unit?: string;
  imageUrl?: string | null;
}

export default function ProductForm({
  action,
  initial,
  categories,
  redirectTo = "/sama/produits",
}: {
  action: Action;
  initial?: ProductInitial;
  categories: string[];
  redirectTo?: string;
}) {
  const router = useRouter();
  const [state, formAction] = useActionState(action, {} as FormState);

  useEffect(() => {
    if (state.ok) router.push(redirectTo);
  }, [state.ok, router, redirectTo]);

  return (
    <form action={formAction} className="space-y-3">
      {initial?.id && <input type="hidden" name="id" value={initial.id} />}
      <ImageUpload name="imageUrl" initial={initial?.imageUrl} label="Photo du produit" />
      <Field label="Nom du produit" required>
        <input name="name" className="input-field" defaultValue={initial?.name} required placeholder="Ex : Sneakers Premium" />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Référence / SKU">
          <input name="sku" className="input-field" defaultValue={initial?.sku} placeholder="SKU-001" />
        </Field>
        <Field label="Catégorie">
          <input name="categoryName" list="cat-list" className="input-field" defaultValue={initial?.categoryName} placeholder="Chaussures" />
          <datalist id="cat-list">
            {categories.map((c) => <option key={c} value={c} />)}
          </datalist>
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prix d'achat (FCFA)">
          <input name="costPrice" type="number" min="0" className="input-field" defaultValue={initial?.costPrice} placeholder="0" />
        </Field>
        <Field label="Prix de vente (FCFA)" required>
          <input name="salePrice" type="number" min="0" className="input-field" defaultValue={initial?.salePrice} required placeholder="0" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label="Prix grossiste (FCFA)">
          <input name="wholesalePrice" type="number" min="0" className="input-field" defaultValue={initial?.wholesalePrice ?? undefined} placeholder="Optionnel" />
        </Field>
        <Field label="Unité">
          <input name="unit" className="input-field" defaultValue={initial?.unit ?? "pièce"} placeholder="pièce" />
        </Field>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Field label={initial?.id ? "Stock (via ajustements)" : "Stock initial"}>
          <input name="stock" type="number" min="0" className="input-field" defaultValue={initial?.stock ?? 0} disabled={!!initial?.id} />
        </Field>
        <Field label="Seuil d'alerte">
          <input name="alertThreshold" type="number" min="0" className="input-field" defaultValue={initial?.alertThreshold ?? 5} />
        </Field>
      </div>
      <Field label="Description">
        <textarea name="description" className="input-field" rows={2} defaultValue={initial?.description} placeholder="Détails du produit…" />
      </Field>

      {state.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}

      <div className="flex gap-2">
        <SubmitButton className="btn-primary flex-1">{initial?.id ? "Enregistrer" : "Ajouter le produit"}</SubmitButton>
        <button type="button" onClick={() => router.back()} className="btn-outline">Annuler</button>
      </div>
    </form>
  );
}
