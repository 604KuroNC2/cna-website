// File upload validation — magic bytes, extension, size, content scan

const MAX_FILE_SIZE_BYTES = 50 * 1024 * 1024; // 50 MB

// XLSX / ZIP magic bytes: PK\x03\x04
const XLSX_MAGIC = new Uint8Array([0x50, 0x4b, 0x03, 0x04]);

// Characters that are illegal in CSV context (signs of script injection)
const DANGEROUS_CSV_PATTERNS = [
  /<script/i,
  /<\/script/i,
  /javascript:/i,
  /vbscript:/i,
  /<object/i,
  /<embed/i,
  /<iframe/i,
  // Formula injection: prevent cells starting with = + - @ that call functions
  // These are stripped at field level when needed; here we just flag obvious cases
];

export interface ValidationResult {
  ok: boolean;
  error?: string;
}

function startsWith(buf: Uint8Array, magic: Uint8Array): boolean {
  if (buf.length < magic.length) return false;
  for (let i = 0; i < magic.length; i++) {
    if (buf[i] !== magic[i]) return false;
  }
  return true;
}

export async function validateCatalogFile(file: File): Promise<ValidationResult> {
  // 1. Size check
  if (file.size === 0) {
    return { ok: false, error: "File is empty." };
  }
  if (file.size > MAX_FILE_SIZE_BYTES) {
    return { ok: false, error: `File exceeds the 50 MB size limit (${(file.size / 1024 / 1024).toFixed(1)} MB).` };
  }

  // 2. Extension check (case-insensitive)
  const name = file.name.toLowerCase();
  const isCSV = name.endsWith(".csv");
  const isXLSX = name.endsWith(".xlsx") || name.endsWith(".xls");
  if (!isCSV && !isXLSX) {
    return { ok: false, error: "Only .csv and .xlsx files are accepted." };
  }

  // 3. Magic byte check — read first 8 bytes
  const headerSlice = file.slice(0, 8);
  const headerBuf = new Uint8Array(await headerSlice.arrayBuffer());

  if (isXLSX) {
    // XLSX is a ZIP container — must start with PK\x03\x04
    if (!startsWith(headerBuf, XLSX_MAGIC)) {
      return { ok: false, error: "File does not appear to be a valid Excel file (bad magic bytes)." };
    }
  } else {
    // CSV: first byte must be a printable ASCII character or UTF-8 BOM
    const firstByte = headerBuf[0];
    const hasBOM = headerBuf[0] === 0xef && headerBuf[1] === 0xbb && headerBuf[2] === 0xbf;
    const isPrintable = firstByte >= 0x09 && firstByte <= 0x7e;
    if (!hasBOM && !isPrintable) {
      return { ok: false, error: "File does not appear to be a valid CSV (unexpected binary content)." };
    }
  }

  // 4. Content scan for script injection (CSV only — XLSX is binary)
  if (isCSV) {
    // Read a sample (first 512 KB) to scan for dangerous patterns
    const sampleSlice = file.slice(0, 512 * 1024);
    const sampleText = await sampleSlice.text();
    for (const pattern of DANGEROUS_CSV_PATTERNS) {
      if (pattern.test(sampleText)) {
        return { ok: false, error: "File contains potentially unsafe content and was rejected." };
      }
    }
  }

  return { ok: true };
}

// Sanitize a single CSV field value before displaying as HTML
// Strips leading formula-injection characters and HTML-encodes special chars
export function sanitizeFieldValue(value: string): string {
  if (!value) return "";
  // Strip formula injection prefixes (=, +, -, @, tab, carriage return at start)
  let sanitized = value.replace(/^[=+\-@\t\r]+/, "");
  // HTML-encode to prevent XSS when rendered via dangerouslySetInnerHTML
  sanitized = sanitized
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;");
  return sanitized;
}
