import Link from "next/link";
import { ArrowRight, Bell, BookOpen, MapPin, Send, ShieldCheck } from "lucide-react";
import { CATEGORIES_INFO, slugCategorie } from "@/lib/touba-infos";

export const metadata = {
  title: { absolute: "Touba Infos — Un nouveau regard sur l’information" },
  alternates: { canonical: "/" },
};

const ENGAGEMENTS = [
  { Icon: ShieldCheck, title: "Information vérifiée", text: "Une publication responsable, claire et accessible." },
  { Icon: MapPin, title: "Ancrée à Touba", text: "Les sujets locaux au cœur d’une lecture ouverte sur le monde." },
  { Icon: BookOpen, title: "Formats utiles", text: "Actualités, dossiers, repères et explications pour comprendre." },
];

export default function ToubaInfosHome() {
  return (
    <main>
      <section className="overflow-hidden bg-neutral-950 text-white">
        <div className="relative mx-auto max-w-7xl px-4 py-20 sm:py-28">
          <div className="absolute -right-24 -top-20 h-80 w-80 rounded-full bg-green-500/20 blur-3xl" />
          <div className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-amber-400/10 blur-3xl" />
          <div className="relative max-w-3xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] text-green-300">
              Une nouvelle rédaction se prépare
            </p>
            <h1 className="mt-7 text-4xl font-black leading-[1.02] tracking-tight sm:text-6xl">
              L’information utile, au cœur de Touba.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-neutral-300 sm:text-xl">
              Touba Infos évolue avec une expérience plus claire, plus rapide et centrée sur les faits. Les premières publications de la nouvelle rédaction arriveront bientôt.
            </p>
            <div className="mt-9 flex flex-wrap gap-3">
              <Link href="/touba-infos/contact#alerte" className="inline-flex items-center gap-2 rounded-xl bg-green-500 px-5 py-3 text-sm font-bold text-neutral-950 transition hover:bg-green-400">
                Contacter la rédaction <Send size={16} />
              </Link>
              <Link href="/touba-infos/politique-editoriale" className="inline-flex items-center gap-2 rounded-xl border border-white/20 px-5 py-3 text-sm font-bold text-white transition hover:bg-white/10">
                Notre ligne éditoriale <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1.9fr] lg:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-green-700">Les rubriques</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-neutral-950 sm:text-4xl">Une navigation pensée pour suivre l’essentiel.</h2>
          </div>
          <p className="max-w-xl text-base leading-relaxed text-neutral-600">Choisissez une rubrique pour découvrir les prochaines publications. Chaque espace restera vide tant qu’aucun contenu validé n’aura été publié.</p>
        </div>
        <div className="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {CATEGORIES_INFO.map((category, index) => (
            <Link key={category} href={`/touba-infos/rubrique/${slugCategorie(category)}`} className="group rounded-2xl border border-neutral-200 bg-white p-5 transition hover:-translate-y-1 hover:border-green-400 hover:shadow-lg hover:shadow-green-950/5">
              <span className="font-mono text-xs font-bold text-green-700">0{index + 1}</span>
              <h3 className="mt-8 text-xl font-black text-neutral-900">{category}</h3>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-bold text-neutral-500 group-hover:text-green-700">Voir la rubrique <ArrowRight size={15} /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-neutral-200 bg-neutral-50">
        <div className="mx-auto grid max-w-7xl gap-6 px-4 py-16 md:grid-cols-3">
          {ENGAGEMENTS.map(({ Icon, title, text }) => (
            <article key={title} className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-neutral-200">
              <Icon size={23} className="text-green-700" />
              <h2 className="mt-5 text-xl font-black text-neutral-950">{title}</h2>
              <p className="mt-2 leading-relaxed text-neutral-600">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-16 sm:py-20">
        <div className="rounded-3xl bg-green-700 px-6 py-10 text-white sm:px-10 sm:py-14">
          <Bell size={28} className="text-green-200" />
          <h2 className="mt-5 max-w-2xl text-3xl font-black tracking-tight sm:text-4xl">Recevez les premières publications de la nouvelle version.</h2>
          <p className="mt-3 max-w-xl text-green-50">Abonnez-vous pour être informé lorsque la rédaction publiera ses premiers contenus.</p>
          <Link href="/touba-infos/newsletter" className="mt-7 inline-flex items-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-bold text-green-800 transition hover:bg-green-50">S’abonner à la newsletter <ArrowRight size={16} /></Link>
        </div>
      </section>
    </main>
  );
}
