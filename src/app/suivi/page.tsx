"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Search, Package, CheckCircle, Clock, Truck, Star, XCircle } from "lucide-react";
import { formatPrix, formatDate } from "@/lib/utils";
import type { Order, OrderStatus } from "@/types";

const ETAPES: { status: OrderStatus; label: string; icon: React.ReactNode }[] = [
  { status: "EN_ATTENTE", label: "Commande reçue", icon: <Clock size={18} /> },
  { status: "CONFIRME", label: "Commande confirmée", icon: <CheckCircle size={18} /> },
  { status: "EN_PRODUCTION", label: "En production", icon: <Package size={18} /> },
  { status: "PRET", label: "Prêt à retirer / expédier", icon: <Star size={18} /> },
  { status: "LIVRE", label: "Livré", icon: <Truck size={18} /> },
];

const statusOrder: Record<OrderStatus, number> = {
  EN_ATTENTE: 0, CONFIRME: 1, EN_PRODUCTION: 2, PRET: 3, LIVRE: 4, ANNULE: -1,
};

function SuiviContent() {
  const searchParams = useSearchParams();
  const [orderNumber, setOrderNumber] = useState(searchParams.get("commande") ?? "");
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim()) return;
    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch(`/api/orders?num=${encodeURIComponent(orderNumber.trim())}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Commande introuvable");
      setOrder(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de recherche");
    } finally {
      setLoading(false);
    }
  };

  const currentStep = order ? statusOrder[order.status] : -1;

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* En-tête */}
      <div className="bg-vert-900 text-white py-10">
        <div className="max-w-3xl mx-auto px-4">
          <nav className="text-vert-400 text-sm mb-4">
            <Link href="/" className="hover:text-or-400">Accueil</Link>
            <span className="mx-2">/</span>
            <span className="text-white">Suivi de commande</span>
          </nav>
          <h1 className="text-3xl font-bold mb-2">Suivre ma commande</h1>
          <p className="text-vert-300">Entrez votre numéro de commande pour suivre son avancement en temps réel.</p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-10">
        {/* Barre de recherche */}
        <form onSubmit={handleSearch} className="bg-white rounded-2xl border border-gray-100 p-6 mb-6 shadow-sm">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Numéro de commande
          </label>
          <div className="flex gap-3">
            <input
              value={orderNumber}
              onChange={(e) => setOrderNumber(e.target.value)}
              className="input-field flex-1"
              placeholder="Ex: TV-260514-1234"
            />
            <button type="submit" disabled={loading}
              className="btn-primary px-6 disabled:opacity-60">
              <Search size={18} />
              {loading ? "..." : "Rechercher"}
            </button>
          </div>
        </form>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-4 mb-6 flex items-center gap-2">
            <XCircle size={20} />
            {error}
          </div>
        )}

        {order && (
          <div className="space-y-5">
            {/* Résumé commande */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <div className="flex items-start justify-between mb-4">
                <div>
                  <p className="text-sm text-gray-500 mb-1">Commande</p>
                  <h2 className="text-xl font-bold text-gray-900">{order.orderNumber}</h2>
                  <p className="text-gray-500 text-sm mt-1">Passée le {formatDate(order.createdAt)}</p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-vert-700">{formatPrix(order.prixTotal)}</p>
                  <p className="text-sm text-gray-500">{order.quantity} × {order.support}</p>
                </div>
              </div>

              <div className="grid sm:grid-cols-2 gap-3 text-sm border-t border-gray-100 pt-4">
                <div>
                  <p className="text-gray-400 text-xs">Client</p>
                  <p className="font-medium text-gray-800">{order.clientName}</p>
                </div>
                <div>
                  <p className="text-gray-400 text-xs">Téléphone</p>
                  <p className="font-medium text-gray-800">{order.clientPhone}</p>
                </div>
                {order.format && (
                  <div>
                    <p className="text-gray-400 text-xs">Format</p>
                    <p className="font-medium text-gray-800">{order.format}</p>
                  </div>
                )}
                <div>
                  <p className="text-gray-400 text-xs">Paiement</p>
                  <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${
                    order.paymentStatus === "PAYE"
                      ? "bg-green-100 text-green-700"
                      : "bg-orange-100 text-orange-700"
                  }`}>
                    {order.paymentStatus === "PAYE" ? "Payé" : "En attente"}
                  </span>
                </div>
              </div>
            </div>

            {/* Timeline de progression */}
            <div className="bg-white rounded-2xl border border-gray-100 p-6 shadow-sm">
              <h3 className="font-bold text-gray-900 text-base mb-6">Avancement de la commande</h3>

              {order.status === "ANNULE" ? (
                <div className="flex items-center gap-3 text-red-600 bg-red-50 rounded-xl p-4">
                  <XCircle size={24} />
                  <div>
                    <p className="font-bold">Commande annulée</p>
                    <p className="text-sm text-red-500">Contactez-nous pour plus d&apos;informations.</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-0">
                  {ETAPES.map((etape, idx) => {
                    const done = idx <= currentStep;
                    const active = idx === currentStep;
                    return (
                      <div key={etape.status} className="flex items-start gap-4">
                        <div className="flex flex-col items-center">
                          <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 border-2 transition-all ${
                            done
                              ? "bg-vert-600 border-vert-600 text-white"
                              : "bg-white border-gray-200 text-gray-300"
                          } ${active ? "ring-4 ring-vert-100" : ""}`}>
                            {etape.icon}
                          </div>
                          {idx < ETAPES.length - 1 && (
                            <div className={`w-0.5 h-10 my-1 ${done && idx < currentStep ? "bg-vert-500" : "bg-gray-200"}`} />
                          )}
                        </div>
                        <div className={`pt-2 pb-8 ${idx === ETAPES.length - 1 ? "pb-0" : ""}`}>
                          <p className={`font-semibold text-sm ${done ? "text-gray-900" : "text-gray-400"}`}>
                            {etape.label}
                          </p>
                          {active && (
                            <p className="text-xs text-vert-600 font-medium mt-0.5">
                              Étape en cours
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Contact */}
            <div className="bg-vert-50 border border-vert-200 rounded-2xl p-5 text-center">
              <p className="text-vert-800 font-semibold mb-1">Une question sur votre commande ?</p>
              <p className="text-vert-600 text-sm mb-3">
                Contactez-nous par WhatsApp avec votre numéro de commande <strong>{order.orderNumber}</strong>
              </p>
              <a href={`https://wa.me/221778001717?text=Bonjour, je voudrais des informations sur ma commande ${order.orderNumber}`}
                target="_blank" rel="noopener noreferrer"
                className="btn-primary inline-flex">
                Contacter par WhatsApp
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SuiviPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-50 flex items-center justify-center text-gray-400">Chargement...</div>}>
      <SuiviContent />
    </Suspense>
  );
}
