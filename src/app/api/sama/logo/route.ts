import { NextRequest } from "next/server";
import sharp from "sharp";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const sourceUrl = new URL("/samapilot-logo.webp", request.nextUrl.origin);
    const source = await fetch(sourceUrl, { cache: "no-store" });

    if (!source.ok) {
      return new Response("Logo source unavailable", { status: 404 });
    }

    const input = Buffer.from(await source.arrayBuffer());
    const png = await sharp(input).png({ compressionLevel: 9 }).toBuffer();

    return new Response(new Uint8Array(png), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=604800, stale-while-revalidate=2592000",
      },
    });
  } catch {
    return new Response("Logo conversion failed", { status: 500 });
  }
}
