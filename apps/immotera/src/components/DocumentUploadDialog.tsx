"use client";

import { FileCheck2, FileText, LoaderCircle, UploadCloud, X } from "lucide-react";
import { type DragEvent, type FormEvent, useEffect, useRef, useState } from "react";
import { DOCUMENT_ACCEPT, DOCUMENT_CATEGORIES, DOCUMENT_RESOURCE_TYPES, type DocumentResourceType } from "@/lib/documents/config";
import type { DocumentRecord } from "@/lib/documents/types";

interface DocumentUploadDialogProps {
  onClose: () => void;
  onUploaded: (document: DocumentRecord) => void;
  resourceType?: DocumentResourceType;
  resourceId?: string;
  resourceLabel?: string;
}

interface UploadConfig { mode: "blob" | "server"; pathname: string; maxSizeBytes: number; maxSizeMb: number }

export function DocumentUploadDialog({ onClose, onUploaded, resourceType = "OTHER", resourceId = "", resourceLabel }: DocumentUploadDialogProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [name, setName] = useState("");
  const [category, setCategory] = useState<(typeof DOCUMENT_CATEGORIES)[number]>("Administratif");
  const [selectedResourceType, setSelectedResourceType] = useState<DocumentResourceType>(resourceType);
  const [selectedResourceId, setSelectedResourceId] = useState(resourceId);
  const [maxSize, setMaxSize] = useState<{ bytes: number; mb: number } | null>(null);
  const [dragging, setDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    void fetch("/api/documents/config").then((response) => response.ok ? response.json() : null).then((data) => {
      if (data) setMaxSize({ bytes: data.maxSizeBytes, mb: data.maxSizeMb });
    });
  }, []);

  const chooseFile = (next?: File) => {
    if (!next) return;
    setError("");
    if (maxSize && next.size > maxSize.bytes) { setError(`Ce fichier dépasse la limite de ${maxSize.mb} Mo.`); return; }
    setFile(next);
    if (!name) setName(next.name.replace(/\.[^.]+$/, "").replaceAll("_", " "));
  };

  const onDrop = (event: DragEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setDragging(false);
    chooseFile(event.dataTransfer.files[0]);
  };

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) { setError("Sélectionnez un fichier à téléverser."); return; }
    if (selectedResourceType !== "OTHER" && !selectedResourceId) { setError("Sélectionnez ou indiquez la ressource liée."); return; }
    setSubmitting(true); setProgress(4); setError("");
    const form = new FormData(event.currentTarget);
    form.set("file", file);
    form.set("resourceType", selectedResourceType);
    form.set("resourceId", selectedResourceId);
    try {
      const configResponse = await fetch("/api/documents/config", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ originalName: file.name }) });
      const config = await configResponse.json() as UploadConfig & { error?: string };
      if (!configResponse.ok) throw new Error(config.error ?? "Le téléversement a échoué.");
      let response: Response;
      if (config.mode === "blob") {
        const { upload } = await import("@vercel/blob/client");
        const blob = await upload(config.pathname, file, { access: "private", handleUploadUrl: "/api/documents/blob", contentType: file.type, multipart: file.size > 5 * 1024 * 1024, onUploadProgress: ({ percentage }) => setProgress(Math.max(5, Math.round(percentage * .86))) });
        const metadata = Object.fromEntries(form.entries());
        delete metadata.file;
        response = await fetch("/api/documents/finalize", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ ...metadata, tags: String(metadata.tags ?? "").split(",").map((tag) => tag.trim()).filter(Boolean), resourceId: selectedResourceId || null, originalName: file.name, storageKey: blob.url, mimeType: blob.contentType || file.type, size: file.size }) });
      } else {
        setProgress(24);
        response = await fetch("/api/documents/upload", { method: "POST", body: form });
        setProgress(88);
      }
      const result = await response.json() as { data?: DocumentRecord; error?: string };
      if (!response.ok || !result.data) throw new Error(result.error ?? "Le téléversement a échoué. Aucun document n’a été enregistré.");
      setProgress(100);
      onUploaded(result.data);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "Le téléversement a échoué. Aucun document n’a été enregistré.");
      setProgress(0);
    } finally { setSubmitting(false); }
  };

  return <div className="dialog-layer" role="dialog" aria-modal="true" aria-labelledby="document-upload-title">
    <button className="dialog-backdrop" onClick={onClose} aria-label="Fermer"/>
    <form className="entry-dialog document-upload-dialog" onSubmit={submit}>
      <header><div><p className="eyebrow">DOCUMENT PRIVÉ</p><h2 id="document-upload-title">Ajouter un document</h2></div><button type="button" onClick={onClose} aria-label="Fermer"><X size={18}/></button></header>
      <div className="document-upload-fields">
        <button type="button" className={`document-drop-zone ${dragging ? "dragging" : ""}`} onClick={() => inputRef.current?.click()} onDragEnter={() => setDragging(true)} onDragLeave={() => setDragging(false)} onDragOver={(event) => event.preventDefault()} onDrop={onDrop}>
          {file ? <><FileCheck2 size={27}/><b>{file.name}</b><span>{formatSize(file.size)} · Cliquer pour remplacer</span></> : <><UploadCloud size={29}/><b>Glissez-déposez votre document ici</b><span>ou parcourir les fichiers</span></>}
          <small>PDF, JPG, PNG, WEBP, DOC ou DOCX · {maxSize ? `${maxSize.mb} Mo maximum` : "limite en cours de chargement"}</small>
        </button>
        <input ref={inputRef} hidden type="file" accept={DOCUMENT_ACCEPT} onChange={(event) => chooseFile(event.target.files?.[0])}/>
        <div className="form-grid">
          <label><span>Nom du document</span><input name="name" required maxLength={180} value={name} onChange={(event) => setName(event.target.value)} placeholder="Ex. Permis de construire"/></label>
          <label><span>Catégorie</span><select name="category" value={category} onChange={(event) => setCategory(event.target.value as typeof category)}>{DOCUMENT_CATEGORIES.map((item) => <option key={item}>{item}</option>)}</select></label>
          <label><span>Type de ressource</span><select name="resourceType" value={selectedResourceType} disabled={Boolean(resourceId)} onChange={(event) => setSelectedResourceType(event.target.value as DocumentResourceType)}>{DOCUMENT_RESOURCE_TYPES.map((type) => <option key={type} value={type}>{resourceTypeLabel(type)}</option>)}</select></label>
          <label><span>Ressource liée</span>{resourceId ? <input value={resourceLabel ?? resourceId} disabled/> : <input name="resourceId" value={selectedResourceId} disabled={selectedResourceType === "OTHER"} onChange={(event) => setSelectedResourceId(event.target.value)} placeholder="Identifiant de la ressource"/>}</label>
          <label><span>Date du document</span><input name="documentDate" type="date"/></label>
          <label><span>Tags facultatifs</span><input name="tags" placeholder="bail, signé, 2026"/></label>
          <label className="full"><span>Description</span><textarea name="description" maxLength={2000} placeholder="Informations utiles sur ce document…"/></label>
        </div>
        {progress > 0 && <div className="document-upload-progress" aria-label={`Téléversement ${progress} %`}><i style={{ width: `${progress}%` }}/><span>{progress} %</span></div>}
        {error && <p className="document-upload-error" role="alert">{error}</p>}
      </div>
      <footer><button type="button" className="button secondary" onClick={onClose} disabled={submitting}>Annuler</button><button className="button primary" disabled={submitting || !file}>{submitting ? <><LoaderCircle className="spin" size={15}/>Téléversement…</> : <><FileText size={15}/>Ajouter le document</>}</button></footer>
    </form>
  </div>;
}

function formatSize(bytes: number) { return bytes >= 1024 * 1024 ? `${(bytes / 1024 / 1024).toFixed(1)} Mo` : `${Math.ceil(bytes / 1024)} Ko`; }
function resourceTypeLabel(type: DocumentResourceType) { return ({ PROPERTY: "Bien", PROJECT: "Projet", BUILDING: "Immeuble", UNIT: "Unité", OWNER: "Propriétaire", TENANT: "Locataire", CONTRACT: "Contrat", MAINTENANCE: "Maintenance", VENDOR: "Fournisseur", OTHER: "Autre / général" } as Record<DocumentResourceType, string>)[type]; }
