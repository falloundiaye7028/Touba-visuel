import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { compare } from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";

const credentialsSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 60 * 60 * 12 },
  pages: { signIn: "/login" },
  providers: [
    CredentialsProvider({
      name: "Email et mot de passe",
      credentials: { email: { label: "Email", type: "email" }, password: { label: "Mot de passe", type: "password" } },
      async authorize(rawCredentials) {
        const parsed = credentialsSchema.safeParse(rawCredentials);
        if (!parsed.success) return null;

        if (!process.env.DATABASE_URL && parsed.data.email === "demo@immotera.sn" && parsed.data.password === "Demo2026!") {
          return { id: "00000000-0000-4000-8000-000000000001", email: parsed.data.email, name: "Mamadou Kane" };
        }

        const user = await db.user.findUnique({ where: { email: parsed.data.email.toLowerCase() } });
        if (!user?.passwordHash || !(await compare(parsed.data.password, user.passwordHash))) return null;
        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.userId = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user) session.user.id = String(token.userId ?? token.sub ?? "");
      return session;
    },
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === "production" ? "__Secure-immotera.session-token" : "immotera.session-token",
      options: { httpOnly: true, sameSite: "lax", path: "/", secure: process.env.NODE_ENV === "production" },
    },
  },
};
