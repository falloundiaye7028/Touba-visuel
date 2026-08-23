import { describe, expect, it } from "vitest";
import type { ArticleInfo } from "@/lib/touba-infos";
import type { ArticleInput } from "@/lib/touba-infos-store";
import {
  articleIdFromIdempotencyKey,
  createArticleDraft,
  getArticleStatus,
  isExplicitPublicationApproval,
  publishArticle,
  sanitizeArticleHtml,
  updateArticleDraft,
  type CreateArticleDraftInput,
  type PublisherRepository,
} from "@/lib/touba-infos-publisher";

class MemoryPublisherRepository implements PublisherRepository {
  readonly articles = new Map<string, ArticleInfo>();

  async listAll() {
    return [...this.articles.values()].map((article) => ({ ...article }));
  }

  async getById(id: string) {
    const article = this.articles.get(id);
    return article ? { ...article } : undefined;
  }

  async create(input: ArticleInput) {
    const article = input as ArticleInfo;
    this.articles.set(article.id, { ...article });
    return { ...article };
  }

  async update(id: string, patch: Partial<ArticleInfo>) {
    const current = this.articles.get(id);
    if (!current) return undefined;
    const updated = { ...current, ...patch, id };
    this.articles.set(id, updated);
    return { ...updated };
  }
}

function validDraft(
  overrides: Partial<CreateArticleDraftInput> = {},
): CreateArticleDraftInput {
  return {
    titre: "NAATAL TOUBA : Al Madine Ndam, un exemple à suivre",
    sousTitre: "Une initiative locale qui associe engagement et cadre de vie.",
    extrait:
      "À Al Madine Ndam, une mobilisation de proximité montre comment améliorer durablement le cadre de vie.",
    contenu:
      "<p>À Touba, les initiatives locales jouent un rôle essentiel dans l’amélioration du cadre de vie.</p><h2>Une mobilisation utile</h2><p>Le quartier agit avec méthode.</p>",
    categorie: "Touba",
    genre: "Reportage",
    auteur: "Ibrahima Mbacké Diop",
    tempsLecture: "3 min",
    tags: ["Touba", "Naatal Touba"],
    imageEmoji: "📰",
    imageGradient: "from-green-700 via-emerald-800 to-green-900",
    alaUne: false,
    breaking: false,
    epingle: false,
    idempotencyKey: "naatal-touba-al-madine-ndam-v1",
    ...overrides,
  };
}

describe("Touba Infos publisher service", () => {
  it("retire les scripts, événements et URL dangereuses du HTML", () => {
    const result = sanitizeArticleHtml(
      '<p onclick="steal()">Texte utile pour l’article.</p><script>alert(1)</script><a href="javascript:alert(1)">piège</a><a href="https://example.com/source">source</a><iframe src="https://evil.test"></iframe>',
    );

    expect(result.changed).toBe(true);
    expect(result.html).not.toContain("script");
    expect(result.html).not.toContain("onclick");
    expect(result.html).not.toContain("javascript:");
    expect(result.html).not.toContain("iframe");
    expect(result.html).toContain('href="https://example.com/source"');
    expect(result.html).toContain('rel="noopener noreferrer"');
  });

  it("crée un brouillon déterministe et ne duplique pas une relance", async () => {
    const repository = new MemoryPublisherRepository();
    const input = validDraft();

    const first = await createArticleDraft(input, repository);
    const replay = await createArticleDraft(input, repository);

    expect(first.articleId).toBe(
      articleIdFromIdempotencyKey(input.idempotencyKey),
    );
    expect(first.statut).toBe("brouillon");
    expect(first.idempotentReplay).toBe(false);
    expect(replay.idempotentReplay).toBe(true);
    expect(repository.articles.size).toBe(1);
  });

  it("refuse de réutiliser une clé d’idempotence pour un autre contenu", async () => {
    const repository = new MemoryPublisherRepository();
    const input = validDraft();
    await createArticleDraft(input, repository);

    await expect(
      createArticleDraft(
        { ...input, titre: "Un titre entièrement différent" },
        repository,
      ),
    ).rejects.toMatchObject({
      code: "IDEMPOTENCY_CONFLICT",
    });
  });

  it("détecte un slug déjà utilisé avec une autre clé", async () => {
    const repository = new MemoryPublisherRepository();
    await createArticleDraft(validDraft(), repository);

    await expect(
      createArticleDraft(
        validDraft({ idempotencyKey: "seconde-operation-unique" }),
        repository,
      ),
    ).rejects.toMatchObject({ code: "DUPLICATE_SLUG" });
  });

  it("met à jour le même brouillon", async () => {
    const repository = new MemoryPublisherRepository();
    const draft = await createArticleDraft(validDraft(), repository);
    const result = await updateArticleDraft(
      {
        articleId: draft.articleId,
        sousTitre: "Un chapô corrigé après relecture humaine.",
        tags: ["Touba", "Citoyenneté", "Touba"],
        idempotencyKey: "correction-chapo-tags-v1",
      },
      repository,
    );

    expect(result.articleId).toBe(draft.articleId);
    expect(result.changedFields).toEqual(["sousTitre", "tags"]);
    expect((await repository.getById(draft.articleId))?.tags).toEqual([
      "Touba",
      "Citoyenneté",
    ]);
  });

  it("refuse toute publication ambiguë et accepte la formule explicite", async () => {
    const repository = new MemoryPublisherRepository();
    const draft = await createArticleDraft(validDraft(), repository);

    expect(isExplicitPublicationApproval("Je valide la spécification")).toBe(false);
    expect(isExplicitPublicationApproval("Je valide et publie")).toBe(true);
    await expect(
      publishArticle(
        {
          articleId: draft.articleId,
          approved: true,
          confirmationText: "Je valide la spécification",
          idempotencyKey: "publication-naatal-v1",
        },
        repository,
      ),
    ).rejects.toMatchObject({ code: "APPROVAL_REQUIRED" });

    const published = await publishArticle(
      {
        articleId: draft.articleId,
        approved: true,
        confirmationText: "Je valide et publie",
        idempotencyKey: "publication-naatal-v1",
      },
      repository,
    );
    const replay = await publishArticle(
      {
        articleId: draft.articleId,
        approved: true,
        confirmationText: "Je valide et publie",
        idempotencyKey: "publication-naatal-v1",
      },
      repository,
    );

    expect(published.statut).toBe("publie");
    expect(published.publicUrl).toContain(
      "https://toubainfos.com/naatal-touba-al-madine-ndam-un-exemple-a-suivre",
    );
    expect(replay.idempotentReplay).toBe(true);
    expect((await getArticleStatus({ articleId: draft.articleId }, repository)).statut)
      .toBe("publie");
  });

  it("refuse de corriger un article déjà publié", async () => {
    const repository = new MemoryPublisherRepository();
    const draft = await createArticleDraft(validDraft(), repository);
    await publishArticle(
      {
        articleId: draft.articleId,
        approved: true,
        confirmationText: "Je valide et publie",
        idempotencyKey: "publication-naatal-v2",
      },
      repository,
    );

    await expect(
      updateArticleDraft(
        {
          articleId: draft.articleId,
          titre: "Titre modifié après publication",
          idempotencyKey: "modification-interdite-v1",
        },
        repository,
      ),
    ).rejects.toMatchObject({
      code: "ARTICLE_ALREADY_PUBLISHED",
    });
  });
});
