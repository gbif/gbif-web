import { IdentityLabel } from '@/components/filters/displayNames';
import {
  filterConfig,
  filterConfigTypes,
  FilterSetting,
  generateFilters,
} from '@/components/filters/filterTools';
import { FilterConfigType } from '@/dataManagement/filterAdapter/filter2predicate';
import { useCountrySuggest } from '@/hooks/useCountrySuggest';
import { useMemo } from 'react';
import { useIntl } from 'react-intl';
import { continentConfig, dwcaExtensionConfig, monthConfig } from './filters/enums';
import { countryConfig, gadmGidConfig } from './filters/keySuggest';
import { locationConfig } from './filters/location';
import { eventDateConfig, sampleSizeValueConfig, yearConfig } from './filters/ranges';
import { eventIdConfig } from './filters/textOnly';
import { localityConfig, sampleSizeUnitConfig, samplingProtocolConfig } from './filters/wildcard';

const freeTextConfig: filterConfig = {
  filterType: filterConfigTypes.FREE_TEXT,
  filterHandle: 'q',
  displayName: IdentityLabel,
  filterTranslation: 'filters.q.name',
  group: 'other',
};

export type Filters = Record<string, FilterSetting>;

export function useFilters({ searchConfig }: { searchConfig: FilterConfigType }): {
  filters: Filters;
} {
  const { formatMessage } = useIntl();
  const countrySuggest = useCountrySuggest();

  const filters: Filters = useMemo(() => {
    const tmpFilters = {
      //free text
      q: generateFilters({ config: freeTextConfig, searchConfig, formatMessage }),
      //suggest foreign keys
      country: generateFilters({
        config: { ...countryConfig, suggestConfig: { getSuggestions: countrySuggest } },
        searchConfig,
        formatMessage,
      }),
      gadmGid: generateFilters({ config: gadmGidConfig, searchConfig, formatMessage }),
      month: generateFilters({ config: monthConfig, searchConfig, formatMessage }),
      continent: generateFilters({ config: continentConfig, searchConfig, formatMessage }),
      dwcaExtension: generateFilters({ config: dwcaExtensionConfig, searchConfig, formatMessage }),
      eventId: generateFilters({ config: eventIdConfig, searchConfig, formatMessage }),
      // fieldNumber: generateFilters({ config: fieldNumberConfig, searchConfig, formatMessage }),
      year: generateFilters({ config: yearConfig, searchConfig, formatMessage }),
      sampleSizeValue: generateFilters({
        config: sampleSizeValueConfig,
        searchConfig,
        formatMessage,
      }),
      sampleSizeUnit: generateFilters({
        config: sampleSizeUnitConfig,
        searchConfig,
        formatMessage,
      }),
      locality: generateFilters({ config: localityConfig, searchConfig, formatMessage }),
      samplingProtocol: generateFilters({
        config: samplingProtocolConfig,
        searchConfig,
        formatMessage,
      }),
      geometry: generateFilters({ config: locationConfig, searchConfig, formatMessage }),
      eventDate: generateFilters({ config: eventDateConfig, searchConfig, formatMessage }),
    };

    // if window object is available then put the available filter keys in an global object for manager to use
    if (typeof window !== 'undefined') {
      window.gbif = window.gbif || {};
      window.gbif.availableFilters = Object.keys(tmpFilters);
    }
    return tmpFilters;
  }, [searchConfig, countrySuggest, formatMessage]);

  return {
    filters,
  };
}
