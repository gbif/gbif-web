import { buildFasta, parseFasta } from './fasta';

// kalign is vendored under public/biowasm/kalign/<version>/ and served same-origin (see
// public/biowasm/README.md). Aioli loads `${urlPrefix}/kalign.js` + `.wasm` from here, so no
// biowasm CDN call is made. kalign 3.3.1 is single-threaded → no COOP/COEP headers needed.
export const KALIGN_VERSION = '3.3.1';

/**
 * Multiple-sequence-align `seqById` with kalign (WebAssembly, in a web worker via Aioli).
 * Returns id -> aligned sequence (all equal length). The `@biowasm/aioli` import is dynamic so
 * the wasm only loads when this runs (client-side). With < 2 sequences there is nothing to
 * align, so the input is returned unchanged.
 */
export async function alignSequences(
  seqById: Record<string, string>
): Promise<Record<string, string>> {
  const ids = Object.keys(seqById);
  if (ids.length < 2) return { ...seqById };

  const { default: Aioli } = await import('@biowasm/aioli');
  // Absolute URL (with origin) is required: Aioli runs in a blob-based web worker whose
  // importScripts cannot resolve a root-relative path like "/biowasm/...".
  const urlPrefix = `${window.location.origin}/biowasm/kalign/${KALIGN_VERSION}`;
  const CLI = await new Aioli([{ tool: 'kalign', version: KALIGN_VERSION, urlPrefix }]);
  await CLI.mount({ name: 'input.fa', data: buildFasta(seqById) });
  await CLI.exec('kalign input.fa -f fasta -o result.fasta');
  const aligned: string = await CLI.cat('result.fasta');
  return parseFasta(aligned);
}
