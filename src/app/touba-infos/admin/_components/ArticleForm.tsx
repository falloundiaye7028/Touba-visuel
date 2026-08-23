"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown, Eye, ImagePlus, LoaderCircle, Save, Settings2, X } from "lucide-react";
import type { ArticleInfo } from "@/lib/touba-infos";
import {
  AUTEURS,
  CATEGORIES_INFO,
  CATEGORIES_PLUS,
  GENRES_INFO,
} from "@/lib/touba-infos";

const CATEGORIES = [...CATEGORIES_INFO, ...CATEGORIES_PLUS];
const GRADIENTS = [
  { label: "Vert", value: "from-green-700 via-emerald-800 to-green-900" },
  { label: "Ardoise", value: "from-slate-700 via-slate-800 to-green-900" },
  { label: "Ambre", value: "from-amber-700 via-stone-700 to-emerald-900" },
  { label: "Rouge", value: "from-red-700 via-red-800 to-green-900" },
];

function toLocalInput(iso?: string): string {
  const date = iso ? new Date(iso) : new Date();
  return new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
    .toISOString()
    .slice(0, 16);
}

export default function ArticleForm({
  action,
  article,
  mode,
}: {
  action: (formData: FormData) => void | Promise<void>;
  article?: ArticleInfo;
  mode: "new" | "edit";
}) {
  const [title, setTitle] = useState(article?.titre ?? "");
  const [summary, setSummary] = useState(article?.extrait ?? "");
  const [category, setCategory] = useState(article?.categorie ?? "Touba");
  const [imageUrl, setImageUrl] = useState(article?.imageUrl ?? "");
  const [uploadState, setUploadState] = useState<"idle" | "uploading" | "error">("idle");
  const [uploadError, setUploadError] = useState("");

  async function uploadImage(file: File) {
    if (!file.type.startsWith("image/")) {
      setUploadError("Sélectionnez une image.");
      setUploadState("error");
      return;
    }
    if (file.size > 4 * 1024 * 1024) {
      setUploadError("L’image ne doit pas dépasser 4 Mo.");
      setUploadState("error");
      return;
    }

    setUploadState("uploading");
    setUploadError("");
    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/touba-infos/admin/upload-image", {
        method: "POST",
        body: formData,
      });
      const data = (await response.json()) as { url?: string; error?: string };
      if (!response.ok || !data.url) throw new Error(data.error || "Envoi impossible.");
      setImageUrl(data.url);
      setUploadState("idle");
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Envoi impossible.");
      setUploadState("error");
    }
  }

  return (
    <form action={action} className="mx-auto max-w-4xl space-y-6">
      <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
        <div className="grid gap-5 md:grid-cols-[1fr_220px]">
          <div className="space-y-5">
            <Field label="Titre" required>
              <input
                name="titre"
                required
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className={`${inputCls} text-base font-semibold`}
                placeholder="Titre de l’article"
              />
            </Field>
            <div className="grid gap-5 sm:grid-cols-2">
              <Field label="Rubrique">
                <select name="categorie" value={category} onChange={(event) => setCategory(event.target.value)} className={inputCls}>
                  {CATEGORIES.map((item) => <option key={item} value={item}>{item}</option>)}
                </select>
              </Field>
              <Field label="Publication">
                <select name="statut" defaultValue={article?.statut ?? "brouillon"} className={inputCls}>
                  <option value="brouillon">Enregistrer comme brouillon</option>
                  <option value="publie">Publier maintenant</option>
                  <option value="programme">Programmer</option>
                </select>
              </Field>
            </div>
            <Field label="Résumé">
              <textarea
                name="extrait"
                rows={3}
                value={summary}
                onChange={(event) => setSummary(event.target.value)}
                className={inputCls}
                placeholder="Expliquez l’essentiel de l’article en quelques lignes."
              />
            </Field>
          </div>

          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50">
            <div className="relative flex aspect-[16/10] items-center justify-center bg-gradient-to-br from-green-700 via-emerald-800 to-green-900">
              {imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={imageUrl} alt="Aperçu" className="h-full w-full object-cover" />
              ) : <ImagePlus size={32} className="text-white/45" />}
              <span className="absolute left-2 top-2 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold uppercase text-green-800">{category}</span>
            </div>
            <p className="truncate px-3 py-2 text-xs font-bold text-neutral-700">{title || "Aperçu de l’article"}</p>
          </div>
        </div>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
        <Field label="Image de l’article">
          <div className="mt-2 space-y-3">
            <label className="flex cursor-pointer items-center justify-center gap-2 rounded-xl border border-dashed border-green-500 bg-green-50 px-4 py-5 text-sm font-bold text-green-800 transition hover:bg-green-100">
              {uploadState === "uploading" ? <LoaderCircle size={18} className="animate-spin" /> : <ImagePlus size={18} />}
              {uploadState === "uploading" ? "Envoi de l’image…" : "Choisir une image"}
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp,image/gif"
                className="sr-only"
                disabled={uploadState === "uploading"}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void uploadImage(file);
                  event.currentTarget.value = "";
                }}
              />
            </label>
            <p className="text-center text-xs text-neutral-500">JPG, PNG, WebP ou GIF · 4 Mo maximum</p>
            {uploadError && <p className="text-sm font-semibold text-red-600">{uploadError}</p>}
            {imageUrl && (
              <div className="flex items-center justify-between gap-3 rounded-lg bg-green-50 px-3 py-2 text-sm text-green-800">
                <span className="truncate font-semibold">Image prête à être associée à l’article.</span>
                <button type="button" onClick={() => setImageUrl("")} className="rounded p-1 hover:bg-green-100" aria-label="Retirer l’image"><X size={16} /></button>
              </div>
            )}
            <input name="imageUrl" value={imageUrl} onChange={(event) => setImageUrl(event.target.value)} className={inputCls} placeholder="Ou collez une URL d’image" />
          </div>
        </Field>
      </section>

      <section className="rounded-2xl border border-neutral-200 bg-white p-5 sm:p-7">
        <Field label="Contenu" required>
          <textarea
            name="contenu"
            required
            rows={15}
            defaultValue={article?.contenu}
            className={`${inputCls} min-h-[300px] leading-relaxed`}
            placeholder="Rédigez votre article ici."
          />
        </Field>
        <p className="mt-2 text-xs text-neutral-500">Vous pouvez utiliser du HTML simple : &lt;h2&gt;, &lt;p&gt;, &lt;strong&gt; et &lt;ul&gt;.</p>
      </section>

      <details className="group rounded-2xl border border-neutral-200 bg-white">
        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 p-5 text-sm font-bold text-neutral-700">
          <span className="inline-flex items-center gap-2"><Settings2 size={17} className="text-green-700" /> Options avancées</span>
          <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
        </summary>
        <div className="grid gap-4 border-t border-neutral-100 p-5 sm:grid-cols-2">
          <Field label="Auteur">
            <select name="auteur" defaultValue={article?.auteur ?? AUTEURS[0]?.nom} className={inputCls}>
              {AUTEURS.map((author) => <option key={author.slug} value={author.nom}>{author.nom}</option>)}
            </select>
          </Field>
          <Field label="Genre">
            <select name="genre" defaultValue={article?.genre ?? "Actualité"} className={inputCls}>
              {GENRES_INFO.map((genre) => <option key={genre} value={genre}>{genre}</option>)}
            </select>
          </Field>
          <Field label="Date de publication">
            <input type="datetime-local" name="date" defaultValue={toLocalInput(article?.date)} className={inputCls} />
          </Field>
          <Field label="Temps de lecture"><input name="tempsLecture" defaultValue={article?.tempsLecture ?? "3 min"} className={inputCls} /></Field>
          <Field label="Mots-clés"><input name="tags" defaultValue={article?.tags.join(", ")} className={inputCls} placeholder="Touba, Magal" /></Field>
          <Field label="Slug (URL)"><input name="slug" defaultValue={article?.slug} className={inputCls} placeholder="Créé automatiquement" /></Field>
          <Field label="Sous-titre"><input name="sousTitre" defaultValue={article?.sousTitre} className={inputCls} /></Field>
          <Field label="Crédit photo"><input name="credit" defaultValue={article?.credit} className={inputCls} /></Field>
          <Field label="Légende"><input name="legende" defaultValue={article?.legende} className={inputCls} /></Field>
          <Field label="Emoji de repli"><input name="imageEmoji" defaultValue={article?.imageEmoji ?? "📰"} className={inputCls} /></Field>
          <Field label="Dégradé">
            <select name="imageGradient" defaultValue={article?.imageGradient ?? GRADIENTS[0].value} className={inputCls}>
              {GRADIENTS.map((gradient) => <option key={gradient.value} value={gradient.value}>{gradient.label}</option>)}
            </select>
          </Field>
          <div className="flex flex-wrap items-center gap-5 sm:col-span-2">
            <Check name="alaUne" label="À la Une" defaultChecked={article?.alaUne} />
            <Check name="breaking" label="Dernière minute" defaultChecked={article?.breaking} />
            <Check name="epingle" label="Épinglé" defaultChecked={article?.epingle} />
          </div>
        </div>
      </details>

      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        {article && <Link href={`/touba-infos/${article.slug}`} target="_blank" className="inline-flex items-center justify-center gap-2 rounded-xl border border-neutral-300 px-5 py-3 text-sm font-bold text-neutral-700 hover:bg-neutral-50"><Eye size={16} /> Aperçu</Link>}
        <button type="submit" className="inline-flex items-center justify-center gap-2 rounded-xl bg-green-600 px-6 py-3 text-sm font-bold text-white hover:bg-green-700"><Save size={16} /> {mode === "new" ? "Enregistrer l’article" : "Enregistrer les modifications"}</button>
      </div>
    </form>
  );
}

const inputCls = "w-full rounded-xl border border-neutral-300 bg-white px-3 py-2.5 text-sm outline-none focus:border-green-500 focus:ring-2 focus:ring-green-500/30";

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-neutral-500">{label}{required && <span className="text-green-600"> *</span>}</span>{children}</label>;
}

function Check({ name, label, defaultChecked }: { name: string; label: string; defaultChecked?: boolean }) {
  return <label className="flex items-center gap-2 text-sm font-medium text-neutral-700"><input type="checkbox" name={name} defaultChecked={defaultChecked} className="h-4 w-4 accent-green-600" />{label}</label>;
}
