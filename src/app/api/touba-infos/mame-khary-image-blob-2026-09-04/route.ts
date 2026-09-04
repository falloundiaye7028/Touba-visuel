import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { put } from "@vercel/blob";
import { adminListAll, adminUpdate } from "@/lib/touba-infos-store";

const TITLE =
  "TOUBA : SOKHNA MAME KHARY MBACKÉ APPORTE DES ÉCLAIRCISSEMENTS SUR LA VENUE DE AÏDA DIALLO";
const SOURCE_IMAGE =
  "https://www.dakaractu.com/photo/art/grande/97917924-68172925.jpg?v=1788511234";

export async function GET() {
  if (!process.env.BLOB_READ_WRITE_TOKEN) {
    return NextResponse.json({ ok: false, error: "BLOB_READ_WRITE_TOKEN absent" }, { status: 503 });
  }

  const article = (await adminListAll()).find((a) => a.titre === TITLE);
  if (!article) {
    return NextResponse.json({ ok: false, error: "Article introuvable" }, { status: 404 });
  }

  try {
    const response = await fetch(SOURCE_IMAGE, {
      headers: { "user-agent": "Mozilla/5.0 ToubaInfos/1.0" },
      cache: "no-store",
    });
    if (!response.ok) {
      return NextResponse.json(
        { ok: false, error: `Image source inaccessible: ${response.status}` },
        { status: 502 },
      );
    }

    const bytes = await response.arrayBuffer();
    const blob = await put(
      "touba-infos/articles/sokhna-mame-khary-aida-diallo.jpg",
      bytes,
      {
        access: "public",
        addRandomSuffix: true,
        contentType: response.headers.get("content-type") || "image/jpeg",
      },
    );

    const updated = await adminUpdate(article.id, {
      imageUrl: blob.url,
      credit: "Source photo : DakarActu — intégration Touba Infos",
      imageFocalX: 50,
      imageFocalY: 40,
    });

    revalidatePath("/touba-infos", "layout");
    revalidatePath(`/touba-infos/${article.slug}`, "page");
    revalidatePath("/", "layout");

    return NextResponse.json({
      ok: true,
      id: updated?.id,
      slug: updated?.slug,
      imageUrl: updated?.imageUrl,
    });
  } catch (error) {
    return NextResponse.json(
      { ok: false, error: error instanceof Error ? error.message : String(error) },
      { status: 500 },
    );
  }
}
