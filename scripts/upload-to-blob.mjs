import { put } from "@vercel/blob";
import { readdir, readFile, writeFile } from "fs/promises";
import { join, relative } from "path";
import { homedir } from "os";

const args = process.argv.slice(2);
const csvFlag = args.indexOf("--from-csv");
const resumeFlag = args.indexOf("--resume");
const inputDir = args.find((a) => !a.startsWith("--"));

if (!inputDir) {
  console.error(
    "Usage: node scripts/upload-to-blob.mjs <directory> [--from-csv] [--resume]"
  );
  console.error("  --from-csv   Only upload files referenced in the product CSV");
  console.error("  --resume     Skip files already successfully uploaded");
  process.exit(1);
}

const resolvedDir = inputDir.startsWith("~/")
  ? join(homedir(), inputDir.slice(2))
  : inputDir;

const RESULTS_FILE = "blob-upload-results.json";
const CSV_FILE = "cna-product-database-catalog-website.csv";

async function collectFiles(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  const files = [];
  for (const entry of entries) {
    const fullPath = join(dir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await collectFiles(fullPath)));
    } else {
      files.push(fullPath);
    }
  }
  return files;
}

async function getCsvFilePaths() {
  const csv = await readFile(CSV_FILE, "utf8");
  const re = /https:\/\/www\.cnalighting\.com\/wp-content\/uploads\/([^\s,"]+)/g;
  const paths = new Set([...csv.matchAll(re)].map((m) => m[1]));
  return paths;
}

async function getAlreadyUploaded() {
  try {
    const data = await readFile(RESULTS_FILE, "utf8");
    const results = JSON.parse(data);
    return new Set(results.filter((r) => r.url).map((r) => r.file));
  } catch {
    return new Set();
  }
}

let targetPaths = null;
if (csvFlag !== -1) {
  targetPaths = await getCsvFilePaths();
  console.log(`CSV mode: ${targetPaths.size} files referenced in product database.`);
}

const alreadyUploaded = resumeFlag !== -1 ? await getAlreadyUploaded() : new Set();
if (resumeFlag !== -1) {
  console.log(`Resume mode: ${alreadyUploaded.size} already uploaded, skipping.`);
}

const allFiles = await collectFiles(resolvedDir);

const toUpload = allFiles.filter((filePath) => {
  const rel = relative(resolvedDir, filePath);
  if (alreadyUploaded.has(rel)) return false;
  if (targetPaths && !targetPaths.has(rel)) return false;
  return true;
});

console.log(`Uploading ${toUpload.length} files...\n`);

let results = [];
if (resumeFlag !== -1) {
  try {
    results = JSON.parse(await readFile(RESULTS_FILE, "utf8"));
  } catch {}
}

let uploaded = 0;
let failed = 0;

for (const filePath of toUpload) {
  const relativePath = relative(resolvedDir, filePath);
  try {
    const data = await readFile(filePath);
    const blob = await put(relativePath, data, {
      access: "public",
      addRandomSuffix: false,
    });
    results.push({ file: relativePath, url: blob.url });
    uploaded++;
    console.log(`[${uploaded}/${toUpload.length}] ${relativePath}`);
  } catch (err) {
    failed++;
    console.error(`  FAILED: ${relativePath} — ${err.message}`);
    results.push({ file: relativePath, url: null, error: err.message });
  }
}

await writeFile(RESULTS_FILE, JSON.stringify(results, null, 2));
console.log(`\nDone. ${uploaded} uploaded, ${alreadyUploaded.size} skipped, ${failed} failed.`);
console.log(`Results written to ${RESULTS_FILE}`);
