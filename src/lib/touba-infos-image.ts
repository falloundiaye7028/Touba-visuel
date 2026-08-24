/**
 * Les URLs Vercel Blob sont déjà des fichiers livrés par le CDN : elles ne
 * prennent pas en charge les paramètres de transformation Cloudinary.
 */
export function isVercelBlobUrl(url: string): boolean {
  try {
    return new URL(url).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
}

export function editorialImageSrc(imageUrl?: string): string | undefined {
  const url = imageUrl?.trim();
  if (!url) return undefined;

  if (isVercelBlobUrl(url) || url.includes("?")) return url;
  return `${url}?auto=format&fit=crop&w=1200&q=70`;
}
