import { recordRentPayment } from "@/lib/services/payments";
import { checkRateLimit } from "@/lib/rate-limit";

export async function POST(request: Request) {
  const client = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "local";
  if (!checkRateLimit(`payments:${client}`, 10).allowed) return Response.json({ error: "Trop de requêtes" }, { status: 429 });
  try { return Response.json(await recordRentPayment(await request.json()), { status: 201 }); }
  catch (cause) {
    const message = cause instanceof Error ? cause.message : "PAYMENT_FAILED";
    const status = message === "UNAUTHORIZED" ? 401 : message === "FORBIDDEN" ? 403 : 400;
    return Response.json({ error: message }, { status });
  }
}
