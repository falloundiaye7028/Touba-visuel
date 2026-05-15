import Image from "next/image";
import { Quote } from "lucide-react";

export default function MotDirecteur() {
  return (
    <section className="py-20 bg-gray-950 overflow-hidden relative">
      {/* Orbes décoratifs */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: "rgba(255,180,0,0.08)" }} />
        <div className="absolute bottom-0 left-0 w-80 h-80 rounded-full blur-[100px]"
          style={{ background: "rgba(10,99,66,0.15)" }} />
      </div>

      <div className="relative max-w-6xl mx-auto px-4">
        {/* Label */}
        <div className="flex justify-center mb-12">
          <div className="flex items-center gap-3 border rounded-full px-5 py-2"
            style={{ borderColor: "rgba(255,180,0,0.3)", background: "rgba(255,180,0,0.05)" }}>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ffc800" }} />
            <span className="text-xs font-bold uppercase tracking-[0.4em]"
              style={{ color: "#ffc800" }}>
              Mot du Fondateur
            </span>
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: "#ffc800" }} />
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 items-center">

          {/* Photo */}
          <div className="flex justify-center lg:justify-end order-2 lg:order-1">
            <div className="relative">
              {/* Cadre décoratif */}
              <div className="absolute -inset-3 rounded-3xl opacity-30"
                style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a, #0a6342)" }} />
              <div className="absolute -inset-1.5 rounded-3xl opacity-20 blur-sm"
                style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }} />

              {/* Photo */}
              <div className="relative w-72 h-96 md:w-80 md:h-[440px] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src="/images/directeur.jpg"
                  alt="Mamadou Falilou Ndiaye — Fondateur Agence Touba Visuel"
                  fill
                  className="object-cover object-top"
                  sizes="(max-width: 768px) 288px, 320px"
                />
                {/* Gradient bas */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Badge nom */}
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="rounded-xl px-4 py-3 backdrop-blur-md"
                    style={{ background: "rgba(0,0,0,0.65)", border: "1px solid rgba(255,200,0,0.3)" }}>
                    <p className="text-white font-black text-sm leading-tight">
                      Mamadou Falilou Ndiaye
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "#ffc800" }}>
                      Fondateur & Directeur Général
                    </p>
                    <p className="text-white/50 text-[10px] mt-0.5 tracking-wider uppercase">
                      Agence Touba Visuel — ATV
                    </p>
                  </div>
                </div>
              </div>

              {/* Badge Touba Ca Kanam */}
              <div className="absolute -top-3 -right-3 rounded-full px-3 py-1.5 shadow-lg"
                style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)" }}>
                <p className="text-gray-900 font-black text-[10px] uppercase tracking-wider whitespace-nowrap">
                  Touba Ca Kanam
                </p>
              </div>
            </div>
          </div>

          {/* Citation */}
          <div className="order-1 lg:order-2">
            <Quote size={48} className="mb-6 opacity-20" style={{ color: "#ffc800" }} />

            <blockquote className="space-y-4 mb-8">
              <p className="text-white text-xl md:text-2xl font-bold leading-relaxed">
                "L&apos;image est le premier langage que le monde comprend.
                <span style={{ color: "#ffc800" }}> Chez ATV, nous ne créons pas simplement des visuels</span> —
                nous donnons une voix puissante à chaque marque, chaque projet, chaque rêve."
              </p>
              <p className="text-gray-400 text-base leading-relaxed">
                Depuis la fondation de l&apos;Agence Touba Visuel, notre mission est claire :
                offrir à chaque client — entrepreneur, institution ou organisation —
                des supports de communication à la hauteur de leurs ambitions.
                La qualité, la créativité et la rapidité sont nos engagements quotidiens.
              </p>
              <p className="text-gray-400 text-base leading-relaxed">
                Touba Ca Kanam — allons de l&apos;avant ensemble.
              </p>
            </blockquote>

            {/* Signature */}
            <div className="flex items-center gap-4 pt-6"
              style={{ borderTop: "1px solid rgba(255,255,255,0.08)" }}>
              <div className="w-12 h-12 rounded-full overflow-hidden relative flex-shrink-0">
                <Image
                  src="/images/directeur.jpg"
                  alt="Signature"
                  fill
                  className="object-cover object-top"
                  sizes="48px"
                />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Mamadou Falilou Ndiaye</p>
                <p className="text-xs" style={{ color: "#ffc800" }}>
                  Fondateur — Agence Touba Visuel (ATV)
                </p>
              </div>

              {/* Ligne décorative */}
              <div className="flex-1 h-px ml-4"
                style={{ background: "linear-gradient(90deg, rgba(255,200,0,0.4), transparent)" }} />
            </div>

            {/* Stats rapides */}
            <div className="grid grid-cols-3 gap-4 mt-8">
              {[
                { val: "500+", label: "Clients" },
                { val: "8+",   label: "Ans d'expérience" },
                { val: "100%", label: "Satisfaction" },
              ].map((s) => (
                <div key={s.label} className="text-center rounded-xl py-3 px-2"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <p className="font-black text-lg"
                    style={{ background: "linear-gradient(135deg, #ffc800, #ff7a2a)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text" }}>
                    {s.val}
                  </p>
                  <p className="text-white/40 text-[10px] uppercase tracking-wider">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
