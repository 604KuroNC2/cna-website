const BLOB_HOST = "https://6dywl8dmjehpqrx0.public.blob.vercel-storage.com";

export function toBlobShortUrl(url: string): string {
  if (!url) return url;
  if (url.startsWith(BLOB_HOST)) {
    return "/file" + url.slice(BLOB_HOST.length);
  }
  return url;
}
