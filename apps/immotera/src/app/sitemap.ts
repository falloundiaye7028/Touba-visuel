import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const origin = process.env.NEXT_PUBLIC_APP_URL ?? "https://intelligenceimmobilier.com";
  return [
    { url: origin, changeFrequency: "weekly", priority: 1 },
    { url: `${origin}/login`, changeFrequency: "monthly", priority: .5 },
    { url: `${origin}/register`, changeFrequency: "monthly", priority: .8 },
    { url: `${origin}/securite`, changeFrequency: "monthly", priority: .6 },
    { url: `${origin}/confidentialite`, changeFrequency: "yearly", priority: .4 },
    { url: `${origin}/conditions`, changeFrequency: "yearly", priority: .4 },
    { url: `${origin}/mentions-legales`, changeFrequency: "yearly", priority: .4 },
  ];
}
