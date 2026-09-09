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
  const host = (req.headers.get("host") || "").toLowerCase().split(":")[0];

  // ── 0. Domaines dédiés ────────────────────────────────────────────────────
  // www → domaine nu pour SAMA PILOT
  if (host === "www.samapilot.com") {
    const cleanPath = pathname.startsWith("/sama")
      ? pathname.slice(5) || "/"
      : pathname;
    const dest = new URL(cleanPath + req.nextUrl.search, "https://samapilot.com");
    return NextResponse.redirect(dest, 308);
  }

  // SAMA PILOT à la racine de samapilot.com, avec URL publique sans /sama.
  if (host === "samapilot.com") {
    // Anciennes URLs /sama restent compatibles mais sont canonisées vers l'URL propre.
    if (pathname === "/sama" || pathname.startsWith("/sama/")) {
      const cleanPath = pathname.slice(5) || "/";
      const dest = new URL(cleanPath + req.nextUrl.search, "https://samapilot.com");
      return NextResponse.redirect(dest, 308);
    }

    const p = pathname;
    const passthrough =
      p.startsWith("/api") ||
      p.startsWith("/.well-known") ||
      p.startsWith("/_next") ||
      p.startsWith("/images") ||
      p.startsWith("/splash") ||
      p === "/robots.txt" ||
      p === "/sitemap.xml" ||
      p === "/sama-manifest.webmanifest" ||
      p === "/sama-sw.js" ||
      p === "/manifest.json" ||
      /\.[a-zA-Z0-9]+$/.test(p);

    if (!passthrough) {
      const target = p === "/" ? "/sama" : `/sama${p}`;
      const url = req.nextUrl.clone();
      url.pathname = target;
      const rewriteHeaders = new Headers(req.headers);
      rewriteHeaders.set("x-pathname", target);
      return NextResponse.rewrite(url, { request: { headers: rewriteHeaders } });
    }
  }

  // Touba Infos : média à la racine
  if (host === "www.toubainfos.com") {
    const dest = new URL(
      req.nextUrl.pathname + req.nextUrl.search,
      "https://toubainfos.com",
    );
    return NextResponse.redirect(dest, 308);
  }
  if (host === "toubainfos.com") {
    const p = pathname;
    const passthrough =
      p.startsWith("/touba-infos") ||
      p.startsWith("/api") ||
      p.startsWith("/.well-known") ||
      p.startsWith("/_next") ||
      p.startsWith("/images") ||
      p.startsWith("/splash") ||
      p === "/robots.txt" ||
      p === "/sitemap.xml" ||
      p === "/manifest.json" ||
      p === "/sw.js" ||
      /\.[a-zA-Z0-9]+$/.test(p);
    if (!passthrough) {
      const target = p === "/" ? "/touba-infos" : `/touba-infos${p}`;
      const url = req.nextUrl.clone();
      url.pathname = target;
      // Transmet le chemin réécrit au layout serveur (habillage média).
      const rewriteHeaders = new Headers(req.headers);
      rewriteHeaders.set("x-pathname", target);
      return NextResponse.rewrite(url, { request: { headers: rewriteHeaders } });
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
  //     (on autorise les Server Actions Next.js et l'app SAMA : POST)
  const isServerAction = !!req.headers.get("next-action");
  const isSamaApp = pathname.startsWith("/sama") || host === "samapilot.com";
  if (
    !pathname.startsWith("/api/") &&
    !isServerAction &&
    !isSamaApp &&
    !["GET", "HEAD"].includes(req.method)
  ) {
    return new NextResponse(null, { status: 405 });
  }

  // Transmet le chemin courant aux composants serveur (chrome conditionnel).
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set("x-pathname", pathname);
  const response = NextResponse.next({ request: { headers: requestHeaders } });

  // ── 6. Headers de sécurité additionnels ──────────────────────────────────
  response.headers.set("X-Request-ID", crypto.randomUUID());
  response.headers.delete("X-Powered-By");
  const noStore =
    pathname.startsWith("/api/") ||
    pathname.startsWith("/touba-infos/admin") ||
    isSamaApp ||
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
