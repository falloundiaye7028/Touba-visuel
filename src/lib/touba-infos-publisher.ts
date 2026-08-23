import { createHash } from "node:crypto";
import sanitizeHtml from "sanitize-html";
import { z } from "zod";
import {
  AUTEURS,
  MEDIA_URL,
  type ArticleInfo,
  type CategorieInfo,
  type GenreInfo,
} from "./touba-infos";
import {
  adminCreate,
  adminGetById,
  adminListAll,
  adminUpdate,
  type ArticleInput,
} from "./touba-infos-store";

export const PUBLISHER_CATEGORIES = [
  "Touba",
  "Sénégal",
  "Politique",
  "Société",
  "Économie",
  "Religion",
  "Magal",
  "Afrique",
  "International",
  "Sport",
  "Culture",
  "Santé",
  "Éducation",
  "Environnement",
  "Diaspora",
  "Technologies",
] as const satisfies readonly CategorieInfo[];

export const PUBLISHER_GENRES = [
  "Actualité",
  "Interview",
  "Analyse",
  "Tribune",
  "Reportage",
  "Communiqué",
  "Vidéo",
] as const satisfies readonly GenreInfo[];

export const PUBLISHER_GRADIENTS = [
  "from-green-700 via-emerald-800 to-green-900",
  "from-slate-700 via-slate-800 to-green-900",
  "from-amber-700 via-stone-700 to-emerald-900",
  "from-red-700 via-red-800 to-green-900",
  "from-sky-700 via-emerald-800 to-green-900",
  "from-fuchsia-700 via-rose-800 to-orange-900",
  "from-violet-700 via-indigo-800 to-slate-900",
] as const;

const AUTHOR_NAMES = AUTEURS.map((author) => author.nom) as [string, ...string[]];
const articleIdSchema = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[A-Za-z0-9_-]+$/, "Identifiant d’article invalide");
const idempotencyKeySchema = z
  .string()
  .trim()
  .min(8, "La clé d’idempotence doit contenir au moins 8 caractères")
  .max(160);
const optionalHttpsUrl = z
  .string()
  .trim()
  .max(2_000)
  .url()
  .refine(
    (value) => new URL(value).protocol === "https:",
    "Une URL HTTPS est requise",
  )
  .optional();
const sourceSchema = z.object({
  url: z
    .string()
    .trim()
    .max(2_000)
    .url()
    .refine((value) => {
      const protocol = new URL(value).protocol;
      return protocol === "https:" || protocol === "http:";
    }, "La source doit utiliser HTTP ou HTTPS"),
  label: z.string().trim().min(1).max(160).optional(),
});

const articleFieldsSchema = z.object({
  titre: z.string().trim().min(5).max(180),
  slug: z.string().trim().min(1).max(90).optional(),
  sousTitre: z.string().trim().max(350).default(""),
  extrait: z.string().trim().min(20).max(700),
  contenu: z.string().trim().min(20).max(120_000),
  categorie: z.enum(PUBLISHER_CATEGORIES),
  genre: z.enum(PUBLISHER_GENRES).default("Actualité"),
  auteur: z.enum(AUTHOR_NAMES),
  tempsLecture: z
    .string()
    .trim()
    .regex(/^\d{1,2}\s+min$/, "Format attendu : « 3 min »")
    .default("3 min"),
  tags: z.array(z.string().trim().min(1).max(50)).max(20).default([]),
  imageUrl: optionalHttpsUrl,
  imageEmoji: z.string().trim().min(1).max(16).default("📰"),
  imageGradient: z.enum(PUBLISHER_GRADIENTS).default(PUBLISHER_GRADIENTS[0]),
  credit: z.string().trim().max(180).optional(),
  legende: z.string().trim().max(500).optional(),
  alaUne: z.boolean().default(false),
  breaking: z.boolean().default(false),
  epingle: z.boolean().default(false),
  date: z.string().datetime({ offset: true }).optional(),
  sources: z.array(sourceSchema).max(20).optional(),
});

export const createArticleDraftSchema = articleFieldsSchema
  .extend({ idempotencyKey: idempotencyKeySchema })
  .strict();

// Schéma de patch sans valeurs par défaut : une correction ne doit jamais
// réécrire silencieusement les champs absents de l’appel MCP.
const editableFieldsSchema = z.object({
  titre: articleFieldsSchema.shape.titre.optional(),
  slug: articleFieldsSchema.shape.slug,
  sousTitre: articleFieldsSchema.shape.sousTitre.unwrap().optional(),
  extrait: articleFieldsSchema.shape.extrait.optional(),
  contenu: articleFieldsSchema.shape.contenu.optional(),
  categorie: articleFieldsSchema.shape.categorie.optional(),
  genre: articleFieldsSchema.shape.genre.unwrap().optional(),
  auteur: articleFieldsSchema.shape.auteur.optional(),
  tempsLecture: articleFieldsSchema.shape.tempsLecture.unwrap().optional(),
  tags: articleFieldsSchema.shape.tags.unwrap().optional(),
  imageUrl: articleFieldsSchema.shape.imageUrl,
  imageEmoji: articleFieldsSchema.shape.imageEmoji.unwrap().optional(),
  imageGradient: articleFieldsSchema.shape.imageGradient.unwrap().optional(),
  credit: articleFieldsSchema.shape.credit,
  legende: articleFieldsSchema.shape.legende,
  alaUne: articleFieldsSchema.shape.alaUne.unwrap().optional(),
  breaking: articleFieldsSchema.shape.breaking.unwrap().optional(),
  epingle: articleFieldsSchema.shape.epingle.unwrap().optional(),
  date: articleFieldsSchema.shape.date,
  sources: articleFieldsSchema.shape.sources,
});

export const updateArticleDraftSchema = editableFieldsSchema
  .extend({
    articleId: articleIdSchema,
    idempotencyKey: idempotencyKeySchema,
  })
  .strict()
  .superRefine((value, context) => {
    const changed = Object.keys(value).filter(
      (key) => key !== "articleId" && key !== "idempotencyKey",
    );
    if (changed.length === 0) {
      context.addIssue({
        code: "custom",
        message: "Au moins un champ à modifier est requis",
      });
    }
  });

export const publishArticleSchema = z
  .object({
    articleId: articleIdSchema,
    approved: z.boolean(),
    confirmationText: z.string().trim().min(1).max(160),
    idempotencyKey: idempotencyKeySchema,
  })
  .strict();

export const getArticleStatusSchema = z
  .object({ articleId: articleIdSchema })
  .strict();

export type CreateArticleDraftInput = z.infer<typeof createArticleDraftSchema>;
export type UpdateArticleDraftInput = z.infer<typeof updateArticleDraftSchema>;
export type PublishArticleInput = z.infer<typeof publishArticleSchema>;
export type GetArticleStatusInput = z.infer<typeof getArticleStatusSchema>;

export interface PublisherRepository {
  listAll(): Promise<ArticleInfo[]>;
  getById(id: string): Promise<ArticleInfo | undefined>;
  create(input: ArticleInput): Promise<ArticleInfo>;
  update(
    id: string,
    patch: Partial<ArticleInfo>,
  ): Promise<ArticleInfo | undefined>;
}

export const defaultPublisherRepository: PublisherRepository = {
  listAll: adminListAll,
  getById: adminGetById,
  create: adminCreate,
  update: adminUpdate,
};

export class PublisherError extends Error {
  constructor(
    public readonly code:
      | "ARTICLE_NOT_FOUND"
      | "ARTICLE_ALREADY_PUBLISHED"
      | "DUPLICATE_SLUG"
      | "IDEMPOTENCY_CONFLICT"
      | "APPROVAL_REQUIRED"
      | "UNSAFE_CONTENT"
      | "INVALID_CONTENT",
    message: string,
  ) {
    super(message);
    this.name = "PublisherError";
  }
}

const ALLOWED_TAGS = [
  "p",
  "h2",
  "h3",
  "strong",
  "em",
  "ul",
  "ol",
  "li",
  "blockquote",
  "a",
  "br",
];

export function sanitizeArticleHtml(input: string): {
  html: string;
  changed: boolean;
} {
  const original = input.trim();
  const html = sanitizeHtml(original, {
    allowedTags: ALLOWED_TAGS,
    allowedAttributes: {
      a: ["href", "title", "target", "rel"],
    },
    allowedSchemes: ["http", "https", "mailto"],
    allowProtocolRelative: false,
    disallowedTagsMode: "discard",
    transformTags: {
      a: (_tagName, attributes) => {
        const href = attributes.href?.trim();
        const external = !!href && /^https?:\/\//i.test(href);
        return {
          tagName: "a",
          attribs: {
            ...(href ? { href } : {}),
            ...(attributes.title ? { title: attributes.title } : {}),
            ...(external
              ? { target: "_blank", rel: "noopener noreferrer" }
              : {}),
          },
        };
      },
    },
  }).trim();

  const plainText = sanitizeHtml(html, { allowedTags: [], allowedAttributes: {} })
    .replace(/&nbsp;/g, " ")
    .trim();
  if (!plainText) {
    throw new PublisherError(
      "INVALID_CONTENT",
      "Le contenu ne contient aucun texte publiable après nettoyage.",
    );
  }

  return { html, changed: html !== original };
}

function escapeHtml(value: string): string {
  return value
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function appendSources(
  html: string,
  sources: CreateArticleDraftInput["sources"],
): string {
  if (!sources?.length) return html;
  const unique = [
    ...new Map(sources.map((source) => [source.url, source])).values(),
  ].filter((source) => !html.includes(source.url));
  if (!unique.length) return html;
  const list = unique
    .map((source) => {
      const label = source.label || new URL(source.url).hostname;
      return `<li><a href="${escapeHtml(source.url)}">${escapeHtml(label)}</a></li>`;
    })
    .join("");
  return sanitizeArticleHtml(`${html}<h3>Sources</h3><ul>${list}</ul>`).html;
}

export function slugifyArticle(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 90);
}

export function articleIdFromIdempotencyKey(key: string): string {
  return `mcp_${createHash("sha256")
    .update(`touba-infos:create:${key}`)
    .digest("hex")
    .slice(0, 24)}`;
}

function normalizedConfirmation(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

export function isExplicitPublicationApproval(value: string): boolean {
  const normalized = normalizedConfirmation(value);
  return (
    /^je valide\b/.test(normalized) &&
    /\b(publi(?:e|er|cation)|mise en ligne)\b/.test(normalized)
  );
}

function publicUrl(slug: string): string {
  return `${MEDIA_URL}/${slug}`;
}

function adminUrl(id: string): string {
  return `${MEDIA_URL}/touba-infos/admin/articles/${id}`;
}

function stableCreateView(article: ArticleInfo) {
  return {
    slug: article.slug,
    titre: article.titre,
    sousTitre: article.sousTitre,
    extrait: article.extrait,
    categorie: article.categorie,
    genre: article.genre,
    auteur: article.auteur,
    date: article.date,
    tempsLecture: article.tempsLecture,
    imageEmoji: article.imageEmoji,
    imageGradient: article.imageGradient,
    imageUrl: article.imageUrl,
    credit: article.credit,
    legende: article.legende,
    alaUne: article.alaUne,
    breaking: article.breaking,
    epingle: article.epingle,
    tags: article.tags,
    contenu: article.contenu,
  };
}

function arraysEqual(a: string[], b: string[]): boolean {
  return a.length === b.length && a.every((value, index) => value === b[index]);
}

function sameCreatePayload(
  a: ReturnType<typeof stableCreateView>,
  b: ReturnType<typeof stableCreateView>,
): boolean {
  return Object.entries(a).every(([key, value]) => {
    const other = b[key as keyof typeof b];
    return Array.isArray(value) && Array.isArray(other)
      ? arraysEqual(value, other)
      : value === other;
  });
}

export async function createArticleDraft(
  rawInput: CreateArticleDraftInput,
  repository: PublisherRepository = defaultPublisherRepository,
) {
  const input = createArticleDraftSchema.parse(rawInput);
  const id = articleIdFromIdempotencyKey(input.idempotencyKey);
  const existing = await repository.getById(id);
  const sanitized = sanitizeArticleHtml(input.contenu);
  const contenu = appendSources(sanitized.html, input.sources);
  const slug = slugifyArticle(input.slug || input.titre);
  const date = input.date || existing?.date || new Date().toISOString();
  const candidate: ArticleInfo = {
    id,
    slug,
    titre: input.titre,
    sousTitre: input.sousTitre,
    extrait: input.extrait,
    categorie: input.categorie,
    genre: input.genre,
    statut: "brouillon",
    auteur: input.auteur,
    date,
    tempsLecture: input.tempsLecture,
    imageEmoji: input.imageEmoji,
    imageGradient: input.imageGradient,
    imageUrl: input.imageUrl,
    credit: input.credit,
    legende: input.legende,
    alaUne: input.alaUne,
    breaking: input.breaking,
    epingle: input.epingle,
    vues: 0,
    tags: [...new Set(input.tags)],
    contenu,
  };

  if (existing) {
    if (
      !sameCreatePayload(stableCreateView(existing), stableCreateView(candidate))
    ) {
      throw new PublisherError(
        "IDEMPOTENCY_CONFLICT",
        "Cette clé d’idempotence a déjà servi avec un autre contenu.",
      );
    }
    return {
      articleId: existing.id,
      slug: existing.slug,
      statut: existing.statut || "brouillon",
      adminUrl: adminUrl(existing.id),
      warnings: ["Brouillon déjà créé : la relance n’a produit aucun doublon."],
      idempotentReplay: true,
    };
  }

  if (!slug) {
    throw new PublisherError(
      "INVALID_CONTENT",
      "Impossible de générer un slug valide.",
    );
  }
  const all = await repository.listAll();
  if (all.some((article) => article.slug === slug)) {
    throw new PublisherError(
      "DUPLICATE_SLUG",
      `Un article utilise déjà le slug « ${slug} ».`,
    );
  }

  const article = await repository.create(candidate);
  const warnings: string[] = [];
  if (sanitized.changed) {
    warnings.push("Le HTML dangereux ou non autorisé a été retiré.");
  }
  if (!article.imageUrl) {
    warnings.push("Aucune photo réelle n’est associée au brouillon.");
  }
  if (article.imageUrl && !article.credit) {
    warnings.push("Le crédit de la photo reste à renseigner.");
  }

  return {
    articleId: article.id,
    slug: article.slug,
    statut: article.statut || "brouillon",
    adminUrl: adminUrl(article.id),
    warnings,
    idempotentReplay: false,
  };
}

export async function updateArticleDraft(
  rawInput: UpdateArticleDraftInput,
  repository: PublisherRepository = defaultPublisherRepository,
) {
  const input = updateArticleDraftSchema.parse(rawInput);
  const article = await repository.getById(input.articleId);
  if (!article) {
    throw new PublisherError("ARTICLE_NOT_FOUND", "Article introuvable.");
  }
  if ((article.statut || "publie") === "publie") {
    throw new PublisherError(
      "ARTICLE_ALREADY_PUBLISHED",
      "Un article déjà publié ne peut pas être modifié par cet agent.",
    );
  }

  const {
    articleId: _articleId,
    idempotencyKey: _key,
    sources,
    ...fields
  } = input;
  const patch: Partial<ArticleInfo> = { ...fields } as Partial<ArticleInfo>;
  const warnings: string[] = [];
  if (fields.slug || fields.titre) {
    const nextSlug = slugifyArticle(fields.slug || article.slug);
    const all = await repository.listAll();
    if (all.some((item) => item.id !== article.id && item.slug === nextSlug)) {
      throw new PublisherError(
        "DUPLICATE_SLUG",
        `Un article utilise déjà le slug « ${nextSlug} ».`,
      );
    }
    if (fields.slug) patch.slug = nextSlug;
  }
  if (fields.contenu !== undefined || sources?.length) {
    const sanitized = sanitizeArticleHtml(fields.contenu ?? article.contenu);
    patch.contenu = appendSources(sanitized.html, sources);
    if (sanitized.changed) {
      warnings.push("Le HTML dangereux ou non autorisé a été retiré.");
    }
  }
  if (fields.tags) patch.tags = [...new Set(fields.tags)];
  patch.miseAJour = new Date().toISOString();

  const updated = await repository.update(article.id, patch);
  if (!updated) {
    throw new PublisherError("ARTICLE_NOT_FOUND", "Article introuvable.");
  }
  const changedFields = Object.keys(fields);
  if (sources?.length) changedFields.push("sources");

  return {
    articleId: updated.id,
    slug: updated.slug,
    statut: updated.statut || "brouillon",
    adminUrl: adminUrl(updated.id),
    changedFields,
    warnings,
  };
}

export async function publishArticle(
  rawInput: PublishArticleInput,
  repository: PublisherRepository = defaultPublisherRepository,
) {
  const input = publishArticleSchema.parse(rawInput);
  if (!input.approved || !isExplicitPublicationApproval(input.confirmationText)) {
    throw new PublisherError(
      "APPROVAL_REQUIRED",
      "Publication refusée : l’utilisateur doit confirmer explicitement « Je valide et publie ».",
    );
  }

  const article = await repository.getById(input.articleId);
  if (!article) {
    throw new PublisherError("ARTICLE_NOT_FOUND", "Article introuvable.");
  }
  if ((article.statut || "publie") === "publie") {
    return {
      articleId: article.id,
      slug: article.slug,
      statut: "publie" as const,
      publicUrl: publicUrl(article.slug),
      adminUrl: adminUrl(article.id),
      idempotentReplay: true,
    };
  }

  const sanitized = sanitizeArticleHtml(article.contenu);
  if (sanitized.changed) {
    throw new PublisherError(
      "UNSAFE_CONTENT",
      "Le brouillon contient du HTML non autorisé. Corrigez-le avant publication.",
    );
  }
  const updated = await repository.update(article.id, {
    statut: "publie",
    miseAJour: new Date().toISOString(),
  });
  if (!updated) {
    throw new PublisherError("ARTICLE_NOT_FOUND", "Article introuvable.");
  }

  return {
    articleId: updated.id,
    slug: updated.slug,
    statut: "publie" as const,
    publicUrl: publicUrl(updated.slug),
    adminUrl: adminUrl(updated.id),
    idempotentReplay: false,
  };
}

export async function getArticleStatus(
  rawInput: GetArticleStatusInput,
  repository: PublisherRepository = defaultPublisherRepository,
) {
  const input = getArticleStatusSchema.parse(rawInput);
  const article = await repository.getById(input.articleId);
  if (!article) {
    throw new PublisherError("ARTICLE_NOT_FOUND", "Article introuvable.");
  }
  const statut = article.statut || "publie";
  return {
    articleId: article.id,
    slug: article.slug,
    titre: article.titre,
    statut,
    publicUrl: statut === "publie" ? publicUrl(article.slug) : null,
    adminUrl: adminUrl(article.id),
    miseAJour: article.miseAJour || null,
  };
}
