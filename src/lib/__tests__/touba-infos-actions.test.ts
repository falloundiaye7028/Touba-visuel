import { beforeEach, describe, expect, it, vi } from "vitest";
const mocks = vi.hoisted(() => ({ create: vi.fn(), update: vi.fn(), revalidate: vi.fn(), redirect: vi.fn() }));
vi.mock("next/headers", () => ({ cookies: vi.fn() }));
vi.mock("next/navigation", () => ({ redirect: mocks.redirect }));
vi.mock("next/cache", () => ({ revalidatePath: mocks.revalidate }));
vi.mock("../touba-infos-admin", () => ({ isAuthed: vi.fn().mockResolvedValue(true) }));
vi.mock("../touba-infos-store", () => ({
  ArticleSlugError: class extends Error {}, adminCreate: mocks.create, adminUpdate: mocks.update,
}));
import { ArticleSlugError } from "../touba-infos-store";
import { createArticleAction, updateArticleAction } from "@/app/touba-infos/admin/actions";
beforeEach(() => vi.clearAllMocks());
describe("retour des erreurs de slug au formulaire", () => {
  it.each(["create", "update"] as const)("renvoie un message sans redirection ni invalidation (%s)", async (operation) => {
    mocks[operation].mockRejectedValue(new ArticleSlugError("Slug déjà utilisé"));
    const data = new FormData();
    data.set("titre", "Titre");
    const result = operation === "create" ? await createArticleAction(data) : await updateArticleAction("160", data);
    expect(result).toEqual({ error: "Slug déjà utilisé" });
    expect(mocks.redirect).not.toHaveBeenCalled();
    expect(mocks.revalidate).not.toHaveBeenCalled();
  });
});
