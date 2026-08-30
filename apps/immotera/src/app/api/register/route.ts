import { hash } from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const schema = z.object({
  name: z.string().min(2).max(100),
  email: z.string().email(),
  password: z.string().min(10).regex(/[A-Z]/).regex(/[0-9]/),
});

export async function POST(request: Request) {
  const parsed = schema.safeParse(await request.json());
  if (!parsed.success) return Response.json({ error: "Données invalides", details: parsed.error.flatten() }, { status: 400 });
  if (!process.env.DATABASE_URL) return Response.json({ ok: true, demo: true }, { status: 201 });

  const email = parsed.data.email.toLowerCase();
  if (await db.user.findUnique({ where: { email } })) return Response.json({ error: "Cette adresse est déjà utilisée" }, { status: 409 });
  const user = await db.user.create({ data: { name: parsed.data.name, email, passwordHash: await hash(parsed.data.password, 12) }, select: { id: true, email: true } });
  return Response.json({ user }, { status: 201 });
}
