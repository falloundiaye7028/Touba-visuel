"use client";

import { useState, useRef, useEffect } from "react";

/* ── Types ─────────────────────────────────────────── */
interface Message {
  role: "bot" | "user";
  text: string;
  time: string;
}

/* ── Base de connaissances ──────────────────────────── */
const REPONSES: { patterns: string[]; reponse: string }[] = [
  {
    patterns: ["bonjour", "salut", "salam", "hello", "bonsoir", "assalam"],
    reponse: "Assalamu Alaikum ! 🌟 Je suis l'assistant IA de Touba Visuel. Je peux vous aider pour :\n\n• Nos services d'impression & communication\n• Les services marketing IA\n• Passer une commande\n• Suivre une commande\n• Tarifs et devis\n\nQue puis-je faire pour vous ?",
  },
  {
    patterns: ["prix", "tarif", "cout", "coût", "combien", "fcfa", "prix"],
    reponse: "Voici nos tarifs principaux 💰\n\n🖨️ Impression :\n• Flyers A5 (500 ex) → 15 000 F\n• Kakémono 60×160cm → 25 000 F\n• Banderoles 3m → 15 000 F\n• T-shirts personnalisés → 2 500 F/pièce\n\n🤖 Marketing IA :\n• Starter → 49 999 F/mois\n• Growth → 99 999 F/mois\n• Elite → 199 999 F/mois\n\nPour un devis précis → WhatsApp : 76 800 17 17",
  },
  {
    patterns: ["commande", "commander", "passer commande", "acheter"],
    reponse: "Pour passer votre commande 📦\n\n1️⃣ Allez sur notre page Commander\n2️⃣ Ou envoyez directement sur WhatsApp : +221 76 800 17 17\n3️⃣ Précisez : type de support, quantité, format\n\nNous acceptons :\n💳 Carte Visa/Mastercard\n📱 Wave · Orange Money\n🏠 Paiement à la livraison\n\nDélai : 48h express à Touba, 3-5j Sénégal",
  },
  {
    patterns: ["livraison", "délai", "delai", "quand", "recevoir"],
    reponse: "Nos délais de livraison 🚚\n\n• Touba : Express 24-48h\n• Dakar : 2-3 jours ouvrés\n• Autres villes : 3-5 jours ouvrés\n• International : 7-14 jours\n\nLivraison offerte pour toute commande > 50 000 F à Touba ! 🎁",
  },
  {
    patterns: ["ia", "intelligence artificielle", "marketing ia", "automatique", "automatisé", "chatbot"],
    reponse: "Nos services Marketing IA 🤖✨\n\n• ✍️ Création de contenu automatique (30+ posts/mois)\n• 📲 Gestion réseaux sociaux 24/7\n• 🎯 Publicités Meta & Google optimisées par IA\n• 🤖 Chatbot IA en Wolof + Français\n• 🎨 Visuels publicitaires générés par IA\n• 📊 Rapports et analyses automatiques\n\n👉 Voir la page complète : /services-ia\n\nVous voulez en savoir plus sur quel service ?",
  },
  {
    patterns: ["magal", "magal touba", "pack magal"],
    reponse: "Pack Magal Touba 2026 🕌\n\nLe Magal de Touba c'est le 2 août 2026 !\n\nNOTRE PACK COMPLET à 199 999 F :\n• 1 Banderole 3m×0,80m\n• 1 Kakémono 60×160cm\n• 50 Badges personnalisés\n• 50 T-shirts Magal\n• 1 Visuel réseaux sociaux\n• 100 Étiquettes bouteilles\n\n⏰ Commandez maintenant avant rupture de stock !\n👉 /magal ou WhatsApp : 76 800 17 17",
  },
  {
    patterns: ["tabaski", "aïd", "aid", "fête", "carte voeux"],
    reponse: "Carte de vœux Tabaski 🌙\n\nGénérez votre carte Tabaski personnalisée GRATUITEMENT !\n\n✅ Personnalisée avec votre nom de famille\n✅ Message personnalisé\n✅ Téléchargement PNG 1080×1080px\n✅ Partage direct WhatsApp/Instagram\n✅ 100% gratuit\n\n👉 Accédez au générateur : /tabaski",
  },
  {
    patterns: ["tshirt", "t-shirt", "textile", "vetement", "vêtement", "polo"],
    reponse: "Nos T-shirts & Textile personnalisés 👕\n\n• T-shirts impression → à partir de 2 500 F/pièce\n• Polos brodés → à partir de 3 500 F/pièce\n• Bonnets → à partir de 1 500 F/pièce\n• Casquettes → à partir de 2 000 F/pièce\n\n📦 Minimum : 10 pièces\n🎨 Votre logo, votre design ou on crée pour vous\n\nBesoin d'un devis ? → WhatsApp : 76 800 17 17",
  },
  {
    patterns: ["flyer", "affiche", "kakemono", "kakémono", "banderole", "impression"],
    reponse: "Nos supports imprimés 🖨️\n\n• Flyers A5 (500 ex) → 15 000 F\n• Affiches A3 → 8 000 F\n• Kakémono 60×160cm → 25 000 F\n• Banderole 3m×0,80m → 15 000 F\n• Roll-up → 35 000 F\n• Bâche publicitaire → sur devis\n\nTous nos supports sont en HD avec vos couleurs et logo !\n\nCommander → WhatsApp : 76 800 17 17",
  },
  {
    patterns: ["site web", "site internet", "développement web", "creation site", "wordpress"],
    reponse: "Création de sites web 💻\n\n• Site vitrine (5 pages) → à partir de 150 000 F\n• E-commerce → à partir de 350 000 F\n• Application web → sur devis\n• Maintenance → 15 000 F/mois\n\n⚡ Livré en 7-14 jours\n🎨 Design professionnel inclus\n📱 100% responsive mobile\n🔒 Hébergement + domaine inclus 1 an\n\nDemander un devis → WhatsApp : 76 800 17 17",
  },
  {
    patterns: ["logo", "identité", "charte graphique", "branding", "design"],
    reponse: "Branding & Design 🎨\n\n• Création de logo → à partir de 35 000 F\n• Charte graphique complète → à partir de 75 000 F\n• Cartes de visite (100 ex) → 15 000 F\n• Papier à en-tête → 10 000 F\n• Signature email → 8 000 F\n\nChaque design est unique, créé par nos graphistes + optimisé par l'IA !\n\n📩 Contactez-nous : WhatsApp 76 800 17 17",
  },
  {
    patterns: ["paiement", "wave", "orange money", "carte", "visa", "payer"],
    reponse: "Modes de paiement acceptés 💳\n\n• 💳 Carte Visa / Mastercard (via Stripe)\n• 📱 Wave\n• 🟠 Orange Money\n• 🏠 Paiement à la livraison (Touba uniquement)\n• 🏦 Virement bancaire\n\n100% sécurisé · Facture émise à chaque commande",
  },
  {
    patterns: ["contact", "telephone", "téléphone", "appeler", "numero", "numéro", "joindre"],
    reponse: "Nous contacter 📞\n\n📱 WhatsApp Business : +221 76 800 17 17\n📍 Adresse : Touba, Sénégal\n🌐 Site : touba-visuel.vercel.app\n\n⏰ Disponible 7j/7 de 8h à 22h\n🤖 Ce chatbot IA répond 24h/24 pour les questions courantes",
  },
  {
    patterns: ["touba", "touba ca kanam", "partenaire"],
    reponse: "Agence Touba Visuel (ATV) 🏛️\n\nNous sommes votre agence de communication complète à Touba !\n\nNos domaines :\n• Impression & Signalétique\n• Textile personnalisé\n• Communication digitale\n• Marketing IA autonome\n• Création de sites web\n• Photographie & Vidéo\n\nFiers partenaires de Touba Ca Kanam 🌟\n\nTouba · Dakar · Sénégal · International",
  },
  {
    patterns: ["merci", "ok", "d'accord", "parfait", "super", "excellent", "waaw"],
    reponse: "Avec plaisir ! 😊 Je suis toujours là si vous avez d'autres questions.\n\nN'hésitez pas à nous contacter directement :\n📱 WhatsApp : +221 76 800 17 17\n\nBonne journée ! ✨",
  },
];

const FALLBACK =
  "Je n'ai pas bien compris votre question 🤔\n\nJe peux vous aider avec :\n• Tarifs et devis\n• Commandes et livraison\n• Services Marketing IA\n• Nos produits (impression, textile, web...)\n\n📱 Pour une réponse personnalisée → WhatsApp : 76 800 17 17";

function trouverReponse(input: string): string {
  const lower = input.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  for (const item of REPONSES) {
    if (item.patterns.some((p) => lower.includes(p.normalize("NFD").replace(/[̀-ͯ]/g, "")))) {
      return item.reponse;
    }
  }
  return FALLBACK;
}

function now(): string {
  return new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" });
}

/* ── Composant ──────────────────────────────────────── */
export default function ChatbotIA() {
  const [ouvert, setOuvert] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "bot",
      text: "Assalamu Alaikum ! 🌟 Je suis l'assistant IA de **Touba Visuel**.\n\nJe peux vous aider pour nos services d'impression, marketing IA, commandes et bien plus. Posez-moi votre question !",
      time: now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [enTrain, setEnTrain] = useState(false);
  const [notif, setNotif] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (ouvert) setNotif(false);
  }, [ouvert]);

  function envoyer() {
    const texte = input.trim();
    if (!texte || enTrain) return;

    const userMsg: Message = { role: "user", text: texte, time: now() };
    setMessages((m) => [...m, userMsg]);
    setInput("");
    setEnTrain(true);

    // Simulation délai de frappe IA
    setTimeout(() => {
      const rep = trouverReponse(texte);
      setMessages((m) => [...m, { role: "bot", text: rep, time: now() }]);
      setEnTrain(false);
    }, 800 + Math.random() * 600);
  }

  const SUGGESTIONS = ["Vos tarifs", "Pack Magal", "Services IA", "Commander", "Livraison"];

  return (
    <>
      {/* Bouton flottant */}
      <button
        onClick={() => setOuvert(!ouvert)}
        className="fixed bottom-24 right-5 z-50 w-14 h-14 rounded-full shadow-2xl flex items-center justify-center text-2xl transition-all hover:scale-110"
        style={{
          background: "linear-gradient(135deg, #a855f7, #3b82f6)",
          boxShadow: "0 0 30px rgba(168,85,247,0.5)",
        }}
        aria-label="Chatbot IA"
      >
        {ouvert ? "✕" : "🤖"}
        {notif && !ouvert && (
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
            1
          </span>
        )}
      </button>

      {/* Fenêtre chat */}
      {ouvert && (
        <div
          className="fixed bottom-44 right-5 z-50 w-[340px] max-h-[560px] rounded-3xl overflow-hidden flex flex-col shadow-2xl border border-white/10"
          style={{
            background: "linear-gradient(180deg, #0f0a1f, #0a0a14)",
            boxShadow: "0 0 60px rgba(168,85,247,0.2)",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center gap-3 px-5 py-4"
            style={{ background: "linear-gradient(135deg, #a855f720, #3b82f620)" }}
          >
            <div className="w-10 h-10 rounded-full flex items-center justify-center text-xl"
              style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}>
              🤖
            </div>
            <div>
              <p className="text-white font-bold text-sm">Assistant IA · Touba Visuel</p>
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="text-green-400 text-xs font-medium">En ligne 24/7</span>
              </div>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ maxHeight: "340px" }}>
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed whitespace-pre-line ${
                    m.role === "user"
                      ? "text-white rounded-br-sm"
                      : "text-gray-200 rounded-bl-sm"
                  }`}
                  style={
                    m.role === "user"
                      ? { background: "linear-gradient(135deg, #a855f7, #3b82f6)" }
                      : { background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }
                  }
                >
                  {m.text}
                  <div className="text-xs opacity-40 mt-1 text-right">{m.time}</div>
                </div>
              </div>
            ))}

            {enTrain && (
              <div className="flex justify-start">
                <div className="px-4 py-3 rounded-2xl rounded-bl-sm text-sm"
                  style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.08)" }}>
                  <span className="flex gap-1 items-center">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: "0.2s" }} />
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: "0.4s" }} />
                  </span>
                </div>
              </div>
            )}
            <div ref={endRef} />
          </div>

          {/* Suggestions rapides */}
          {messages.length <= 2 && (
            <div className="px-4 pb-2 flex gap-2 overflow-x-auto scrollbar-hide">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  onClick={() => {
                    setInput(s);
                    setTimeout(() => envoyer(), 10);
                  }}
                  className="flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium text-purple-300 border border-purple-500/30 bg-purple-500/10 hover:bg-purple-500/20 transition-colors"
                >
                  {s}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-4 border-t border-white/5">
            <div className="flex gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && envoyer()}
                placeholder="Posez votre question..."
                className="flex-1 px-4 py-2.5 rounded-xl text-sm text-white placeholder-white/30 focus:outline-none border border-white/10 focus:border-purple-500/50 transition-colors"
                style={{ background: "rgba(255,255,255,0.05)" }}
              />
              <button
                onClick={envoyer}
                disabled={!input.trim() || enTrain}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-all hover:scale-110 disabled:opacity-40"
                style={{ background: "linear-gradient(135deg, #a855f7, #3b82f6)" }}
              >
                <svg width="16" height="16" fill="none" viewBox="0 0 24 24" stroke="white" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </div>
            <p className="text-center text-white/20 text-xs mt-2">
              IA Touba Visuel · Réponse instantanée
            </p>
          </div>
        </div>
      )}
    </>
  );
}
