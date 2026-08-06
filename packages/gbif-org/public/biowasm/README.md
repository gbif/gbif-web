# Vendored biowasm tools

WebAssembly builds of bioinformatics tools, self-hosted here so the app loads them from its own
origin (CSP-clean, version-pinned, no dependency on the biowasm CDN). Loaded at runtime by
`@biowasm/aioli` via a per-tool `urlPrefix` pointing at `/biowasm/<tool>/<version>`.

## Tools

- `kalign/3.3.1/` — multiple sequence aligner (`kalign.js`, `kalign.wasm`). Single-threaded, so
  no COOP/COEP headers are required.

## Reproducing / updating

Files come from the biowasm CDN (`https://biowasm.com/cdn/v3/<tool>/<version>/`). To refetch:

```sh
V=3.3.1
mkdir -p public/biowasm/kalign/$V
for f in kalign.js kalign.wasm; do
  curl -fsSL -A "Mozilla/5.0" -o "public/biowasm/kalign/$V/$f" \
    "https://biowasm.com/cdn/v3/kalign/$V/$f"
done
```

Keep the version in the folder name in sync with the `urlPrefix`/`version` passed to Aioli in
`src/components/dashboard/charts/sequencePhylogeny/compute/kalign.ts`.
