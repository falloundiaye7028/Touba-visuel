"use client";

import { useState } from "react";
import { ImagePlus, X } from "lucide-react";

/**
 * Upload d'image sans stockage externe : l'image est redimensionnée et
 * compressée côté client (canvas) puis stockée en data URL dans un champ
 * caché. Bornée en taille pour rester légère en base. Migrable vers un
 * stockage objet ultérieurement.
 */
export default function ImageUpload({
  name, initial, label = "Image", maxSize = 600, aspect = "square",
}: { name: string; initial?: string | null; label?: string; maxSize?: number; aspect?: "square" | "wide" }) {
  const [preview, setPreview] = useState<string>(initial || "");
  const [busy, setBusy] = useState(false);

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusy(true);
    try {
      const dataUrl = await resize(file, maxSize);
      setPreview(dataUrl);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div>
      <span className="text-sm font-medium text-gray-700">{label}</span>
      <input type="hidden" name={name} value={preview} />
      <div className="mt-1 flex items-center gap-3">
        <div className={`${aspect === "square" ? "w-20 h-20" : "w-32 h-16"} rounded-xl bg-gray-100 border border-gray-200 grid place-items-center overflow-hidden shrink-0`}>
          {preview ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={preview} alt="" className="w-full h-full object-cover" />
          ) : <ImagePlus className="w-6 h-6 text-gray-300" />}
        </div>
        <div className="flex flex-col gap-1">
          <label className="btn-outline !py-1.5 text-sm cursor-pointer">
            {busy ? "Traitement…" : preview ? "Changer" : "Choisir une image"}
            <input type="file" accept="image/*" onChange={onFile} className="hidden" />
          </label>
          {preview && (
            <button type="button" onClick={() => setPreview("")} className="text-xs text-red-500 inline-flex items-center gap-1"><X className="w-3 h-3" /> Retirer</button>
          )}
        </div>
      </div>
    </div>
  );
}

function resize(file: File, max: number): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      const img = new Image();
      img.onload = () => {
        let { width, height } = img;
        if (width > height && width > max) { height = Math.round((height * max) / width); width = max; }
        else if (height > max) { width = Math.round((width * max) / height); height = max; }
        const canvas = document.createElement("canvas");
        canvas.width = width; canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (!ctx) return reject(new Error("canvas"));
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL("image/jpeg", 0.72));
      };
      img.onerror = reject;
      img.src = reader.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
