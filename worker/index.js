const STATIC_ASSETS = __STATIC_ASSETS__;

const SECURITY_HEADERS = {
  "x-content-type-options": "nosniff",
  "x-frame-options": "DENY",
  "referrer-policy": "strict-origin-when-cross-origin",
  "permissions-policy": "camera=(), microphone=(), geolocation=()",
  "content-security-policy": "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self' data: blob:; font-src 'self' data:; connect-src 'self' https://aether-ai.aether-dev.workers.dev; frame-src 'none'; frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'; upgrade-insecure-requests",
};

const MIME_TYPES = {
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

function decodeBase64(value) {
  const binary = atob(value);
  const bytes = new Uint8Array(binary.length);
  for (let index = 0; index < binary.length; index += 1) bytes[index] = binary.charCodeAt(index);
  return bytes;
}

function notFound() {
  return new Response("Not found", { status: 404, headers: SECURITY_HEADERS });
}

async function serveStatic(request, url) {
  if (request.method !== "GET" && request.method !== "HEAD") {
    return new Response("Method not allowed", { status: 405, headers: { ...SECURITY_HEADERS, allow: "GET, HEAD" } });
  }

  let pathname;
  try {
    pathname = decodeURIComponent(url.pathname);
  } catch {
    return notFound();
  }
  if (pathname === "/") pathname = "/index.html";
  else if (pathname.endsWith("/")) pathname += "index.html";
  else if (!pathname.split("/").at(-1).includes(".")) pathname += ".html";

  const asset = STATIC_ASSETS[pathname];
  if (!asset) return notFound();

  const body = decodeBase64(asset.body);
  const stream = new Response(body).body.pipeThrough(new DecompressionStream("gzip"));
  const headers = new Headers(SECURITY_HEADERS);
  headers.set("content-type", asset.contentType || MIME_TYPES[pathname.slice(pathname.lastIndexOf("."))] || "application/octet-stream");
  headers.set("cache-control", pathname.endsWith(".html") ? "public, max-age=300" : "public, max-age=3600");
  return new Response(request.method === "HEAD" ? null : stream, { status: 200, headers });
}

export default {
  async fetch(request) {
    return serveStatic(request, new URL(request.url));
  },
};
