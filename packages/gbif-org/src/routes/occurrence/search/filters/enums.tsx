import { BasisOfRecordLabel, ContinentLabel, DwcaExtensionLabel, EndpointTypeLabel, LicenceLabel, MediaTypeLabel, MonthLabel, IucnRedListCategoryLabel, typeStatusLabel } from "@/components/filters/displayNames";
import licenseOptions from '@/enums/basic/license.json';
import basisOfRecordOptions from '@/enums/basic/basisOfRecord.json';
import mediaTypeOptions from '@/enums/basic/mediaType.json';
import monthOptions from '@/enums/basic/month.json';
import continentOptions from '@/enums/basic/continent.json';
import endpointTypeOptions from '@/enums/basic/endpointType.json';
import dwcaExtensionOptions from '@/enums/basic/dwcaExtension.json';
import iucnRedListCategoryOptions from '@/enums/basic/iucnRedListCategory.json';
import typeStatusOptions from '@/enums/basic/typeStatus.json';
import { HelpText } from '@/components/helpText';
import { filterConfig, filterConfigTypes } from "@/components/filters/filterTools";

export const licenceConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'license',
  displayName: LicenceLabel,
  options: licenseOptions,
  filterTranslation: 'filters.license.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: license {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const basisOfRecordConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'basisOfRecord',
  displayName: BasisOfRecordLabel,
  options: basisOfRecordOptions,
  filterTranslation: 'filters.basisOfRecord.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: basisOfRecord {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const mediaTypeConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'mediaType',
  displayName: MediaTypeLabel,
  options: mediaTypeOptions,
  filterTranslation: 'filters.mediaType.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: mediaType {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const monthConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'month',
  displayName: MonthLabel,
  options: monthOptions,
  filterTranslation: 'filters.month.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: month(size: 12) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const continentConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'continent',
  displayName: ContinentLabel,
  options: continentOptions,
  filterTranslation: 'filters.continent.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: continent {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const protocolConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'protocol',
  displayName: EndpointTypeLabel,
  options: endpointTypeOptions,
  filterTranslation: 'filters.protocol.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: protocol(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const dwcaExtensionConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'dwcaExtension',
  displayName: DwcaExtensionLabel,
  options: dwcaExtensionOptions,
  filterTranslation: 'filters.dwcaExtension.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: dwcaExtension(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const iucnRedListCategoryConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'iucnRedListCategory',
  displayName: IucnRedListCategoryLabel,
  options: iucnRedListCategoryOptions,
  filterTranslation: 'filters.iucnRedListCategory.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceCountryFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: iucnRedListCategory(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const typeStatusConfig: filterConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'typeStatus',
  displayName: typeStatusLabel,
  options: typeStatusOptions,
  filterTranslation: 'filters.typeStatus.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceTypeStatusFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: typeStatus(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};