"use client";

import { FormEvent, useCallback, useEffect, useMemo, useState } from "react";
import { signOut } from "next-auth/react";
import {
  Activity, Bell, BookOpenCheck, Building2, Check, ChevronDown,
  CircleUserRound, ClipboardCheck, Download, Droplets, FileCheck2,
  FolderKanban, HandCoins, HeartHandshake, Home, KeyRound, Landmark, Lightbulb, LockKeyhole,
  MapPin, Menu, MessageSquareText, MoreHorizontal, Network, Plus,
  Printer, ReceiptText, Search, Settings, ShieldCheck, TrendingUp, UsersRound, Wallet,
  UserPlus, WalletCards, X,
} from "lucide-react";

type View = "dashboard" | "membres" | "contributions" | "finances" | "projets" | "commissions" | "transparence";
type Role = "Administrateur" | "Collecteur" | "Responsable commission" | "Contrôleur";
type MemberRole = Role | "Membre";
type MemberStatus = "Actif" | "À relancer" | "Suspendu";
type Transaction = { name: string; id: string; zone: string; amount: string; channel: string; time: string; initials: string };
type ContributionReceipt = { receiptNumber: string; amount: number; channel: string; externalReference: string | null; contributedAt: string; status: string; member: { memberCode: string; name: string; zone: string | null }; recordedBy: { memberCode: string; name: string } };
type Member = { id: string; name: string; phone: string; zone: string; country: string; status: MemberStatus; role: MemberRole; email: string; accountEnabled: boolean; joinedAt: string; initials: string };
type ProjectRecord = { id: string; name: string; domain: string; budget: string; spent: string; progress: number; place: string; status: "En cours" | "Planifié" | "Finalisation" | "Terminé"; iconName: "health" | "water" | "building" | "light" };
type Expense = { id: string; recordId?: string; label: string; commission: string; amount: number; status: "À valider" | "Validée"; approvals: number; required: number; submittedAt: string };
type AuditAction = "CONTRIBUTION_CREATED" | "MEMBER_CREATED" | "MEMBER_ACCESS_UPDATED" | "PROJECT_CREATED" | "EXPENSE_CREATED" | "EXPENSE_APPROVED" | "PASSWORD_CHANGED";
type AuditEntry = { at: string; action: AuditAction; actor: string; recordId: string; detail: string };
type DataMode = "loading" | "demo" | "server";
type ServerMetrics = { activeMembers: number; collectedThisMonth: number; contributionCount: number; activeProjects: number };

type ServerBootstrap = {
  mode: "server";
  actor: { id: string; name: string; role: "ADMIN" | "COLLECTOR" | "COMMISSION_MANAGER" | "CONTROLLER" };
  metrics: ServerMetrics;
  members: Array<{ memberCode: string; name: string; phone: string | null; zone: string | null; country: string; status: "ACTIVE" | "TO_FOLLOW_UP" | "SUSPENDED"; role: "ADMIN" | "COLLECTOR" | "COMMISSION_MANAGER" | "CONTROLLER" | "MEMBER"; createdAt: string; user: { email: string } | null }>;
  contributions: Array<{ receiptNumber: string; amount: number; channel: string; contributedAt: string; member: { memberCode: string; name: string; zone: string | null } | null }>;
  projects: Array<{ projectCode: string; name: string; domain: string; budget: number; spent: number; progress: number; place: string | null; status: "PLANNED" | "IN_PROGRESS" | "FINALIZATION" | "COMPLETED" }>;
  expenses: Array<{ id: string; expenseNumber: string; label: string; commission: string; amount: number; status: "PENDING" | "APPROVED" | "REJECTED" | "PAID"; required: number; submittedAt: string; _count: { approvals: number } }>;
  audit: Array<{ action: AuditAction; entityId: string; metadata: Record<string, unknown> | null; createdAt: string; actor: { name: string; memberCode: string } | null }>;
};

const TRANSACTIONS_STORAGE_KEY = "tck-connect:v1:transactions";
const MEMBERS_STORAGE_KEY = "tck-connect:v1:members";
const PROJECTS_STORAGE_KEY = "tck-connect:v1:projects";
const EXPENSES_STORAGE_KEY = "tck-connect:v1:expenses";
const ROLE_STORAGE_KEY = "tck-connect:v1:role";
const AUDIT_STORAGE_KEY = "tck-connect:v1:audit";

const navigation = [
  { id: "dashboard" as View, label: "Vue d’ensemble", icon: Home },
  { id: "membres" as View, label: "Membres", icon: UsersRound },
  { id: "contributions" as View, label: "Contributions", icon: HandCoins },
  { id: "finances" as View, label: "Finances & contrôle", icon: Wallet },
  { id: "projets" as View, label: "Projets", icon: FolderKanban },
  { id: "commissions" as View, label: "Commissions", icon: Network },
  { id: "transparence" as View, label: "Transparence", icon: ShieldCheck },
];

const roleViews: Record<Role, View[]> = {
  Administrateur: ["dashboard", "membres", "contributions", "finances", "projets", "commissions", "transparence"],
  Collecteur: ["dashboard", "membres", "contributions"],
  "Responsable commission": ["dashboard", "membres", "projets", "commissions"],
  Contrôleur: ["dashboard", "contributions", "finances", "transparence"],
};

const stats = [
  { label: "Membres actifs", value: "184 240", trend: "+12,4 %", detail: "depuis le mois dernier", icon: UsersRound },
  { label: "Collecté ce mois", value: "146,8 M", suffix: "F CFA", trend: "+8,2 %", detail: "depuis le mois dernier", icon: HandCoins },
  { label: "Projets en cours", value: "24", trend: "8 domaines", detail: "à travers Touba", icon: TrendingUp },
  { label: "Taux de traçabilité", value: "100 %", trend: "Audit à jour", detail: "toutes les opérations", icon: ShieldCheck },
];

const defaultTransactions: Transaction[] = [
  { name: "Sokhna Awa Diop", id: "TCK-026184", zone: "Touba Mosquée", amount: "1 000", channel: "Wave", time: "Il y a 4 min", initials: "AD" },
  { name: "Serigne Fallou Mbacké", id: "TCK-018042", zone: "Dakar", amount: "12 000", channel: "Orange Money", time: "Il y a 12 min", initials: "FM" },
  { name: "Moussa Faye", id: "TCK-031508", zone: "Diourbel", amount: "1 000", channel: "Collecteur", time: "Il y a 18 min", initials: "MF" },
  { name: "Aïssatou Ndiaye", id: "TCK-042091", zone: "France", amount: "25 000", channel: "Virement", time: "Il y a 31 min", initials: "AN" },
  { name: "Cheikhouna Gueye", id: "TCK-009713", zone: "Touba Guédé", amount: "3 000", channel: "Free Money", time: "Il y a 45 min", initials: "CG" },
];

const defaultMembers: Member[] = [
  { id: "TCK-026184", name: "Sokhna Awa Diop", phone: "+221 77 000 11 22", zone: "Touba Mosquée", country: "Sénégal", status: "Actif", role: "Membre", email: "", accountEnabled: false, joinedAt: "12 août 2026", initials: "AD" },
  { id: "TCK-018042", name: "Serigne Fallou Mbacké", phone: "+221 76 000 33 44", zone: "Dakar", country: "Sénégal", status: "Actif", role: "Collecteur", email: "collecteur@tck.sn", accountEnabled: true, joinedAt: "8 août 2026", initials: "FM" },
  { id: "TCK-031508", name: "Moussa Faye", phone: "+221 78 000 55 66", zone: "Diourbel", country: "Sénégal", status: "À relancer", role: "Membre", email: "", accountEnabled: false, joinedAt: "2 août 2026", initials: "MF" },
  { id: "TCK-042091", name: "Aïssatou Ndiaye", phone: "+33 6 00 00 00 00", zone: "Île-de-France", country: "France", status: "Actif", role: "Contrôleur", email: "controle@tck.sn", accountEnabled: true, joinedAt: "28 juillet 2026", initials: "AN" },
  { id: "TCK-009713", name: "Cheikhouna Gueye", phone: "+221 70 000 77 88", zone: "Touba Guédé", country: "Sénégal", status: "Actif", role: "Membre", email: "", accountEnabled: false, joinedAt: "21 juillet 2026", initials: "CG" },
];

const defaultProjects: ProjectRecord[] = [
  { id: "PRJ-001", name: "Centre de dialyse Ndamatou", domain: "Santé", budget: "480 M", spent: "312 M", progress: 65, place: "Ndamatou", status: "En cours", iconName: "health" },
  { id: "PRJ-002", name: "Réseau d’eau — 12 quartiers", domain: "Hydraulique", budget: "195 M", spent: "154 M", progress: 79, place: "Touba périphérie", status: "En cours", iconName: "water" },
  { id: "PRJ-003", name: "VRD Université de Touba", domain: "Infrastructure", budget: "1,2 Md", spent: "348 M", progress: 29, place: "CCAK", status: "Planifié", iconName: "building" },
  { id: "PRJ-004", name: "Lampadaires solaires — lot 4", domain: "Éclairage", budget: "86 M", spent: "81 M", progress: 94, place: "6 quartiers", status: "Finalisation", iconName: "light" },
];

const defaultExpenses: Expense[] = [
  { id: "DEP-26081", label: "Pompe de forage gros débit", commission: "Hydraulique", amount: 18500000, status: "À valider", approvals: 9, required: 13, submittedAt: "26 août 2026" },
  { id: "DEP-26080", label: "Équipements centre de santé", commission: "Santé & Social", amount: 7200000, status: "À valider", approvals: 12, required: 13, submittedAt: "25 août 2026" },
  { id: "DEP-26079", label: "Entretien lot lampadaires", commission: "Éclairage public", amount: 3650000, status: "Validée", approvals: 13, required: 13, submittedAt: "24 août 2026" },
];

const projectIcons = { health: HeartHandshake, water: Droplets, building: Building2, light: Lightbulb };

const serverRoleLabels: Record<ServerBootstrap["actor"]["role"], Role> = {
  ADMIN: "Administrateur",
  COLLECTOR: "Collecteur",
  COMMISSION_MANAGER: "Responsable commission",
  CONTROLLER: "Contrôleur",
};

const memberRoleLabels: Record<ServerBootstrap["members"][number]["role"], MemberRole> = {
  ADMIN: "Administrateur",
  COLLECTOR: "Collecteur",
  COMMISSION_MANAGER: "Responsable commission",
  CONTROLLER: "Contrôleur",
  MEMBER: "Membre",
};

const memberRoleValues: Record<MemberRole, ServerBootstrap["members"][number]["role"]> = {
  Administrateur: "ADMIN",
  Collecteur: "COLLECTOR",
  "Responsable commission": "COMMISSION_MANAGER",
  Contrôleur: "CONTROLLER",
  Membre: "MEMBER",
};

const memberStatusValues: Record<MemberStatus, ServerBootstrap["members"][number]["status"]> = {
  Actif: "ACTIVE",
  "À relancer": "TO_FOLLOW_UP",
  Suspendu: "SUSPENDED",
};

const serverProjectStatuses: Record<ServerBootstrap["projects"][number]["status"], ProjectRecord["status"]> = {
  PLANNED: "Planifié",
  IN_PROGRESS: "En cours",
  FINALIZATION: "Finalisation",
  COMPLETED: "Terminé",
};

const commissions = [
  { name: "Hydraulique", members: 22, projects: 4, icon: Droplets, color: "blue" },
  { name: "Finances", members: 22, projects: 8, icon: Landmark, color: "gold" },
  { name: "Santé & Social", members: 31, projects: 6, icon: HeartHandshake, color: "red" },
  { name: "Éclairage public", members: 28, projects: 3, icon: Lightbulb, color: "yellow" },
  { name: "Scientifique & Culturelle", members: 46, projects: 5, icon: BookOpenCheck, color: "purple" },
  { name: "Communication", members: 18, projects: 2, icon: MessageSquareText, color: "green" },
];

const chartValues = [42, 49, 45, 58, 55, 67, 63, 74, 69, 82, 88, 96];

function PageTitle({ eyebrow, title, text, action }: { eyebrow: string; title: string; text: string; action?: React.ReactNode }) {
  return <div className="tck-welcome"><div><span className="tck-eyebrow">{eyebrow}</span><h1>{title}</h1><p>{text}</p></div>{action}</div>;
}

function Status({ children }: { children: React.ReactNode }) {
  return <span className="tck-status"><i />{children}</span>;
}

function downloadCsv(filename: string, rows: Array<Array<string | number>>) {
  const content = rows.map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(",")).join("\n");
  const url = URL.createObjectURL(new Blob(["\ufeff", content], { type: "text/csv;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

function initials(name: string) {
  return name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "TCK";
}

function formatCompactMoney(amount: number) {
  if (amount >= 1_000_000_000) return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(amount / 1_000_000_000)} Md`;
  if (amount >= 1_000_000) return `${new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(amount / 1_000_000)} M`;
  return new Intl.NumberFormat("fr-FR").format(amount);
}

function parseMoneyLabel(value: string) {
  const normalized = value.trim().toLowerCase().replaceAll(" ", "").replace(",", ".");
  const numeric = Number.parseFloat(normalized.replace(/[^0-9.]/g, "")) || 0;
  if (normalized.includes("md")) return Math.round(numeric * 1_000_000_000);
  if (normalized.includes("m")) return Math.round(numeric * 1_000_000);
  return Math.round(numeric);
}

function auditDetail(entry: ServerBootstrap["audit"][number]) {
  const metadata = entry.metadata || {};
  if (entry.action === "MEMBER_CREATED") return `${metadata.name || "Membre"} · ${metadata.zone || "Zone non renseignée"}`;
  if (entry.action === "MEMBER_ACCESS_UPDATED") return `${metadata.name || "Membre"} · ${metadata.role || "Rôle mis à jour"} · ${metadata.status || "Statut mis à jour"}`;
  if (entry.action === "CONTRIBUTION_CREATED") return `${new Intl.NumberFormat("fr-FR").format(Number(metadata.amount || 0))} F CFA · ${metadata.channel || "Canal non renseigné"}`;
  if (entry.action === "PROJECT_CREATED") return `${metadata.name || "Projet"} · ${new Intl.NumberFormat("fr-FR").format(Number(metadata.budget || 0))} F CFA`;
  if (entry.action === "EXPENSE_CREATED") return `${metadata.label || "Dépense"} · ${new Intl.NumberFormat("fr-FR").format(Number(metadata.amount || 0))} F CFA`;
  if (entry.action === "PASSWORD_CHANGED") return "Sécurité du compte mise à jour";
  return `${metadata.expenseNumber || "Dépense"} · validation ${metadata.approvals || 0}/${metadata.required || 13}`;
}

export default function TckConnectPage() {
  const [view, setView] = useState<View>("dashboard");
  const [query, setQuery] = useState("");
  const [menuOpen, setMenuOpen] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [receipt, setReceipt] = useState<ContributionReceipt | null>(null);
  const [memberModalOpen, setMemberModalOpen] = useState(false);
  const [memberAccess, setMemberAccess] = useState<Member | null>(null);
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [expenseModalOpen, setExpenseModalOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [toast, setToast] = useState(false);
  const [toastError, setToastError] = useState(false);
  const [toastText, setToastText] = useState("Le reçu TCK a été généré avec succès.");
  const [dataMode, setDataMode] = useState<DataMode>("loading");
  const [actorName, setActorName] = useState("Mame Mor Mbacké");
  const [serverMetrics, setServerMetrics] = useState<ServerMetrics | null>(null);
  const [role, setRole] = useState<Role>("Administrateur");
  const [transactions, setTransactions] = useState<Transaction[]>(defaultTransactions);
  const [members, setMembers] = useState<Member[]>(defaultMembers);
  const [projectRecords, setProjectRecords] = useState<ProjectRecord[]>(defaultProjects);
  const [expenses, setExpenses] = useState<Expense[]>(defaultExpenses);
  const [auditEntries, setAuditEntries] = useState<AuditEntry[]>([]);
  const currentLabel = navigation.find((item) => item.id === view)?.label ?? "Vue d’ensemble";
  const allowedNavigation = navigation.filter((item) => roleViews[role].includes(item.id));
  const canCollect = role === "Administrateur" || role === "Collecteur";
  const canManageProjects = role === "Administrateur" || role === "Responsable commission";
  const canManageFinances = role === "Administrateur" || role === "Contrôleur";
  const canManageMembers = dataMode === "server" && role === "Administrateur";
  const filteredTransactions = useMemo(() => transactions.filter((item) => `${item.name} ${item.id} ${item.zone}`.toLowerCase().includes(query.toLowerCase())), [query, transactions]);

  const loadServerData = useCallback(async () => {
    try {
      const response = await fetch("/api/tck/bootstrap", { cache: "no-store" });
      if (response.status === 401 || response.status === 403) {
        setDataMode("demo");
        return false;
      }
      if (!response.ok) throw new Error("Synchronisation indisponible");
      const payload = await response.json() as ServerBootstrap;
      const date = new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" });
      const dateTime = new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" });

      setActorName(payload.actor.name);
      setRole(serverRoleLabels[payload.actor.role]);
      setServerMetrics(payload.metrics);
      setMembers(payload.members.map((member) => ({
        id: member.memberCode,
        name: member.name,
        phone: member.phone || "—",
        zone: member.zone || "Non renseignée",
        country: member.country,
        status: member.status === "ACTIVE" ? "Actif" : member.status === "SUSPENDED" ? "Suspendu" : "À relancer",
        role: memberRoleLabels[member.role],
        email: member.user?.email || "",
        accountEnabled: Boolean(member.user),
        joinedAt: date.format(new Date(member.createdAt)),
        initials: initials(member.name),
      })));
      setTransactions(payload.contributions.map((item) => ({
        name: item.member?.name || "Contributeur non rattaché",
        id: item.member?.memberCode || item.receiptNumber,
        zone: item.member?.zone || "Non renseignée",
        amount: new Intl.NumberFormat("fr-FR").format(item.amount),
        channel: item.channel,
        time: dateTime.format(new Date(item.contributedAt)),
        initials: initials(item.member?.name || "TCK"),
      })));
      setProjectRecords(payload.projects.map((project) => ({
        id: project.projectCode,
        name: project.name,
        domain: project.domain,
        budget: formatCompactMoney(project.budget),
        spent: formatCompactMoney(project.spent),
        progress: project.progress,
        place: project.place || "Touba",
        status: serverProjectStatuses[project.status],
        iconName: project.domain === "Santé" ? "health" : project.domain === "Hydraulique" ? "water" : project.domain === "Éclairage" ? "light" : "building",
      })));
      setExpenses(payload.expenses.map((expense) => ({
        id: expense.expenseNumber,
        recordId: expense.id,
        label: expense.label,
        commission: expense.commission,
        amount: expense.amount,
        status: expense.status === "APPROVED" || expense.status === "PAID" ? "Validée" : "À valider",
        approvals: expense._count.approvals,
        required: expense.required,
        submittedAt: date.format(new Date(expense.submittedAt)),
      })));
      setAuditEntries(payload.audit.map((entry) => ({
        at: entry.createdAt,
        action: entry.action,
        actor: entry.actor ? `${entry.actor.name} · ${entry.actor.memberCode}` : "Système TCK",
        recordId: entry.entityId,
        detail: auditDetail(entry),
      })));
      setDataMode("server");
      return true;
    } catch {
      setDataMode("demo");
      return false;
    }
  }, []);

  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(TRANSACTIONS_STORAGE_KEY);
      if (saved) {
        const payload = JSON.parse(saved) as { version?: number; records?: Transaction[] };
        if (payload.version === 1 && Array.isArray(payload.records)) setTransactions(payload.records);
      }
      const savedMembers = window.localStorage.getItem(MEMBERS_STORAGE_KEY);
      if (savedMembers) {
        const payload = JSON.parse(savedMembers) as { version?: number; records?: Member[] };
        if (payload.version === 1 && Array.isArray(payload.records)) setMembers(payload.records);
      }
      const savedProjects = window.localStorage.getItem(PROJECTS_STORAGE_KEY);
      if (savedProjects) {
        const payload = JSON.parse(savedProjects) as { version?: number; records?: ProjectRecord[] };
        if (payload.version === 1 && Array.isArray(payload.records)) setProjectRecords(payload.records);
      }
      const savedExpenses = window.localStorage.getItem(EXPENSES_STORAGE_KEY);
      if (savedExpenses) {
        const payload = JSON.parse(savedExpenses) as { version?: number; records?: Expense[] };
        if (payload.version === 1 && Array.isArray(payload.records)) setExpenses(payload.records);
      }
      const savedRole = window.localStorage.getItem(ROLE_STORAGE_KEY) as Role | null;
      if (savedRole && roleViews[savedRole]) setRole(savedRole);
      const savedAudit = window.localStorage.getItem(AUDIT_STORAGE_KEY);
      if (savedAudit) {
        const parsed = JSON.parse(savedAudit) as Array<AuditEntry & { amount?: number; channel?: string }>;
        setAuditEntries(parsed.map((entry) => ({
          ...entry,
          detail: entry.detail || `${new Intl.NumberFormat("fr-FR").format(entry.amount || 0)} F CFA · ${entry.channel || "Saisie directe"}`,
        })));
      }
    } catch {
      setTransactions(defaultTransactions);
      setMembers(defaultMembers);
      setProjectRecords(defaultProjects);
      setExpenses(defaultExpenses);
      setAuditEntries([]);
    }
    void loadServerData();
  }, [loadServerData]);

  function changeView(next: View) {
    setView(next); setMenuOpen(false); window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function changeRole(next: Role) {
    if (dataMode === "server") return;
    setRole(next);
    window.localStorage.setItem(ROLE_STORAGE_KEY, next);
    setProfileOpen(false);
    if (!roleViews[next].includes(view)) setView("dashboard");
  }

  function notify(text = "L’opération a été enregistrée avec succès.", error = false) {
    setToastText(text);
    setToastError(error);
    setToast(true);
    window.setTimeout(() => setToast(false), 4000);
  }

  async function serverMutation<T = unknown>(path: string, body?: Record<string, unknown>, method = "POST") {
    const response = await fetch(path, {
      method,
      headers: body ? { "Content-Type": "application/json" } : undefined,
      body: body ? JSON.stringify(body) : undefined,
    });
    const payload = await response.json().catch(() => ({})) as T & { error?: string };
    if (!response.ok) throw new Error(payload.error || "Opération refusée par le serveur TCK");
    await loadServerData();
    return payload;
  }
  function appendAudit(entry: AuditEntry) {
    const next = [entry, ...auditEntries].slice(0, 100);
    setAuditEntries(next);
    window.localStorage.setItem(AUDIT_STORAGE_KEY, JSON.stringify(next));
  }
  async function saveContribution(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("memberName") || "Membre TCK").trim();
    const id = String(form.get("memberId") || "TCK-DEMO").trim().toUpperCase();
    const amountNumber = Number(form.get("amount") || 0);
    const channel = String(form.get("channel") || "Saisie directe");
    const reference = String(form.get("reference") || "").trim();
    if (dataMode === "server") {
      try {
        const payload = await serverMutation<{ record: ContributionReceipt }>("/api/tck/contributions", { memberCode: id, amount: amountNumber, channel, externalReference: reference });
        setModalOpen(false);
        setReceipt(payload.record);
        notify("Contribution enregistrée dans PostgreSQL et reçue par le journal d’audit.");
      } catch (error) {
        notify(error instanceof Error ? error.message : "Contribution non enregistrée", true);
      }
      return;
    }
    const record: Transaction = {
      name,
      id,
      zone: "Saisie directe",
      amount: new Intl.NumberFormat("fr-FR").format(amountNumber),
      channel,
      time: "À l’instant",
      initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "TCK",
    };
    const next = [record, ...transactions];
    setTransactions(next);
    window.localStorage.setItem(TRANSACTIONS_STORAGE_KEY, JSON.stringify({ version: 1, records: next }));
    appendAudit({ at: new Date().toISOString(), action: "CONTRIBUTION_CREATED", actor: `${role} démo`, recordId: id, detail: `${new Intl.NumberFormat("fr-FR").format(amountNumber)} F CFA · ${channel}` });
    setModalOpen(false);
    setReceipt({ receiptNumber: `REC-DEMO-${String(Date.now()).slice(-8)}`, amount: amountNumber, channel, externalReference: reference || null, contributedAt: new Date().toISOString(), status: "VALIDATED", member: { memberCode: id, name, zone: "Saisie directe" }, recordedBy: { memberCode: "DEMO", name: `${role} démo` } });
    notify("Contribution conservée sur cet appareil en mode démonstration.");
  }

  async function saveMember(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const name = String(form.get("name") || "Membre TCK").trim();
    if (dataMode === "server") {
      try {
        await serverMutation("/api/tck/members", { name, phone: String(form.get("phone") || "").trim(), zone: String(form.get("zone") || "").trim(), country: String(form.get("country") || "Sénégal") });
        setMemberModalOpen(false);
        notify("Membre créé dans le référentiel central TCK.");
      } catch (error) {
        notify(error instanceof Error ? error.message : "Membre non créé", true);
      }
      return;
    }
    const id = `TCK-${String(Date.now()).slice(-6)}`;
    const record: Member = {
      id,
      name,
      phone: String(form.get("phone") || "").trim(),
      zone: String(form.get("zone") || "Non renseignée").trim(),
      country: String(form.get("country") || "Sénégal"),
      status: "Actif",
      role: "Membre",
      email: "",
      accountEnabled: false,
      joinedAt: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date()),
      initials: name.split(/\s+/).slice(0, 2).map((part) => part[0]).join("").toUpperCase() || "TCK",
    };
    const next = [record, ...members];
    setMembers(next);
    window.localStorage.setItem(MEMBERS_STORAGE_KEY, JSON.stringify({ version: 1, records: next }));
    appendAudit({ at: new Date().toISOString(), action: "MEMBER_CREATED", actor: `${role} démo`, recordId: id, detail: `${record.name} · ${record.zone}` });
    setMemberModalOpen(false);
    notify("Membre conservé sur cet appareil en mode démonstration.");
  }

  async function saveMemberAccess(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!memberAccess || !canManageMembers) return;
    const form = new FormData(event.currentTarget);
    const nextRole = String(form.get("role") || "Membre") as MemberRole;
    const nextStatus = String(form.get("status") || "Actif") as MemberStatus;
    try {
      await serverMutation(`/api/tck/members/${encodeURIComponent(memberAccess.id)}`, {
        role: memberRoleValues[nextRole],
        status: memberStatusValues[nextStatus],
        email: String(form.get("email") || "").trim(),
        temporaryPassword: String(form.get("temporaryPassword") || ""),
      }, "PATCH");
      setMemberAccess(null);
      notify("Rôle, statut et accès du membre mis à jour dans le registre central.");
    } catch (error) {
      notify(error instanceof Error ? error.message : "Accès du membre non modifié", true);
    }
  }

  async function saveProject(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const domain = String(form.get("domain") || "Infrastructure");
    if (dataMode === "server") {
      const status = { "Planifié": "PLANNED", "En cours": "IN_PROGRESS", "Finalisation": "FINALIZATION", "Terminé": "COMPLETED" }[String(form.get("status") || "Planifié")];
      try {
        await serverMutation("/api/tck/projects", { name: String(form.get("name") || "").trim(), domain, budget: parseMoneyLabel(String(form.get("budget") || "0")), place: String(form.get("place") || "").trim(), status, public: true });
        setProjectModalOpen(false);
        notify("Projet publié dans le portefeuille central TCK.");
      } catch (error) {
        notify(error instanceof Error ? error.message : "Projet non créé", true);
      }
      return;
    }
    const record: ProjectRecord = {
      id: `PRJ-${String(Date.now()).slice(-6)}`,
      name: String(form.get("name") || "Projet TCK").trim(),
      domain,
      budget: String(form.get("budget") || "0 M").trim(),
      spent: "0",
      progress: 0,
      place: String(form.get("place") || "Touba").trim(),
      status: String(form.get("status") || "Planifié") as ProjectRecord["status"],
      iconName: domain === "Santé" ? "health" : domain === "Hydraulique" ? "water" : domain === "Éclairage" ? "light" : "building",
    };
    const next = [record, ...projectRecords];
    setProjectRecords(next);
    window.localStorage.setItem(PROJECTS_STORAGE_KEY, JSON.stringify({ version: 1, records: next }));
    appendAudit({ at: new Date().toISOString(), action: "PROJECT_CREATED", actor: `${role} démo`, recordId: record.id, detail: `${record.name} · ${record.budget} F CFA` });
    setProjectModalOpen(false);
    notify("Projet conservé sur cet appareil en mode démonstration.");
  }

  async function saveExpense(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    if (dataMode === "server") {
      try {
        await serverMutation("/api/tck/expenses", { label: String(form.get("label") || "").trim(), commission: String(form.get("commission") || "Finances"), amount: Number(form.get("amount") || 0), justification: String(form.get("justification") || "").trim() });
        setExpenseModalOpen(false);
        notify("Dépense soumise au quorum dans le système central.");
      } catch (error) {
        notify(error instanceof Error ? error.message : "Dépense non soumise", true);
      }
      return;
    }
    const record: Expense = {
      id: `DEP-${String(Date.now()).slice(-5)}`,
      label: String(form.get("label") || "Dépense TCK").trim(),
      commission: String(form.get("commission") || "Finances"),
      amount: Number(form.get("amount") || 0),
      status: "À valider",
      approvals: 1,
      required: 13,
      submittedAt: new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "short", year: "numeric" }).format(new Date()),
    };
    const next = [record, ...expenses];
    setExpenses(next);
    window.localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify({ version: 1, records: next }));
    appendAudit({ at: new Date().toISOString(), action: "EXPENSE_CREATED", actor: `${role} démo`, recordId: record.id, detail: `${record.label} · ${new Intl.NumberFormat("fr-FR").format(record.amount)} F CFA` });
    setExpenseModalOpen(false);
    notify("Dépense conservée sur cet appareil en mode démonstration.");
  }

  async function approveExpense(id: string) {
    const current = expenses.find((item) => item.id === id);
    if (!current || current.status === "Validée") return;
    if (dataMode === "server") {
      try {
        await serverMutation(`/api/tck/expenses/${current.recordId}/approve`);
        notify("Votre validation a été enregistrée dans le quorum.");
      } catch (error) {
        notify(error instanceof Error ? error.message : "Validation refusée", true);
      }
      return;
    }
    const next = expenses.map((item) => item.id === id ? { ...item, approvals: Math.min(item.approvals + 1, item.required), status: item.approvals + 1 >= item.required ? "Validée" as const : "À valider" as const } : item);
    setExpenses(next);
    window.localStorage.setItem(EXPENSES_STORAGE_KEY, JSON.stringify({ version: 1, records: next }));
    appendAudit({ at: new Date().toISOString(), action: "EXPENSE_APPROVED", actor: `${role} démo`, recordId: id, detail: `${current.label} · validation ${Math.min(current.approvals + 1, current.required)}/${current.required}` });
    notify("Validation simulée sur cet appareil.");
  }

  return (
    <div className="tck-shell">
      {menuOpen && <button className="tck-overlay" aria-label="Fermer le menu" onClick={() => setMenuOpen(false)} />}
      <aside className={`tck-sidebar ${menuOpen ? "open" : ""}`}>
        <div className="tck-brand"><div className="tck-brand-mark">TCK</div><div><strong>TCK CONNECT</strong><span>Touba Ca Kanam</span></div></div>
        <span className="tck-nav-label">Pilotage</span>
        <nav aria-label="Navigation principale">{allowedNavigation.map(({ id, label, icon: Icon }) => <button className={view === id ? "active" : ""} onClick={() => changeView(id)} key={id}><Icon size={19} />{label}</button>)}</nav>
        <span className="tck-nav-label tck-nav-label-bottom">Système</span>
        <nav><button><Bell size={19} />Notifications<span className="tck-badge">6</span></button><button><Settings size={19} />Paramètres</button></nav>
        <div className="tck-sidebar-foot"><ShieldCheck size={20} /><div><strong>Données sécurisées</strong><span>Dernier audit : aujourd’hui</span></div></div>
      </aside>

      <main className="tck-main">
        <header className="tck-topbar">
          <button className="tck-icon-btn tck-menu" aria-label="Ouvrir le menu" onClick={() => setMenuOpen(true)}><Menu size={22} /></button>
          <div className="tck-mobile-title">{currentLabel}</div>
          <span className={`tck-mvp ${dataMode === "server" ? "server" : ""}`}>
            {dataMode === "loading" ? "Connexion…" : dataMode === "server" ? "Serveur TCK" : "Mode démo"}
          </span>
          <label className="tck-search"><Search size={18} /><input value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Rechercher" placeholder="Rechercher un membre, un projet…" /></label>
          <div className="tck-top-actions"><button className="tck-icon-btn" aria-label="Notifications"><Bell size={20} /><i /></button><div className="tck-profile-wrap"><button className="tck-profile" aria-expanded={profileOpen} onClick={() => setProfileOpen((open) => !open)}><CircleUserRound size={28} /><span><strong>{actorName}</strong><small>{role}</small></span><ChevronDown size={16} /></button>{profileOpen && <div className="tck-role-menu">{dataMode === "server" ? <><span>Session sécurisée</span><a className="tck-session-link tck-session-link-first" href="/tck-connect/compte/securite"><KeyRound size={15} />Changer le mot de passe</a><button className="tck-session-action" onClick={() => void signOut({ callbackUrl: "/tck-connect" })}><LockKeyhole size={15} />Se déconnecter</button></> : <><span>Simuler un profil</span>{(Object.keys(roleViews) as Role[]).map((item) => <button className={item === role ? "active" : ""} onClick={() => changeRole(item)} key={item}><i />{item}{item === role && <Check size={14} />}</button>)}<a className="tck-session-link" href="/tck-connect/connexion"><LockKeyhole size={15} />Se connecter au serveur</a></>}</div>}</div></div>
        </header>
        <div className="tck-content">
          {view === "dashboard" && <Dashboard onAdd={() => setModalOpen(true)} onNavigate={changeView} rows={filteredTransactions} records={projectRecords} canCollect={canCollect} actorName={actorName} dataMode={dataMode} metrics={serverMetrics} />}
          {view === "membres" && <Members query={query} onAdd={() => setMemberModalOpen(true)} onManage={canManageMembers ? setMemberAccess : undefined} records={members} metrics={serverMetrics} />}
          {view === "contributions" && <Contributions onAdd={() => setModalOpen(true)} rows={filteredTransactions} canAdd={canCollect} metrics={serverMetrics} />}
          {view === "finances" && <Finances expenses={expenses} onAdd={() => setExpenseModalOpen(true)} onApprove={approveExpense} canManage={canManageFinances} />}
          {view === "projets" && <Projects records={projectRecords} onAdd={() => setProjectModalOpen(true)} canAdd={canManageProjects} />}
          {view === "commissions" && <Commissions />}
          {view === "transparence" && <Transparency auditEntries={auditEntries} />}
        </div>
        <nav className="tck-bottom-nav" aria-label="Navigation mobile">{allowedNavigation.slice(0, 5).map(({ id, label, icon: Icon }) => <button className={view === id ? "active" : ""} onClick={() => changeView(id)} key={id}><Icon size={19} /><span>{label.split(" ")[0]}</span></button>)}</nav>
      </main>
      {modalOpen && <ContributionModal onClose={() => setModalOpen(false)} onSave={saveContribution} server={dataMode === "server"} members={members} />}
      {receipt && <ContributionReceiptModal receipt={receipt} onClose={() => setReceipt(null)} />}
      {memberModalOpen && <MemberModal onClose={() => setMemberModalOpen(false)} onSave={saveMember} server={dataMode === "server"} />}
      {memberAccess && <MemberAccessModal member={memberAccess} onClose={() => setMemberAccess(null)} onSave={saveMemberAccess} />}
      {projectModalOpen && <ProjectModal onClose={() => setProjectModalOpen(false)} onSave={saveProject} server={dataMode === "server"} />}
      {expenseModalOpen && <ExpenseModal onClose={() => setExpenseModalOpen(false)} onSave={saveExpense} server={dataMode === "server"} />}
      {toast && <div className={`tck-toast ${toastError ? "error" : ""}`}><span>{toastError ? <X size={17} /> : <Check size={17} />}</span><div><strong>{toastError ? "Action requise" : "Opération enregistrée"}</strong><small>{toastText}</small></div></div>}
    </div>
  );
}

function Dashboard({ onAdd, onNavigate, rows, records, canCollect, actorName, dataMode, metrics }: { onAdd: () => void; onNavigate: (view: View) => void; rows: Transaction[]; records: ProjectRecord[]; canCollect: boolean; actorName: string; dataMode: DataMode; metrics: ServerMetrics | null }) {
  const liveStats = metrics ? [
    { label: "Membres actifs", value: new Intl.NumberFormat("fr-FR").format(metrics.activeMembers), trend: "Référentiel central", detail: "comptes actifs", icon: UsersRound },
    { label: "Collecté ce mois", value: formatCompactMoney(metrics.collectedThisMonth), suffix: "F CFA", trend: `${metrics.contributionCount} opération${metrics.contributionCount > 1 ? "s" : ""}`, detail: "validée(s)", icon: HandCoins },
    { label: "Projets en cours", value: String(metrics.activeProjects), trend: "Portefeuille public", detail: "piloté en temps réel", icon: TrendingUp },
    { label: "Taux de traçabilité", value: "100 %", trend: "Audit serveur", detail: "écritures journalisées", icon: ShieldCheck },
  ] : stats;
  const monthlyAmount = metrics?.collectedThisMonth ?? 146_800_000;
  const progress = Math.min(100, monthlyAmount / 200_000_000 * 100);
  const firstName = actorName.split(/\s+/)[0] || "TCK";
  return <><PageTitle eyebrow="Jeudi 27 août 2026" title={`As-salāmu ʿalaykum, ${firstName}`} text="Voici l’état de la mobilisation et des projets de Touba Ca Kanam." action={canCollect ? <button className="tck-primary" onClick={onAdd}><Plus size={18} />Nouvelle contribution</button> : <span className="tck-lock-note"><LockKeyhole size={15} />Lecture seule</span>} /><div className="tck-stats">{liveStats.map(({ label, value, suffix, trend, detail, icon: Icon }) => <article className="tck-stat" key={label}><div className="tck-stat-head"><span>{label}</span><i><Icon size={19} /></i></div><strong>{value} {suffix && <small>{suffix}</small>}</strong><p><b>{trend}</b> {detail}</p></article>)}</div><section className="tck-hero-panel"><div><span className="tck-eyebrow">Objectif communautaire</span><h2>1 000 F par mouride, chaque mois.</h2><p>Une contribution simple. Des résultats visibles. Une confiance partagée.</p></div><div className="tck-progress-wrap"><div><span>Progression mensuelle</span><strong>{new Intl.NumberFormat("fr-FR", { maximumFractionDigits: 1 }).format(progress)} %</strong></div><div className="tck-progress"><i style={{ width: `${progress}%` }} /></div><small>{formatCompactMoney(monthlyAmount)} F CFA sur un objectif de 200 M</small></div></section><div className="tck-grid-main"><section className="tck-card tck-chart-card"><CardHead title="Évolution des contributions" subtitle={dataMode === "server" ? "Tendance de référence · connexion serveur active" : "Collecte mensuelle · en millions F CFA"} action="12 derniers mois" /><div className="tck-chart"><div className="tck-y-axis"><span>100</span><span>75</span><span>50</span><span>25</span><span>0</span></div><div className="tck-bars">{chartValues.map((v, i) => <div className="tck-bar-col" key={i}><i style={{ height: `${v}%` }}><b>{v}</b></i><span>{["Sep", "Oct", "Nov", "Déc", "Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Aoû"][i]}</span></div>)}</div></div></section><section className="tck-card"><CardHead title="Projets prioritaires" subtitle="Avancement opérationnel" /><div className="tck-project-mini">{records.slice(0, 3).map((project) => { const Icon = projectIcons[project.iconName]; return <button onClick={() => onNavigate("projets")} key={project.id}><span className="tck-mini-icon"><Icon size={18} /></span><div><strong>{project.name}</strong><small>{project.place}</small><div className="tck-mini-progress"><i style={{ width: `${project.progress}%` }} /></div></div><b>{project.progress}%</b></button>; })}{records.length === 0 && <div className="tck-empty"><FolderKanban size={24} /><strong>Aucun projet publié</strong><span>Le portefeuille central est prêt à recevoir son premier dossier.</span></div>}</div></section></div><section className="tck-card tck-table-card"><CardHead title="Contributions récentes" subtitle="Transactions validées en temps réel" action="Voir le registre" onAction={() => onNavigate("contributions")} /><TransactionsTable rows={rows} /></section></>;
}

function CardHead({ title, subtitle, action, onAction }: { title: string; subtitle: string; action?: string; onAction?: () => void }) { return <div className="tck-card-head"><div><h3>{title}</h3><p>{subtitle}</p></div>{action && <button onClick={onAction}>{action}<ChevronDown size={14} /></button>}</div>; }
function TransactionsTable({ rows }: { rows: Transaction[] }) { return <div className="tck-table-scroll"><table className="tck-table"><thead><tr><th>Contributeur</th><th>Zone</th><th>Canal</th><th>Montant</th><th>Statut</th><th></th></tr></thead><tbody>{rows.map((item, index) => <tr key={`${item.id}-${index}`}><td><div className="tck-person"><i>{item.initials}</i><span><strong>{item.name}</strong><small>{item.id} · {item.time}</small></span></div></td><td>{item.zone}</td><td>{item.channel}</td><td><strong>{item.amount} F</strong></td><td><Status>Validée</Status></td><td><button className="tck-more" aria-label={`Actions pour ${item.name}`}><MoreHorizontal size={18} /></button></td></tr>)}</tbody></table>{rows.length === 0 && <div className="tck-empty"><Search size={24} /><strong>Aucun résultat</strong><span>Essayez un nom, un identifiant ou une zone.</span></div>}</div>; }

function Members({ query, onAdd, onManage, records, metrics }: { query: string; onAdd: () => void; onManage?: (member: Member) => void; records: Member[]; metrics: ServerMetrics | null }) {
  const filtered = records.filter((item) => `${item.name} ${item.id} ${item.zone} ${item.country} ${item.role} ${item.email}`.toLowerCase().includes(query.toLowerCase()));
  const staffCount = records.filter((item) => item.role !== "Membre" && item.status === "Actif").length;
  const exportMembers = () => downloadCsv("tck-connect-membres.csv", [["Identifiant", "Nom", "Téléphone", "Zone", "Pays", "Rôle", "Statut", "Compte"], ...filtered.map((item) => [item.id, item.name, item.phone, item.zone, item.country, item.role, item.status, item.accountEnabled ? item.email : "Non activé"])]);
  return <><PageTitle eyebrow="Communauté" title="Registre des membres" text="Une identité TCK unique, du quartier à la diaspora." action={<button className="tck-primary" onClick={onAdd}><UserPlus size={18} />Ajouter un membre</button>} /><div className="tck-summary-strip"><div><UsersRound /><span><strong>{new Intl.NumberFormat("fr-FR").format(metrics?.activeMembers ?? 184235 + records.length)}</strong>Membres actifs</span></div><div><MapPin /><span><strong>{metrics ? new Set(records.map((record) => record.zone)).size : 312}</strong>Zones couvertes</span></div><div><ShieldCheck /><span><strong>{metrics ? staffCount : 2}</strong>Accès opérationnels</span></div></div><section className="tck-card tck-members-card"><CardHead title="Membres récents" subtitle={query ? `Résultats pour « ${query} »` : "Identités, rôles et accès au système central"} action="Exporter" onAction={exportMembers} /><MembersTable rows={filtered} onManage={onManage} /></section></>;
}

function MembersTable({ rows, onManage }: { rows: Member[]; onManage?: (member: Member) => void }) {
  return <div className="tck-table-scroll"><table className="tck-table tck-members-table"><thead><tr><th>Membre</th><th>Zone</th><th>Rôle</th><th>Compte</th><th>Statut</th>{onManage && <th>Administration</th>}</tr></thead><tbody>{rows.map((member) => <tr key={member.id}><td><div className="tck-person"><i>{member.initials}</i><span><strong>{member.name}</strong><small>{member.id} · {member.phone}</small></span></div></td><td>{member.zone}<small>{member.country}</small></td><td><span className={`tck-role tck-role-${member.role === "Membre" ? "member" : "staff"}`}>{member.role}</span></td><td>{member.accountEnabled ? <span className="tck-account"><LockKeyhole size={13} /><span><strong>Activé</strong><small>{member.email}</small></span></span> : <span className="tck-account tck-account-off"><CircleUserRound size={13} />Non activé</span>}</td><td><span className={member.status === "Actif" ? "tck-status" : member.status === "Suspendu" ? "tck-status tck-status-stop" : "tck-status tck-status-warn"}><i />{member.status}</span></td>{onManage && <td><button className="tck-member-manage" onClick={() => onManage(member)}><Settings size={14} />Gérer</button></td>}</tr>)}</tbody></table>{rows.length === 0 && <div className="tck-empty"><Search size={24} /><strong>Aucun membre</strong><span>Modifiez la recherche ou créez une nouvelle fiche.</span></div>}</div>;
}

function Contributions({ onAdd, rows, canAdd, metrics }: { onAdd: () => void; rows: Transaction[]; canAdd: boolean; metrics: ServerMetrics | null }) {
  const exportRows = () => downloadCsv("tck-connect-contributions.csv", [["Identifiant", "Contributeur", "Zone", "Canal", "Montant", "Date"], ...rows.map((item) => [item.id, item.name, item.zone, item.channel, item.amount, item.time])]);
  const total = metrics?.collectedThisMonth ?? 8_420_000;
  const count = metrics?.contributionCount ?? 2918;
  const average = count > 0 ? Math.round(total / count) : 0;
  return <><PageTitle eyebrow="Mobilisation" title="Contributions & collecte" text="Suivez chaque franc, du contributeur jusqu’au rapprochement bancaire." action={canAdd ? <button className="tck-primary" onClick={onAdd}><Plus size={18} />Enregistrer</button> : <span className="tck-lock-note"><LockKeyhole size={15} />Consultation de contrôle</span>} /><div className="tck-stats tck-stats-3"><article className="tck-stat"><div className="tck-stat-head"><span>{metrics ? "Ce mois" : "Aujourd’hui"}</span><i><WalletCards size={19} /></i></div><strong>{formatCompactMoney(total)} <small>F CFA</small></strong><p><b>{new Intl.NumberFormat("fr-FR").format(count)}</b> transactions validées</p></article><article className="tck-stat"><div className="tck-stat-head"><span>À rapprocher</span><i><ReceiptText size={19} /></i></div><strong>{metrics ? "0" : "3,18 M"} <small>F CFA</small></strong><p><b>{metrics ? 0 : 148}</b> opérations à contrôler</p></article><article className="tck-stat"><div className="tck-stat-head"><span>Contribution moyenne</span><i><TrendingUp size={19} /></i></div><strong>{new Intl.NumberFormat("fr-FR").format(metrics ? average : 4720)} <small>F CFA</small></strong><p><b>{metrics ? "Calcul serveur" : "+6,4 %"}</b> sur la période</p></article></div><section className="tck-card tck-table-card"><CardHead title="Registre de collecte" subtitle="Tous les canaux · mise à jour en temps réel" action="Télécharger" onAction={exportRows} /><TransactionsTable rows={rows} /></section></>;
}

function Projects({ records, onAdd, canAdd }: { records: ProjectRecord[]; onAdd: () => void; canAdd: boolean }) {
  const [filter, setFilter] = useState("Tous");
  const filtered = filter === "Tous" ? records : records.filter((item) => filter === "Planifiés" ? item.status === "Planifié" : filter === "Terminés" ? item.status === "Terminé" : item.status === filter);
  return <><PageTitle eyebrow="Impact" title="Projets & réalisations" text="Pilotez les budgets, les jalons et les preuves d’impact sur le terrain." action={canAdd ? <button className="tck-primary" onClick={onAdd}><Plus size={18} />Nouveau projet</button> : <span className="tck-lock-note"><LockKeyhole size={15} />Lecture seule</span>} /><div className="tck-filter-row">{["Tous", "En cours", "Planifiés", "Terminés"].map((item) => <button className={filter === item ? "active" : ""} onClick={() => setFilter(item)} key={item}>{item} <span>{item === "Tous" ? records.length : item === "Planifiés" ? records.filter((p) => p.status === "Planifié").length : item === "Terminés" ? records.filter((p) => p.status === "Terminé").length : records.filter((p) => p.status === item).length}</span></button>)}</div><div className="tck-project-grid">{filtered.map((project) => { const Icon = projectIcons[project.iconName]; return <article className="tck-project-card" key={project.id}><div className="tck-project-top"><span><Icon size={21} /></span><Status>{project.status}</Status></div><small>{project.domain}</small><h3>{project.name}</h3><p><MapPin size={14} />{project.place}</p><div className="tck-budget-row"><span>Budget <strong>{project.budget}</strong></span><span>Dépensé <strong>{project.spent}</strong></span></div><div className="tck-project-progress"><i style={{ width: `${project.progress}%` }} /></div><div className="tck-progress-label"><span>Avancement global</span><strong>{project.progress} %</strong></div><button className="tck-secondary">Ouvrir le dossier</button></article>; })}</div>{filtered.length === 0 && <div className="tck-empty tck-empty-card"><FolderKanban size={28} /><strong>Aucun projet dans cette catégorie</strong><span>Changez le filtre ou créez un nouveau projet.</span></div>}</>;
}

function Finances({ expenses, onAdd, onApprove, canManage }: { expenses: Expense[]; onAdd: () => void; onApprove: (id: string) => void; canManage: boolean }) {
  const pending = expenses.filter((item) => item.status === "À valider");
  const pendingAmount = pending.reduce((sum, item) => sum + item.amount, 0);
  return <><PageTitle eyebrow="Gouvernance financière" title="Finances & contrôle" text="Chaque décaissement suit un quorum, une justification et une trace d’audit." action={canManage ? <button className="tck-primary" onClick={onAdd}><Plus size={18} />Soumettre une dépense</button> : <span className="tck-lock-note"><LockKeyhole size={15} />Accès contrôlé</span>} /><div className="tck-stats tck-stats-3"><article className="tck-stat"><div className="tck-stat-head"><span>Budget engagé</span><i><Landmark size={19} /></i></div><strong>86,4 M <small>F CFA</small></strong><p><b>42 %</b> du budget mensuel</p></article><article className="tck-stat"><div className="tck-stat-head"><span>En attente</span><i><ClipboardCheck size={19} /></i></div><strong>{new Intl.NumberFormat("fr-FR").format(pendingAmount)} <small>F CFA</small></strong><p><b>{pending.length}</b> demande{pending.length > 1 ? "s" : ""} à valider</p></article><article className="tck-stat"><div className="tck-stat-head"><span>Quorum statutaire</span><i><ShieldCheck size={19} /></i></div><strong>13 <small>VALIDATEURS</small></strong><p><b>Double contrôle</b> systématique</p></article></div><section className="tck-card tck-table-card"><CardHead title="Demandes de décaissement" subtitle="Validation collégiale et séparation des pouvoirs" action="Exporter" onAction={() => downloadCsv("tck-connect-depenses.csv", [["Référence", "Objet", "Commission", "Montant", "Validations", "Statut"], ...expenses.map((item) => [item.id, item.label, item.commission, item.amount, `${item.approvals}/${item.required}`, item.status])])} /><div className="tck-table-scroll"><table className="tck-table tck-finance-table"><thead><tr><th>Dépense</th><th>Commission</th><th>Montant</th><th>Quorum</th><th>Statut</th><th>Décision</th></tr></thead><tbody>{expenses.map((item) => <tr key={item.id}><td><strong>{item.label}</strong><small>{item.id} · {item.submittedAt}</small></td><td>{item.commission}</td><td><strong>{new Intl.NumberFormat("fr-FR").format(item.amount)} F</strong></td><td><div className="tck-quorum"><span><i style={{ width: `${item.approvals / item.required * 100}%` }} /></span><b>{item.approvals}/{item.required}</b></div></td><td>{item.status === "Validée" ? <Status>Validée</Status> : <span className="tck-status tck-status-warn"><i />À valider</span>}</td><td>{canManage && item.status === "À valider" ? <button className="tck-approve" onClick={() => onApprove(item.id)}><Check size={14} />Approuver</button> : <span className="tck-decision-done"><ShieldCheck size={15} />{item.status === "Validée" ? "Quorum atteint" : "Consultation"}</span>}</td></tr>)}</tbody></table></div></section><section className="tck-control-note"><LockKeyhole size={20} /><div><strong>Séparation des pouvoirs active</strong><p>Le demandeur, les validateurs et le contrôleur sont identifiés séparément dans le journal d’audit.</p></div></section></>;
}

function Commissions() { return <><PageTitle eyebrow="Organisation" title="Commissions de Touba Ca Kanam" text="Chaque commission dispose de son équipe, sa feuille de route et ses indicateurs." action={<button className="tck-primary"><Plus size={18} />Créer une activité</button>} /><div className="tck-commission-grid">{commissions.map((commission) => <article className="tck-commission-card" key={commission.name}><div className={`tck-commission-icon ${commission.color}`}><commission.icon size={24} /></div><button className="tck-more"><MoreHorizontal size={19} /></button><h3>{commission.name}</h3><p><span><UsersRound size={15} />{commission.members} membres</span><span><FolderKanban size={15} />{commission.projects} projets</span></p><div className="tck-commission-foot"><span><i />Feuille de route active</span><ChevronDown size={16} /></div></article>)}</div></>; }

function Transparency({ auditEntries }: { auditEntries: AuditEntry[] }) {
  const labels: Record<AuditAction, string> = { CONTRIBUTION_CREATED: "Contribution enregistrée", MEMBER_CREATED: "Membre créé", MEMBER_ACCESS_UPDATED: "Accès membre modifié", PROJECT_CREATED: "Projet créé", EXPENSE_CREATED: "Dépense soumise", EXPENSE_APPROVED: "Dépense approuvée", PASSWORD_CHANGED: "Mot de passe modifié" };
  const exportAudit = () => downloadCsv("tck-connect-journal-audit.csv", [["Date", "Action", "Acteur", "Référence", "Détail"], ...auditEntries.map((entry) => [entry.at, labels[entry.action], entry.actor, entry.recordId, entry.detail])]);
  return <><PageTitle eyebrow="Confiance & redevabilité" title="Centre de transparence" text="Les données validées deviennent des preuves publiques, lisibles par tous." action={<div className="tck-title-actions"><a className="tck-secondary" href="/tck-connect/public"><ShieldCheck size={17} />Portail public</a><button className="tck-primary" onClick={exportAudit}><Download size={18} />Rapport d’audit</button></div>} /><section className="tck-trust-banner"><div className="tck-trust-score"><span>96<small>%</small></span></div><div><span className="tck-eyebrow">Allocation directe</span><h2>96 % des ressources consacrées aux projets</h2><p>Chaque indicateur publié est relié à une écriture validée et à une pièce justificative.</p></div><ShieldCheck size={75} /></section><div className="tck-transparency-grid"><section className="tck-card"><CardHead title="Chaîne de validation" subtitle="Contrôles appliqués aux dépenses" /><div className="tck-validation-list">{["Demande budgétaire enregistrée", "Pièces justificatives vérifiées", "Quorum de validation atteint", "Paiement rapproché et archivé"].map((label, index) => <div key={label}><span><Check size={15} /></span><p><strong>{label}</strong><small>Contrôle {index + 1} validé</small></p><FileCheck2 size={18} /></div>)}</div></section><section className="tck-card"><CardHead title="Publications" subtitle="Documents disponibles au public" /><div className="tck-report-list"><button><span><ReceiptText /></span><div><strong>Rapport financier — juillet 2026</strong><small>PDF · Publié le 5 août</small></div><Download /></button><button><span><ClipboardCheck /></span><div><strong>Bilan des projets — semestre 1</strong><small>PDF · Publié le 12 juillet</small></div><Download /></button><button><span><ShieldCheck /></span><div><strong>Rapport de contrôle interne</strong><small>PDF · Publié le 30 juin</small></div><Download /></button></div></section></div><section className="tck-card tck-audit-card"><CardHead title="Journal d’audit du MVP" subtitle={`${auditEntries.length} opération${auditEntries.length > 1 ? "s" : ""} tracée${auditEntries.length > 1 ? "s" : ""} sur cet appareil`} action="Exporter" onAction={exportAudit} /><div className="tck-audit-list">{auditEntries.slice(0, 10).map((entry, index) => { const isMember = entry.action === "MEMBER_CREATED"; const isProject = entry.action === "PROJECT_CREATED"; const Icon = isMember ? UserPlus : isProject ? FolderKanban : entry.action.startsWith("EXPENSE") ? Wallet : HandCoins; return <article key={`${entry.at}-${index}`}><span className={isMember ? "member" : isProject ? "project" : "payment"}><Icon size={16} /></span><div><strong>{labels[entry.action]}</strong><p>{entry.detail}</p><small>{entry.actor} · {new Intl.DateTimeFormat("fr-FR", { dateStyle: "medium", timeStyle: "short" }).format(new Date(entry.at))} · {entry.recordId}</small></div><ShieldCheck size={17} /></article>; })}{auditEntries.length === 0 && <div className="tck-empty"><ShieldCheck size={24} /><strong>Journal prêt</strong><span>Les prochaines opérations seront tracées ici.</span></div>}</div></section></>;
}

function ContributionModal({ onClose, onSave, server, members }: { onClose: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void; server: boolean; members: Member[] }) {
  const eligibleMembers = members.filter((member) => member.status !== "Suspendu");
  return <div className="tck-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="tck-modal" role="dialog" aria-modal="true" aria-labelledby="contribution-title"><div className="tck-modal-head"><div><span className="tck-eyebrow">Collecte sécurisée</span><h2 id="contribution-title">Nouvelle contribution</h2></div><button onClick={onClose} aria-label="Fermer"><X size={20} /></button></div><form onSubmit={onSave}>{server ? <label>Membre du registre<select name="memberId" required defaultValue=""><option value="" disabled>{eligibleMembers.length ? "Choisir un membre" : "Aucun membre disponible"}</option>{eligibleMembers.map((member) => <option value={member.id} key={member.id}>{member.name} · {member.id} · {member.zone}</option>)}</select></label> : <div className="tck-form-row"><label>Nom du contributeur<input name="memberName" required placeholder="Ex. Awa Diop" /></label><label>Identifiant du membre<input name="memberId" required placeholder="Ex. TCK-026184" /></label></div>}<div className="tck-form-row"><label>Montant (F CFA)<input name="amount" required min="100" max="1000000000" type="number" defaultValue="1000" /></label><label>Canal<select name="channel" defaultValue="Wave"><option>Wave</option><option>Orange Money</option><option>Free Money</option><option>Espèces / Collecteur</option><option>Virement bancaire</option></select></label></div><label>Référence de transaction <small>facultative pour les espèces</small><input name="reference" placeholder="Référence opérateur, virement ou reçu manuel" /></label><div className="tck-modal-note"><ShieldCheck size={18} /><span>{server ? "Le membre est relié au reçu, puis l’opération est enregistrée dans PostgreSQL et le journal d’audit." : "L’opération restera sur cet appareil dans le journal de démonstration."}</span></div><div className="tck-modal-actions"><button type="button" className="tck-secondary" onClick={onClose}>Annuler</button><button type="submit" className="tck-primary" disabled={server && eligibleMembers.length === 0}><Check size={18} />Valider et générer le reçu</button></div></form></section></div>;
}

function contributionReceiptText(receipt: ContributionReceipt) {
  return [
    "TCK CONNECT — REÇU DE CONTRIBUTION",
    `Reçu : ${receipt.receiptNumber}`,
    `Date : ${new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "short" }).format(new Date(receipt.contributedAt))}`,
    `Membre : ${receipt.member.name}`,
    `Identifiant : ${receipt.member.memberCode}`,
    `Zone : ${receipt.member.zone || "Non renseignée"}`,
    `Montant : ${new Intl.NumberFormat("fr-FR").format(receipt.amount)} F CFA`,
    `Canal : ${receipt.channel}`,
    `Référence externe : ${receipt.externalReference || "Non applicable"}`,
    `Enregistré par : ${receipt.recordedBy.name} (${receipt.recordedBy.memberCode})`,
    "Statut : VALIDÉE",
    "",
    "Ce reçu est identifié de manière unique dans le registre central de Touba Ca Kanam.",
  ].join("\n");
}

function downloadContributionReceipt(receipt: ContributionReceipt) {
  const url = URL.createObjectURL(new Blob([contributionReceiptText(receipt)], { type: "text/plain;charset=utf-8" }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = `${receipt.receiptNumber}.txt`;
  anchor.click();
  URL.revokeObjectURL(url);
}

function ContributionReceiptModal({ receipt, onClose }: { receipt: ContributionReceipt; onClose: () => void }) {
  const date = new Intl.DateTimeFormat("fr-FR", { dateStyle: "full", timeStyle: "short" }).format(new Date(receipt.contributedAt));
  return <div className="tck-modal-backdrop tck-receipt-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="tck-modal tck-receipt-modal" role="dialog" aria-modal="true" aria-labelledby="receipt-title"><div className="tck-receipt-print"><div className="tck-receipt-brand"><div className="tck-brand-mark">TCK</div><div><strong>TCK CONNECT</strong><span>Touba Ca Kanam</span></div><ShieldCheck size={28} /></div><div className="tck-receipt-head"><span className="tck-eyebrow">Contribution validée</span><h2 id="receipt-title">Reçu de contribution</h2><p>{receipt.receiptNumber}</p></div><div className="tck-receipt-amount"><span>Montant reçu</span><strong>{new Intl.NumberFormat("fr-FR").format(receipt.amount)} <small>F CFA</small></strong><Status>Validée</Status></div><dl><div><dt>Contributeur</dt><dd>{receipt.member.name}<small>{receipt.member.memberCode} · {receipt.member.zone || "Zone non renseignée"}</small></dd></div><div><dt>Canal</dt><dd>{receipt.channel}</dd></div><div><dt>Référence</dt><dd>{receipt.externalReference || "Saisie directe"}</dd></div><div><dt>Date et heure</dt><dd>{date}</dd></div><div><dt>Enregistré par</dt><dd>{receipt.recordedBy.name}<small>{receipt.recordedBy.memberCode}</small></dd></div></dl><div className="tck-receipt-proof"><ShieldCheck size={18} /><p><strong>Preuve enregistrée</strong><span>Ce numéro de reçu est unique et relié au journal d’audit central.</span></p></div></div><div className="tck-receipt-actions"><button className="tck-secondary" onClick={onClose}>Fermer</button><button className="tck-secondary" onClick={() => downloadContributionReceipt(receipt)}><Download size={17} />Télécharger</button><button className="tck-primary" onClick={() => window.print()}><Printer size={17} />Imprimer / PDF</button></div></section></div>;
}

function MemberModal({ onClose, onSave, server }: { onClose: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void; server: boolean }) {
  return <div className="tck-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="tck-modal" role="dialog" aria-modal="true" aria-labelledby="member-title"><div className="tck-modal-head"><div><span className="tck-eyebrow">Identité communautaire</span><h2 id="member-title">Nouveau membre</h2></div><button onClick={onClose} aria-label="Fermer"><X size={20} /></button></div><form onSubmit={onSave}><label>Nom complet<input name="name" required autoFocus placeholder="Ex. Sokhna Awa Diop" /></label><div className="tck-form-row"><label>Téléphone<input name="phone" required type="tel" placeholder="+221 77 000 00 00" /></label><label>Pays<select name="country" defaultValue="Sénégal"><option>Sénégal</option><option>France</option><option>Italie</option><option>Espagne</option><option>États-Unis</option><option>Mauritanie</option><option>Autre</option></select></label></div><label>Zone ou quartier<input name="zone" required placeholder="Ex. Touba Mosquée" /></label><div className="tck-modal-note"><ShieldCheck size={18} /><span>{server ? "Un identifiant unique sera généré dans le référentiel central et audité." : "Un identifiant local sera généré pour cette démonstration."}</span></div><div className="tck-modal-actions"><button type="button" className="tck-secondary" onClick={onClose}>Annuler</button><button type="submit" className="tck-primary"><UserPlus size={18} />Créer le membre</button></div></form></section></div>;
}

function MemberAccessModal({ member, onClose, onSave }: { member: Member; onClose: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void }) {
  return <div className="tck-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="tck-modal tck-access-modal" role="dialog" aria-modal="true" aria-labelledby="member-access-title"><div className="tck-modal-head"><div><span className="tck-eyebrow">Administration sécurisée</span><h2 id="member-access-title">Rôle et accès</h2><p>{member.name} · {member.id}</p></div><button onClick={onClose} aria-label="Fermer"><X size={20} /></button></div><form onSubmit={onSave}><div className="tck-form-row"><label>Rôle dans TCK CONNECT<select name="role" defaultValue={member.role}><option>Membre</option><option>Collecteur</option><option>Responsable commission</option><option>Contrôleur</option><option>Administrateur</option></select></label><label>Statut du membre<select name="status" defaultValue={member.status}><option>Actif</option><option>À relancer</option><option>Suspendu</option></select></label></div><div className="tck-access-section"><div><LockKeyhole size={18} /><span><strong>Compte de connexion</strong><small>{member.accountEnabled ? "Accès actuellement activé" : "Aucun accès numérique pour le moment"}</small></span></div><label>Adresse e-mail<input name="email" type="email" defaultValue={member.email} autoComplete="off" placeholder="agent@tck.sn" /></label><label>{member.accountEnabled ? "Nouveau mot de passe temporaire (facultatif)" : "Mot de passe temporaire pour activer l’accès"}<input name="temporaryPassword" type="password" minLength={12} autoComplete="new-password" placeholder={member.accountEnabled ? "Laisser vide pour ne pas le modifier" : "12 caractères minimum"} /></label><p>Le mot de passe doit contenir majuscule, minuscule, chiffre et caractère spécial. Il n’est jamais affiché après l’enregistrement.</p></div><div className="tck-modal-note"><ShieldCheck size={18} /><span>Les modifications sont réservées aux administrateurs et ajoutées au journal d’audit central.</span></div><div className="tck-modal-actions"><button type="button" className="tck-secondary" onClick={onClose}>Annuler</button><button type="submit" className="tck-primary"><Check size={18} />Enregistrer les accès</button></div></form></section></div>;
}

function ProjectModal({ onClose, onSave, server }: { onClose: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void; server: boolean }) {
  return <div className="tck-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="tck-modal" role="dialog" aria-modal="true" aria-labelledby="project-title"><div className="tck-modal-head"><div><span className="tck-eyebrow">Programmation opérationnelle</span><h2 id="project-title">Nouveau projet</h2></div><button onClick={onClose} aria-label="Fermer"><X size={20} /></button></div><form onSubmit={onSave}><label>Nom du projet<input name="name" required autoFocus placeholder="Ex. Extension réseau d’eau" /></label><div className="tck-form-row"><label>Domaine<select name="domain" defaultValue="Infrastructure"><option>Infrastructure</option><option>Santé</option><option>Hydraulique</option><option>Éclairage</option><option>Éducation</option></select></label><label>Statut<select name="status" defaultValue="Planifié"><option>Planifié</option><option>En cours</option><option>Finalisation</option><option>Terminé</option></select></label></div><div className="tck-form-row"><label>Budget prévisionnel<input name="budget" required placeholder="Ex. 150 M" /></label><label>Lieu<input name="place" required placeholder="Ex. Touba Darou Khoudoss" /></label></div><div className="tck-modal-note"><FolderKanban size={18} /><span>{server ? "Le projet sera ajouté au portefeuille central et au portail public." : "Le projet sera ajouté au portefeuille de démonstration local."}</span></div><div className="tck-modal-actions"><button type="button" className="tck-secondary" onClick={onClose}>Annuler</button><button type="submit" className="tck-primary"><Plus size={18} />Créer le projet</button></div></form></section></div>;
}

function ExpenseModal({ onClose, onSave, server }: { onClose: () => void; onSave: (event: FormEvent<HTMLFormElement>) => void; server: boolean }) {
  return <div className="tck-modal-backdrop" role="presentation" onMouseDown={(event) => event.target === event.currentTarget && onClose()}><section className="tck-modal" role="dialog" aria-modal="true" aria-labelledby="expense-title"><div className="tck-modal-head"><div><span className="tck-eyebrow">Circuit de décaissement</span><h2 id="expense-title">Soumettre une dépense</h2></div><button onClick={onClose} aria-label="Fermer"><X size={20} /></button></div><form onSubmit={onSave}><label>Objet de la dépense<input name="label" required autoFocus placeholder="Ex. Achat de matériel hydraulique" /></label><div className="tck-form-row"><label>Commission<select name="commission" defaultValue="Hydraulique"><option>Hydraulique</option><option>Finances</option><option>Santé & Social</option><option>Éclairage public</option><option>Scientifique & Culturelle</option><option>Communication</option></select></label><label>Montant (F CFA)<input name="amount" required min="1000" type="number" placeholder="Ex. 2500000" /></label></div><label>Justification<input name="justification" required placeholder="Référence de la demande ou du devis" /></label><div className="tck-modal-note"><ShieldCheck size={18} /><span>{server ? "La demande est écrite dans le registre central et suit un quorum de 13 validateurs." : "La demande simule localement le quorum de 13 validateurs."}</span></div><div className="tck-modal-actions"><button type="button" className="tck-secondary" onClick={onClose}>Annuler</button><button type="submit" className="tck-primary"><ClipboardCheck size={18} />Soumettre au quorum</button></div></form></section></div>;
}
