import { BasisOfRecordLabel, ContinentLabel, DwcaExtensionLabel, EndpointTypeLabel, LicenceLabel, MediaTypeLabel, MonthLabel, IucnRedListCategoryLabel, typeStatusLabel, occurrenceIssueLabel, occurrenceStatusLabel } from "@/components/filters/displayNames";
import licenseOptions from '@/enums/basic/license.json';
import basisOfRecordOptions from '@/enums/basic/basisOfRecord.json';
import mediaTypeOptions from '@/enums/basic/mediaType.json';
import monthOptions from '@/enums/basic/month.json';
import continentOptions from '@/enums/basic/continent.json';
import endpointTypeOptions from '@/enums/basic/endpointType.json';
import dwcaExtensionOptions from '@/enums/basic/dwcaExtension.json';
import iucnRedListCategoryOptions from '@/enums/basic/iucnRedListCategory.json';
import typeStatusOptions from '@/enums/basic/typeStatus.json';
import occurrenceIssueOptions from '@/enums/basic/occurrenceIssue.json';
import occurrenceStatusOptions from '@/enums/basic/occurrenceStatus.json';
import { HelpText } from '@/components/helpText';
import { filterConfigTypes, filterEnumConfig } from "@/components/filters/filterTools";

export const licenceConfig: filterEnumConfig = {
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

export const basisOfRecordConfig: filterEnumConfig = {
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

export const mediaTypeConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'mediaType',
  displayName: MediaTypeLabel,
  options: mediaTypeOptions,
  allowExistence: true,
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

export const monthConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'month',
  displayName: MonthLabel,
  options: monthOptions,
  allowNegations: true,
  allowExistence: true,
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

export const continentConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'continent',
  displayName: ContinentLabel,
  allowExistence: true,
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

export const protocolConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'protocol',
  displayName: EndpointTypeLabel,
  options: endpointTypeOptions,
  allowNegations: true,
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

export const dwcaExtensionConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'dwcaExtension',
  displayName: DwcaExtensionLabel,
  options: dwcaExtensionOptions,
  allowNegations: true,
  allowExistence: true,
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

export const iucnRedListCategoryConfig: filterEnumConfig = {
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

export const typeStatusConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'typeStatus',
  displayName: typeStatusLabel,
  options: typeStatusOptions,
  allowNegations: true,
  allowExistence: true,
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

export const occurrenceIssueConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'issue',
  displayName: occurrenceIssueLabel,
  options: occurrenceIssueOptions,
  allowNegations: true,
  allowExistence: true,
  filterTranslation: 'filters.occurrenceIssue.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceIssueFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: issue(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};

export const occurrenceStatusConfig: filterEnumConfig = {
  filterType: filterConfigTypes.ENUM,
  filterHandle: 'occurrenceStatus',
  displayName: occurrenceStatusLabel,
  options: occurrenceStatusOptions,
  filterTranslation: 'filters.occurrenceStatus.name',
  facetQuery: /* GraphQL */ `
    query OccurrenceOccurrenceStatusFacet($predicate: Predicate) {
      search: occurrenceSearch(predicate: $predicate) {
        facet {
          field: occurrenceStatus(size: 100) {
            name: key
            count
          }
        }
      }
    }
  `,
  about: () => <HelpText identifier="how-to-link-datasets-to-my-project-page" />,
};