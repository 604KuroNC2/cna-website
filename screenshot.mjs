import { createRequire } from "module";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Try to find puppeteer from known locations
const puppeteerPaths = [
  path.join(__dirname, "node_modules", "puppeteer"),
  "C:/Users/nateh/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer",
  "C:/Users/ayuet/AppData/Local/Temp/puppeteer-test/node_modules/puppeteer",
];

let puppeteer;
for (const p of puppeteerPaths) {
  try {
    const req = createRequire(import.meta.url);
    puppeteer = req(p);
    break;
  } catch {}
}

if (!puppeteer) {
  try {
    const mod = await import("puppeteer");
    puppeteer = mod.default || mod;
  } catch {
    console.error("Puppeteer not found. Run: npm install puppeteer");
    process.exit(1);
  }
}

const dir = path.join(__dirname, "temporary screenshots");
if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });

const url = process.argv[2] || "http://localhost:3000";
const label = process.argv[3] || "";

const existing = fs.readdirSync(dir).filter((f) => f.endsWith(".png"));
const nums = existing.map((f) => parseInt(f.match(/screenshot-(\d+)/)?.[1] || "0"));
const next = Math.max(0, ...nums) + 1;
const filename = label ? `screenshot-${next}-${label}.png` : `screenshot-${next}.png`;
const outPath = path.join(dir, filename);

// Chrome executable locations to try
const chromePaths = [
  "C:/Users/nateh/.cache/puppeteer/chrome/win64-127.0.2651.105/chrome-win64/chrome.exe",
  "C:/Users/ayuet/.cache/puppeteer/chrome/win64-127.0.2651.105/chrome-win64/chrome.exe",
  "C:/Users/ayuet/.cache/puppeteer/chrome/win64-148.0.7778.97/chrome-win64/chrome.exe",
  process.env.PUPPETEER_EXEC_PATH,
].filter(Boolean);

let executablePath;
for (const p of chromePaths) {
  if (p && fs.existsSync(p)) { executablePath = p; break; }
}

const browser = await puppeteer.launch({
  executablePath,
  headless: true,
  args: ["--no-sandbox", "--disable-setuid-sandbox", "--disable-gpu"],
});

const page = await browser.newPage();
await page.setViewport({ width: 1440, height: 900 });
await page.goto(url, { waitUntil: "networkidle0", timeout: 30000 });
await new Promise((r) => setTimeout(r, 2000));
await page.screenshot({ path: outPath, fullPage: false });
await browser.close();

console.log(`Screenshot saved: ${outPath}`);
