// Server-only: catalog CSV stored in Vercel Blob, never exposed to browser
import { put } from "@vercel/blob";
import iconv from "iconv-lite";

export const CATALOG_PATHNAME = "catalog/products.csv";
export const CATALOG_URL = `https://6dywl8dmjehpqrx0.public.blob.vercel-storage.com/${CATALOG_PATHNAME}`;

// Fallback path used during local dev before any blob upload
const LOCAL_FALLBACK = "public/data/products.csv";

export async function fetchCatalogText(): Promise<string> {
  // Try Vercel Blob first
  try {
    const res = await fetch(CATALOG_URL, { next: { revalidate: 60 } });
    if (res.ok) {
      const text = await res.text();
      // Strip UTF-8 BOM if present
      return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
    }
  } catch {}

  // Filesystem fallback: works in dev and on Vercel (public/ is included in the deployment bundle)
  try {
    const { readFileSync } = await import("fs");
    const { join } = await import("path");
    const raw = readFileSync(join(process.cwd(), LOCAL_FALLBACK));
    const text = iconv.decode(raw, "utf8");
    return text.charCodeAt(0) === 0xfeff ? text.slice(1) : text;
  } catch {}

  throw new Error("Catalog CSV not available");
}

export async function uploadCatalog(buffer: Buffer): Promise<string> {
  // Detect and normalise encoding to UTF-8
  const hasBOM = buffer[0] === 0xef && buffer[1] === 0xbb && buffer[2] === 0xbf;
  let text: string;
  if (hasBOM) {
    text = buffer.slice(3).toString("utf8");
  } else {
    // Assume Latin-1 (Windows default CSV save)
    text = iconv.decode(buffer, "latin1");
  }

  // Fix corrupted ≥ (stored as ? before digits in some exports)
  text = text.replace(/\?\s*(?=\d)/g, "≥ ");

  const utf8 = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(text, "utf8")]);

  const { url } = await put(CATALOG_PATHNAME, utf8, {
    access: "public",
    addRandomSuffix: false,
    contentType: "text/csv; charset=utf-8",
  });

  return url;
}
