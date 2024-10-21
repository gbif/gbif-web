export function extractLocaleFromPathname(url: string, availableLocales: string[], defaultLocale: string): string {
  const locale = availableLocales.find((locale) => url.startsWith(`/${locale}/`));
  return locale ?? defaultLocale;
}