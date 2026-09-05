"use client";

import { Download, Eye, FileText, LoaderCircle, Plus, ShieldCheck, Trash2 } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import { DOCUMENT_CATEGORIES, DOCUMENT_RESOURCE_TYPES, type DocumentResourceType } from "@/lib/documents/config";
import type { DocumentRecord } from "@/lib/documents/types";
import { DocumentUploadDialog } from "./DocumentUploadDialog";

interface ResourceDocumentsProps { resourceType?: DocumentResourceType; resourceId?: string; resourceLabel?: string; compact?: boolean; onToast?: (message: string) => void }

export function ResourceDocuments({ resourceType, resourceId, resourceLabel, compact = false, onToast }: ResourceDocumentsProps) {
  const [documents, setDocuments] = useState<DocumentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [from, setFrom] = useState("");
  const [uploader, setUploader] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    setLoading(true); setError("");
    const query = new URLSearchParams();
    if (resourceId) query.set("resourceId", resourceId);
    if (resourceType) query.set("resourceType", resourceType);
    if (search) query.set("search", search);
    if (category) query.set("category", category);
    if (typeFilter) query.set("resourceType", typeFilter);
    if (from) query.set("from", from);
    if (uploader) query.set("uploader", uploader);
    try {
      const response = await fetch(`/api/documents?${query}`);
      const result = await response.json() as { data?: DocumentRecord[]; error?: string };
      if (!response.ok) throw new Error(result.error);
      setDocuments(result.data ?? []);
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Impossible de charger les documents."); }
    finally { setLoading(false); }
  }, [category, from, resourceId, resourceType, search, typeFilter, uploader]);

  useEffect(() => { const timer = window.setTimeout(() => void load(), 180); return () => window.clearTimeout(timer); }, [load]);

  const openDocument = async (document: DocumentRecord, disposition: "inline" | "attachment") => {
    const response = await fetch(`/api/documents/${document.id}/signed-url?disposition=${disposition}`);
    const result = await response.json() as { url?: string; error?: string };
    if (!response.ok || !result.url) { setError(result.error ?? "Impossible de générer le lien temporaire."); return; }
    window.open(result.url, "_blank", "noopener,noreferrer");
  };

  const removeDocument = async (document: DocumentRecord) => {
    if (!window.confirm(`Retirer « ${document.name} » de la bibliothèque ? Le fichier restera récupérable selon la politique de conservation.`)) return;
    const response = await fetch(`/api/documents/${document.id}`, { method: "DELETE" });
    if (!response.ok) { const result = await response.json(); setError(result.error ?? "Suppression impossible."); return; }
    setDocuments((current) => current.filter((item) => item.id !== document.id));
    onToast?.("Document retiré de la bibliothèque");
  };

  return <section className={compact ? "resource-documents compact" : "resource-documents"} aria-labelledby={compact ? "resource-documents-title" : undefined}>
    {compact && <header><div><p className="eyebrow">DOCUMENTS</p><h2 id="resource-documents-title">Documents liés</h2></div><button className="button primary" onClick={() => setDialogOpen(true)}><Plus size={15}/>Ajouter un document</button></header>}
    {!compact && <div className="security-banner"><ShieldCheck size={20}/><div><b>Documents privés et contrôlés</b><span>Validation binaire, accès tenant et liens temporaires de cinq minutes. Aucune URL publique permanente.</span></div></div>}
    {!compact && <div className="document-filters"><label><span>Rechercher</span><input value={search} onChange={(event) => setSearch(event.target.value)} placeholder="Nom, catégorie, ressource…"/></label><label><span>Catégorie</span><select value={category} onChange={(event) => setCategory(event.target.value)}><option value="">Toutes</option>{DOCUMENT_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Ressource</span><select value={typeFilter} onChange={(event) => setTypeFilter(event.target.value)}><option value="">Tous les types</option>{DOCUMENT_RESOURCE_TYPES.map((item) => <option key={item}>{item}</option>)}</select></label><label><span>Depuis le</span><input type="date" value={from} onChange={(event) => setFrom(event.target.value)}/></label><label><span>Uploader</span><input value={uploader} onChange={(event) => setUploader(event.target.value)} placeholder="Nom ou identifiant"/></label></div>}
    {error && <p className="document-library-error" role="alert">{error}</p>}
    {loading ? <div className="document-library-empty"><LoaderCircle className="spin"/><span>Chargement des documents…</span></div> : documents.length === 0 ? <div className="document-library-empty"><FileText/><b>Aucun document</b><span>Ajoutez un premier fichier PDF, image ou document Word.</span>{compact && <button className="button secondary" onClick={() => setDialogOpen(true)}>Ajouter</button>}</div> : <div className="data-panel responsive-table document-library"><div className="data-row document-row data-head"><span>Document</span><span>Catégorie</span><span>Ressource liée</span><span>Date</span><span>Taille</span><span>Uploader</span><span>Actions</span></div>{documents.map((document) => <div className="data-row document-row" key={document.id}><span className="primary-cell"><i className="doc-icon"><FileText size={16}/></i><span><b>{document.name}</b><small>{document.originalName}</small></span></span><span>{document.category}</span><span><b>{document.resourceLabel ?? "Bibliothèque générale"}</b><small>{document.resourceType}</small></span><span>{new Intl.DateTimeFormat("fr-SN").format(new Date(document.documentDate ?? document.createdAt))}</span><span>{formatSize(document.size)}</span><span>{document.uploaderName}</span><span className="document-actions"><button aria-label={`Voir ${document.name}`} onClick={() => void openDocument(document, "inline")}><Eye size={14}/></button><button aria-label={`Télécharger ${document.name}`} onClick={() => void openDocument(document, "attachment")}><Download size={14}/></button><button className="danger" aria-label={`Supprimer ${document.name}`} onClick={() => void removeDocument(document)}><Trash2 size={14}/></button></span></div>)}</div>}
    {dialogOpen && <DocumentUploadDialog resourceType={resourceType} resourceId={resourceId} resourceLabel={resourceLabel} onClose={() => setDialogOpen(false)} onUploaded={(document) => { setDialogOpen(false); setDocuments((current) => [document, ...current]); onToast?.("Document téléversé avec succès"); }}/>}
  </section>;
}

function formatSize(bytes: number) { return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} Mo` : `${Math.ceil(bytes / 1024)} Ko`; }
