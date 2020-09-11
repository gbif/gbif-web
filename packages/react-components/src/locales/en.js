import basisOfRecord from './enums/basisOfRecord.json';
import countryCode from './enums/countryCode.json';
import mediaTypes from './enums/mediaTypes.json';
import occurrenceIssue from './enums/occurrenceIssue.json';
import typeStatus from './enums/typeStatus.json';
import taxonRank from './enums/taxonRank.json';

export const en = {
  first: 'First',
  previous: 'Previous',
  next: 'Next',
  options: 'Options',
  'pagination.pageXofY': 'Page {current} of {total}',
  moreFilters: 'more',
  nResults: '{total, plural, one {# result} other {# results}}',
  tableHeaders: {
    features: 'Features'
  },
  filter: {
    taxonKey: {
      name: 'Scientific name',
      count: '{num, plural, one {scientific name} other {# scientific names}}'
    },
    basisOfRecord: {
      name: 'Basis of record',
      count: '{num, plural, one {basis of record} other {# bases of records}}',
      isNotNull: 'Has a basis of record',
      isNull: 'Has no basis of record',
      description: 'You can think of it as the evidence'
    },
    institutionCode: {
      name: 'Institution code',
      count: '{num, plural, one {institution code} other {# institution codes}}',
      description: 'The institution code for this record'
    },
    catalogNumber: {
      name: 'Catalog number',
      count: '{num, plural, one {catalog number} other {# catalog numbers}}',
      description: 'The catalog number for this record'
    },
    mediaTypes: {
      name: 'Media type',
      count: '{num, plural, one {media type} other {# media types}}',
      description: 'What can of media should the occurrence have'
    },
    occurrenceIssue: {
      name: 'Issues and flags',
      count: '{num, plural, one {issue or flag} other {# issues and flags}}',
      isNotNull: 'Has issues',
      isNull: 'Has no issues',
      description: 'During interpretation we try to detect potential issues and add flags for them. You decide which matters to you.'
    },
    countryCode: {
      name: 'Country',
      count: '{num, plural, one {country} other {# countries}}',
      description: 'Country or area from which the record is located within'
    },
    publishingCountryCode: {
      name: 'Publishing country',
      count: '{num, plural, one {publishing country} other {# publishing countries}}',
      description: 'Country or area that published the data'
    },
    q: {
      name: 'Similar text',
      count: '{num, plural, one {text string} other {# text search strings}}',
      description: 'Search for text similar to the entered across text fields. For structured search on say species names you should use the "Scientific name" filter'
    },
    coordinates: {
      name: 'Latitude longitude',
    },
    elevation: {
      name: 'Elevation',
      count: '{num, plural, one {elevation filter} other {# elevation filters}}',
    },
    datasetKey: {
      name: 'Dataset',
      count: '{num, plural, one {dataset} other {# datasets}}',
    },
    publisherKey: {
      name: 'Publisher',
      count: '{num, plural, one {publisher} other {# publishers}}',
    },
    hostKey: {
      name: 'Hosting organisation',
      count: '{num, plural, one {host} other {# hosts}}',
    },
    country: {
      name: 'Country',
      count: '{num, plural, one {country} other {# countries}}',
    },
    typeStatus: {
      name: 'Type status',
      count: '{num, plural, one {type status} other {# type statuses}}',
      isNotNull: 'Has a type status',
      isNull: 'Has no type status',
      description: 'The specimen has been designated as a type'
    },
    year: {
      name: 'Year',
      count: '{num, plural, one {year filter} other {# year filters}}',
    },
    sampleSizeUnit: {
      name: "Sample size unit",
      count: '{num, plural, one {sample size unit} other {# sample size units}}'
    }
  },
  invalidValue: 'Invalid value',
  interval: {
    description: {
      lt: "Less than {to}",
      lte: "Less or equal {to}",
      gt: "Greater than {from}",
      gte: "Greater or equal {from}",
      e: "Equals {is}"
    },
    year: {
      between: 'Year {from} to {to}',
      lt: 'Before year {to}',
      gt: 'After year {from}',
      e: 'Year is {from}',
    },
    elevation: {
      between: 'Elevation {from}m to {to}m',
      lt: 'Elevation below {to}m',
      gt: 'Elevation above {from}m',
      e: 'Elevation is {from}m',
    }
  },
  enums: {
    basisOfRecord,
    countryCode,
    mediaTypes,
    occurrenceIssue,
    typeStatus,
    taxonRank
  }
}