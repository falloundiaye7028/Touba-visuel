import { headers } from "next/headers";
import type { MetadataRoute } from "next";

export default async function robots(): Promise<MetadataRoute.Robots> {
  const host = (await headers()).get("host") || "";
  const isInfos = host.includes("toubainfos.com");

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: isInfos
        ? [
            "/api/",
            "/admin",
            "/preview-premium",
            "/newsletter/confirmer",
            "/newsletter/desinscription",
          ]
        : ["/api/", "/admin/"],
    },
    sitemap: isInfos
      ? [
          "https://toubainfos.com/sitemap.xml",
          "https://toubainfos.com/news-sitemap.xml",
        ]
      : "https://touba-visuel.vercel.app/sitemap.xml",
  };
}
