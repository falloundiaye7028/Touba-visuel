import { NextRequest, NextResponse } from "next/server";
import { runVeille } from "@/lib/touba-infos-veille";

export const dynamic = "force-dynamic";
export const maxDuration = 60;

/**
 * Déclenche une passe de veille (à appeler par un cron externe).
 * Sécurisé par `TI_AGENT_SECRET` (ou `ADMIN_SECRET`).
 * Exemple : GET /api/touba-infos/agent/veille?secret=XXXX
 * Programmation : Vercel Cron, GitHub Actions ou cron externe.
 */
export async function GET(req: NextRequest) {
  const secret =
    req.nextUrl.searchParams.get("secret") || req.headers.get("x-agent-secret");
  const expected = process.env.TI_AGENT_SECRET || process.env.ADMIN_SECRET;

  if (!expected || secret !== expected) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  try {
    const run = await runVeille();
    return NextResponse.json({ ok: true, run });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: String(e).slice(0, 200) },
      { status: 500 },
    );
  }
}
