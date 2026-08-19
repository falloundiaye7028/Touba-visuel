"use client";

import { useState } from "react";
import { UploadCloud } from "lucide-react";
import { importProductsAction, importCustomersAction, type ImportState } from "@/lib/sama/actions/imports";

type Mode = "products" | "customers";

const HEADERS: Record<Mode, { keys: string[]; label: string; template: string }> = {
  products: {
    keys: ["name", "salePrice", "costPrice", "stock", "category", "sku", "unit"],
    label: "Produits",
    template: "name,salePrice,costPrice,stock,category\nSneakers,25000,12000,40,Chaussures",
  },
  customers: {
    keys: ["name", "phone", "email", "city", "source"],
    label: "Clients",
    template: "name,phone,city,source\nFatou Ndiaye,771234567,Dakar,WhatsApp",
  },
};

// Synonymes FR pour la reconnaissance des colonnes.
const SYNONYMS: Record<string, string> = {
  nom: "name", produit: "name", client: "name",
  prix: "salePrice", "prix de vente": "salePrice", vente: "salePrice",
  "prix d'achat": "costPrice", achat: "costPrice", cout: "costPrice",
  quantite: "stock", qte: "stock", "quantité": "stock",
  categorie: "category", "catégorie": "category",
  reference: "sku", ref: "sku", "référence": "sku",
  unite: "unit", "unité": "unit",
  telephone: "phone", "téléphone": "phone", tel: "phone", numero: "phone",
  ville: "city", source: "source", email: "email", mail: "email",
};

function parseCsv(text: string, mode: Mode): Record<string, string>[] {
  const lines = text.trim().split(/\r?\n/).filter((l) => l.trim());
  if (lines.length < 2) return [];
  const delim = lines[0].includes(";") && !lines[0].includes(",") ? ";" : ",";
  const rawHeaders = lines[0].split(delim).map((h) => h.trim().toLowerCase().replace(/^"|"$/g, ""));
  const headers = rawHeaders.map((h) => {
    if (HEADERS[mode].keys.map((k) => k.toLowerCase()).includes(h)) return HEADERS[mode].keys.find((k) => k.toLowerCase() === h)!;
    return SYNONYMS[h] ?? h;
  });
  return lines.slice(1).map((line) => {
    const cells = line.split(delim).map((c) => c.trim().replace(/^"|"$/g, ""));
    const row: Record<string, string> = {};
    headers.forEach((h, i) => { if (cells[i] !== undefined) row[h] = cells[i]; });
    return row;
  }).filter((r) => r.name);
}

export default function ImportClient() {
  const [mode, setMode] = useState<Mode>("products");
  const [text, setText] = useState("");
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [result, setResult] = useState<ImportState | null>(null);
  const [loading, setLoading] = useState(false);

  function analyze(v: string) { setText(v); setRows(parseCsv(v, mode)); setResult(null); }

  async function onFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const content = await file.text();
    analyze(content);
  }

  async function submit() {
    setLoading(true);
    setResult(null);
    const fd = new FormData();
    fd.set("rows", JSON.stringify(rows));
    const action = mode === "products" ? importProductsAction : importCustomersAction;
    const res = await action({} as ImportState, fd);
    setResult(res);
    setLoading(false);
    if (res.ok) { setText(""); setRows([]); }
  }

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        {(["products", "customers"] as Mode[]).map((m) => (
          <button key={m} onClick={() => { setMode(m); setText(""); setRows([]); setResult(null); }}
            className={`px-4 py-2 rounded-xl text-sm font-medium ${mode === m ? "bg-vert-700 text-white" : "bg-white border border-gray-200 text-gray-600"}`}>
            {HEADERS[m].label}
          </button>
        ))}
      </div>

      <div className="card p-4 space-y-3">
        <label className="btn-outline w-full cursor-pointer">
          <UploadCloud className="w-4 h-4" /> Choisir un fichier CSV
          <input type="file" accept=".csv,text/csv" onChange={onFile} className="hidden" />
        </label>
        <div className="text-center text-xs text-gray-400">ou collez vos données ci-dessous</div>
        <textarea value={text} onChange={(e) => analyze(e.target.value)} rows={5} className="input-field font-mono text-xs" placeholder={HEADERS[mode].template} />
        <div className="text-xs text-gray-400">Colonnes reconnues : {HEADERS[mode].keys.join(", ")} (les en-têtes en français sont aussi acceptés).</div>
      </div>

      {rows.length > 0 && (
        <div className="card p-4">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-semibold text-sm">Aperçu · {rows.length} ligne(s)</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs">
              <thead><tr className="text-left text-gray-400">{HEADERS[mode].keys.map((k) => <th key={k} className="py-1 pr-3">{k}</th>)}</tr></thead>
              <tbody>
                {rows.slice(0, 8).map((r, i) => (
                  <tr key={i} className="border-t border-gray-50">{HEADERS[mode].keys.map((k) => <td key={k} className="py-1 pr-3 text-gray-600">{r[k] ?? "—"}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
          {rows.length > 8 && <div className="text-xs text-gray-400 mt-1">… et {rows.length - 8} de plus</div>}
          <button onClick={submit} disabled={loading} className="btn-primary w-full mt-3">{loading ? "Import en cours…" : `Importer ${rows.length} ${HEADERS[mode].label.toLowerCase()}`}</button>
        </div>
      )}

      {result?.error && <div className="bg-red-50 text-red-700 text-sm rounded-xl px-3 py-2">{result.error}</div>}
      {result?.ok && (
        <div className="bg-vert-50 text-vert-700 text-sm rounded-xl px-3 py-2">
          ✓ {result.imported} importé(s){result.skipped ? `, ${result.skipped} ignoré(s) (lignes invalides ou limite du plan)` : ""}.
        </div>
      )}
    </div>
  );
}
