"use client";
import Link from "next/link";
import { ArrowRight, Share2 } from "lucide-react";
import { useState } from "react";
import type { Categorie } from "@/lib/supports";

interface Props {
  categorie: Categorie;
}

const BASE_URL = "https://touba-visuel.vercel.app";

function ShareButtons({ categorie }: { categorie: Categorie }) {
  const pageUrl = `${BASE_URL}/catalogue/${categorie.slug}`;
  const url = encodeURIComponent(pageUrl);
  const textWA = encodeURIComponent(
    `🎨 *${categorie.nom}* — Agence Touba Visuel (ATV)\n\n${categorie.description}\n\n👉 Commander en ligne :\n${pageUrl}`
  );
  const textX = encodeURIComponent(
    `🎨 ${categorie.nom} — Agence Touba Visuel (ATV)\n${categorie.description}`
  );

  const links = [
    {
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${url}`,
      color: "#1877F2",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
        </svg>
      ),
    },
    {
      label: "WhatsApp",
      href: `https://api.whatsapp.com/send?text=${textWA}`,
      color: "#25D366",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      ),
    },
    {
      label: "TikTok",
      href: `https://www.tiktok.com/@yoonu_murid_digital`,
      color: "#010101",
      icon: (
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.78 1.52V6.75a4.85 4.85 0 01-1.01-.06z"/>
        </svg>
      ),
    },
    {
      label: "X",
      href: `https://twitter.com/intent/tweet?url=${url}&text=${textX}`,
      color: "#000000",
      icon: (
        <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
          <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.737-8.835L1.254 2.25H8.08l4.259 5.63zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
        </svg>
      ),
    },
  ];

  return (
    <div className="flex items-center gap-1.5 flex-wrap">
      {links.map((l) => (
        <a
          key={l.label}
          href={l.href}
          target="_blank"
          rel="noopener noreferrer"
          title={`Partager sur ${l.label}`}
          className="w-7 h-7 rounded-lg flex items-center justify-center text-white transition-all duration-200 hover:scale-110 hover:shadow-md"
          style={{ backgroundColor: l.color }}
        >
          {l.icon}
        </a>
      ))}
    </div>
  );
}

export default function CategorieCard({ categorie }: Props) {
  const [showShare, setShowShare] = useState(false);

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 p-6 hover:shadow-xl hover:border-vert-300 transition-all duration-300 flex flex-col">
      <Link href={`/catalogue/${categorie.slug}`} className="flex-1">
        <div className="flex items-start justify-between mb-4">
          <div className="text-4xl">{categorie.emoji}</div>
          <ArrowRight
            size={20}
            className="text-gray-300 group-hover:text-vert-600 group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
        <h3 className="text-gray-900 font-bold text-lg mb-2 group-hover:text-vert-700 transition-colors">
          {categorie.nom}
        </h3>
        <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">
          {categorie.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <span className="bg-vert-50 text-vert-700 text-xs font-semibold px-3 py-1 rounded-full">
            {categorie.supports.length} supports
          </span>
          <span className="text-vert-600 text-xs font-medium group-hover:underline">
            Voir tout
          </span>
        </div>
      </Link>

      {/* Boutons de partage */}
      <div className="border-t border-gray-100 pt-3">
        <button
          onClick={() => setShowShare(!showShare)}
          className="flex items-center gap-2 text-gray-400 hover:text-vert-600 text-xs font-semibold transition-colors w-full"
        >
          <Share2 size={13} />
          {showShare ? "Masquer" : "Partager"}
        </button>
        {showShare && (
          <div className="mt-2 animate-fade-in">
            <ShareButtons categorie={categorie} />
          </div>
        )}
      </div>
    </div>
  );
}
