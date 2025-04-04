import { SuggestFnProps } from '@/components/filters/suggest';
import country from '@/enums/basic/country.json';
import { matchSorter } from 'match-sorter';
import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';

const countryCodesToRemove = ['AA', 'XX', 'XZ'];
export const actualCountryCodes = country.filter((code) => {
  return !countryCodesToRemove.includes(code);
});

export function useCountrySuggest() {
  const { formatMessage } = useIntl();

  const countries = useMemo(() => {
    return actualCountryCodes.map((code) => ({
      key: code,
      title: formatMessage({ id: `enums.countryCode.${code}` }),
    }));
  }, [formatMessage]);

  const countrySuggest = useCallback(
    ({ q }: SuggestFnProps) => {
      // instead of just using indexOf or similar. This has the benefit of reshuffling records based on the match, check for abrivations etc
      const filtered = matchSorter(countries, q ?? '', { keys: ['title', 'key'] });
      return { promise: Promise.resolve(filtered), cancel: () => {} };
    },
    [countries]
  );

  return countrySuggest;
}
