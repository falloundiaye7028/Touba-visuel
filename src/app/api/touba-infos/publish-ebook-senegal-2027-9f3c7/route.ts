import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const EBOOK_SLUG = "senegal-2027-le-grand-decryptage-des-elections";
const ARTICLE_SLUG = "touba-infos-publie-senegal-2027-le-grand-decryptage-des-elections";
const PDF_URL = "/ebooks/senegal-2027-le-grand-decryptage-des-elections.pdf";
const COVER_URL = "/ebooks/senegal-2027-le-grand-decryptage-cover.png";

const articleHtml = `
<p><strong>Touba Infos publie un nouveau magazine numérique : « Sénégal 2027 : Le Grand Décryptage des Élections ».</strong></p>
<p>Ce dossier spécial a été conçu pour permettre au public de comprendre les principaux enjeux juridiques et institutionnels liés aux échéances électorales de 2027, sans confondre les textes en vigueur, leur interprétation et les hypothèses politiques.</p>
<h2>Un dossier consacré aux grandes questions de 2027</h2>
<p>Le magazine analyse notamment la possibilité d’un couplage entre élections législatives et territoriales, les conditions de dissolution de l’Assemblée nationale prévues par l’article 87 de la Constitution, la durée des mandats locaux, les possibilités de prorogation, le rôle de la loi et du décret, le référendum, les ordonnances ainsi que les conséquences d’un éventuel blocage institutionnel.</p>
<p>Il revient également sur la jurisprudence électorale récente et présente plusieurs scénarios de calendrier afin d’aider les lecteurs à distinguer ce qui est juridiquement établi de ce qui demeure hypothétique.</p>
<h2>Téléchargement gratuit</h2>
<p>Le magazine est mis gratuitement à la disposition des lecteurs de Touba Infos.</p>
<p><a href="${PDF_URL}" download><strong>→ Télécharger le PDF : Sénégal 2027 - Le Grand Décryptage des Élections</strong></a></p>
<p><a href="/touba-infos/ebooks/${EBOOK_SLUG}"><strong>→ Voir la fiche du magazine dans la bibliothèque Touba Infos</strong></a></p>
<h2>Une démarche pédagogique</h2>
<p>Cette publication n’a pas vocation à annoncer une décision politique qui n’aurait pas encore été officiellement prise. Elle propose une lecture pédagogique des règles constitutionnelles, électorales et institutionnelles applicables, à partir des textes et des précédents étudiés par la rédaction.</p>
`;

export async function GET() {
  try {
    const now = new Date();

    const ebook = await prisma.infoEbook.upsert({
      where: { slug: EBOOK_SLUG },
      update: {
        title: "SÉNÉGAL 2027 : LE GRAND DÉCRYPTAGE DES ÉLECTIONS",
        author: "Rédaction Touba Infos",
        description:
          "Un magazine spécial de Touba Infos consacré aux enjeux institutionnels, juridiques et électoraux de 2027 : élections locales et législatives, dissolution de l’Assemblée nationale, calendrier électoral, prorogation des mandats, référendum, ordonnances, jurisprudence et scénarios possibles.",
        category: "Politique & Institutions",
        coverUrl: COVER_URL,
        coverFocalX: 50,
        coverFocalY: 50,
        pdfPathname: PDF_URL,
        kind: "FREE",
        priceXof: 0,
        status: "PUBLISHED",
      },
      create: {
        slug: EBOOK_SLUG,
        title: "SÉNÉGAL 2027 : LE GRAND DÉCRYPTAGE DES ÉLECTIONS",
        author: "Rédaction Touba Infos",
        description:
          "Un magazine spécial de Touba Infos consacré aux enjeux institutionnels, juridiques et électoraux de 2027 : élections locales et législatives, dissolution de l’Assemblée nationale, calendrier électoral, prorogation des mandats, référendum, ordonnances, jurisprudence et scénarios possibles.",
        category: "Politique & Institutions",
        coverUrl: COVER_URL,
        coverFocalX: 50,
        coverFocalY: 50,
        pdfPathname: PDF_URL,
        kind: "FREE",
        priceXof: 0,
        status: "PUBLISHED",
      },
    });

    await prisma.infoArticle.updateMany({
      where: { alaUne: true, NOT: { slug: ARTICLE_SLUG } },
      data: { alaUne: false },
    });

    const article = await prisma.infoArticle.upsert({
      where: { slug: ARTICLE_SLUG },
      update: {
        titre: "TOUBA INFOS PUBLIE « SÉNÉGAL 2027 : LE GRAND DÉCRYPTAGE DES ÉLECTIONS »",
        sousTitre:
          "Un magazine spécial pour comprendre, à partir des textes, les grandes questions institutionnelles et électorales qui se posent à l’approche de 2027.",
        extrait:
          "Touba Infos met gratuitement à disposition son nouveau magazine numérique consacré au calendrier électoral, à la dissolution, aux élections locales et législatives et aux scénarios institutionnels de 2027.",
        categorie: "Politique",
        genre: "Analyse",
        statut: "publie",
        auteur: "Rédaction Touba Infos",
        date: now,
        miseAJour: now,
        tempsLecture: "3 min",
        imageEmoji: "📘",
        imageGradient: "from-green-800 via-emerald-900 to-neutral-950",
        imageUrl: COVER_URL,
        imageFocalX: 50,
        imageFocalY: 50,
        credit: "Touba Infos",
        legende: "Couverture du magazine spécial Sénégal 2027",
        alaUne: true,
        breaking: false,
        epingle: true,
        tags: ["Sénégal 2027", "Élections", "Ebook", "Constitution", "Touba Infos"],
        contenu: articleHtml,
      },
      create: {
        id: "ebook-senegal-2027-20260904",
        slug: ARTICLE_SLUG,
        titre: "TOUBA INFOS PUBLIE « SÉNÉGAL 2027 : LE GRAND DÉCRYPTAGE DES ÉLECTIONS »",
        sousTitre:
          "Un magazine spécial pour comprendre, à partir des textes, les grandes questions institutionnelles et électorales qui se posent à l’approche de 2027.",
        extrait:
          "Touba Infos met gratuitement à disposition son nouveau magazine numérique consacré au calendrier électoral, à la dissolution, aux élections locales et législatives et aux scénarios institutionnels de 2027.",
        categorie: "Politique",
        genre: "Analyse",
        statut: "publie",
        auteur: "Rédaction Touba Infos",
        date: now,
        miseAJour: now,
        tempsLecture: "3 min",
        imageEmoji: "📘",
        imageGradient: "from-green-800 via-emerald-900 to-neutral-950",
        imageUrl: COVER_URL,
        imageFocalX: 50,
        imageFocalY: 50,
        credit: "Touba Infos",
        legende: "Couverture du magazine spécial Sénégal 2027",
        alaUne: true,
        breaking: false,
        epingle: true,
        vues: 0,
        tags: ["Sénégal 2027", "Élections", "Ebook", "Constitution", "Touba Infos"],
        contenu: articleHtml,
      },
    });

    revalidatePath("/", "layout");
    revalidatePath("/touba-infos", "layout");
    revalidatePath("/touba-infos/ebooks", "layout");
    revalidatePath(`/touba-infos/ebooks/${EBOOK_SLUG}`);
    revalidatePath(`/touba-infos/${ARTICLE_SLUG}`);

    return NextResponse.json({
      ok: true,
      ebook: {
        slug: ebook.slug,
        url: `/touba-infos/ebooks/${ebook.slug}`,
        pdfUrl: PDF_URL,
        coverUrl: COVER_URL,
      },
      article: {
        slug: article.slug,
        url: `/touba-infos/${article.slug}`,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : "Erreur inconnue" },
      { status: 500 },
    );
  }
}
