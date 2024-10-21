import { useI18n } from './i18nContextProvider';

export function localizeRouteId(routeId: string, localeCode: string): string {
  return `${routeId}-${localeCode}`;
}

export function useLocalizedRouteId(routeId: string): string {
  const { locale } = useI18n();
  return localizeRouteId(routeId, locale.code);
}
