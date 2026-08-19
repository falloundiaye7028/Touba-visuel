"use client";

import { useActionState, useEffect, useMemo, useState } from "react";
import { Plus, Minus, ShoppingBag, X, MessageCircle } from "lucide-react";
import { createStoreOrderAction, type OrderState } from "@/lib/sama/actions/orders";
import { formatMoney } from "@/lib/sama/money";

interface P { id: string; name: string; salePrice: number; stock: number; imageUrl: string | null; description: string | null; category: string | null }
interface Line { productId: string; name: string; quantity: number; unitPrice: number }

export default function StoreClient({
  slug, products, whatsapp, brandColor, currency, businessName,
}: { slug: string; products: P[]; whatsapp: string; brandColor: string; currency: string; businessName: string }) {
  const [cart, setCart] = useState<Line[]>([]);
  const [open, setOpen] = useState(false);
  const [done, setDone] = useState(false);
  const [state, formAction] = useActionState(createStoreOrderAction, {} as OrderState);
  useEffect(() => { if (state.ok) { setDone(true); setCart([]); } }, [state.ok]);

  const add = (p: P) => setCart((c) => c.find((l) => l.productId === p.id) ? c.map((l) => l.productId === p.id ? { ...l, quantity: l.quantity + 1 } : l) : [...c, { productId: p.id, name: p.name, quantity: 1, unitPrice: p.salePrice }]);
  const setQty = (id: string, q: number) => setCart((c) => c.flatMap((l) => l.productId === id ? (q <= 0 ? [] : [{ ...l, quantity: q }]) : [l]));
  const count = cart.reduce((a, l) => a + l.quantity, 0);
  const total = cart.reduce((a, l) => a + l.unitPrice * l.quantity, 0);

  const waText = useMemo(() => encodeURIComponent(
    `Bonjour, je souhaite commander :\n` + cart.map((l) => `${l.quantity} × ${l.name}`).join("\n") + `\nTotal : ${formatMoney(total, currency as "XOF")}`
  ), [cart, total, currency]);
  const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "").replace(/^0/, "221")}?text=${waText}` : "";

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {products.map((p) => (
          <div key={p.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden flex flex-col">
            <div className="aspect-square bg-gray-100 grid place-items-center text-gray-300">
              {p.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={p.imageUrl} alt={p.name} className="w-full h-full object-cover" />
              ) : <ShoppingBag className="w-8 h-8" />}
            </div>
            <div className="p-3 flex flex-col flex-1">
              <div className="font-medium text-sm text-gray-900 line-clamp-2">{p.name}</div>
              <div className="font-bold mt-1" style={{ color: brandColor }}>{formatMoney(p.salePrice, currency as "XOF")}</div>
              <button onClick={() => add(p)} disabled={p.stock <= 0} className="mt-2 text-sm font-semibold text-white rounded-xl py-2 disabled:opacity-40" style={{ background: brandColor }}>
                {p.stock <= 0 ? "Épuisé" : "Ajouter"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {count > 0 && !open && (
        <button onClick={() => setOpen(true)} className="fixed bottom-4 inset-x-4 max-w-md mx-auto text-white rounded-2xl py-3 px-5 flex items-center justify-between shadow-lg z-40" style={{ background: brandColor }}>
          <span className="flex items-center gap-2"><ShoppingBag className="w-5 h-5" /> Panier ({count})</span>
          <span className="font-bold">{formatMoney(total, currency as "XOF")}</span>
        </button>
      )}

      {open && (
        <div className="fixed inset-0 z-50 bg-black/40 flex items-end sm:items-center justify-center" onClick={() => setOpen(false)}>
          <div className="bg-white w-full sm:max-w-md sm:rounded-3xl rounded-t-3xl p-5 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-3">
              <h2 className="font-bold text-lg">Votre panier</h2>
              <button onClick={() => setOpen(false)}><X className="w-5 h-5 text-gray-400" /></button>
            </div>

            {done ? (
              <div className="text-center py-6">
                <div className="text-2xl">✅</div>
                <p className="font-semibold mt-2">Commande envoyée !</p>
                <p className="text-sm text-gray-500 mt-1">{businessName} vous contactera pour la confirmation.</p>
                <button onClick={() => { setDone(false); setOpen(false); }} className="mt-4 text-sm text-vert-700 font-medium">Fermer</button>
              </div>
            ) : (
              <>
                <div className="space-y-2 mb-4">
                  {cart.map((l) => (
                    <div key={l.productId} className="flex items-center gap-2 text-sm">
                      <span className="flex-1">{l.name}</span>
                      <button onClick={() => setQty(l.productId, l.quantity - 1)} className="w-7 h-7 rounded-lg bg-gray-100 grid place-items-center"><Minus className="w-3.5 h-3.5" /></button>
                      <span className="w-6 text-center">{l.quantity}</span>
                      <button onClick={() => setQty(l.productId, l.quantity + 1)} className="w-7 h-7 rounded-lg bg-gray-100 grid place-items-center"><Plus className="w-3.5 h-3.5" /></button>
                      <span className="w-20 text-right font-semibold">{formatMoney(l.unitPrice * l.quantity, currency as "XOF")}</span>
                    </div>
                  ))}
                </div>
                <div className="flex justify-between font-bold border-t border-gray-100 pt-2 mb-4"><span>Total</span><span>{formatMoney(total, currency as "XOF")}</span></div>

                <form action={formAction} className="space-y-2">
                  <input type="hidden" name="slug" value={slug} />
                  <input type="hidden" name="items" value={JSON.stringify(cart)} />
                  <input name="name" placeholder="Votre nom *" className="input-field !py-2" required />
                  <input name="phone" placeholder="Téléphone *" className="input-field !py-2" required />
                  <input name="city" placeholder="Ville" className="input-field !py-2" />
                  <input name="address" placeholder="Adresse de livraison" className="input-field !py-2" />
                  <textarea name="comment" placeholder="Commentaire" rows={2} className="input-field !py-2" />
                  {state.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{state.error}</div>}
                  <button type="submit" className="w-full text-white rounded-xl py-3 font-semibold" style={{ background: brandColor }}>Valider la commande</button>
                </form>
                {waLink && (
                  <a href={waLink} target="_blank" className="mt-2 w-full flex items-center justify-center gap-2 border-2 rounded-xl py-2.5 font-semibold text-sm" style={{ borderColor: brandColor, color: brandColor }}>
                    <MessageCircle className="w-4 h-4" /> Commander sur WhatsApp
                  </a>
                )}
              </>
            )}
          </div>
        </div>
      )}
    </>
  );
}
