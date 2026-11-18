// Tool results are plain text in a fixed layout. The reader is a model, so labels and their order never
// change, each fact is stated once, and rows are compact lines, not JSON.
export interface Result {
  headline: string;
  /** The filter in strict form, to paste back in. */
  reuse?: string;
  notApplied?: string[];
  body?: string[];
  see?: string;
  live?: string;
  api?: string;
  hint?: string;
}

export function renderResult(r: Result): string {
  const out: string[] = [r.headline];
  const meta: string[] = [];
  if (r.reuse) meta.push(`Reuse: ${r.reuse}`);
  for (const n of r.notApplied ?? []) meta.push(`Not applied: ${n}`);
  if (meta.length) out.push('', ...meta);
  if (r.body?.length) out.push('', ...r.body);
  const links: string[] = [];
  if (r.see) links.push(`See it: ${r.see}`);
  if (r.live) links.push(`Live view: ${r.live}`);
  if (r.api) links.push(`API: GET ${r.api}`);
  if (links.length) out.push('', ...links);
  if (r.hint) out.push('', `Hint: ${r.hint}`);
  return out.join('\n');
}

export const fmt = (n: number) => n.toLocaleString('en-US');
