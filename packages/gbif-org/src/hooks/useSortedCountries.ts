import countries from '@/enums/basic/country.json';
import { useI18n } from '@/reactRouterPlugins';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';

export function useSortedCountries() {
  const { formatMessage } = useIntl();
  const { locale } = useI18n();

  const sortedCountries = useMemo(() => {
    const translatedCountries = countries.map((country) => ({
      key: country,
      title: formatMessage({ id: `enums.countryCode.${country}` }),
    }));

    return translatedCountries.sort((a, b) => a.title.localeCompare(b.title, locale.localeCode));
  }, [locale.localeCode, formatMessage]);

  return sortedCountries;
}
