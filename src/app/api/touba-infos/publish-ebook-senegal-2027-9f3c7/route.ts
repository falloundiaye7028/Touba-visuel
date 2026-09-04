import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

const EBOOK_SLUG = "senegal-2027-le-grand-decryptage-des-elections";
const ARTICLE_SLUG = "touba-infos-publie-senegal-2027-le-grand-decryptage-des-elections";

export async function POST(request: Request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return NextResponse.json({ ok: false, error: "BLOB_READ_WRITE_TOKEN manquant" }, { status: 500 });
    }

    const form = await request.formData();
    const pdf = form.get("pdf");
    const cover = form.get("cover");

    if (!(pdf instanceof File) || pdf.type !== "application/pdf") {
      return NextResponse.json({ ok: false, error: "PDF requis" }, { status: 400 });
    }
    if (!(cover instanceof File) || !cover.type.startsWith("image/")) {
      return NextResponse.json({ ok: false, error: "Couverture image requise" }, { status: 400 });
    }
    if (pdf.size > 25 * 1024 * 1024 || cover.size > 8 * 1024 * 1024) {
      return NextResponse.json({ ok: false, error: "Fichier trop volumineux" }, { status: 400 });
    }

    const [pdfBlob, coverBlob] = await Promise.all([
      put("touba-infos/ebooks/senegal-2027-le-grand-decryptage-des-elections.pdf", pdf, {
        access: "public",
        addRandomSuffix: true,
        contentType: "application/pdf",
      }),
      put("touba-infos/ebooks/senegal-2027-le-grand-decryptage-cover.png", cover, {
        access: "public",
        addRandomSuffix: true,
        contentType: cover.type || "image/png",
      }),
    ]);

    const ebook = await prisma.infoEbook.upsert({
      where: { slug: EBOOK_SLUG },
      update: {
        title: "SÉNÉGAL 2027 : LE GRAND DÉCRYPTAGE DES ÉLECTIONS",
        author: "Rédaction Touba Infos",
        description:
          "Un magazine spécial de Touba Infos consacré aux enjeux institutionnels, juridiques et électoraux de 2027 : élections locales et législatives, dissolution de l’Assemblée nationale, calendrier électoral, prorogation des mandats, référendum, ordonnances, jurisprudence et scénarios possibles.",
        category: "Politique & Institutions",
        coverUrl: coverBlob.url,
        coverFocalX: 50,
        coverFocalY: 50,
        pdfPathname: pdfBlob.url,
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
        coverUrl: coverBlob.url,
        coverFocalX: 50,
        coverFocalY: 50,
        pdfPathname: pdfBlob.url,
        kind: "FREE",
        priceXof: 0,
        status: "PUBLISHED",
      },
    });

    const now = new Date();
    const article = await prisma.infoArticle.upsert({
      where: { slug: ARTICLE_SLUG },
      update: {
        titre: "TOUBA INFOS PUBLIE « SÉNÉGAL 2027 : LE GRAND DÉCRYPTAGE DES ÉLECTIONS »",
        sousTitre: "Un magazine spécial pour comprendre, à partir des textes, les grandes questions institutionnelles et électorales qui se posent à l’approche de 2027.",
        extrait: "Touba Infos met gratuitement à disposition son nouveau magazine numérique consacré au calendrier électoral, à la dissolution, aux élections locales et législatives et aux scénarios institutionnels de 2027.",
        categorie: "Politique",
        genre: "Analyse",
        statut: "publie",
        auteur: "Rédaction Touba Infos",
        date: now,
        miseAJour: now,
        tempsLecture: "3 min",
        imageEmoji: "📘",
        imageGradient: "from-green-800 via-emerald-900 to-neutral-950",
        imageUrl: coverBlob.url,
        imageFocalX: 50,
        imageFocalY: 50,
        credit: "Touba Infos",
        legende: "Couverture du magazine spécial Sénégal 2027",
        alaUne: true,
        breaking: false,
        epingle: true,
        tags: ["Sénégal 2027", "Élections", "Ebook", "Constitution", "Touba Infos"],
        contenu: `<p><strong>Touba Infos publie un nouveau magazine numérique : « Sénégal 2027 : Le Grand Décryptage des Élections ».</strong></p>
<p>Ce dossier spécial a été conçu pour permettre au public de comprendre les principaux enjeux juridiques et institutionnels liés aux échéances électorales de 2027, sans confondre les textes en vigueur, leur interprétation et les hypothèses politiques.</p>
<h2>Un dossier consacré aux grandes questions de 2027</h2>
<p>Le magazine analyse notamment la possibilité d’un couplage entre élections législatives et territoriales, les conditions de dissolution de l’Assemblée nationale prévues par l’article 87 de la Constitution, la durée des mandats locaux, les possibilités de prorogation, le rôle de la loi et du décret, le référendum, les ordonnances ainsi que les conséquences d’un éventuel blocage institutionnel.</p>
<p>Il revient également sur la jurisprudence électorale récente et présente plusieurs scénarios de calendrier afin d’aider les lecteurs à distinguer ce qui est juridiquement établi de ce qui demeure hypothétique.</p>
<h2>Téléchargement gratuit</h2>
<p>Le magazine est mis gratuitement à la disposition des lecteurs de Touba Infos.</p>
<p><a href="${pdfBlob.url}" target="_blank" rel="noopener noreferrer"><strong>→ Télécharger le PDF : Sénégal 2027 - Le Grand Décryptage des Élections</strong></a></p>
<p><a href="/touba-infos/ebooks/${EBOOK_SLUG}"><strong>→ Voir la fiche du magazine dans la bibliothèque Touba Infos</strong></a></p>
<h2>Une démarche pédagogique</h2>
<p>Cette publication n’a pas vocation à annoncer une décision politique qui n’aurait pas encore été officiellement prise. Elle propose une lecture pédagogique des règles constitutionnelles, électorales et institutionnelles applicables, à partir des textes et des précédents étudiés par la rédaction.</p>`,
      },
      create: {
        id: "ebook-senegal-2027-20260904",
        slug: ARTICLE_SLUG,
        titre: "TOUBA INFOS PUBLIE « SÉNÉGAL 2027 : LE GRAND DÉCRYPTAGE DES ÉLECTIONS »",
        sousTitre: "Un magazine spécial pour comprendre, à partir des textes, les grandes questions institutionnelles et électorales qui se posent à l’approche de 2027.",
        extrait: "Touba Infos met gratuitement à disposition son nouveau magazine numérique consacré au calendrier électoral, à la dissolution, aux élections locales et législatives et aux scénarios institutionnels de 2027.",
        categorie: "Politique",
        genre: "Analyse",
        statut: "publie",
        auteur: "Rédaction Touba Infos",
        date: now,
        miseAJour: now,
        tempsLecture: "3 min",
        imageEmoji: "📘",
        imageGradient: "from-green-800 via-emerald-900 to-neutral-950",
        imageUrl: coverBlob.url,
        imageFocalX: 50,
        imageFocalY: 50,
        credit: "Touba Infos",
        legende: "Couverture du magazine spécial Sénégal 2027",
        alaUne: true,
        breaking: false,
        epingle: true,
        vues: 0,
        tags: ["Sénégal 2027", "Élections", "Ebook", "Constitution", "Touba Infos"],
        contenu: `<p><strong>Touba Infos publie un nouveau magazine numérique : « Sénégal 2027 : Le Grand Décryptage des Élections ».</strong></p>
<p>Ce dossier spécial a été conçu pour permettre au public de comprendre les principaux enjeux juridiques et institutionnels liés aux échéances électorales de 2027, sans confondre les textes en vigueur, leur interprétation et les hypothèses politiques.</p>
<h2>Un dossier consacré aux grandes questions de 2027</h2>
<p>Le magazine analyse notamment la possibilité d’un couplage entre élections législatives et territoriales, les conditions de dissolution de l’Assemblée nationale prévues par l’article 87 de la Constitution, la durée des mandats locaux, les possibilités de prorogation, le rôle de la loi et du décret, le référendum, les ordonnances ainsi que les conséquences d’un éventuel blocage institutionnel.</p>
<p>Il revient également sur la jurisprudence électorale récente et présente plusieurs scénarios de calendrier afin d’aider les lecteurs à distinguer ce qui est juridiquement établi de ce qui demeure hypothétique.</p>
<h2>Téléchargement gratuit</h2>
<p>Le magazine est mis gratuitement à la disposition des lecteurs de Touba Infos.</p>
<p><a href="${pdfBlob.url}" target="_blank" rel="noopener noreferrer"><strong>→ Télécharger le PDF : Sénégal 2027 - Le Grand Décryptage des Élections</strong></a></p>
<p><a href="/touba-infos/ebooks/${EBOOK_SLUG}"><strong>→ Voir la fiche du magazine dans la bibliothèque Touba Infos</strong></a></p>
<h2>Une démarche pédagogique</h2>
<p>Cette publication n’a pas vocation à annoncer une décision politique qui n’aurait pas encore été officiellement prise. Elle propose une lecture pédagogique des règles constitutionnelles, électorales et institutionnelles applicables, à partir des textes et des précédents étudiés par la rédaction.</p>`,
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
        pdfUrl: pdfBlob.url,
        coverUrl: coverBlob.url,
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
