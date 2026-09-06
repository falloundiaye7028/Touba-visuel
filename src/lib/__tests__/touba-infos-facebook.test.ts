import { afterEach, describe, expect, it, vi } from "vitest";
import type { ArticleInfo } from "@/lib/touba-infos";
import type { ArticleInput } from "@/lib/touba-infos-store";
import {
  shareArticleToFacebook,
  type FacebookShareResult,
} from "@/lib/touba-infos-facebook";
import type { PublisherRepository } from "@/lib/touba-infos-publisher";

const previousEnv = {
  pageId: process.env.FACEBOOK_PAGE_ID,
  token: process.env.FACEBOOK_PAGE_ACCESS_TOKEN,
  version: process.env.FACEBOOK_GRAPH_API_VERSION,
};

class MemoryRepository implements PublisherRepository {
  constructor(public article: ArticleInfo) {}
  async listAll() { return [{ ...this.article }]; }
  async getById(id: string) {
    return id === this.article.id ? { ...this.article } : undefined;
  }
  async create(input: ArticleInput) {
    this.article = input as ArticleInfo;
    return { ...this.article };
  }
  async update(id: string, patch: Partial<ArticleInfo>) {
    if (id !== this.article.id) return undefined;
    this.article = { ...this.article, ...patch };
    return { ...this.article };
  }
}

function publishedArticle(): ArticleInfo {
  return {
    id: "article-facebook-1",
    slug: "nouvel-article-touba",
    titre: "Un nouvel article publié à Touba",
    sousTitre: "",
    extrait: "Les informations essentielles de ce nouvel article Touba Infos.",
    categorie: "Touba",
    genre: "Actualité",
    statut: "publie",
    auteur: "Ibrahima Mbacké Diop",
    date: new Date().toISOString(),
    tempsLecture: "3 min",
    imageEmoji: "📰",
    imageGradient: "from-green-700 via-emerald-800 to-green-900",
    alaUne: false,
    breaking: false,
    epingle: false,
    vues: 0,
    tags: ["Touba"],
    contenu: "<p>Contenu publié.</p>",
  };
}

afterEach(() => {
  vi.unstubAllGlobals();
  if (previousEnv.pageId === undefined) delete process.env.FACEBOOK_PAGE_ID;
  else process.env.FACEBOOK_PAGE_ID = previousEnv.pageId;
  if (previousEnv.token === undefined) delete process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  else process.env.FACEBOOK_PAGE_ACCESS_TOKEN = previousEnv.token;
  if (previousEnv.version === undefined) delete process.env.FACEBOOK_GRAPH_API_VERSION;
  else process.env.FACEBOOK_GRAPH_API_VERSION = previousEnv.version;
});

describe("Touba Infos Facebook publisher", () => {
  it("n’appelle pas Meta lorsque la Page n’est pas configurée", async () => {
    delete process.env.FACEBOOK_PAGE_ID;
    delete process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
    delete process.env.FACEBOOK_GRAPH_API_VERSION;
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const result = await shareArticleToFacebook(
      publishedArticle(),
      new MemoryRepository(publishedArticle()),
    );

    expect(result).toEqual({ status: "not_configured" });
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("partage le bon lien une seule fois et mémorise le post Meta", async () => {
    process.env.FACEBOOK_PAGE_ID = "123456789";
    process.env.FACEBOOK_PAGE_ACCESS_TOKEN = "test-token-ne-jamais-logger";
    process.env.FACEBOOK_GRAPH_API_VERSION = "v99.0";
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ id: "123456789_987654321" }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }),
    );
    vi.stubGlobal("fetch", fetchMock);
    const repository = new MemoryRepository(publishedArticle());

    const first = await shareArticleToFacebook(repository.article, repository);
    const replay = await shareArticleToFacebook(repository.article, repository);

    expect(first).toEqual<FacebookShareResult>({
      status: "published",
      postId: "123456789_987654321",
    });
    expect(replay).toEqual<FacebookShareResult>({
      status: "already_published",
      postId: "123456789_987654321",
    });
    expect(fetchMock).toHaveBeenCalledTimes(1);
    const [, request] = fetchMock.mock.calls[0];
    expect(String(request.body)).toContain(
      encodeURIComponent(
        "https://toubainfos.com/touba-infos/nouvel-article-touba",
      ),
    );
    expect(repository.article.facebookSharedAt).toBeTruthy();
  });
});
