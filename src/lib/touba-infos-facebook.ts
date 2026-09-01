import type { ArticleInfo } from "./touba-infos";
import { genererDiffusion, urlArticle } from "./touba-infos-diffusion";
import {
  defaultPublisherRepository,
  type PublisherRepository,
} from "./touba-infos-publisher";

export type FacebookShareResult =
  | { status: "published"; postId: string }
  | { status: "already_published"; postId: string }
  | { status: "not_configured" };

export class FacebookShareError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "FacebookShareError";
  }
}

function facebookConfig() {
  const pageId = process.env.FACEBOOK_PAGE_ID?.trim();
  const accessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN?.trim();
  const version = process.env.FACEBOOK_GRAPH_API_VERSION?.trim();
  if (!pageId || !accessToken || !version) return null;
  if (!/^v\d+\.\d+$/.test(version)) {
    throw new FacebookShareError(
      "FACEBOOK_GRAPH_API_VERSION doit respecter le format vXX.X.",
    );
  }
  return { pageId, accessToken, version };
}

export async function shareArticleToFacebook(
  article: ArticleInfo,
  repository: PublisherRepository = defaultPublisherRepository,
): Promise<FacebookShareResult> {
  if ((article.statut ?? "publie") !== "publie") {
    throw new FacebookShareError(
      "Seul un article déjà publié peut être diffusé sur Facebook.",
    );
  }
  if (article.facebookPostId) {
    return { status: "already_published", postId: article.facebookPostId };
  }

  const config = facebookConfig();
  if (!config) return { status: "not_configured" };

  const body = new URLSearchParams({
    message: genererDiffusion(article).facebook,
    link: urlArticle(article.slug),
  });
  const response = await fetch(
    `https://graph.facebook.com/${config.version}/${encodeURIComponent(config.pageId)}/feed`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body,
      signal: AbortSignal.timeout(15_000),
    },
  );
  const payload = (await response.json().catch(() => null)) as
    | { id?: string; error?: { message?: string } }
    | null;
  if (!response.ok || !payload?.id) {
    throw new FacebookShareError(
      payload?.error?.message || `Meta a refusé la publication (${response.status}).`,
    );
  }

  await repository.update(article.id, {
    facebookPostId: payload.id,
    facebookSharedAt: new Date().toISOString(),
  });
  return { status: "published", postId: payload.id };
}

export async function sharePublishedArticleById(
  articleId: string,
  repository: PublisherRepository = defaultPublisherRepository,
): Promise<FacebookShareResult> {
  const article = await repository.getById(articleId);
  if (!article) throw new FacebookShareError("Article introuvable.");
  return shareArticleToFacebook(article, repository);
}
