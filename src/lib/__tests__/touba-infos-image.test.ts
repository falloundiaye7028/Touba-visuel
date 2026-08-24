import { describe, expect, it } from "vitest";
import { editorialImageSrc, isVercelBlobUrl } from "@/lib/touba-infos-image";

const BLOB_URL = "https://876xi1t4drtxireu.public.blob.vercel-storage.com/touba-infos/articles/img-8414-I5ptEXFpTnqjk0yxTcF0QyPAPM6DO5.jpg";

describe("Touba Infos editorial images", () => {
  it("keeps Vercel Blob URLs unchanged so the original file is rendered", () => {
    expect(isVercelBlobUrl(BLOB_URL)).toBe(true);
    expect(editorialImageSrc(BLOB_URL)).toBe(BLOB_URL);
  });

  it("uses the editorial fallback only when no image URL exists", () => {
    expect(editorialImageSrc(undefined)).toBeUndefined();
    expect(editorialImageSrc("   ")).toBeUndefined();
  });
});
