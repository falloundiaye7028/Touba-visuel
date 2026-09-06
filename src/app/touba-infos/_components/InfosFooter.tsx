import Link from "next/link";
import { Facebook, Youtube, Music2, Send } from "lucide-react";
import Logo from "./Logo";
import NewsletterForm from "./NewsletterForm";

const COL_ACTU = [
  { label: "Touba", href: "/touba-infos/rubrique/touba" },
  { label: "Sénégal", href: "/touba-infos/rubrique/senegal" },
  { label: "Politique", href: "/touba-infos/rubrique/politique" },
  { label: "Économie", href: "/touba-infos/rubrique/economie" },
  { label: "Société", href: "/touba-infos/rubrique/societe" },
  { label: "Sport", href: "/touba-infos/rubrique/sport" },
  { label: "Environnement", href: "/touba-infos/rubrique/environnement" },
];

const COL_MEDIA = [
  { label: "À propos", href: "/touba-infos/a-propos" },
  { label: "Équipe & auteurs", href: "/touba-infos/a-propos#equipe" },
  { label: "Contact", href: "/touba-infos/contact" },
  { label: "Publicité", href: "/touba-infos/publicite" },
  { label: "Alerter la rédaction", href: "/touba-infos/contact#alerte" },
];

const COL_INFOS = [
  { label: "Politique éditoriale", href: "/touba-infos/politique-editoriale" },
  { label: "Mentions légales", href: "/touba-infos/politique-editoriale#mentions" },
  { label: "Confidentialité", href: "/touba-infos/politique-editoriale#confidentialite" },
  { label: "Cookies", href: "/touba-infos/politique-editoriale#cookies" },
  { label: "Corrections", href: "/touba-infos/politique-editoriale#corrections" },
];

const SOCIALS = [
  { label: "Facebook", href: "https://www.facebook.com/toubainfos/?locale=fr_FR", Icon: Facebook },
  { label: "YouTube", href: "https://www.youtube.com/@toubainfostv183", Icon: Youtube },
  { label: "TikTok", href: "https://www.tiktok.com/@yoonu_murid_digital", Icon: Music2 },
];

export default function InfosFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-neutral-950 text-neutral-300">
      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="mx-auto grid max-w-7xl items-center gap-6 px-4 py-10 md:grid-cols-2">
          <div>
            <h3 className="text-xl font-black text-white">
              Recevez l&apos;essentiel de l&apos;actualité
            </h3>
            <p className="mt-1 text-sm text-neutral-400">
              Touba, le Sénégal, l&apos;Afrique et le monde — directement dans
              votre boîte mail.
            </p>
          </div>
          <NewsletterForm variant="dark" />
        </div>
      </div>

      {/* Colonnes */}
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <div className="inline-flex rounded-lg bg-black/40 p-1">
            <Logo height={40} />
          </div>
          <p className="mt-4 text-sm leading-relaxed text-neutral-400">
            Média numérique d&apos;information générale. L&apos;actualité au
            cœur de Touba, ouverte sur le Sénégal, l&apos;Afrique et le monde.
          </p>
          <div className="mt-5 flex items-center gap-3">
            {SOCIALS.map(({ label, href, Icon }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-neutral-300 transition-colors hover:bg-green-600 hover:text-white"
              >
                <Icon size={16} />
              </a>
            ))}
            <a
              href="https://wa.me/221768001717"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-white/5 text-neutral-300 transition-colors hover:bg-green-600 hover:text-white"
            >
              <Send size={15} />
            </a>
          </div>
        </div>

        <FooterCol title="Actualités" links={COL_ACTU} />
        <FooterCol title="Touba Infos" links={COL_MEDIA} />
        <FooterCol title="Informations" links={COL_INFOS} />
      </div>

      {/* Bas de page */}
      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-5 text-xs text-neutral-500 sm:flex-row">
          <p>© {year} Touba Infos — Tous droits réservés.</p>
          <p className="text-neutral-600">
            Touba • Sénégal • Afrique • Monde ·{" "}
            <Link href="/" className="hover:text-green-400">
              Un projet de l&apos;Agence Touba Visuel
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({
  title,
  links,
}: {
  title: string;
  links: { label: string; href: string }[];
}) {
  return (
    <div>
      <h4 className="text-[13px] font-bold uppercase tracking-widest text-white">
        {title}
      </h4>
      <ul className="mt-4 space-y-2.5 text-sm">
        {links.map((l) => (
          <li key={l.href}>
            <Link
              href={l.href}
              className="text-neutral-400 transition-colors hover:text-green-400"
            >
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
