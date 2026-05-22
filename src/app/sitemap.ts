import type { MetadataRoute } from "next";
import { CATALOGUE } from "@/lib/supports";
import { ARTICLES } from "@/lib/blog";

const BASE = "https://touba-visuel.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
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

  return [
    { url: BASE, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${BASE}/marche-ocass`, lastModified: new Date(), changeFrequency: "daily", priority: 0.95 },
    { url: `${BASE}/catalogue`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.9 },
    { url: `${BASE}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE}/commande`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    ...catalogueUrls,
    ...blogUrls,
  ];
}
