// ============================================================================
//  TOUBA INFOS — Store de contenu (source de vérité du CMS)
//  Persistance fichier `data/touba-infos-articles.json` (best-effort) + cache
//  mémoire. Amorcé depuis ARTICLES_INFO (contenus de démonstration).
//
//  ⚠️ Module SERVEUR uniquement (fs). Ne pas importer depuis un composant
//  client. Pour la production multi-instances / serverless, remplacer la
//  couche de persistance par Prisma/PostgreSQL (les modèles sont prêts côté
//  schéma) — l'interface publique de ce module reste identique.
// ============================================================================

import { promises as fs } from "fs";
import path from "path";
import {
  ARTICLES_INFO,
  type ArticleInfo,
  type CategorieInfo,
  type GenreInfo,
} from "./touba-infos";

const DATA_FILE = path.join(process.cwd(), "data", "touba-infos-articles.json");

let cache: ArticleInfo[] | null = null;

function seed(): ArticleInfo[] {
  return ARTICLES_INFO.map((a) => ({ ...a, statut: a.statut ?? "publie" }));
}

async function load(): Promise<ArticleInfo[]> {
  if (cache) return cache;
  try {
    const raw = await fs.readFile(DATA_FILE, "utf8");
    const parsed = JSON.parse(raw) as ArticleInfo[];
    cache = Array.isArray(parsed) && parsed.length ? parsed : seed();
  } catch {
    cache = seed();
    // tentative d'écriture initiale (silencieuse si FS en lecture seule)
    void persist();
  }
  return cache;
}

async function persist(): Promise<void> {
  if (!cache) return;
  try {
    await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
    await fs.writeFile(DATA_FILE, JSON.stringify(cache, null, 2), "utf8");
  } catch {
    /* FS en lecture seule (serverless) : on conserve le cache mémoire. */
  }
}

// ── Tri & visibilité ────────────────────────────────────────────────────────
const byDate = (a: ArticleInfo, b: ArticleInfo) =>
  new Date(b.date).getTime() - new Date(a.date).getTime();

function estPublic(a: ArticleInfo): boolean {
  const s = a.statut ?? "publie";
  if (s === "publie") return true;
  if (s === "programme") return new Date(a.date).getTime() <= Date.now();
  return false; // brouillon
}

// ════════════════════════════════════════════════════════════════════════════
//  Lecture publique (articles visibles uniquement)
// ════════════════════════════════════════════════════════════════════════════
export async function getArticlesTries(): Promise<ArticleInfo[]> {
  return (await load()).filter(estPublic).sort(byDate);
}

export async function getUne(): Promise<ArticleInfo> {
  const pub = await getArticlesTries();
  return pub.find((a) => a.alaUne) ?? pub[0];
}

export async function getPlusLus(n = 5): Promise<ArticleInfo[]> {
  return (await getArticlesTries())
    .slice()
    .sort((a, b) => b.vues - a.vues)
    .slice(0, n);
}

export async function getDernieres(n = 6): Promise<ArticleInfo[]> {
  return (await getArticlesTries()).slice(0, n);
}

/** Recherche par slug — inclut les brouillons pour permettre l'aperçu. */
export async function getArticleInfoBySlug(
  slug: string,
): Promise<ArticleInfo | undefined> {
  return (await load()).find((a) => a.slug === slug);
}

export async function getArticlesInfoByCategorie(
  categorie: CategorieInfo,
): Promise<ArticleInfo[]> {
  return (await getArticlesTries()).filter((a) => a.categorie === categorie);
}

export async function getArticlesInfoByGenre(
  genre: GenreInfo,
): Promise<ArticleInfo[]> {
  return (await getArticlesTries()).filter((a) => a.genre === genre);
}

export async function getArticlesInfoSimilaires(
  article: ArticleInfo,
): Promise<ArticleInfo[]> {
  const pub = (await getArticlesTries()).filter((a) => a.id !== article.id);
  const meme = pub.filter((a) => a.categorie === article.categorie);
  const autres = pub.filter((a) => a.categorie !== article.categorie);
  return [...meme, ...autres].slice(0, 4);
}

export async function getBreaking(): Promise<ArticleInfo[]> {
  return (await getArticlesTries()).filter((a) => a.breaking);
}

export async function getByTag(tag: string): Promise<ArticleInfo[]> {
  return (await getArticlesTries()).filter((a) => a.tags.includes(tag));
}

export async function rechercheArticles(q: string): Promise<ArticleInfo[]> {
  const t = q.trim().toLowerCase();
  if (!t) return [];
  return (await getArticlesTries()).filter((a) =>
    [a.titre, a.sousTitre, a.extrait, a.auteur, a.categorie, ...a.tags]
      .join(" ")
      .toLowerCase()
      .includes(t),
  );
}

export async function getPublishedSlugs(): Promise<string[]> {
  return (await getArticlesTries()).map((a) => a.slug);
}

// ════════════════════════════════════════════════════════════════════════════
//  Administration (tous statuts)
// ════════════════════════════════════════════════════════════════════════════
export async function adminListAll(): Promise<ArticleInfo[]> {
  return (await load()).slice().sort(byDate);
}

export async function adminGetById(
  id: string,
): Promise<ArticleInfo | undefined> {
  return (await load()).find((a) => a.id === id);
}

export interface AdminStats {
  total: number;
  publies: number;
  brouillons: number;
  programmes: number;
  alaUne: number;
  breaking: number;
  vues: number;
}

export async function adminStats(): Promise<AdminStats> {
  const all = await load();
  const st = (a: ArticleInfo) => a.statut ?? "publie";
  return {
    total: all.length,
    publies: all.filter((a) => st(a) === "publie").length,
    brouillons: all.filter((a) => st(a) === "brouillon").length,
    programmes: all.filter((a) => st(a) === "programme").length,
    alaUne: all.filter((a) => a.alaUne).length,
    breaking: all.filter((a) => a.breaking).length,
    vues: all.reduce((s, a) => s + (a.vues || 0), 0),
  };
}

const DIACRITICS = /[̀-ͯ]/g;
function slugify(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(DIACRITICS, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export type ArticleInput = Partial<ArticleInfo> & {
  titre: string;
  categorie: CategorieInfo;
  auteur: string;
};

const GRADIENTS: Record<string, string> = {
  defaut: "from-green-700 via-emerald-800 to-green-900",
};

export async function adminCreate(input: ArticleInput): Promise<ArticleInfo> {
  const all = await load();
  const id = String(
    all.reduce((m, a) => Math.max(m, Number(a.id) || 0), 0) + 1,
  );
  let slug = input.slug?.trim() ? slugify(input.slug) : slugify(input.titre);
  if (!slug) slug = `article-${id}`;
  while (all.some((a) => a.slug === slug)) slug = `${slug}-${id}`;

  const article: ArticleInfo = {
    id,
    slug,
    titre: input.titre,
    sousTitre: input.sousTitre ?? "",
    extrait: input.extrait ?? "",
    categorie: input.categorie,
    genre: input.genre ?? "Actualité",
    statut: input.statut ?? "brouillon",
    auteur: input.auteur,
    date: input.date ?? new Date().toISOString(),
    miseAJour: input.miseAJour,
    tempsLecture: input.tempsLecture ?? "3 min",
    imageEmoji: input.imageEmoji ?? "📰",
    imageGradient: input.imageGradient ?? GRADIENTS.defaut,
    imageUrl: input.imageUrl || undefined,
    credit: input.credit || undefined,
    legende: input.legende || undefined,
    alaUne: input.alaUne ?? false,
    breaking: input.breaking ?? false,
    epingle: input.epingle ?? false,
    vues: input.vues ?? 0,
    tags: input.tags ?? [],
    contenu: input.contenu ?? "<p></p>",
  };
  cache = [article, ...all];
  await persist();
  return article;
}

export async function adminUpdate(
  id: string,
  patch: Partial<ArticleInfo>,
): Promise<ArticleInfo | undefined> {
  const all = await load();
  const idx = all.findIndex((a) => a.id === id);
  if (idx < 0) return undefined;
  const next = { ...all[idx], ...patch, id };
  if (patch.slug) next.slug = slugify(patch.slug);
  all[idx] = next;
  cache = all;
  await persist();
  return next;
}

export async function adminToggle(
  id: string,
  field: "alaUne" | "breaking" | "epingle",
): Promise<void> {
  const a = await adminGetById(id);
  if (a) await adminUpdate(id, { [field]: !a[field] } as Partial<ArticleInfo>);
}

export async function adminSetStatut(
  id: string,
  statut: ArticleInfo["statut"],
): Promise<void> {
  await adminUpdate(id, { statut });
}

export async function adminDelete(id: string): Promise<void> {
  const all = await load();
  cache = all.filter((a) => a.id !== id);
  await persist();
}
