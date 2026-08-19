/**
 * Configuration NextAuth pour SAMA BUSINESS.
 * Stratégie JWT + Credentials (email/téléphone + mot de passe, bcrypt).
 * Le modèle User existant est réutilisé (partagé avec la plateforme).
 */
import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/db";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt", maxAge: 30 * 24 * 60 * 60 },
  pages: {
    signIn: "/sama/connexion",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        identifiant: { label: "Email ou téléphone", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.identifiant || !credentials?.password) return null;
        const id = credentials.identifiant.trim().toLowerCase();

        const user = await prisma.user.findFirst({
          where: {
            OR: [{ email: id }, { phone: credentials.identifiant.trim() }],
          },
        });
        if (!user || !user.password) return null;

        const ok = await bcrypt.compare(credentials.password, user.password);
        if (!ok) return null;

        return { id: user.id, name: user.name, email: user.email };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) token.uid = user.id;
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.uid) {
        (session.user as { id?: string }).id = token.uid as string;
      }
      return session;
    },
  },
  secret: process.env.NEXTAUTH_SECRET || "sama-business-dev-secret-change-me",
};

/** Hash un mot de passe en clair. */
export async function hashPassword(plain: string): Promise<string> {
  return bcrypt.hash(plain, 12);
}
