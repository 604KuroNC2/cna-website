// Start the CNA Lighting Next.js dev server.
// Next.js dev mode has built-in hot reload — edits to any file will auto-refresh the browser.
// Run with: "C:/Program Files/nodejs/node.exe" serve.mjs
import { spawn } from "child_process";
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Find node.exe
const nodeCandidates = [
  process.execPath,
  "C:/Program Files/nodejs/node.exe",
  "C:/Program Files (x86)/nodejs/node.exe",
];
const nodeExe = nodeCandidates.find((p) => p && fs.existsSync(p)) || "node";

const nextScript = path.join(__dirname, "node_modules/next/dist/bin/next");

console.log("Starting CNA Lighting dev server at http://localhost:3000");
console.log("Hot reload is active — file changes apply automatically.");
console.log("Press Ctrl+C to stop.\n");

const child = spawn(nodeExe, [nextScript, "dev", "--port", "3000"], {
  cwd: __dirname,
  stdio: "inherit",
});

child.on("error", (err) => {
  console.error("Failed to start server:", err.message);
  process.exit(1);
});

child.on("exit", (code) => process.exit(code ?? 0));
