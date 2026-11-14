# AetherTech

The AetherTech company site is in `dist/`. Its branch cards link to AetherAI, AetherSoft Studio, and AetherLabs. The transparent AetherTech wordmark and favicon are in `dist/assets/`.

Build the Cloudflare Worker bundle with:

```sh
node scripts/build-worker.mjs
```

The generated entry point is `dist/server/index.js`. Do not put API keys or other secrets in this repository.
