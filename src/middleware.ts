import { NextRequest, NextResponse } from "next/server";

// Rate limit en mémoire (Edge compatible)
const rateLimitStore = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(key: string, max: number, windowMs: number): boolean {
  const now = Date.now();
  const entry = rateLimitStore.get(key);
  if (!entry || entry.resetAt < now) {
    rateLimitStore.set(key, { count: 1, resetAt: now + windowMs });
    return true;
  }
  if (entry.count >= max) return false;
  entry.count++;
  return true;
}

function getIp(req: NextRequest): string {
  return (
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown"
  );
}

// Patterns suspects (injection SQL, XSS basique, path traversal)
const SUSPICIOUS_PATTERNS = [
  /(<script|javascript:|vbscript:|onload=|onerror=)/i,
  /(union\s+select|drop\s+table|insert\s+into|delete\s+from)/i,
  /(\.\.\/)|(\.\.\\)/,
  /(eval\(|document\.cookie|window\.location)/i,
];

function isSuspicious(value: string): boolean {
  return SUSPICIOUS_PATTERNS.some((p) => p.test(value));
}

export async function middleware(req: NextRequest) {
  const ip = getIp(req);
  const { pathname } = req.nextUrl;

  // ── 0. Domaine dédié Touba Infos : média à la racine ─────────────────────
  //     Sur toubainfos.com, la racine et les chemins propres servent le média
  //     (réécriture interne vers /touba-infos). L'agence reste sur son domaine.
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];
  if (host === "toubainfos.com" || host === "www.toubainfos.com") {
    const p = pathname;
    const passthrough =
      p.startsWith("/touba-infos") ||
      p.startsWith("/api") ||
      p.startsWith("/_next") ||
      p.startsWith("/images") ||
      p.startsWith("/splash") ||
      p === "/robots.txt" ||
      p === "/sitemap.xml" ||
      p === "/manifest.json" ||
      p === "/sw.js" ||
      /\.[a-zA-Z0-9]+$/.test(p);
    if (!passthrough) {
      const url = req.nextUrl.clone();
      url.pathname = p === "/" ? "/touba-infos" : `/touba-infos${p}`;
      return NextResponse.rewrite(url);
    }
  }

  // ── 1. Protection /admin ──────────────────────────────────────────────────
  if (pathname.startsWith("/admin") || pathname.startsWith("/api/admin")) {
    const adminSecret = req.headers.get("x-admin-secret") || req.cookies.get("admin-token")?.value;
    const expected = process.env.ADMIN_SECRET;
    if (!expected || adminSecret !== expected) {
      if (pathname.startsWith("/api/admin")) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
      }
      // Pour /admin page, laisser passer (protection côté page)
    }
  }

  // ── 2. Rate limiting API ──────────────────────────────────────────────────
  if (pathname.startsWith("/api/")) {
    // POST /api/orders : 10 req/minute par IP
    if (pathname === "/api/orders" && req.method === "POST") {
      if (!checkRateLimit(`orders:${ip}`, 10, 60_000)) {
        return NextResponse.json(
          { error: "Trop de requêtes. Réessayez dans une minute." },
          { status: 429, headers: { "Retry-After": "60" } }
        );
      }
    }
    // Général : 60 req/minute par IP
    if (!checkRateLimit(`api:${ip}`, 60, 60_000)) {
      return NextResponse.json(
        { error: "Trop de requêtes." },
        { status: 429, headers: { "Retry-After": "60" } }
      );
    }
  }

  // ── 3. Détection injections dans query params ─────────────────────────────
  const url = req.nextUrl.toString();
  if (isSuspicious(url)) {
    return NextResponse.json({ error: "Requête invalide" }, { status: 400 });
  }

  // ── 4. Bloquer user-agents suspects ──────────────────────────────────────
  const ua = req.headers.get("user-agent") ?? "";
  const BLOCKED_UA = ["sqlmap", "nikto", "nessus", "masscan", "zgrab", "nuclei"];
  if (BLOCKED_UA.some((b) => ua.toLowerCase().includes(b))) {
    return new NextResponse(null, { status: 403 });
  }

  // ── 5. Bloquer méthodes HTTP non autorisées sur pages ────────────────────
  //     (on autorise les Server Actions Next.js : POST avec en-tête next-action)
  const isServerAction = !!req.headers.get("next-action");
  if (
    !pathname.startsWith("/api/") &&
    !isServerAction &&
    !["GET", "HEAD"].includes(req.method)
  ) {
    return new NextResponse(null, { status: 405 });
  }

  const response = NextResponse.next();

  // ── 6. Headers de sécurité additionnels ──────────────────────────────────
  response.headers.set("X-Request-ID", crypto.randomUUID());
  response.headers.delete("X-Powered-By");
  const noStore =
    pathname.startsWith("/api/") ||
    pathname.startsWith("/touba-infos/admin") ||
    isServerAction;
  response.headers.set(
    "Cache-Control",
    noStore ? "no-store" : "public, max-age=3600",
  );

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|images/).*)"],
};
