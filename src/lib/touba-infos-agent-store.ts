// ============================================================================
//  TOUBA INFOS NEWS AGENT — Store des sujets détectés (serveur)
//  Persistance best-effort (data/) + repli mémoire, comme le store d'articles.
// ============================================================================

import { promises as fs } from "fs";
import path from "path";
import {
  type SujetDetecte,
  type StatutSujet,
  similariteTitre,
  hashChaine,
  normaliserTitre,
} from "./touba-infos-agent";
import { adminListAll } from "./touba-infos-store";

const FILE = path.join(process.cwd(), "data", "touba-infos-sujets.json");

export interface DerniereVeille {
  at: string;
  consultees: number;
  detectes: number;
  nouveaux: number;
  erreurs: string[];
  mode: "reel" | "demo" | "mixte";
}

interface AgentState {
  sujets: SujetDetecte[];
  lastRun?: DerniereVeille;
}

let cache: AgentState | null = null;

async function load(): Promise<AgentState> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(FILE, "utf8");
    cache = JSON.parse(raw) as AgentState;
    if (!Array.isArray(cache.sujets)) cache = { sujets: [] };
  } catch {
    cache = { sujets: [] };
  }
  return cache;
}

async function persist(): Promise<void> {
  if (!cache) return;
  try {
    await fs.mkdir(path.dirname(FILE), { recursive: true });
    await fs.writeFile(FILE, JSON.stringify(cache, null, 2), "utf8");
  } catch {
    /* FS lecture seule : cache mémoire conservé */
  }
}

export async function listSujets(): Promise<SujetDetecte[]> {
  const s = await load();
  return [...s.sujets].sort(
    (a, b) =>
      b.score - a.score ||
      new Date(b.detecteA).getTime() - new Date(a.detecteA).getTime(),
  );
}

export async function getSujet(id: string): Promise<SujetDetecte | undefined> {
  return (await load()).sujets.find((x) => x.id === id);
}

export async function getDerniereVeille(): Promise<DerniereVeille | undefined> {
  return (await load()).lastRun;
}

/** Ajoute des sujets en évitant les doublons (hash, titres proches, articles existants). */
export async function ajouterSujets(
  candidats: Omit<SujetDetecte, "id" | "hash" | "detecteA">[],
): Promise<number> {
  const state = await load();
  const articles = await adminListAll();
  const titresArticles = articles.map((a) => normaliserTitre(a.titre));

  let ajoutes = 0;
  for (const c of candidats) {
    const hash = hashChaine(c.url || c.titre);
    // Déjà détecté (même URL) ?
    if (state.sujets.some((s) => s.hash === hash)) continue;
    // Titre trop proche d'un sujet déjà détecté ?
    if (state.sujets.some((s) => similariteTitre(s.titre, c.titre) > 0.6)) continue;
    // Sujet déjà couvert par un article publié ?
    const nt = normaliserTitre(c.titre);
    if (titresArticles.some((t) => similariteTitre(t, nt) > 0.6)) continue;

    state.sujets.unshift({
      ...c,
      id: `${hash}-${Date.now().toString(36)}`,
      hash,
      detecteA: new Date().toISOString(),
    });
    ajoutes++;
  }
  // Bornage : on garde les 200 plus récents
  state.sujets = state.sujets.slice(0, 200);
  await persist();
  return ajoutes;
}

export async function setStatutSujet(
  id: string,
  statut: StatutSujet,
): Promise<void> {
  const state = await load();
  const s = state.sujets.find((x) => x.id === id);
  if (s) {
    s.statut = statut;
    await persist();
  }
}

export async function enregistrerVeille(run: DerniereVeille): Promise<void> {
  const state = await load();
  state.lastRun = run;
  await persist();
}

export interface StatsAgent {
  total: number;
  prioritaires: number;
  aVerifier: number;
  rediges: number;
  rejetes: number;
}

export async function statsAgent(): Promise<StatsAgent> {
  const s = await load();
  return {
    total: s.sujets.filter((x) => x.statut === "detecte" || x.statut === "a_verifier").length,
    prioritaires: s.sujets.filter((x) => x.score >= 80 && x.statut !== "rejete").length,
    aVerifier: s.sujets.filter((x) => x.statut === "a_verifier").length,
    rediges: s.sujets.filter((x) => x.statut === "redige").length,
    rejetes: s.sujets.filter((x) => x.statut === "rejete").length,
  };
}
