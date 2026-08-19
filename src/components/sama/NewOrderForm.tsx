"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Minus, Trash2, Search } from "lucide-react";
import { createOrderAction, type OrderState } from "@/lib/sama/actions/orders";
import { SubmitButton } from "@/components/sama/SubmitButton";
import { Field } from "@/components/sama/ui";
import { formatMoney } from "@/lib/sama/money";
import { CHANNELS } from "@/lib/sama/constants";

interface ProductLite { id: string; name: string; salePrice: number; stock: number }
interface CustomerLite { id: string; name: string }
interface Line { productId: string; name: string; quantity: number; unitPrice: number }

export default function NewOrderForm({ products, customers, currency }: { products: ProductLite[]; customers: CustomerLite[]; currency: string }) {
  const router = useRouter();
  const [cart, setCart] = useState<Line[]>([]);
  const [search, setSearch] = useState("");
  const [deliveryFee, setDeliveryFee] = useState(0);
  const [state, formAction] = useActionState(createOrderAction, {} as OrderState);
  useEffect(() => { if (state.ok && state.orderId) router.push(`/sama/commandes/${state.orderId}`); }, [state, router]);

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return products.filter((p) => !q || p.name.toLowerCase().includes(q)).slice(0, 8);
  }, [products, search]);

  const subtotal = cart.reduce((a, l) => a + l.unitPrice * l.quantity, 0);
  const total = subtotal + deliveryFee;

  const add = (p: ProductLite) => { setCart((c) => c.find((l) => l.productId === p.id) ? c.map((l) => l.productId === p.id ? { ...l, quantity: l.quantity + 1 } : l) : [...c, { productId: p.id, name: p.name, quantity: 1, unitPrice: p.salePrice }]); setSearch(""); };
  const setQty = (i: number, q: number) => setCart((c) => c.map((l, idx) => idx === i ? { ...l, quantity: Math.max(1, q) } : l));
  const remove = (i: number) => setCart((c) => c.filter((_, idx) => idx !== i));

  return (
    <form action={formAction} className="space-y-4">
      <input type="hidden" name="items" value={JSON.stringify(cart)} />
      <input type="hidden" name="deliveryFee" value={deliveryFee} />

      <div className="card p-4">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher un produit…" className="input-field !pl-9" />
          {search && (
            <div className="absolute z-10 mt-1 w-full bg-white border border-gray-200 rounded-xl shadow-lg max-h-64 overflow-y-auto">
              {filtered.map((p) => (
                <button type="button" key={p.id} onClick={() => add(p)} className="w-full flex justify-between px-3 py-2 hover:bg-gray-50 text-sm text-left">
                  <span>{p.name}</span><span className="font-semibold">{formatMoney(p.salePrice, currency as "XOF")}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {cart.length > 0 && (
        <div className="card p-4 space-y-2">
          {cart.map((l, i) => (
            <div key={i} className="flex items-center gap-2 text-sm">
              <span className="flex-1 truncate">{l.name}</span>
              <button type="button" onClick={() => setQty(i, l.quantity - 1)} className="w-7 h-7 rounded-lg bg-gray-100 grid place-items-center"><Minus className="w-3.5 h-3.5" /></button>
              <span className="w-6 text-center">{l.quantity}</span>
              <button type="button" onClick={() => setQty(i, l.quantity + 1)} className="w-7 h-7 rounded-lg bg-gray-100 grid place-items-center"><Plus className="w-3.5 h-3.5" /></button>
              <span className="w-20 text-right font-semibold">{formatMoney(l.unitPrice * l.quantity, currency as "XOF")}</span>
              <button type="button" onClick={() => remove(i)} className="text-red-400"><Trash2 className="w-4 h-4" /></button>
            </div>
          ))}
        </div>
      )}

      <div className="card p-4 space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <Field label="Client"><select name="customerId" className="input-field"><option value="">Client de passage</option>{customers.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}</select></Field>
          <Field label="Canal"><select name="channel" className="input-field" defaultValue="WHATSAPP">{CHANNELS.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}</select></Field>
        </div>
        <Field label="Frais de livraison"><input type="number" min={0} value={deliveryFee || ""} onChange={(e) => setDeliveryFee(parseInt(e.target.value) || 0)} className="input-field" placeholder="0" /></Field>
        <Field label="Commentaire"><textarea name="comment" className="input-field" rows={2} /></Field>
      </div>

      <div className="card p-4 flex justify-between font-bold"><span>Total</span><span>{formatMoney(total, currency as "XOF")}</span></div>
      {state.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}
      <SubmitButton className="btn-primary w-full !py-3">{cart.length === 0 ? "Ajoutez un produit" : "Créer la commande"}</SubmitButton>
    </form>
  );
}
