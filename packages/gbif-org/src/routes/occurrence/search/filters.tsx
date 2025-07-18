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
import { isInClusterConfig, isSequencedConfig, repatriatedConfig } from './filters/booleans';
import {
  basisOfRecordConfig,
  continentConfig,
  dwcaExtensionConfig,
  gbifRegionConfig,
  iucnRedListCategoryConfig,
  licenceConfig,
  mediaTypeConfig,
  monthConfig,
  occurrenceIssueConfig,
  occurrenceStatusConfig,
  occurrenceTaxonomicIssueConfig,
  protocolConfig,
  publishedByGbifRegionConfig,
} from './filters/enums';
import {
  collectionCodeConfig,
  collectionKeyConfig,
  countryConfig,
  datasetKeyConfig,
  gadmGidConfig,
  hostingOrganizationKeyConfig,
  institutionCodeConfig,
  institutionKeyConfig,
  networkKeyConfig,
  publishingCountryConfig,
  publishingOrgConfig,
  recordNumberConfig,
  taxonKeyConfig,
  typeStatusSuggestConfig,
} from './filters/keySuggest';
import { locationConfig } from './filters/location';
import {
  coordinateUncertaintyConfig,
  depthConfig,
  distanceFromCentroidInMetersConfig,
  elevationConfig,
  endDayOfYearConfig,
  eventDateConfig,
  geologicalTimeConfig,
  lastInterpretedConfig,
  organismQuantityConfig,
  relativeOrganismQuantityConfig,
  sampleSizeValueConfig,
  startDayOfYearConfig,
  yearConfig,
} from './filters/ranges';
import {
  associatedSequencesConfig,
  datasetNameConfig,
  eventIdConfig,
  fieldNumberConfig,
  gbifIdConfig,
  higherGeographyConfig,
  identifiedByIdConfig,
  occurrenceIdConfig,
  organismIdConfig,
  previousIdentificationsConfig,
  programmeConfig,
  projectIdConfig,
  recordedByIdConfig,
  taxonIdConfig,
} from './filters/textOnly';
import {
  degreeOfEstablishmentConfig,
  establishmentMeansConfig,
  lifeStageConfig,
  pathwayConfig,
  sexConfig,
} from './filters/vocabulary';
import {
  biostratigraphyConfig,
  catalogNumberConfig,
  datasetIdConfig,
  georeferencedByConfig,
  identifiedByConfig,
  islandConfig,
  islandGroupConfig,
  lithostratigraphyConfig,
  localityConfig,
  organismQuantityTypeConfig,
  preparationsConfig,
  recordedByConfig,
  sampleSizeUnitConfig,
  samplingProtocolConfig,
  stateProvinceConfig,
  verbatimScientificNameConfig,
  waterBodyConfig,
} from './filters/wildcard';

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
      publishingCountry: generateFilters({
        config: { ...publishingCountryConfig, suggestConfig: { getSuggestions: countrySuggest } },
        searchConfig,
        formatMessage,
      }),
      institutionKey: generateFilters({
        config: institutionKeyConfig,
        searchConfig,
        formatMessage,
      }),
      collectionKey: generateFilters({ config: collectionKeyConfig, searchConfig, formatMessage }),
      datasetKey: generateFilters({ config: datasetKeyConfig, searchConfig, formatMessage }),
      taxonKey: generateFilters({ config: taxonKeyConfig, searchConfig, formatMessage }),
      publishingOrg: generateFilters({ config: publishingOrgConfig, searchConfig, formatMessage }),
      hostingOrganizationKey: generateFilters({
        config: hostingOrganizationKeyConfig,
        searchConfig,
        formatMessage,
      }),
      networkKey: generateFilters({ config: networkKeyConfig, searchConfig, formatMessage }),
      gadmGid: generateFilters({ config: gadmGidConfig, searchConfig, formatMessage }),

      institutionCode: generateFilters({
        config: institutionCodeConfig,
        searchConfig,
        formatMessage,
      }),
      collectionCode: generateFilters({
        config: collectionCodeConfig,
        searchConfig,
        formatMessage,
      }),
      recordNumber: generateFilters({ config: recordNumberConfig, searchConfig, formatMessage }),
      establishmentMeans: generateFilters({
        config: establishmentMeansConfig,
        searchConfig,
        formatMessage,
      }),
      sex: generateFilters({
        config: sexConfig,
        searchConfig,
        formatMessage,
      }),
      lifeStage: generateFilters({
        config: lifeStageConfig,
        searchConfig,
        formatMessage,
      }),

      // enums
      license: generateFilters({ config: licenceConfig, searchConfig, formatMessage }),
      basisOfRecord: generateFilters({ config: basisOfRecordConfig, searchConfig, formatMessage }),
      mediaType: generateFilters({ config: mediaTypeConfig, searchConfig, formatMessage }),
      month: generateFilters({ config: monthConfig, searchConfig, formatMessage }),
      continent: generateFilters({ config: continentConfig, searchConfig, formatMessage }),
      protocol: generateFilters({ config: protocolConfig, searchConfig, formatMessage }),
      dwcaExtension: generateFilters({ config: dwcaExtensionConfig, searchConfig, formatMessage }),
      iucnRedListCategory: generateFilters({
        config: iucnRedListCategoryConfig,
        searchConfig,
        formatMessage,
      }),
      typeStatus: generateFilters({ config: typeStatusSuggestConfig, searchConfig, formatMessage }),
      // typeStatus: generateFilters({ config: typeStatusConfig, searchConfig, formatMessage }),
      issue: generateFilters({
        config: occurrenceIssueConfig,
        searchConfig,
        formatMessage,
      }),
      taxonomicIssue: generateFilters({
        config: occurrenceTaxonomicIssueConfig,
        searchConfig,
        formatMessage,
      }),
      occurrenceStatus: generateFilters({
        config: occurrenceStatusConfig,
        searchConfig,
        formatMessage,
      }),

      projectId: generateFilters({ config: projectIdConfig, searchConfig, formatMessage }),
      recordedById: generateFilters({ config: recordedByIdConfig, searchConfig, formatMessage }),
      identifiedById: generateFilters({
        config: identifiedByIdConfig,
        searchConfig,
        formatMessage,
      }),
      occurrenceId: generateFilters({ config: occurrenceIdConfig, searchConfig, formatMessage }),
      organismId: generateFilters({ config: organismIdConfig, searchConfig, formatMessage }),
      higherGeography: generateFilters({
        config: higherGeographyConfig,
        searchConfig,
        formatMessage,
      }),
      eventId: generateFilters({ config: eventIdConfig, searchConfig, formatMessage }),
      fieldNumber: generateFilters({ config: fieldNumberConfig, searchConfig, formatMessage }),

      isInCluster: generateFilters({ config: isInClusterConfig, searchConfig, formatMessage }),
      isSequenced: generateFilters({ config: isSequencedConfig, searchConfig, formatMessage }),

      year: generateFilters({ config: yearConfig, searchConfig, formatMessage }),
      coordinateUncertaintyInMeters: generateFilters({
        config: coordinateUncertaintyConfig,
        searchConfig,
        formatMessage,
      }),
      depth: generateFilters({ config: depthConfig, searchConfig, formatMessage }),
      organismQuantity: generateFilters({
        config: organismQuantityConfig,
        searchConfig,
        formatMessage,
      }),
      relativeOrganismQuantity: generateFilters({
        config: relativeOrganismQuantityConfig,
        searchConfig,
        formatMessage,
      }),
      sampleSizeValue: generateFilters({
        config: sampleSizeValueConfig,
        searchConfig,
        formatMessage,
      }),
      elevation: generateFilters({ config: elevationConfig, searchConfig, formatMessage }),

      catalogNumber: generateFilters({ config: catalogNumberConfig, searchConfig, formatMessage }),
      preparations: generateFilters({ config: preparationsConfig, searchConfig, formatMessage }),
      biostratigraphy: generateFilters({
        config: biostratigraphyConfig,
        searchConfig,
        formatMessage,
      }),
      lithostratigraphy: generateFilters({
        config: lithostratigraphyConfig,
        searchConfig,
        formatMessage,
      }),
      geologicalTime: generateFilters({
        config: geologicalTimeConfig,
        searchConfig,
        formatMessage,
      }),
      sampleSizeUnit: generateFilters({
        config: sampleSizeUnitConfig,
        searchConfig,
        formatMessage,
      }),
      locality: generateFilters({ config: localityConfig, searchConfig, formatMessage }),
      waterBody: generateFilters({ config: waterBodyConfig, searchConfig, formatMessage }),
      stateProvince: generateFilters({ config: stateProvinceConfig, searchConfig, formatMessage }),
      datasetId: generateFilters({ config: datasetIdConfig, searchConfig, formatMessage }),
      samplingProtocol: generateFilters({
        config: samplingProtocolConfig,
        searchConfig,
        formatMessage,
      }),
      verbatimScientificName: generateFilters({
        config: verbatimScientificNameConfig,
        searchConfig,
        formatMessage,
      }),

      recordedBy: generateFilters({ config: recordedByConfig, searchConfig, formatMessage }),
      identifiedBy: generateFilters({ config: identifiedByConfig, searchConfig, formatMessage }),

      geometry: generateFilters({ config: locationConfig, searchConfig, formatMessage }),

      eventDate: generateFilters({ config: eventDateConfig, searchConfig, formatMessage }),
      taxonId: generateFilters({ config: taxonIdConfig, searchConfig, formatMessage }),
      islandGroup: generateFilters({ config: islandGroupConfig, searchConfig, formatMessage }),
      island: generateFilters({ config: islandConfig, searchConfig, formatMessage }),
      programme: generateFilters({ config: programmeConfig, searchConfig, formatMessage }),
      datasetName: generateFilters({ config: datasetNameConfig, searchConfig, formatMessage }),
      gbifRegion: generateFilters({ config: gbifRegionConfig, searchConfig, formatMessage }),
      gbifId: generateFilters({ config: gbifIdConfig, searchConfig, formatMessage }),
      endDayOfYear: generateFilters({ config: endDayOfYearConfig, searchConfig, formatMessage }),
      startDayOfYear: generateFilters({
        config: startDayOfYearConfig,
        searchConfig,
        formatMessage,
      }),
      organismQuantityType: generateFilters({
        config: organismQuantityTypeConfig,
        searchConfig,
        formatMessage,
      }),
      pathway: generateFilters({ config: pathwayConfig, searchConfig, formatMessage }),
      previousIdentifications: generateFilters({
        config: previousIdentificationsConfig,
        searchConfig,
        formatMessage,
      }),
      associatedSequences: generateFilters({
        config: associatedSequencesConfig,
        searchConfig,
        formatMessage,
      }),
      degreeOfEstablishment: generateFilters({
        config: degreeOfEstablishmentConfig,
        searchConfig,
        formatMessage,
      }),
      lastInterpreted: generateFilters({
        config: lastInterpretedConfig,
        searchConfig,
        formatMessage,
      }),
      publishedByGbifRegion: generateFilters({
        config: publishedByGbifRegionConfig,
        searchConfig,
        formatMessage,
      }),
      georeferencedBy: generateFilters({
        config: georeferencedByConfig,
        searchConfig,
        formatMessage,
      }),
      repatriated: generateFilters({ config: repatriatedConfig, searchConfig, formatMessage }),
      distanceFromCentroidInMeters: generateFilters({
        config: distanceFromCentroidInMetersConfig,
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
