import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { Prisma } from "@prisma/client";

const mocks = vi.hoisted(() => ({
  count: vi.fn(), findMany: vi.fn(), findUnique: vi.fn(),
  update: vi.fn(), create: vi.fn(), readFile: vi.fn(),
  mkdir: vi.fn(), writeFile: vi.fn(),
}));
vi.mock("../db", () => ({ prisma: { infoArticle: mocks } }));
vi.mock("react", () => ({ cache: (fn: unknown) => fn }));
vi.mock("fs", () => ({ promises: mocks }));

const article = (id: string, slug: string) => ({
  id, slug, titre: "Titre", categorie: "Touba", auteur: "Rédaction",
  date: new Date("2026-09-13T21:48:00Z"), tags: [],
});
const conflict = (target: string[]) => new Prisma.PrismaClientKnownRequestError(
  "Unique constraint failed", { code: "P2002", clientVersion: "5", meta: { target } },
);

beforeEach(() => {
  vi.resetModules();
  vi.resetAllMocks();
  vi.stubEnv("DATABASE_URL", "postgresql://test.invalid/test");
  mocks.count.mockResolvedValue(2);
  mocks.findMany.mockResolvedValue([article("160", "original"), article("161", "deja-pris")]);
  mocks.findUnique.mockResolvedValue(null);
  mocks.readFile.mockResolvedValue(JSON.stringify([article("160", "original"), article("161", "deja-pris")]));
});
afterEach(() => vi.unstubAllEnvs());

describe("slugs des articles", () => {
  it("refuse un doublon après normalisation avant toute écriture", async () => {
    mocks.findUnique.mockResolvedValue({ id: "161" });
    const store = await import("../touba-infos-store");
    await expect(store.adminUpdate("160", { slug: "Déjà pris!" })).rejects.toBeInstanceOf(store.ArticleSlugError);
    expect(mocks.findUnique).toHaveBeenCalledWith({ where: { slug: "deja-pris" }, select: { id: true } });
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("autorise de conserver son propre slug", async () => {
    mocks.findUnique.mockResolvedValue({ id: "160" });
    const store = await import("../touba-infos-store");
    await expect(store.adminUpdate("160", { slug: "original" })).resolves.toMatchObject({ slug: "original" });
    expect(mocks.update).toHaveBeenCalledOnce();
  });
  it.each([undefined, "", "   "])("conserve le slug quand le champ est vide (%s)", async (slug) => {
    const store = await import("../touba-infos-store");
    await expect(store.adminUpdate("160", { slug })).resolves.toMatchObject({ slug: "original" });
  });
  it("refuse un slug devenu vide après normalisation", async () => {
    const store = await import("../touba-infos-store");
    await expect(store.adminUpdate("160", { slug: "!!!" })).rejects.toBeInstanceOf(store.ArticleSlugError);
    expect(mocks.update).not.toHaveBeenCalled();
  });
  it("traite un conflit concurrent lors de la modification", async () => {
    mocks.update.mockRejectedValue(conflict(["slug"]));
    const store = await import("../touba-infos-store");
    await expect(store.adminUpdate("160", { slug: "nouveau" })).rejects.toBeInstanceOf(store.ArticleSlugError);
  });
  it("traite aussi un conflit concurrent lors de la création", async () => {
    mocks.create.mockRejectedValue(conflict(["slug"]));
    const store = await import("../touba-infos-store");
    await expect(store.adminCreate({ titre: "Nouveau", categorie: "Touba", auteur: "Rédaction" })).rejects.toBeInstanceOf(store.ArticleSlugError);
  });
  it("ne masque pas les erreurs sur une autre contrainte", async () => {
    const error = conflict(["id"]);
    mocks.create.mockRejectedValue(error);
    const store = await import("../touba-infos-store");
    await expect(store.adminCreate({ titre: "Nouveau", categorie: "Touba", auteur: "Rédaction" })).rejects.toBe(error);
  });
  it("protège aussi le stockage fichier sans modifier les articles", async () => {
    vi.stubEnv("DATABASE_URL", "");
    const store = await import("../touba-infos-store");
    await expect(store.adminUpdate("160", { slug: "Déjà pris" })).rejects.toBeInstanceOf(store.ArticleSlugError);
    expect(mocks.writeFile).not.toHaveBeenCalled();
    await expect(store.adminGetById("160")).resolves.toMatchObject({ slug: "original" });
  });
});
