import { McpServer } from "@modelcontextprotocol/server";
import { z } from "zod";
import {
  PublisherError,
  createArticleDraft,
  createArticleDraftSchema,
  defaultPublisherRepository,
  getArticleStatus,
  getArticleStatusSchema,
  publishArticle,
  publishArticleSchema,
  updateArticleDraft,
  updateArticleDraftSchema,
  type PublisherRepository,
} from "./touba-infos-publisher";

const articleStatusSchema = z.enum(["brouillon", "programme", "publie"]);
const draftOutputSchema = z.object({
  articleId: z.string(),
  slug: z.string(),
  statut: articleStatusSchema,
  adminUrl: z.string().url(),
  warnings: z.array(z.string()),
  idempotentReplay: z.boolean(),
});
const updateOutputSchema = z.object({
  articleId: z.string(),
  slug: z.string(),
  statut: articleStatusSchema,
  adminUrl: z.string().url(),
  changedFields: z.array(z.string()),
  warnings: z.array(z.string()),
});
const publishOutputSchema = z.object({
  articleId: z.string(),
  slug: z.string(),
  statut: z.literal("publie"),
  publicUrl: z.string().url(),
  adminUrl: z.string().url(),
  idempotentReplay: z.boolean(),
});
const statusOutputSchema = z.object({
  articleId: z.string(),
  slug: z.string(),
  titre: z.string(),
  statut: articleStatusSchema,
  publicUrl: z.string().url().nullable(),
  adminUrl: z.string().url(),
  miseAJour: z.string().nullable(),
});

export interface ToubaInfosMcpServerOptions {
  repository?: PublisherRepository;
  actorId?: string;
  onMutation?: () => void | Promise<void>;
}

function errorResult(error: unknown) {
  const code = error instanceof PublisherError ? error.code : "INTERNAL_ERROR";
  const message =
    error instanceof PublisherError
      ? error.message
      : "L’opération n’a pas pu être exécutée. Consultez les journaux du serveur.";
  return {
    content: [{ type: "text" as const, text: `${code}: ${message}` }],
    isError: true as const,
  };
}

function logMutation(
  action: "create" | "update" | "publish",
  articleId: string,
  actorId?: string,
) {
  console.info("[touba-infos-publisher]", {
    action,
    articleId,
    actorId: actorId || "oauth-client",
    at: new Date().toISOString(),
  });
}

export function createToubaInfosMcpServer(
  options: ToubaInfosMcpServerOptions = {},
): McpServer {
  const repository = options.repository || defaultPublisherRepository;
  const server = new McpServer(
    { name: "touba-infos-publisher", version: "1.0.0" },
    {
      instructions:
        "Agent privé de publication Touba Infos. Créez toujours un brouillon avant publication. N’appelez publish_article que si l’utilisateur a explicitement demandé la publication dans la conversation en cours avec une formule telle que « Je valide et publie ». Ne publiez jamais sur simple approbation d’une spécification, d’un plan ou d’un texte. Aucun outil de suppression n’existe. Utilisez get_article_status pour vérifier l’état avant et après une écriture.",
    },
  );

  server.registerTool(
    "create_article_draft",
    {
      title: "Créer un brouillon Touba Infos",
      description:
        "Crée dans le CMS Touba Infos un brouillon privé à partir d’un article déjà relu. N’effectue aucune publication. Fournir une clé d’idempotence unique et stable pour éviter les doublons lors des relances.",
      inputSchema: createArticleDraftSchema,
      outputSchema: draftOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (input) => {
      try {
        const output = await createArticleDraft(input, repository);
        await options.onMutation?.();
        logMutation("create", output.articleId, options.actorId);
        return {
          content: [
            {
              type: "text",
              text: `Brouillon ${output.articleId} enregistré. Administration : ${output.adminUrl}`,
            },
          ],
          structuredContent: output,
        };
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "update_article_draft",
    {
      title: "Corriger un brouillon Touba Infos",
      description:
        "Modifie seulement les champs fournis d’un article encore en brouillon ou programmé. Refuse toute modification d’un article déjà publié. Fournir une clé d’idempotence stable pour la correction demandée.",
      inputSchema: updateArticleDraftSchema,
      outputSchema: updateOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (input) => {
      try {
        const output = await updateArticleDraft(input, repository);
        await options.onMutation?.();
        logMutation("update", output.articleId, options.actorId);
        return {
          content: [
            {
              type: "text",
              text: `Brouillon ${output.articleId} mis à jour : ${output.changedFields.join(", ")}.`,
            },
          ],
          structuredContent: output,
        };
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "publish_article",
    {
      title: "Publier un article Touba Infos",
      description:
        "Rend public un brouillon existant. À appeler uniquement si l’utilisateur vient de confirmer explicitement « Je valide et publie ». Une validation de spécification, de plan, de brouillon ou une formule ambiguë ne constitue jamais une autorisation de publier.",
      inputSchema: publishArticleSchema,
      outputSchema: publishOutputSchema,
      annotations: {
        readOnlyHint: false,
        destructiveHint: true,
        idempotentHint: true,
        openWorldHint: true,
      },
    },
    async (input) => {
      try {
        const output = await publishArticle(input, repository);
        await options.onMutation?.();
        logMutation("publish", output.articleId, options.actorId);
        return {
          content: [
            {
              type: "text",
              text: `Article publié : ${output.publicUrl}`,
            },
          ],
          structuredContent: output,
        };
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  server.registerTool(
    "get_article_status",
    {
      title: "Vérifier un article Touba Infos",
      description:
        "Consulte sans modification le titre, le statut et les liens d’un article Touba Infos à partir de son identifiant.",
      inputSchema: getArticleStatusSchema,
      outputSchema: statusOutputSchema,
      annotations: {
        readOnlyHint: true,
        destructiveHint: false,
        idempotentHint: true,
        openWorldHint: false,
      },
    },
    async (input) => {
      try {
        const output = await getArticleStatus(input, repository);
        return {
          content: [
            {
              type: "text",
              text: `${output.titre} — statut : ${output.statut}. Administration : ${output.adminUrl}${output.publicUrl ? ` — Public : ${output.publicUrl}` : ""}`,
            },
          ],
          structuredContent: output,
        };
      } catch (error) {
        return errorResult(error);
      }
    },
  );

  return server;
}
