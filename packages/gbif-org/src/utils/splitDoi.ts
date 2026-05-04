export function splitDoi(doi: string): { prefix: string; suffix: string } {
  const i = doi.indexOf('/');
  if (i < 0) return { prefix: doi, suffix: '' };
  return { prefix: doi.slice(0, i), suffix: doi.slice(i + 1) };
}
