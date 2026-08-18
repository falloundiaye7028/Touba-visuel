"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, Trash2, Search } from "lucide-react";
import { createSaleAction, type SaleState } from "@/lib/sama/actions/sales";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import { formatMoney } from "@/lib/sama/money";
import { CHANNELS, PAY_METHODS } from "@/lib/sama/constants";

interface ProductLite { id: string; name: string; salePrice: number; stock: number; unit: string }
interface CustomerLite { id: string; name: string }
interface CartLine { productId: string | null; name: string; quantity: number; unitPrice: number; stock: number | null }

export default function NewSaleForm({
  products, customers, currency,
}: { products: ProductLite[]; customers: CustomerLite[]; currency: string }) {
  const router = useRouter();
  const [cart, setCart] = useState<CartLine[]>([]);
  const [search, setSearch] = useState("");
  const [discount, setDiscount] = useState(0);
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [method, setMethod] = useState("ESPECES");
  const [amountPaidInput, setAmountPaidInput] = useState<string>("");
  const [state, formAction] = useActionState(createSaleAction, {} as SaleState);

  useEffect(() => { if (state.ok && state.saleId) router.push(`/sama/ventes/${state.saleId}`); }, [state, router]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => !q || p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [products, search]);

  const subtotal = cart.reduce((a, l) => a + l.unitPrice * l.quantity, 0);
  const total = Math.max(0, subtotal - discount + deliveryFee);

  function addProduct(p: ProductLite) {
    setCart((c) => {
      const existing = c.find((l) => l.productId === p.id);
      if (existing) return c.map((l) => (l.productId === p.id ? { ...l, quantity: l.quantity + 1 } : l));
      return [...c, { productId: p.id, name: p.name, quantity: 1, unitPrice: p.salePrice, stock: p.stock }];
    });
    setSearch("");
  }
  function addFree() {
    setCart((c) => [...c, { productId: null, name: "Article libre", quantity: 1, unitPrice: 0, stock: null }]);
  }
  const setQty = (i: number, q: number) => setCart((c) => c.map((l, idx) => (idx === i ? { ...l, quantity: Math.max(1, q) } : l)));
  const setPrice = (i: number, p: number) => setCart((c) => c.map((l, idx) => (idx === i ? { ...l, unitPrice: Math.max(0, p) } : l)));
  const setName = (i: number, n: string) => setCart((c) => c.map((l, idx) => (idx === i ? { ...l, name: n } : l)));
  const removeLine = (i: number) => setCart((c) => c.filter((_, idx) => idx !== i));

  const itemsJson = JSON.stringify(cart.map((l) => ({ productId: l.productId, name: l.name, quantity: l.quantity, unitPrice: l.unitPrice })));
  const isCredit = method === "CREDIT";

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="items" value={itemsJson} />
      <input type="hidden" name="discount" value={discount} />
      <input type="hidden" name="deliveryFee" value={deliveryFee} />
      <input type="hidden" name="method" value={method} />
      <input type="hidden" name="amountPaid" value={isCredit ? (amountPaidInput || "0") : (amountPaidInput !== "" ? amountPaidInput : String(total))} />

      {/* Recherche produit */}
      <div className="card p-4 space-y-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit à ajouter…" className="input-field !pl-9" />
          {search && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
              {filtered.length === 0 ? (
                <div className="p-3 text-sm text-gray-400">Aucun produit</div>
              ) : filtered.map((p) => (
                <button type="button" key={p.id} onClick={() => addProduct(p)} className="w-full flex items-center justify-between px-3 py-2 hover:bg-gray-50 text-sm text-left">
                  <span>{p.name} <span className="text-gray-400">· stock {p.stock}</span></span>
                  <span className="font-semibold">{formatMoney(p.salePrice, currency as "XOF")}</span>
                </button>
              ))}
            </div>
          )}
        </div>
        <button type="button" onClick={addFree} className="text-sm text-vert-700 font-medium">+ Ajouter un article libre</button>
      </div>

      {/* Panier */}
      {cart.length > 0 && (
        <div className="card p-4 space-y-3">
          {cart.map((l, i) => (
            <div key={i} className="flex items-center gap-2 border-b border-gray-100 pb-3 last:border-0 last:pb-0">
              <div className="flex-1 min-w-0">
                {l.productId ? (
                  <div className="font-medium text-sm truncate">{l.name}</div>
                ) : (
                  <input value={l.name} onChange={(e) => setName(i, e.target.value)} className="input-field !py-1.5 text-sm" placeholder="Nom de l'article" />
                )}
                <div className="flex items-center gap-1 mt-1">
                  <input type="number" min={0} value={l.unitPrice} onChange={(e) => setPrice(i, parseInt(e.target.value) || 0)} className="w-24 border border-gray-200 rounded-lg px-2 py-1 text-sm" />
                  <span className="text-xs text-gray-400">FCFA</span>
                  {l.stock !== null && l.quantity > l.stock && <span className="text-xs text-red-500">stock : {l.stock}</span>}
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button type="button" onClick={() => setQty(i, l.quantity - 1)} className="w-7 h-7 rounded-lg bg-gray-100 grid place-items-center"><Minus className="w-3.5 h-3.5" /></button>
                <input type="number" min={1} value={l.quantity} onChange={(e) => setQty(i, parseInt(e.target.value) || 1)} className="w-12 text-center border border-gray-200 rounded-lg py-1 text-sm" />
                <button type="button" onClick={() => setQty(i, l.quantity + 1)} className="w-7 h-7 rounded-lg bg-gray-100 grid place-items-center"><Plus className="w-3.5 h-3.5" /></button>
              </div>
              <div className="w-20 text-right text-sm font-semibold">{formatMoney(l.unitPrice * l.quantity, currency as "XOF")}</div>
              <button type="button" onClick={() => removeLine(i)} className="text-red-400 p-1"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      {/* Détails */}
      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Client">
            <select name="customerId" className="input-field">
              <option value="">Client de passage</option>
              {customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </Field>
          <Field label="Canal de vente">
            <select name="channel" className="input-field" defaultValue="BOUTIQUE">
              {CHANNELS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
            </select>
          </Field>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Remise (FCFA)">
            <input type="number" min={0} value={discount || ""} onChange={(e) => setDiscount(parseInt(e.target.value) || 0)} className="input-field" placeholder="0" />
          </Field>
          <Field label="Frais de livraison">
            <input type="number" min={0} value={deliveryFee || ""} onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)} className="input-field" placeholder="0" />
          </Field>
        </div>
        <Field label="Moyen de paiement">
          <select value={method} onChange={(e) => setMethod(e.target.value)} className="input-field">
            {PAY_METHODS.map((m) => <option key={m.value} value={m.value}>{m.label}</option>)}
          </select>
        </Field>
        <Field label={isCredit ? "Montant versé (acompte)" : "Montant reçu"} hint={isCredit ? "Laissez vide pour une vente 100% à crédit" : "Laissez vide pour un paiement intégral"}>
          <input type="number" min={0} value={amountPaidInput} onChange={(e) => setAmountPaidInput(e.target.value)} className="input-field" placeholder={formatMoney(total, currency as "XOF")} />
        </Field>
      </div>

      {/* Totaux */}
      <div className="card p-4 space-y-1.5 text-sm">
        <div className="flex justify-between"><span className="text-gray-500">Sous-total</span><span>{formatMoney(subtotal, currency as "XOF")}</span></div>
        {discount > 0 && <div className="flex justify-between text-red-600"><span>Remise</span><span>- {formatMoney(discount, currency as "XOF")}</span></div>}
        {deliveryFee > 0 && <div className="flex justify-between"><span className="text-gray-500">Livraison</span><span>+ {formatMoney(deliveryFee, currency as "XOF")}</span></div>}
        <div className="flex justify-between text-lg font-bold pt-1 border-t border-gray-100"><span>Total</span><span>{formatMoney(total, currency as "XOF")}</span></div>
      </div>

      {state.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}

      <SubmitButton className="btn-primary w-full !py-3" pendingLabel="Enregistrement de la vente…">
        {cart.length === 0 ? "Ajoutez un produit" : `Valider la vente · ${formatMoney(total, currency as "XOF")}`}
      </SubmitButton>
    </form>
  );
}
