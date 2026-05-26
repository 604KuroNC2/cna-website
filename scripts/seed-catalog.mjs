/**
 * One-time script: uploads public/data/products.csv to Vercel Blob at catalog/products.csv.
 * Run with: node scripts/seed-catalog.mjs
 * Requires BLOB_READ_WRITE_TOKEN in .env.local
 */

import { readFileSync } from "fs";
import { join } from "path";
import { put } from "@vercel/blob";
import iconv from "iconv-lite";
// Load .env.local manually (no dotenv dependency needed)
import { readFileSync as _readEnv } from "fs";
try {
  const env = _readEnv(".env.local", "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^([A-Z_][A-Z0-9_]*)=(.*)$/);
    if (m) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const CSV_PATH = join(process.cwd(), "public", "data", "products.csv");
const CATALOG_PATHNAME = "catalog/products.csv";

console.log(`Reading ${CSV_PATH}...`);
const raw = readFileSync(CSV_PATH);

// Detect encoding
const hasBOM = raw[0] === 0xef && raw[1] === 0xbb && raw[2] === 0xbf;
let text;
if (hasBOM) {
  text = raw.slice(3).toString("utf8");
} else {
  text = iconv.decode(raw, "latin1");
}

// Fix corrupted ≥ symbol
text = text.replace(/\?\s*(?=\d)/g, "≥ ");

const utf8 = Buffer.concat([Buffer.from([0xef, 0xbb, 0xbf]), Buffer.from(text, "utf8")]);

console.log(`Uploading ${utf8.length} bytes to Vercel Blob at ${CATALOG_PATHNAME}...`);
const { url } = await put(CATALOG_PATHNAME, utf8, {
  access: "public",
  addRandomSuffix: false,
  contentType: "text/csv; charset=utf-8",
});

console.log(`Done! Blob URL: ${url}`);
