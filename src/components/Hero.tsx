import Link from "next/link";
import { ArrowRight, Check, CirclePlay, Sparkles, Star } from "lucide-react";

const services = [
  "Identité visuelle",
  "Impression grand format",
  "Sites web sur mesure",
  "Marketing digital",
];

const stats = [
  { chiffre: "500+", label: "marques accompagnées" },
  { chiffre: "48h", label: "pour vos projets express" },
  { chiffre: "4.9/5", label: "satisfaction client" },
];

export default function Hero() {
  return (
    <section className="relative isolate overflow-hidden bg-[#052d1f] text-white">
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_83%_18%,rgba(255,190,35,0.2),transparent_24%),radial-gradient(circle_at_10%_80%,rgba(34,197,94,0.18),transparent_30%),linear-gradient(125deg,#031d14_8%,#075536_54%,#063525_100%)]" />
      <div className="absolute inset-0 -z-10 opacity-[0.15] [background-image:linear-gradient(rgba(255,255,255,.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,.2)_1px,transparent_1px)] [background-size:72px_72px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
      <div className="absolute right-[8%] top-24 -z-10 h-72 w-72 rounded-full border border-white/10 bg-white/[0.03]" />
      <div className="absolute right-[15%] top-40 -z-10 h-48 w-48 rounded-full border border-or-400/20" />

      <div className="mx-auto grid min-h-[min(780px,calc(100vh-64px))] max-w-7xl items-center gap-14 px-4 pb-20 pt-28 lg:grid-cols-[1.05fr_.95fr] lg:px-8 lg:pt-20">
        <div className="max-w-2xl">
          <div className="mb-7 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2 text-xs font-bold uppercase tracking-[0.16em] text-or-300 shadow-lg backdrop-blur">
            <Sparkles size={14} />
            Agence créative à Touba
          </div>

          <h1 className="font-black leading-[0.94] tracking-[-0.055em] text-white" style={{ fontSize: "clamp(3.25rem, 7vw, 6.5rem)", fontFamily: "var(--font-display)" }}>
            Votre image,
            <span className="block text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,.72)]">en grand.</span>
          </h1>

          <p className="mt-7 max-w-xl text-lg leading-relaxed text-vert-100/80 md:text-xl">
            Nous créons des identités fortes, des supports qui attirent le regard et des expériences digitales qui font avancer votre marque.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            {services.map((service) => (
              <span key={service} className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/10 px-3 py-2 text-sm text-white/80">
                <Check size={14} className="text-or-300" />
                {service}
              </span>
            ))}
          </div>

          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/commande" className="group inline-flex items-center justify-center gap-3 rounded-2xl bg-or-400 px-7 py-4 font-bold text-vert-950 shadow-[0_18px_40px_rgba(255,200,0,.2)] transition hover:-translate-y-0.5 hover:bg-or-300">
              Lancer mon projet
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </Link>
            <a href="https://wa.me/221768001717" target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center gap-3 rounded-2xl border border-white/20 bg-white/[0.06] px-7 py-4 font-semibold text-white backdrop-blur transition hover:bg-white/[0.13]">
              Demander un devis
              <CirclePlay size={18} className="text-or-300" />
            </a>
          </div>

          <div className="mt-12 flex flex-wrap items-center gap-x-7 gap-y-4">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="font-black text-2xl text-or-300" style={{ fontFamily: "var(--font-display)" }}>{stat.chiffre}</p>
                <p className="mt-1 text-xs text-white/55">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg lg:max-w-none">
          <div className="absolute -inset-5 -z-10 rounded-[2.25rem] bg-or-400/15 blur-3xl" />
          <div className="relative overflow-hidden rounded-[2rem] border border-white/15 bg-white/[0.09] p-4 shadow-2xl backdrop-blur-xl sm:p-5">
            <div className="rounded-[1.5rem] bg-[#f7f7f2] p-5 text-gray-900 sm:p-7">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-vert-900 text-sm font-black text-or-300">ATV</div>
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-[0.16em] text-vert-700">Touba Visuel</p>
                    <p className="text-sm text-gray-500">Direction artistique</p>
                  </div>
                </div>
                <span className="rounded-full bg-vert-100 px-3 py-1 text-xs font-bold text-vert-700">Disponible</span>
              </div>

              <div className="mt-8 rounded-[1.35rem] bg-vert-950 p-6 text-white sm:p-8">
                <p className="text-xs font-bold uppercase tracking-[0.2em] text-or-300">Projet à la une</p>
                <h2 className="mt-3 text-3xl font-black leading-tight" style={{ fontFamily: "var(--font-display)" }}>Une présence qui ne passe pas inaperçue.</h2>
                <div className="mt-8 grid grid-cols-3 gap-3">
                  {[
                    ["01", "Stratégie"],
                    ["02", "Création"],
                    ["03", "Impact"],
                  ].map(([number, label]) => (
                    <div key={number} className="rounded-xl border border-white/10 bg-white/[0.06] p-3">
                      <p className="text-lg font-black text-or-300">{number}</p>
                      <p className="mt-4 text-xs text-white/60">{label}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-5 flex items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex -space-x-2">
                  {["#f7c300", "#1d9c68", "#0a6342"].map((color) => <span key={color} className="h-8 w-8 rounded-full border-2 border-white" style={{ background: color }} />)}
                </div>
                <div className="flex items-center gap-1 text-sm font-bold text-vert-800"><Star size={15} className="fill-or-400 text-or-400" /> 4.9 — recommandé</div>
              </div>
            </div>
          </div>
          <div className="absolute -bottom-6 -left-5 hidden rounded-2xl border border-white/15 bg-vert-950/90 px-5 py-4 shadow-xl backdrop-blur sm:block">
            <p className="text-xs text-white/55">Devis personnalisé</p>
            <p className="mt-1 text-sm font-bold text-white">Réponse sous 24h</p>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-10 bg-white [clip-path:polygon(0_70%,20%_20%,45%_70%,70%_25%,100%_65%,100%_100%,0_100%)]" />
    </section>
  );
}
