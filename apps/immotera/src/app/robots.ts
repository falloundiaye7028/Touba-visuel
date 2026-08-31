import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://intelligenceimmobilier.com";
  return { rules: [{ userAgent: "*", allow: ["/", "/login", "/register", "/securite", "/confidentialite", "/conditions", "/mentions-legales"], disallow: ["/dashboard", "/properties", "/owners", "/tenants", "/contracts", "/payments", "/settings", "/api"] }], sitemap: `${origin}/sitemap.xml` };
}
