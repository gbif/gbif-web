export function createRouteId(id: string, langCode: string, isSlugified = false) {
  return `${id}-${langCode}-${isSlugified}`;
}
