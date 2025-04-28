export function normalizeString(r: string): string {
  // Remove all non-alphanumeric characters and convert to lowercase
  return r
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '');
}
