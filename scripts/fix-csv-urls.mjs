// scripts/fix-csv-urls.mjs
// Updates old GoDaddy /files/... paths in products.csv to Vercel Blob URLs.
// Run: node scripts/fix-csv-urls.mjs

import { readFile, writeFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = join(__dirname, '..');

const BLOB_RESULTS_PATH = join(ROOT, 'blob-upload-results.json');
const CSV_PATH = join(ROOT, 'public/data/products.csv');

async function main() {
  // Build lookup map: "YYYY/MM/filename.ext" → blob URL
  const blobResults = JSON.parse(await readFile(BLOB_RESULTS_PATH, 'utf8'));
  const blobMap = new Map();
  for (const { file, url } of blobResults) {
    if (url) blobMap.set(file, url);
  }
  console.log(`Loaded ${blobMap.size} blob URL mappings.`);

  // Read the CSV as plain text to preserve formatting exactly
  const csv = await readFile(CSV_PATH, 'utf8');
  const lines = csv.split('\n');

  let replacedImages = 0;
  let replacedSpecs = 0;
  let missingImages = [];
  let missingSpecs = [];

  // Find column indexes from header row
  const headers = lines[0].split(',');
  const imageCol = headers.findIndex(h => h.trim() === 'Images/Gallery');
  const specCol = headers.findIndex(h => h.trim() === 'Spec Sheet Link');

  if (imageCol === -1 || specCol === -1) {
    console.error('Could not find "Images/Gallery" or "Spec Sheet Link" columns in CSV header.');
    process.exit(1);
  }

  // Process each data row with a simple field-aware replacement.
  // We replace /files/YYYY/MM/filename → blob URL in the raw text.
  // Using regex replacement on each line is safe because the paths are unique filenames.
  const updatedLines = lines.map((line, i) => {
    if (i === 0) return line; // skip header

    // Replace all occurrences of /files/YYYY/MM/... paths in this line
    return line.replace(/\/files\/(\d{4}\/\d{2}\/[^\s,"]+)/g, (match, relativePath) => {
      // Try both the raw path and URL-decoded version (e.g. %2B → +)
      const blobUrl = blobMap.get(relativePath) ?? blobMap.get(decodeURIComponent(relativePath));
      if (blobUrl) {
        // Determine if this looks like a spec sheet or image for counting
        if (relativePath.endsWith('.pdf') || relativePath.toLowerCase().includes('spec')) {
          replacedSpecs++;
        } else {
          replacedImages++;
        }
        return blobUrl;
      } else {
        // Track missing files
        if (relativePath.endsWith('.pdf')) {
          missingSpecs.push(relativePath);
        } else {
          missingImages.push(relativePath);
        }
        return match; // leave unchanged
      }
    });
  });

  const updatedCsv = updatedLines.join('\n');
  await writeFile(CSV_PATH, updatedCsv, 'utf8');

  console.log(`\n--- Results ---`);
  console.log(`Images replaced:    ${replacedImages}`);
  console.log(`Spec sheets replaced: ${replacedSpecs}`);

  if (missingImages.length > 0) {
    console.log(`\nImages NOT found in blob (${missingImages.length}) — still using old path:`);
    missingImages.forEach(f => console.log(`  /files/${f}`));
  }

  if (missingSpecs.length > 0) {
    console.log(`\nSpec sheets NOT found in blob (${missingSpecs.length}) — still using old path:`);
    missingSpecs.forEach(f => console.log(`  /files/${f}`));
  }

  if (missingImages.length === 0 && missingSpecs.length === 0) {
    console.log(`\nAll paths updated successfully.`);
  } else {
    console.log(`\nFiles not found need to be uploaded to Vercel Blob manually.`);
    console.log(`Run: node --env-file=.env.local scripts/upload-to-blob.mjs <folder-with-missing-files>`);
  }

  console.log(`\nUpdated CSV saved to: public/data/products.csv`);
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
