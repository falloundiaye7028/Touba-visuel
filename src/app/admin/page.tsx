"use client";

import { useState, useEffect, useCallback } from "react";
import { Package, CheckCircle, Clock, Truck, XCircle, RefreshCw } from "lucide-react";
import OrderStatusBadge from "@/components/OrderStatusBadge";
import { formatPrix, formatDate } from "@/lib/utils";
import type { Order, OrderStatus, PaymentStatus } from "@/types";

const STATUS_OPTIONS: { value: string; label: string }[] = [
  { value: "", label: "Toutes les commandes" },
  { value: "EN_ATTENTE", label: "En attente" },
  { value: "CONFIRME", label: "Confirmées" },
  { value: "EN_PRODUCTION", label: "En production" },
  { value: "PRET", label: "Prêtes" },
  { value: "LIVRE", label: "Livrées" },
  { value: "ANNULE", label: "Annulées" },
];

export default function AdminPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const res = await fetch(`/api/admin/orders?status=${statusFilter}`);
    const data = await res.json();
    setOrders(data.orders ?? []);
    setTotal(data.total ?? 0);
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const updateOrder = async (id: string, status: OrderStatus, paymentStatus?: PaymentStatus) => {
    setUpdating(id);
    await fetch("/api/admin/orders", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id, status, paymentStatus }),
    });
    await fetchOrders();
    setUpdating(null);
  };

  const stats = [
    { label: "Total commandes", value: total, icon: <Package size={20} className="text-vert-600" />, bg: "bg-vert-50" },
    { label: "En attente", value: orders.filter((o) => o.status === "EN_ATTENTE").length, icon: <Clock size={20} className="text-yellow-600" />, bg: "bg-yellow-50" },
    { label: "En production", value: orders.filter((o) => o.status === "EN_PRODUCTION").length, icon: <RefreshCw size={20} className="text-purple-600" />, bg: "bg-purple-50" },
    { label: "Livrées", value: orders.filter((o) => o.status === "LIVRE").length, icon: <Truck size={20} className="text-blue-600" />, bg: "bg-blue-50" },
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* En-tête admin */}
      <div className="bg-vert-950 text-white py-6 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold">Administration — Agence Touba Visuel (ATV)</h1>
            <p className="text-vert-400 text-sm">Gestion des commandes et paiements</p>
          </div>
          <button onClick={fetchOrders} className="flex items-center gap-2 bg-vert-800 hover:bg-vert-700 text-white px-4 py-2 rounded-lg text-sm transition-colors">
            <RefreshCw size={15} />
            Actualiser
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Statistiques */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className={`${s.bg} rounded-xl p-4 border border-gray-100`}>
              <div className="flex items-center gap-2 mb-1">{s.icon}</div>
              <p className="text-2xl font-bold text-gray-900">{s.value}</p>
              <p className="text-gray-500 text-xs">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Filtres */}
        <div className="bg-white rounded-xl border border-gray-100 p-4 mb-5 flex flex-wrap gap-2">
          {STATUS_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setStatusFilter(opt.value)}
              className={`px-4 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                statusFilter === opt.value
                  ? "bg-vert-700 text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Tableau des commandes */}
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden shadow-sm">
          {loading ? (
            <div className="text-center py-16 text-gray-400">Chargement...</div>
          ) : orders.length === 0 ? (
            <div className="text-center py-16 text-gray-400">Aucune commande</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Commande</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Client</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Support</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Montant</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Statut</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Paiement</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Date</th>
                    <th className="text-left px-4 py-3 text-gray-600 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {orders.map((order) => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono font-bold text-vert-700 text-xs">{order.orderNumber}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-gray-900">{order.clientName}</p>
                        <p className="text-gray-400 text-xs">{order.clientPhone}</p>
                      </td>
                      <td className="px-4 py-3">
                        <p className="text-gray-800">{order.support}</p>
                        <p className="text-gray-400 text-xs">×{order.quantity}{order.format ? ` — ${order.format}` : ""}</p>
                      </td>
                      <td className="px-4 py-3 font-bold text-gray-900">{formatPrix(order.prixTotal)}</td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.status} />
                      </td>
                      <td className="px-4 py-3">
                        <OrderStatusBadge status={order.paymentStatus} />
                      </td>
                      <td className="px-4 py-3 text-gray-500 text-xs whitespace-nowrap">{formatDate(order.createdAt)}</td>
                      <td className="px-4 py-3">
                        <div className="flex gap-1">
                          {order.status === "EN_ATTENTE" && (
                            <button
                              onClick={() => updateOrder(order.id, "CONFIRME")}
                              disabled={updating === order.id}
                              className="p-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg transition-colors"
                              title="Confirmer"
                            >
                              <CheckCircle size={14} />
                            </button>
                          )}
                          {order.status === "CONFIRME" && (
                            <button
                              onClick={() => updateOrder(order.id, "EN_PRODUCTION")}
                              disabled={updating === order.id}
                              className="p-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg transition-colors"
                              title="Mettre en production"
                            >
                              <RefreshCw size={14} />
                            </button>
                          )}
                          {order.status === "EN_PRODUCTION" && (
                            <button
                              onClick={() => updateOrder(order.id, "PRET")}
                              disabled={updating === order.id}
                              className="p-1.5 bg-green-100 hover:bg-green-200 text-green-700 rounded-lg transition-colors"
                              title="Marquer prêt"
                            >
                              <Package size={14} />
                            </button>
                          )}
                          {order.status === "PRET" && (
                            <button
                              onClick={() => updateOrder(order.id, "LIVRE", "PAYE")}
                              disabled={updating === order.id}
                              className="p-1.5 bg-teal-100 hover:bg-teal-200 text-teal-700 rounded-lg transition-colors"
                              title="Marquer livré"
                            >
                              <Truck size={14} />
                            </button>
                          )}
                          {order.status !== "ANNULE" && order.status !== "LIVRE" && (
                            <button
                              onClick={() => updateOrder(order.id, "ANNULE")}
                              disabled={updating === order.id}
                              className="p-1.5 bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
                              title="Annuler"
                            >
                              <XCircle size={14} />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
