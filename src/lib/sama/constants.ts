/**
 * Constantes métier SAMA BUSINESS : plans, rôles, catégories de dépenses,
 * moyens de paiement, canaux, types d'activité, villes/pays.
 * Centralisées pour préparer l'internationalisation.
 */
import type { SamaRole } from "@prisma/client";

export const APP_NAME = "SAMA BUSINESS";
export const APP_SLOGAN = "Vendez. Gérez. Encaissez. Fidélisez.";
export const APP_BASE = "/sama";

// ── Plans d'abonnement (référence, synchronisés en base via le seed) ──────────
export interface PlanDef {
  code: string;
  name: string;
  priceMonthly: number;
  maxProducts: number | null;
  maxCustomers: number | null;
  maxSalesMonth: number | null;
  maxUsers: number | null;
  features: string[];
  highlight?: boolean;
}

export const PLANS: PlanDef[] = [
  {
    code: "GRATUIT",
    name: "Gratuit",
    priceMonthly: 0,
    maxProducts: 30,
    maxCustomers: 50,
    maxSalesMonth: 50,
    maxUsers: 1,
    features: ["30 produits", "50 clients", "50 ventes / mois", "1 utilisateur", "Tableau de bord"],
  },
  {
    code: "STARTER",
    name: "Starter",
    priceMonthly: 5000,
    maxProducts: 500,
    maxCustomers: null,
    maxSalesMonth: null,
    maxUsers: 1,
    features: ["500 produits", "Clients illimités", "Ventes illimitées", "Factures PDF", "Gestion de stock", "Rapports"],
  },
  {
    code: "BUSINESS",
    name: "Business",
    priceMonthly: 10000,
    maxProducts: null,
    maxCustomers: null,
    maxSalesMonth: null,
    maxUsers: 10,
    features: ["Tout Starter", "Plusieurs utilisateurs", "Boutique en ligne", "CRM avancé", "Campagnes", "Rapports avancés"],
    highlight: true,
  },
  {
    code: "PRO_IA",
    name: "Pro IA",
    priceMonthly: 20000,
    maxProducts: null,
    maxCustomers: null,
    maxSalesMonth: null,
    maxUsers: 25,
    features: ["Tout Business", "SAMA AI", "Analyses IA", "Contenu marketing IA", "Recommandations", "Rapports IA"],
  },
];

export const planByCode = (code: string) => PLANS.find((p) => p.code === code) ?? PLANS[0];

// ── Rôles ─────────────────────────────────────────────────────────────────────
export const ROLE_LABELS: Record<SamaRole, string> = {
  OWNER: "Propriétaire",
  MANAGER: "Gérant",
  SELLER: "Vendeur",
  CASHIER: "Caissier",
  STOCK: "Gestionnaire de stock",
  COMMERCIAL: "Commercial",
};

// Permissions granulaires par rôle (extensible)
export type Permission =
  | "sales.create" | "sales.view" | "sales.cancel"
  | "orders.manage"
  | "products.manage" | "products.view"
  | "stock.manage"
  | "customers.manage"
  | "expenses.manage"
  | "payments.manage"
  | "invoices.manage"
  | "reports.view"
  | "reports.finance"
  | "employees.manage"
  | "settings.manage"
  | "subscription.manage"
  | "marketing.manage";

export const ROLE_PERMISSIONS: Record<SamaRole, Permission[] | "*"> = {
  OWNER: "*",
  MANAGER: [
    "sales.create", "sales.view", "orders.manage", "products.manage",
    "products.view", "stock.manage", "customers.manage", "reports.view",
    "payments.manage", "invoices.manage", "expenses.manage",
  ],
  SELLER: ["sales.create", "sales.view", "orders.manage", "customers.manage", "products.view"],
  CASHIER: ["payments.manage", "invoices.manage", "sales.view"],
  STOCK: ["stock.manage", "products.manage", "products.view"],
  COMMERCIAL: ["customers.manage", "sales.create", "sales.view", "reports.view", "products.view"],
};

export function hasPermission(role: SamaRole, perm: Permission): boolean {
  const perms = ROLE_PERMISSIONS[role];
  return perms === "*" || perms.includes(perm);
}

export const ALL_PERMISSIONS: { value: Permission; label: string }[] = [
  { value: "sales.create", label: "Créer des ventes" },
  { value: "sales.view", label: "Voir les ventes" },
  { value: "sales.cancel", label: "Annuler des ventes" },
  { value: "orders.manage", label: "Gérer les commandes" },
  { value: "products.manage", label: "Gérer les produits" },
  { value: "products.view", label: "Voir les produits" },
  { value: "stock.manage", label: "Gérer le stock" },
  { value: "customers.manage", label: "Gérer les clients" },
  { value: "expenses.manage", label: "Gérer les dépenses" },
  { value: "payments.manage", label: "Gérer les paiements" },
  { value: "invoices.manage", label: "Gérer les factures/devis" },
  { value: "reports.view", label: "Voir les rapports" },
  { value: "reports.finance", label: "Rapports financiers" },
  { value: "marketing.manage", label: "Gérer le marketing" },
  { value: "employees.manage", label: "Gérer les employés" },
  { value: "settings.manage", label: "Gérer les paramètres" },
  { value: "subscription.manage", label: "Gérer l'abonnement" },
];

/** Développe les permissions d'un rôle en liste explicite. */
export function expandRolePermissions(role: SamaRole): Permission[] {
  const perms = ROLE_PERMISSIONS[role];
  return perms === "*" ? ALL_PERMISSIONS.map((p) => p.value) : [...perms];
}

/**
 * Résolution PURE d'une permission pour un membre : ses permissions
 * personnalisées si définies (liste), sinon celles de son rôle. OWNER a tout.
 */
export function resolveMemberPermission(
  role: SamaRole,
  customPermissions: unknown,
  perm: Permission
): boolean {
  if (role === "OWNER") return true;
  if (Array.isArray(customPermissions)) return (customPermissions as string[]).includes(perm);
  return hasPermission(role, perm);
}

// Segments clients automatiques (marketing / CRM)
export const SEGMENTS = [
  { value: "all", label: "Tous les clients" },
  { value: "new", label: "Nouveaux clients (30 j)" },
  { value: "regular", label: "Clients réguliers (2+ achats)" },
  { value: "best", label: "Meilleurs clients (top dépense)" },
  { value: "inactive", label: "Clients inactifs (60 j+)" },
  { value: "debtors", label: "Clients débiteurs" },
] as const;

// ── Types d'activité ──────────────────────────────────────────────────────────
export const ACTIVITY_TYPES = [
  "Vêtements & Mode", "Alimentation", "Électronique", "Cosmétique & Beauté",
  "Restauration", "Matériaux & Quincaillerie", "Services", "Chaussures",
  "Accessoires", "Épicerie", "Pharmacie & Parapharmacie", "Autre",
];

// ── Catégories de dépenses ─────────────────────────────────────────────────────
export const EXPENSE_CATEGORIES = [
  "Loyer", "Salaires", "Transport", "Électricité", "Communication",
  "Publicité", "Fournitures", "Achats marchandises", "Livraison", "Autre",
];

// ── Moyens de paiement ─────────────────────────────────────────────────────────
export const PAY_METHODS = [
  { value: "ESPECES", label: "Espèces" },
  { value: "WAVE", label: "Wave" },
  { value: "ORANGE_MONEY", label: "Orange Money" },
  { value: "FREE_MONEY", label: "Free Money" },
  { value: "VIREMENT", label: "Virement bancaire" },
  { value: "CHEQUE", label: "Chèque" },
  { value: "CREDIT", label: "Crédit client" },
  { value: "AUTRE", label: "Autre" },
] as const;

// ── Canaux de vente ─────────────────────────────────────────────────────────────
export const CHANNELS = [
  { value: "BOUTIQUE", label: "Boutique physique" },
  { value: "WHATSAPP", label: "WhatsApp" },
  { value: "FACEBOOK", label: "Facebook" },
  { value: "INSTAGRAM", label: "Instagram" },
  { value: "TIKTOK", label: "TikTok" },
  { value: "SITE_WEB", label: "Site web" },
  { value: "TELEPHONE", label: "Téléphone" },
  { value: "AUTRE", label: "Autre" },
] as const;

// ── Statuts de commande ─────────────────────────────────────────────────────────
export const ORDER_STATUS = [
  { value: "NOUVELLE", label: "Nouvelle", color: "bg-blue-100 text-blue-700" },
  { value: "CONFIRMEE", label: "Confirmée", color: "bg-indigo-100 text-indigo-700" },
  { value: "EN_PREPARATION", label: "En préparation", color: "bg-amber-100 text-amber-700" },
  { value: "PRETE", label: "Prête", color: "bg-purple-100 text-purple-700" },
  { value: "EXPEDIEE", label: "Expédiée", color: "bg-cyan-100 text-cyan-700" },
  { value: "LIVREE", label: "Livrée", color: "bg-green-100 text-green-700" },
  { value: "ANNULEE", label: "Annulée", color: "bg-red-100 text-red-700" },
  { value: "RETOURNEE", label: "Retournée", color: "bg-gray-100 text-gray-700" },
] as const;

// ── Pays supportés (architecture Afrique francophone) ──────────────────────────
export const COUNTRIES = [
  { code: "SN", name: "Sénégal", currency: "XOF", dial: "+221" },
  { code: "CI", name: "Côte d'Ivoire", currency: "XOF", dial: "+225" },
  { code: "ML", name: "Mali", currency: "XOF", dial: "+223" },
  { code: "GN", name: "Guinée", currency: "GNF", dial: "+224" },
  { code: "BF", name: "Burkina Faso", currency: "XOF", dial: "+226" },
  { code: "MR", name: "Mauritanie", currency: "MRU", dial: "+222" },
  { code: "BJ", name: "Bénin", currency: "XOF", dial: "+229" },
  { code: "TG", name: "Togo", currency: "XOF", dial: "+228" },
  { code: "CM", name: "Cameroun", currency: "XAF", dial: "+237" },
] as const;

export const SN_CITIES = [
  "Dakar", "Touba", "Thiès", "Mbour", "Saint-Louis", "Kaolack", "Ziguinchor",
  "Diourbel", "Louga", "Tambacounda", "Rufisque", "Mbacké", "Autre",
];
