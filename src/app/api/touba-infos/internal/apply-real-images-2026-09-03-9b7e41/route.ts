import { NextResponse } from "next/server";
import { put } from "@vercel/blob";
import { adminGetById, adminUpdate } from "@/lib/touba-infos-store";

type ImageJob = {
  id: string;
  sourceUrl?: string;
  directImageUrl?: string;
  fallbackImageUrl?: string;
  credit: string;
  legende: string;
};

const jobs: ImageJob[] = [
  {
    id: "53",
    sourceUrl: "https://aps.sn/appel-a-une-modernisation-du-systeme-dinformation-sur-les-marches-pour-proteger-le-pouvoir-dachat/",
    credit: "Photo : Agence de Presse Sénégalaise (APS)",
    legende: "Atelier consacré à la modernisation du système d’information sur les marchés au Sénégal.",
  },
  {
    id: "54",
    sourceUrl: "https://aps.sn/grand-magal-lassainissement-et-lhydraulique-defis-au-coeur-des-preparatifs-responsable/",
    fallbackImageUrl: "https://aps.sn/wp-content/uploads/2026/07/magal1.webp",
    credit: "Photo : Agence de Presse Sénégalaise (APS)",
    legende: "Les enjeux d’assainissement et d’hydraulique dans la préparation du Grand Magal de Touba 2026.",
  },
  {
    id: "55",
    sourceUrl: "https://aps.sn/le-general-birame-diop-installe-dans-ses-fonctions-de-president-de-la-commission-de-la-cedeao/",
    fallbackImageUrl: "https://aps.sn/wp-content/uploads/2026/09/biramesouleydiop1.webp",
    credit: "Photo : Agence de Presse Sénégalaise (APS)",
    legende: "Le général sénégalais Birame Diop lors de son installation à la tête de la Commission de la CEDEAO.",
  },
  {
    id: "56",
    directImageUrl: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7f/Strait_Of_Hormuz_Transit_230508-N-NH257-1076.jpg/960px-Strait_Of_Hormuz_Transit_230508-N-NH257-1076.jpg",
    credit: "Photo : U.S. Navy / Elliot Schaudt — Wikimedia Commons, domaine public",
    legende: "Transit dans le détroit d’Ormuz, zone stratégique au cœur des tensions entre les États-Unis et l’Iran. Photo d’illustration.",
  },
  {
    id: "57",
    sourceUrl: "https://aps.sn/le-senegal-represente-par-trois-chefs-au-bocuse-dor-africa-2026/",
    fallbackImageUrl: "https://aps.sn/wp-content/uploads/2026/09/la-team-sen.webp",
    credit: "Photo : Agence de Presse Sénégalaise (APS)",
    legende: "L’équipe sénégalaise engagée au Bocuse d’Or Africa 2026.",
  },
  {
    id: "58",
    sourceUrl: "https://aps.sn/universite-de-matam-le-recteur-appelle-a-accelerer-les-travaux-pour-une-ouverture-en-octobre-prochain/",
    fallbackImageUrl: "https://aps.sn/wp-content/uploads/2026/09/mamadousidibe.webp",
    credit: "Photo : Agence de Presse Sénégalaise (APS)",
    legende: "Mamadou Sidibé, recteur de l’Université Souleymane Niang de Matam, lors d’une visite du chantier.",
  },
  {
    id: "59",
    sourceUrl: "https://aps.sn/soixante-senegalais-rapatries-dafrique-du-sud-accueillis-a-laeroport-de-dakar/",
    fallbackImageUrl: "https://aps.sn/wp-content/uploads/2026/08/abdoukarimcisse.webp",
    credit: "Photo : Agence de Presse Sénégalaise (APS)",
    legende: "Accueil à Dakar de Sénégalais rapatriés d’Afrique du Sud.",
  },
  {
    id: "60",
    sourceUrl: "https://aps.sn/le-projet-de-loi-sur-la-protection-des-infrastructures-dinformation-critiques-et-la-securite-numerique-adopte-par-les-deputes/",
    fallbackImageUrl: "https://aps.sn/wp-content/uploads/2026/08/pleniaire.webp",
    credit: "Photo : Agence de Presse Sénégalaise (APS)",
    legende: "Séance plénière consacrée au texte sur la protection des infrastructures d’information critiques et la sécurité numérique.",
  },
];

function ogImage(html: string): string | undefined {
  const direct = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i);
  const reverse = html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  return (direct?.[1] || reverse?.[1])?.replace(/&amp;/g, "&");
}

function extension(contentType: string, url: string): string {
  if (contentType.includes("png")) return "png";
  if (contentType.includes("webp")) return "webp";
  if (contentType.includes("gif")) return "gif";
  if (contentType.includes("jpeg") || contentType.includes("jpg")) return "jpg";
  const pathname = new URL(url).pathname;
  const ext = pathname.split(".").pop()?.toLowerCase();
  return ext && /^[a-z0-9]+$/.test(ext) ? ext : "jpg";
}

async function resolveImage(job: ImageJob): Promise<string> {
  if (job.directImageUrl) return job.directImageUrl;
  if (job.sourceUrl) {
    try {
      const page = await fetch(job.sourceUrl, {
        cache: "no-store",
        headers: { "user-agent": "ToubaInfos/1.0 (+https://toubainfos.com)" },
      });
      if (page.ok) {
        const found = ogImage(await page.text());
        if (found) return found;
      }
    } catch {
      // fallback below
    }
  }
  if (job.fallbackImageUrl) return job.fallbackImageUrl;
  throw new Error(`Image source introuvable pour l’article ${job.id}`);
}

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ ok: false, error: "BLOB_READ_WRITE_TOKEN absent" }, { status: 503 });
  }

  const updated: Array<Record<string, string>> = [];
  const failed: Array<Record<string, string>> = [];

  for (const job of jobs) {
    try {
      const article = await adminGetById(job.id);
      if (!article) throw new Error("Article introuvable");

      const remoteUrl = await resolveImage(job);
      const response = await fetch(remoteUrl, {
        cache: "no-store",
        headers: { "user-agent": "ToubaInfos/1.0 (+https://toubainfos.com)" },
      });
      if (!response.ok) throw new Error(`Téléchargement image HTTP ${response.status}`);

      const contentType = response.headers.get("content-type") || "image/jpeg";
      if (!contentType.startsWith("image/")) throw new Error(`Type inattendu : ${contentType}`);

      const body = await response.arrayBuffer();
      const ext = extension(contentType, remoteUrl);
      const blob = await put(`touba-infos/articles/${article.slug}.${ext}`, body, {
        access: "public",
        addRandomSuffix: true,
        contentType,
      });

      await adminUpdate(job.id, {
        imageUrl: blob.url,
        imageFocalX: 50,
        imageFocalY: 50,
        credit: job.credit,
        legende: job.legende,
        miseAJour: new Date().toISOString(),
      });

      updated.push({ id: job.id, slug: article.slug, source: remoteUrl, imageUrl: blob.url });
    } catch (error) {
      failed.push({ id: job.id, error: error instanceof Error ? error.message : String(error) });
    }
  }

  return NextResponse.json({ ok: failed.length === 0, updated, failed }, { status: failed.length ? 207 : 200 });
}
