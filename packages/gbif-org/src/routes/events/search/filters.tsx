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
import {
  eventDateConfig,
  humboldtSiteCountConfig,
  yearConfig,
  humboldtSamplingEffortValueConfig,
  humboldtTotalAreaSampledValueConfig,
  humboldtEventDurationValueConfig,
  humboldtAbundanceCapConfig,
} from './filters/ranges';
import { humboldtBooleansConfig } from './filters/humboldt';
import {
  eventIdConfig,
  humboldtInventoryTypesConfig,
  humboldtProtocolNamesConfig,
  localityConfig,
  eventTypeConfig,
  humboldtSamplingPerformedByConfig,
  humboldtSamplingEffortUnitConfig,
  humboldtProtocolReferencesConfig,
  humboldtTargetDegreeOfEstablishmentScopeConfig,
  humboldtTargetGrowthFormScopeConfig,
  humboldtTargetHabitatScopeConfig,
  humboldtTargetLifeStageScopeConfig,
  humboldtTotalAreaSampledUnitConfig,
  humboldtEventDurationUnitConfig,
  humboldtTargetTaxonomicScopeUsageNameConfig,
  humboldtMaterialSampleTypesConfig,
} from './filters/textOnly';
import { sampleSizeUnitConfig } from './filters/wildcard';

import {
  humboldtIsAbundanceReportedConfig,
  humboldtIsAbundanceCapReportedConfig,
  humboldtIsTaxonomicScopeFullyReportedConfig,
} from './filters/boolean';

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
      eventType: generateFilters({ config: eventTypeConfig, searchConfig, formatMessage }),
      // fieldNumber: generateFilters({ config: fieldNumberConfig, searchConfig, formatMessage }),
      year: generateFilters({ config: yearConfig, searchConfig, formatMessage }),
      /*    sampleSizeValue: generateFilters({
        config: sampleSizeValueConfig,
        searchConfig,
        formatMessage,
      }),
      sampleSizeUnit: generateFilters({
        config: sampleSizeUnitConfig,
        searchConfig,
        formatMessage,
      }), */
      locality: generateFilters({ config: localityConfig, searchConfig, formatMessage }),
      humboldtProtocolNames: generateFilters({
        config: humboldtProtocolNamesConfig,
        searchConfig,
        formatMessage,
      }),
      humboldtInventoryTypes: generateFilters({
        config: humboldtInventoryTypesConfig,
        searchConfig,
        formatMessage,
      }),
      humboldtIsAbundanceReported: generateFilters({
        config: humboldtIsAbundanceReportedConfig,
        searchConfig,
        formatMessage,
      }),
      humboldtIsAbundanceCapReported: generateFilters({
        config: humboldtIsAbundanceCapReportedConfig,
        searchConfig,
        formatMessage,
      }),

      humboldtSiteCount: generateFilters({
        config: humboldtSiteCountConfig,
        searchConfig,
        formatMessage,
      }),

      humboldtSamplingPerformedBy: generateFilters({
        config: humboldtSamplingPerformedByConfig,
        searchConfig,
        formatMessage,
      }),
      humboldtSamplingEffortUnit: generateFilters({
        config: humboldtSamplingEffortUnitConfig,
        searchConfig,
        formatMessage,
      }),
      humboldtSamplingEffortValue: generateFilters({
        config: humboldtSamplingEffortValueConfig,
        searchConfig,
        formatMessage,
      }),

      humboldtTargetDegreeOfEstablishmentScope: generateFilters({
        config: humboldtTargetDegreeOfEstablishmentScopeConfig,
        searchConfig,
        formatMessage,
      }),
      humboldtTargetGrowthFormScope: generateFilters({
        config: humboldtTargetGrowthFormScopeConfig,
        searchConfig,
        formatMessage,
      }),
      humboldtTargetHabitatScope: generateFilters({
        config: humboldtTargetHabitatScopeConfig,
        searchConfig,
        formatMessage,
      }),
      humboldtTargetLifeStageScope: generateFilters({
        config: humboldtTargetLifeStageScopeConfig,
        searchConfig,
        formatMessage,
      }),
      humboldtTotalAreaSampledUnit: generateFilters({
        config: humboldtTotalAreaSampledUnitConfig,
        searchConfig,
        formatMessage,
      }),
      humboldtTotalAreaSampledValue: generateFilters({
        config: humboldtTotalAreaSampledValueConfig,
        searchConfig,
        formatMessage,
      }),

      humboldtEventDurationUnit: generateFilters({
        config: humboldtEventDurationUnitConfig,
        searchConfig,
        formatMessage,
      }),

      humboldtEventDurationValue: generateFilters({
        config: humboldtEventDurationValueConfig,
        searchConfig,
        formatMessage,
      }),

      humboldtTargetTaxonomicScopeUsageName: generateFilters({
        config: humboldtTargetTaxonomicScopeUsageNameConfig,
        searchConfig,
        formatMessage,
      }),

      humboldtIsTaxonomicScopeFullyReported: generateFilters({
        config: humboldtIsTaxonomicScopeFullyReportedConfig,
        searchConfig,
        formatMessage,
      }),
      humboldtMaterialSampleTypes: generateFilters({
        config: humboldtMaterialSampleTypesConfig,
        searchConfig,
        formatMessage,
      }),

      humboldtAbundanceCap: generateFilters({
        config: humboldtAbundanceCapConfig,
        searchConfig,
        formatMessage,
      }),
      geometry: generateFilters({ config: locationConfig, searchConfig, formatMessage }),
      eventDate: generateFilters({ config: eventDateConfig, searchConfig, formatMessage }),
      humboldtBooleans: generateFilters({
        config: humboldtBooleansConfig,
        searchConfig,
        formatMessage,
      }),
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
