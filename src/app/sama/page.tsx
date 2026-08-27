import Link from "next/link";
import {
  ArrowRight, BarChart3, Bot, Check, ChevronRight, CircleCheck,
  FileText, Package, ShieldCheck, ShoppingCart, Store, Users,
} from "lucide-react";
import SamaPilotLogo from "@/components/sama/SamaPilotLogo";
import { PLANS } from "@/lib/sama/constants";
import { formatMoney } from "@/lib/sama/money";

export const dynamic = "force-dynamic";

const FEATURES = [
  { icon: ShoppingCart, title: "Vendez sans attendre", desc: "Chaque vente met à jour vos encaissements, votre marge et votre stock." },
  { icon: Package, title: "Gardez le contrôle", desc: "Repérez les ruptures, les produits qui dorment et ce qui se vend le mieux." },
  { icon: Users, title: "Relancez au bon moment", desc: "Retrouvez vos créances et l’historique de chaque client en un geste." },
  { icon: FileText, title: "Restez professionnel", desc: "Créez vos devis, factures et reçus prêts à partager ou imprimer." },
  { icon: Store, title: "Partagez votre boutique", desc: "Diffusez votre catalogue sur WhatsApp, TikTok, Instagram ou Facebook." },
  { icon: BarChart3, title: "Décidez avec vos chiffres", desc: "Suivez votre chiffre d’affaires, vos dépenses et votre bénéfice réel." },
];

const STEPS = [
  ["01", "Créez votre espace", "Ajoutez le nom et les informations de votre entreprise."],
  ["02", "Enregistrez l’activité", "Produits, ventes, dépenses et clients : tout est à sa place."],
  ["03", "Avancez sereinement", "SAMA AI vous aide à prioriser ce qui compte aujourd’hui."],
];

const FAQ = [
  ["Est-ce adapté au téléphone ?", "Oui. SAMA PILOT est pensé pour une utilisation simple et rapide sur mobile."],
  ["Puis-je commencer gratuitement ?", "Oui. Vous avez 14 jours d’essai sans carte bancaire."],
  ["Mes données sont-elles séparées ?", "Oui. Chaque entreprise possède son propre espace et ses propres données."],
];

export default function SamaLanding() {
  return (
    <main className="min-h-screen overflow-hidden bg-[#f7faf8] text-slate-900">
      <header className="sticky top-0 z-40 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between px-4 sm:h-20 sm:px-6">
          <Link href="/sama" aria-label="SAMA PILOT — Accueil">
            <SamaPilotLogo variant="compact" className="h-11 w-[158px] sm:h-12 sm:w-[174px]" />
          </Link>
          <nav className="hidden items-center gap-7 text-sm font-medium text-slate-600 lg:flex">
            <a href="#fonctionnalites" className="transition hover:text-[#0e7d52]">Fonctionnalités</a>
            <a href="#comment-ca-marche" className="transition hover:text-[#0e7d52]">Comment ça marche</a>
            <a href="#ia" className="transition hover:text-[#0e7d52]">SAMA AI</a>
            <a href="#tarifs" className="transition hover:text-[#0e7d52]">Tarifs</a>
          </nav>
          <div className="flex items-center gap-2 sm:gap-4">
            <Link href="/sama/connexion" className="hidden text-sm font-semibold text-slate-700 sm:block">Connexion</Link>
            <Link href="/sama/inscription" className="inline-flex items-center rounded-xl bg-[#0e7d52] px-3 py-2 text-xs font-bold text-white shadow-lg shadow-emerald-900/15 transition hover:bg-[#086442] sm:px-4 sm:text-sm">Essayer gratuitement</Link>
          </div>
        </div>
      </header>

      <section className="relative isolate overflow-hidden bg-[#073f2d] text-white">
        <div className="absolute inset-0 -z-20 bg-[radial-gradient(circle_at_85%_12%,rgba(215,173,50,.32),transparent_23%),radial-gradient(circle_at_8%_90%,rgba(14,125,82,.65),transparent_40%),linear-gradient(135deg,#052d20,#0e7d52)]" />
        <div className="absolute inset-0 -z-10 opacity-20 [background-image:linear-gradient(90deg,rgba(255,255,255,.22)_1px,transparent_1px),linear-gradient(rgba(255,255,255,.22)_1px,transparent_1px)] [background-size:48px_48px] [mask-image:linear-gradient(to_bottom,black,transparent)]" />
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[1fr_.9fr] lg:py-24">
          <div className="max-w-2xl">
            <SamaPilotLogo className="h-24 w-64 rounded-2xl bg-white p-2 shadow-xl shadow-black/20 sm:h-28 sm:w-80" />
            <p className="mt-8 text-sm font-bold uppercase tracking-[.18em] text-[#f2d373]">Le copilote des entrepreneurs sénégalais</p>
            <h1 className="mt-4 text-4xl font-black leading-[1.03] tracking-tight sm:text-6xl" style={{ fontFamily: "var(--font-display)" }}>
              Votre activité avance. <span className="text-[#f2d373]">Vous gardez le cap.</span>
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-relaxed text-white/80">
              Ventes, stock, clients et encaissements réunis dans un espace simple, pensé pour votre téléphone et votre rythme.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/sama/inscription" className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#d7ad32] px-6 py-4 font-bold text-[#073f2d] shadow-xl shadow-black/20 transition hover:-translate-y-0.5 hover:bg-[#edca63]">Créer mon espace <ArrowRight size={18} /></Link>
              <a href="#fonctionnalites" className="inline-flex items-center justify-center gap-2 rounded-2xl border border-white/25 bg-white/10 px-6 py-4 font-semibold transition hover:bg-white/20">Découvrir SAMA PILOT <ChevronRight size={18} /></a>
            </div>
            <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-sm text-white/80">
              {["14 jours d’essai", "Sans carte bancaire", "Support local"].map((item) => <span key={item} className="flex items-center gap-2"><Check size={15} className="text-[#f2d373]" />{item}</span>)}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-lg">
            <div className="absolute -inset-8 -z-10 rounded-full bg-[#d7ad32]/25 blur-3xl" />
            <div className="overflow-hidden rounded-[2rem] border border-white/20 bg-white p-3 shadow-2xl sm:p-5">
              <div className="rounded-[1.4rem] bg-[#f5f9f7] p-5 text-slate-900 sm:p-7">
                <div className="flex items-center justify-between"><div><p className="text-xs font-bold uppercase tracking-widest text-[#0e7d52]">Aujourd’hui</p><p className="mt-1 text-xl font-black">Bonjour, Awa</p></div><div className="grid h-11 w-11 place-items-center rounded-2xl bg-[#0e7d52] font-black text-white">A</div></div>
                <div className="mt-6 rounded-2xl bg-[#0e7d52] p-5 text-white"><p className="text-sm text-white/70">Ventes du jour</p><p className="mt-1 text-3xl font-black">128 500 <span className="text-base">FCFA</span></p><p className="mt-3 text-xs font-semibold text-[#f2d373]">+18% cette semaine</p></div>
                <div className="mt-4 grid grid-cols-2 gap-3">{[["24", "Produits en stock"], ["8", "Clients à relancer"]].map(([value, label]) => <div key={label} className="rounded-2xl border border-[#0e7d52]/10 bg-white p-4"><p className="text-2xl font-black text-[#0e7d52]">{value}</p><p className="mt-1 text-xs text-slate-500">{label}</p></div>)}</div>
              </div>
            </div>
            <div className="absolute -bottom-5 -left-3 rounded-2xl border border-[#d7ad32]/30 bg-white px-4 py-3 text-sm text-slate-800 shadow-xl sm:-left-8"><p className="text-xs text-slate-500">SAMA AI vous conseille</p><p className="mt-1 font-bold text-[#0e7d52]">3 actions utiles aujourd’hui</p></div>
          </div>
        </div>
      </section>

      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-slate-100 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6">
          {[['Tout au même endroit', 'Ventes, stock, clients et paiements.'], ['Des décisions utiles', 'Des résultats clairs pour avancer.'], ['Une prise en main rapide', 'Commencez par votre première vente.']].map(([title, text]) => <div key={title} className="py-6 text-center sm:px-8"><p className="font-bold text-emerald-900">{title}</p><p className="mt-1 text-sm text-slate-500">{text}</p></div>)}
        </div>
      </section>

      <section id="fonctionnalites" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="max-w-2xl">
          <p className="text-sm font-bold uppercase tracking-[.16em] text-[#0e7d52]">Le quotidien sous contrôle</p>
          <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-950 sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>Ce dont vous avez besoin. Rien de compliqué.</h2>
          <p className="mt-4 text-lg text-slate-600">Chaque outil a été pensé pour vous faire gagner du temps, pas pour vous donner plus de travail.</p>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map(({ icon: Icon, title, desc }) => <article key={title} className="group rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg"><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-[#0e7d52]"><Icon size={23} /></div><h3 className="mt-5 text-lg font-bold">{title}</h3><p className="mt-2 text-sm leading-relaxed text-slate-600">{desc}</p></article>)}
        </div>
      </section>

      <section id="comment-ca-marche" className="bg-[#073f2d] py-20 text-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6">
          <div className="max-w-2xl"><p className="text-sm font-bold uppercase tracking-[.16em] text-[#d7ad32]">Simple dès le premier jour</p><h2 className="mt-3 text-3xl font-black sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>Du premier produit à la première décision.</h2></div>
          <div className="mt-10 grid gap-4 md:grid-cols-3">
            {STEPS.map(([number, title, desc]) => <div key={number} className="rounded-3xl border border-white/10 bg-white/[.06] p-6"><span className="text-4xl font-black text-[#d7ad32]">{number}</span><h3 className="mt-10 text-xl font-bold">{title}</h3><p className="mt-3 text-sm leading-relaxed text-emerald-100/70">{desc}</p></div>)}
          </div>
        </div>
      </section>

      <section id="ia" className="mx-auto max-w-7xl px-4 py-20 sm:px-6">
        <div className="grid items-center gap-10 rounded-[2rem] bg-gradient-to-br from-slate-950 via-slate-900 to-[#073f2d] p-7 text-white shadow-2xl sm:p-12 lg:grid-cols-[auto_1fr]">
          <div className="grid h-20 w-20 place-items-center rounded-3xl bg-[#d7ad32] text-[#073f2d]"><Bot size={40} /></div>
          <div><p className="text-sm font-bold uppercase tracking-[.16em] text-[#d7ad32]">SAMA AI</p><h2 className="mt-3 text-3xl font-black sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>Vos chiffres vous parlent enfin.</h2><p className="mt-4 max-w-3xl text-lg leading-relaxed text-slate-300">Demandez ce que vous devez faire aujourd’hui. SAMA AI vous aide à détecter les stocks faibles, créances à récupérer et opportunités à saisir, à partir de vos données réelles.</p></div>
        </div>
      </section>

      <section id="tarifs" className="bg-white py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6"><div className="text-center"><p className="text-sm font-bold uppercase tracking-[.16em] text-[#0e7d52]">Tarifs transparents</p><h2 className="mt-3 text-3xl font-black sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>Commencez maintenant, évoluez à votre rythme.</h2></div><div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{PLANS.map((plan) => <article key={plan.code} className={`flex flex-col rounded-3xl border p-6 ${plan.highlight ? "border-emerald-500 bg-[#073f2d] text-white shadow-xl" : "border-slate-200 bg-white"}`}><p className={`text-xs font-bold uppercase tracking-widest ${plan.highlight ? "text-[#d7ad32]" : "text-[#0e7d52]"}`}>{plan.highlight ? "Le plus choisi" : "SAMA PILOT"}</p><h3 className="mt-4 text-xl font-bold">{plan.name}</h3><p className="mt-3 text-3xl font-black">{plan.priceMonthly === 0 ? "0" : formatMoney(plan.priceMonthly).replace(" FCFA", "")}<span className={`text-sm font-medium ${plan.highlight ? "text-white/60" : "text-slate-400"}`}> FCFA{plan.priceMonthly > 0 ? "/mois" : ""}</span></p><ul className={`mt-6 flex-1 space-y-3 text-sm ${plan.highlight ? "text-emerald-50/85" : "text-slate-600"}`}>{plan.features.map((feature) => <li key={feature} className="flex gap-2"><Check size={16} className="mt-0.5 shrink-0 text-emerald-400" />{feature}</li>)}</ul><Link href="/sama/inscription" className={`mt-8 inline-flex items-center justify-center rounded-xl px-4 py-3 text-sm font-bold transition ${plan.highlight ? "bg-[#d7ad32] text-[#073f2d] hover:bg-[#edca63]" : "bg-[#0e7d52] text-white hover:bg-[#086442]"}`}>Choisir ce plan</Link></article>)}</div></div>
      </section>

      <section className="mx-auto max-w-4xl px-4 py-20 sm:px-6"><h2 className="text-center text-3xl font-black" style={{ fontFamily: "var(--font-display)" }}>Questions fréquentes</h2><div className="mt-8 space-y-3">{FAQ.map(([question, answer]) => <details key={question} className="rounded-2xl border border-slate-200 bg-white p-5"><summary className="cursor-pointer font-bold">{question}</summary><p className="mt-3 text-sm leading-relaxed text-slate-600">{answer}</p></details>)}</div></section>

      <section className="bg-[#d7ad32] py-16 text-[#073f2d]"><div className="mx-auto max-w-3xl px-4 text-center"><ShieldCheck className="mx-auto" size={30} /><h2 className="mt-4 text-3xl font-black sm:text-4xl" style={{ fontFamily: "var(--font-display)" }}>Prêt à mieux piloter votre activité ?</h2><p className="mt-3 text-lg text-[#073f2d]/75">Créez votre espace et commencez avec votre première vente.</p><Link href="/sama/inscription" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#073f2d] px-7 py-4 font-bold text-white transition hover:bg-emerald-900">Créer mon compte gratuitement <ArrowRight size={18} /></Link></div></section>

      <footer className="bg-slate-950 py-12 text-slate-400"><div className="mx-auto flex max-w-7xl flex-col justify-between gap-8 px-4 sm:flex-row sm:px-6"><div><SamaPilotLogo variant="compact" className="h-10 w-[145px] rounded-lg bg-white p-1" /><p className="mt-4 max-w-sm text-sm">Vendez. Gérez. Encaissez. Décidez avec l’IA.</p><p className="mt-2 text-xs">Développé par Touba Digital Group</p></div><div className="flex gap-6 text-sm"><Link href="/sama/inscription" className="hover:text-white">Créer un compte</Link><Link href="/sama/connexion" className="hover:text-white">Connexion</Link><a href="#tarifs" className="hover:text-white">Tarifs</a></div></div><p className="mx-auto mt-10 max-w-7xl px-4 text-xs text-slate-600 sm:px-6">© {new Date().getFullYear()} SAMA PILOT · Sénégal · Afrique francophone</p></footer>
    </main>
  );
}
