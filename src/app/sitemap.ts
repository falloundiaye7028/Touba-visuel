import type { MetadataRoute } from "next";
import { CATALOGUE } from "@/lib/supports";
import { ARTICLES } from "@/lib/blog";
import {
  CATEGORIES_INFO,
  CATEGORIES_PLUS,
  slugCategorie,
  MEDIA_URL,
  type CategorieInfo,
} from "@/lib/touba-infos";
import { getArticlesTries } from "@/lib/touba-infos-store";

const BASE = "https://touba-visuel.vercel.app";
// Média servi à la racine de son domaine dédié
const INFOS = MEDIA_URL;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const articlesInfos = await getArticlesTries();
  const catalogueUrls = CATALOGUE.flatMap((cat) => [
    { url: `${BASE}/catalogue/${cat.slug}`, lastModified: new Date(), changeFrequency: "weekly" as const, priority: 0.8 },
    ...cat.supports.map((s) => ({
      url: `${BASE}/catalogue/${cat.slug}/${s.slug}`,
      lastModified: new Date(),
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  ]);

  const blogUrls = ARTICLES.map((a) => ({
    url: `${BASE}/blog/${a.slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  // ── Touba Infos (média) ──
  const infosSections = [
    "magal",
    "videos",
    "direct",
    "fil-info",
    "a-propos",
    "contact",
    "publicite",
    "politique-editoriale",
    "newsletter",
  ].map((s) => ({
    url: `${INFOS}/${s}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const infosRubriques = [...CATEGORIES_INFO, ...CATEGORIES_PLUS].map((c) => ({
    url: `${INFOS}/rubrique/${slugCategorie(c as CategorieInfo)}`,
    lastModified: new Date(),
    changeFrequency: "daily" as const,
    priority: 0.7,
  }));

  const infosArticles = articlesInfos.map((a) => ({
    url: `${INFOS}/${a.slug}`,
    lastModified: new Date(a.miseAJour ?? a.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [
    {
      url: `${INFOS}/`,
      lastModified: new Date(),
      changeFrequency: "hourly",
      priority: 0.95,
    },
    ...infosSections,
    ...infosRubriques,
    ...infosArticles,
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/marche-ocass`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE}/catalogue`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/commande`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...catalogueUrls,
    ...blogUrls,
  ];
}
