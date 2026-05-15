"use client";
import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  {
    q: "Comment passer une commande chez ATV ?",
    r: "C'est très simple : choisissez votre support dans le catalogue, cliquez sur « Commander », renseignez vos informations et fichiers, puis payez en ligne (Wave, Orange Money, carte) ou à la livraison. Vous recevez une confirmation immédiate et votre commande est traitée sous 24h à 48h.",
  },
  {
    q: "Quels sont les délais de livraison ?",
    r: "Pour Touba : livraison express 24h à 48h. Pour Dakar et les autres villes du Sénégal : 2 à 5 jours ouvrables. Pour l'international : 7 à 14 jours selon la destination. Des options express sont disponibles sur demande.",
  },
  {
    q: "Je n'ai pas de logo ni de fichier — vous pouvez créer le visuel ?",
    r: "Absolument ! Nos graphistes créent votre visuel de A à Z. Il vous suffit de nous expliquer votre idée, votre activité et vos couleurs préférées. La création graphique est incluse dans beaucoup de nos offres ou facturée séparément à partir de 4 999 F.",
  },
  {
    q: "Quels modes de paiement acceptez-vous ?",
    r: "Nous acceptons : Wave, Orange Money, Free Money, carte Visa/Mastercard via Stripe, et le paiement à la livraison pour les clients de Touba. Tout est sécurisé et vous recevez un reçu automatique.",
  },
  {
    q: "Faites-vous des remises pour les grandes quantités ?",
    r: "Oui ! Plus votre commande est importante, meilleur est le prix unitaire. Contactez-nous directement sur WhatsApp pour obtenir un devis personnalisé pour vos besoins en volume.",
  },
  {
    q: "Pouvez-vous créer un site web complet pour mon entreprise ?",
    r: "Oui, c'est l'une de nos spécialités ! Nous créons des sites vitrine, boutiques e-commerce, portfolios, et applications mobiles — de la conception à la mise en ligne. Délai : 7 à 30 jours selon la complexité. Devis gratuit sur WhatsApp.",
  },
  {
    q: "Est-ce qu'ATV travaille en dehors de Touba ?",
    r: "Oui ! Nous servons des clients à Dakar, Thiès, Diourbel, Saint-Louis, et partout au Sénégal. Nous travaillons aussi avec des clients internationaux (diaspora sénégalaise, entreprises africaines). La livraison et la communication se font à distance via WhatsApp.",
  },
  {
    q: "Comment se passe une campagne de communication terrain ?",
    r: "Nous prenons en charge toute la stratégie : conception des visuels, impression des supports, animation terrain, captation photo/vidéo et rapport de performance. C'est ce que nous avons fait pour Orange Money lors du Magal de Touba 2025. Contactez-nous pour un devis sur mesure.",
  },
];

export default function FAQ() {
  const [ouvert, setOuvert] = useState<number | null>(0);

  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.4em] mb-3 text-vert-600">
            Questions fréquentes
          </p>
          <h2 className="section-title mb-2">Vous avez des questions ?</h2>
          <p className="section-subtitle">Tout ce que vous devez savoir avant de commander</p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, i) => (
            <div key={i}
              className="border border-gray-100 rounded-2xl overflow-hidden transition-all duration-200 hover:border-vert-200"
              style={{ background: ouvert === i ? "rgba(10,99,66,0.03)" : "white" }}>
              <button
                onClick={() => setOuvert(ouvert === i ? null : i)}
                className="w-full flex items-center justify-between px-6 py-4 text-left gap-4"
              >
                <p className="font-bold text-gray-900 text-sm md:text-base">{faq.q}</p>
                <ChevronDown
                  size={18}
                  className="flex-shrink-0 text-vert-600 transition-transform duration-300"
                  style={{ transform: ouvert === i ? "rotate(180deg)" : "rotate(0deg)" }}
                />
              </button>
              {ouvert === i && (
                <div className="px-6 pb-5">
                  <p className="text-gray-600 text-sm leading-relaxed">{faq.r}</p>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-10 text-center p-6 rounded-2xl"
          style={{ background: "linear-gradient(135deg, rgba(10,99,66,0.05), rgba(255,200,0,0.05))" }}>
          <p className="text-gray-700 font-semibold mb-3">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <a href="https://wa.me/221778001717?text=Bonjour%20ATV%2C%20j%27ai%20une%20question."
            target="_blank" rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-white font-bold px-6 py-3 rounded-xl text-sm shadow-lg transition-all hover:opacity-90"
            style={{ background: "linear-gradient(135deg, #25D366, #128C7E)" }}>
            💬 Posez votre question sur WhatsApp
          </a>
        </div>
      </div>
    </section>
  );
}
