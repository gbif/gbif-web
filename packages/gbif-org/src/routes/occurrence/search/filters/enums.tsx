import {
  BasisOfRecordLabel,
  ContinentLabel,
  DwcaExtensionLabel,
  EndpointTypeLabel,
  GbifRegionLabel,
  IucnRedListCategoryLabel,
  LicenceLabel,
  MediaTypeLabel,
  MonthLabel,
  occurrenceIssueLabel,
  occurrenceStatusLabel,
} from '@/components/filters/displayNames';
import { filterConfigTypes, filterEnumConfig } from '@/components/filters/filterTools';
import { Message } from '@/components/message';
import basisOfRecordOptions from '@/enums/basic/basisOfRecord.json';
import continentOptions from '@/enums/basic/continent.json';
import dwcaExtensionOptions from '@/enums/basic/dwcaExtension.json';
import gbifRegionOptions from '@/enums/basic/gbifRegion.json';
import iucnRedListCategoryOptions from '@/enums/basic/iucnRedListCategory.json';
import licenseOptions from '@/enums/basic/license.json';
import mediaTypeOptions from '@/enums/basic/mediaType.json';
import monthOptions from '@/enums/basic/month.json';
import occurrenceNonTaxonomicIssue from '@/enums/basic/occurrenceNonTaxonomicIssue.json';
import protocolOptions from '@/enums/basic/occurrenceProtocols.json';
import occurrenceStatusOptions from '@/enums/basic/occurrenceStatus.json';
import occurrenceTaxonomicIssue from '@/enums/basic/occurrenceTaxonomicIssue.json';

export const licenceConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'license',
  displayName: LicenceLabel,
  options: licenseOptions,
  filterTranslation: 'filters.license.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceLicenseFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: license {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.license.description" />,
  group: 'record',
};

export const basisOfRecordConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'basisOfRecord',
  displayName: BasisOfRecordLabel,
  options: basisOfRecordOptions,
  filterTranslation: 'filters.basisOfRecord.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceBoRFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: basisOfRecord {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.basisOfRecord.description" />,
  group: 'record',
};

export const mediaTypeConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'mediaType',
  displayName: MediaTypeLabel,
  options: mediaTypeOptions,
  allowExistence: true,
  allowNegations: false,
  filterTranslation: 'filters.mediaType.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceMediaFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: mediaType {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.mediaType.description" />,
  group: 'occurrence',
};

export const monthConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'month',
  displayName: MonthLabel,
  options: monthOptions,
  allowNegations: true,
  allowExistence: true,
  filterTranslation: 'filters.month.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceMonthFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: month(size: 12) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.month.description" />,
  group: 'event',
};

export const continentConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'continent',
  displayName: ContinentLabel,
  allowExistence: true,
  allowNegations: false,
  options: continentOptions,
  filterTranslation: 'filters.continent.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceContinentFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: continent {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.continent.description" />,
  group: 'location',
};

export const protocolConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'protocol',
  displayName: EndpointTypeLabel,
  options: protocolOptions, // this is just a subset of endpointTypes, but since not all endpoints can provide occurrence data we only show those that are relevant
  allowExistence: true,
  allowNegations: false,
  filterTranslation: 'filters.protocol.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceProtocolFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: protocol(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.protocol.description" />,
  group: 'provenance',
};

export const dwcaExtensionConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'dwcaExtension',
  displayName: DwcaExtensionLabel,
  options: dwcaExtensionOptions,
  allowNegations: true,
  allowExistence: true,
  filterTranslation: 'filters.dwcaExtension.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceDwcaExtensionFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: dwcaExtension(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  // about: () => <Message id="filters.isSequenced.description" />,
  group: 'other',
};

export const iucnRedListCategoryConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'iucnRedListCategory',
  displayName: IucnRedListCategoryLabel,
  options: iucnRedListCategoryOptions,
  filterTranslation: 'filters.iucnRedListCategory.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceIucnFacet($q: String, $predicate: Predicate, $checklistKey: ID) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: iucnRedListCategory(size: 100, checklistKey: $checklistKey) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.iucnRedListCategory.description" />,
  group: 'other',
};

export const occurrenceIssueConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'issue',
  displayName: occurrenceIssueLabel,
  options: occurrenceNonTaxonomicIssue,
  allowNegations: true,
  allowExistence: true,
  filterTranslation: 'filters.occurrenceIssue.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceIssueFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: issue(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.occurrenceIssue.description" />,
  group: 'other',
};

export const occurrenceTaxonomicIssueConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'taxonomicIssue',
  displayName: occurrenceIssueLabel,
  options: occurrenceTaxonomicIssue,
  allowNegations: true,
  allowExistence: true,
  filterTranslation: 'filters.occurrenceTaxonomicIssue.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceTaxonomicIssueFacet($q: String, $predicate: Predicate, $checklistKey: ID) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: taxonomicIssue(size: 100, checklistKey: $checklistKey) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.occurrenceTaxonomicIssue.description" />,
  group: 'other',
};

export const occurrenceStatusConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'occurrenceStatus',
  displayName: occurrenceStatusLabel,
  options: occurrenceStatusOptions,
  filterTranslation: 'filters.occurrenceStatus.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceOccurrenceStatusFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: occurrenceStatus(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.occurrenceStatus.description" />,
  group: 'occurrence',
};

export const gbifRegionConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'gbifRegion',
  displayName: GbifRegionLabel,
  allowExistence: true,
  allowNegations: false,
  options: gbifRegionOptions,
  filterTranslation: 'filters.gbifRegion.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceGbifRegionFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: gbifRegion {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.gbifRegion.description" />,
  group: 'location',
};

export const publishedByGbifRegionConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'publishedByGbifRegion',
  displayName: GbifRegionLabel,
  allowExistence: true,
  allowNegations: false,
  options: gbifRegionOptions,
  filterTranslation: 'filters.publishedByGbifRegion.name',
  facetQuery: /* GraphQL */ `
    query OccurrencePublishedByGbifRegionFacet($q: String, $predicate: Predicate) {
      search: occurrenceSearch(q: $q, predicate: $predicate) {
        facet {
          field: publishedByGbifRegion {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <Message id="filters.publishedByGbifRegion.description" />,
  group: 'location',
};
