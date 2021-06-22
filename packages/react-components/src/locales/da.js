import basisOfRecord from false;
import countryCode from false;
import mediaType from false;
import occurrenceIssue from false;
import typeStatus from false;
import taxonRank from false;
import taxonomicStatus from false;
import license from false;
import month from false;
import continent from false;
import protocol from false;
import establishmentMeans from false;
import occurrenceStatus from false;
import role from false;
import isInCluster from false;
import datasetType from false;
import datasetSubtype from false;
import { dataset } from false;
// -- Add imports above this line (required by plopfile.js) --
export const en = {
  first: 'Første',
  previous: 'Forrige',
  next: 'Næste',
  options: false,
  'pagination.pageXofY': 'Side {current} af {total}',
  moreFilters: 'mere',
  nResults: false,
  nResultsWithCoordinates: false,
  nResultsWithImages: false,
  tableHeaders: {
    features: false,
    citations: false,
    occurrences: 'Observationer'
  },
  nullOrNot: {
    isNotNull: false,
    isNull: false
  },
  components: { dataset },
  filter: {
    taxonKey: {
      name: 'Videnskabeligt navn',
      count: false,
      description: false
    },
    basisOfRecord: {
      name: 'Observationstype',
      count: false,
      isNotNull: false,
      isNull: false,
      description: false
    },
    institutionCode: {
      name: false,
      count: false,
      description: false
    },
    catalogNumber: {
      name: 'Katalognummer',
      count: false,
      description: false
    },
    mediaType: {
      name: false,
      count: false,
      description: false
    },
    occurrenceIssue: {
      name: false,
      count: false,
      isNotNull: false,
      isNull: false,
      description: false
    },
    occurrenceCountry: {
      name: 'Land',
      count: false,
      description: false
    },
    publishingCountryCode: {
      name: false,
      count: false,
      description: false
    },
    q: {
      name: false,
      count: false,
      description: false
    },
    coordinates: { name: 'Koordinater' },
    elevation: {
      name: false,
      count: false,
      description: false
    },
    license: {
      name: 'Licens',
      count: false,
      description: false
    },
    datasetKey: {
      name: 'Datasæt',
      count: false,
      description: false
    },
    publisherKey: {
      name: 'Forlægger',
      count: false,
      description: false
    },
    hostingOrganizationKey: {
      name: false,
      count: false,
      description: false
    },
    country: {
      name: 'Land',
      count: false
    },
    countriesOfCoverage: {
      name: false,
      count: false
    },
    countriesOfResearcher: {
      name: false,
      count: false
    },
    typeStatus: {
      name: false,
      count: false,
      isNotNull: false,
      isNull: false,
      description: false
    },
    year: {
      name: false,
      count: false,
      description: false
    },
    sampleSizeUnit: {
      name: false,
      count: false,
      description: false
    },
    coordinateUncertainty: {
      name: 'Koordinat usikkerhed',
      count: false,
      description: false
    },
    depth: {
      name: false,
      count: false,
      description: false
    },
    organismQuantity: {
      name: false,
      count: false,
      description: false
    },
    sampleSizeValue: {
      name: false,
      count: false,
      description: false
    },
    relativeOrganismQuantity: {
      name: false,
      count: false,
      description: false
    },
    month: {
      name: false,
      count: false,
      description: false
    },
    continent: {
      name: false,
      count: false,
      description: false
    },
    protocol: {
      name: false,
      count: false,
      description: false
    },
    establishmentMeans: {
      name: false,
      count: false,
      description: false
    },
    catalogNumber: {
      name: 'Katalognummer',
      count: false,
      description: false
    },
    recordedBy: {
      name: false,
      count: false,
      description: false
    },
    recordNumber: {
      name: false,
      count: false,
      description: false
    },
    collectionCode: {
      name: false,
      count: false,
      description: false
    },
    recordedById: {
      name: false,
      count: false,
      description: false
    },
    identifiedById: {
      name: false,
      count: false,
      description: false
    },
    occurrenceId: {
      name: 'Observations-ID',
      count: false,
      description: false
    },
    organismId: {
      name: 'Organisme-ID',
      count: false,
      description: false
    },
    locality: {
      name: false,
      count: false,
      description: false
    },
    waterBody: {
      name: false,
      count: false,
      description: false
    },
    stateProvince: {
      name: false,
      count: false,
      description: false
    },
    eventId: {
      name: false,
      count: false,
      description: false
    },
    samplingProtocol: {
      name: false,
      count: false,
      description: false
    },
    occurrenceStatus: {
      name: false,
      count: false,
      description: false
    },
    gadmGid: {
      name: false,
      count: false,
      description: false
    },
    identifiedBy: {
      name: false,
      count: false,
      description: false
    },
    isInCluster: {
      name: false,
      count: false,
      description: false
    },
    datasetType: {
      name: false,
      count: false,
      description: false
    },
    datasetSubtype: {
      name: false,
      count: false,
      description: false
    },
    institutionKey: {
      name: false,
      count: false,
      description: false
    },
    name: {
      name: 'Navn',
      count: false,
      description: false
    },
    city: {
      name: false,
      count: false,
      description: false
    },
    code: {
      name: false,
      count: false,
      description: false
    },
    verbatimScientificName: {
      name: false,
      count: false,
      description: false
    },
    networkKey: {
      name: false,
      count: false,
      description: false
    }
  },
  invalidValue: false,
  interval: {
    description: {
      lt: false,
      lte: false,
      gt: false,
      gte: false,
      e: false
    },
    compact: {
      between: false,
      lt: false,
      gt: false,
      e: false
    },
    compactMeters: {
      between: false,
      lt: 'Under {to}m',
      gt: 'Over {from}m',
      e: false
    },
    compactTime: {
      between: false,
      lt: false,
      gt: false,
      e: false
    },
    year: {
      between: false,
      lt: false,
      gt: false,
      e: false
    },
    coordinateUncertainty: {
      between: false,
      lt: false,
      gt: false,
      e: false
    },
    depth: {
      between: false,
      lt: false,
      gt: false,
      e: false
    },
    organismQuantity: {
      between: false,
      lt: false,
      gt: false,
      e: false
    },
    sampleSizeValue: {
      between: false,
      lt: false,
      gt: false,
      e: false
    },
    relativeOrganismQuantity: {
      between: false,
      lt: false,
      gt: false,
      e: false
    },
    elevation: {
      between: false,
      lt: false,
      gt: false,
      e: false
    }
  },
  enums: {
    basisOfRecord,
    countryCode,
    mediaType,
    occurrenceIssue,
    typeStatus,
    taxonRank,
    taxonomicStatus,
    license,
    month,
    continent,
    protocol,
    establishmentMeans,
    occurrenceStatus,
    role,
    isInCluster,
    datasetType,
    datasetSubtype
  }
};