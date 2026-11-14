import { gzipSync } from "node:zlib";
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";

const root = process.cwd();
const dist = path.join(root, "dist");
const mimeTypes = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
};
const files = [];

function walk(directory) {
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (entry.name !== ".openai" && entry.name !== "server") walk(fullPath);
      continue;
    }
    if (entry.name.startsWith(".")) continue;
    files.push(fullPath);
  }
}

walk(dist);
const assets = {};
for (const file of files) {
  const relativePath = "/" + path.relative(dist, file).split(path.sep).join("/");
  const extension = path.extname(file).toLowerCase();
  const contents = readFileSync(file);
  assets[relativePath] = {
    body: gzipSync(contents, { level: 9 }).toString("base64"),
    contentType: mimeTypes[extension] || "application/octet-stream",
  };
}

const workerPath = path.join(root, "worker", "index.js");
const source = readFileSync(workerPath, "utf8");
if (!source.includes("__STATIC_ASSETS__")) throw new Error("Worker source is missing the static-assets placeholder.");
const output = path.join(dist, "server", "index.js");
mkdirSync(path.dirname(output), { recursive: true });
writeFileSync(output, source.replace("__STATIC_ASSETS__", JSON.stringify(assets)));
console.log(`Built static Worker for ${files.length} files (${(Buffer.byteLength(readFileSync(output)) / 1024 / 1024).toFixed(2)} MiB source).`);
