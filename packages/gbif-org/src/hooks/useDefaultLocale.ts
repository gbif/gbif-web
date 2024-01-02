import { useConfig } from '@/contexts/config/config';

export function useDefaultLocale() {
  const { languages } = useConfig();
  const defaultLanguage = languages.find((l) => l.default);
  if (defaultLanguage == null) throw new Error('No default language');
  return defaultLanguage;
}
