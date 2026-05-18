import { NextRequest, NextResponse } from "next/server";

export const runtime = "edge";

export async function POST(req: NextRequest) {
  try {
    const { entreprise, secteur, produit, plateforme, ton, objectif, langue } = await req.json();

    const systemPrompt = `Tu es un expert en marketing digital et community management pour les entreprises sénégalaises et africaines. Tu maîtrises parfaitement le marché sénégalais, la culture mouride, les habitudes des consommateurs de Touba, Dakar et du Sénégal entier. Tu crées des posts viraux, accrocheurs, qui vendent vraiment.`;

    const userPrompt = `Crée 3 posts différents et uniques pour ${plateforme} pour cette entreprise :

Entreprise : ${entreprise || "une entreprise sénégalaise"}
Secteur : ${secteur || "Commerce général"}
Produit/Service : ${produit}
Ton : ${ton}
Objectif : ${objectif || "Attirer des clients et vendre"}
Langue : ${langue || "Français (tu peux ajouter quelques mots en Wolof pour l'authenticité)"}

Règles importantes :
- Chaque post doit être DIFFÉRENT en style et approche
- Utilise des emojis pertinents et percutants
- Ajoute des hashtags adaptés au marché sénégalais (#Sénégal #Touba #Dakar etc.)
- Inclus un appel à l'action clair (WhatsApp, commande, visite, etc.)
- Adapte la longueur à ${plateforme} (Instagram/Facebook = 150-300 mots, WhatsApp = court et direct, Twitter = max 280 car.)
- Varie les accroches : question, chiffre, émotion, offre, témoignage imaginé
- Quelques mots en Wolof si pertinent (ex: "Sunu boutique", "Dëggël ci", "Waaw waaw")

Réponds UNIQUEMENT avec ce format JSON (rien d'autre avant ou après) :
{
  "posts": [
    {"titre": "Accroche courte du post 1", "contenu": "Texte complet du post 1 avec emojis et hashtags"},
    {"titre": "Accroche courte du post 2", "contenu": "Texte complet du post 2 avec emojis et hashtags"},
    {"titre": "Accroche courte du post 3", "contenu": "Texte complet du post 3 avec emojis et hashtags"}
  ]
}`;

    const response = await fetch("https://text.pollinations.ai/openai", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "openai",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        temperature: 0.9,
        max_tokens: 2000,
      }),
    });

    if (!response.ok) {
      throw new Error(`Pollinations error: ${response.status}`);
    }

    const data = await response.json();
    const text = data.choices?.[0]?.message?.content ?? "";

    // Extraire le JSON de la réponse
    const match = text.match(/\{[\s\S]*\}/);
    if (!match) throw new Error("Invalid AI response format");

    const parsed = JSON.parse(match[0]);

    return NextResponse.json({ posts: parsed.posts });
  } catch (err) {
    console.error("generate-post error:", err);
    return NextResponse.json({ error: "Génération échouée. Réessayez." }, { status: 500 });
  }
}
