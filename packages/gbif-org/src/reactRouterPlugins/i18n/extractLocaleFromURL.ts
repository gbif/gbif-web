export function extractLocaleFromPathname(
  url: string,
  availableLocales: string[],
  defaultLocale: string
): string {
  const locale = availableLocales.find(
    (locale) =>
      // Handle nested paths
      url.startsWith(`/${locale}/`) ||
      // Handle root paths without ending slash
      url === `/${locale}`
  );
  return locale ?? defaultLocale;
}
