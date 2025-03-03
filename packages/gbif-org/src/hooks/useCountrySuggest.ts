import { useCallback, useMemo } from 'react';
import { useIntl } from 'react-intl';
import { matchSorter } from 'match-sorter';
import country from '@/enums/basic/country.json';
import { SuggestFnProps } from '@/components/filters/suggest';

export function useCountrySuggest() {
  const { formatMessage } = useIntl();

  const countries = useMemo(() => {
    return country.map((code) => ({
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
