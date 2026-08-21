import chunk0 from "@/lib/sama/official-logo/chunk0";
import chunk1 from "@/lib/sama/official-logo/chunk1";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const logoBytes = Buffer.from(chunk0 + chunk1, "base64");

export async function GET() {
  return new Response(new Uint8Array(logoBytes), {
    status: 200,
    headers: {
      "Content-Type": "image/webp",
      "Cache-Control": "public, max-age=31536000, immutable",
      "Content-Disposition": "inline; filename=\"sama-pilot-logo-officiel.webp\"",
    },
  });
}
