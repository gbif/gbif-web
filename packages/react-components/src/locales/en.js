import basisOfRecord from './enums/basisOfRecord.json';
import countryCode from './enums/countryCode.json';
import mediaTypes from './enums/mediaTypes.json';
import occurrenceIssue from './enums/occurrenceIssue.json';
import typeStatus from './enums/typeStatus.json';
import license from './enums/license.json';
import month from './enums/month.json';
import continent from './enums/continent.json';
import protocol from './enums/protocol.json';
import establishmentMeans from './enums/establishmentMeans.json';
// -- Add imports above this line (required by plopfile.js) --

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
    license: {
      name: 'License',
      count: '{num, plural, one {license} other {# licenses}}',
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
      description: 'What year is the record from'
    },
    sampleSizeUnit: {
      name: "Sample size unit",
      count: '{num, plural, one {sample size unit} other {# sample size units}}',
      description: 'This field is used together with "sample size value" and describes the unit of the meassurement'
    },
    coordinateUncertainty: {
      name: 'Coordinate uncertainty',
      count: '{num, plural, one {Coordinate uncertainty} other {# coordinate uncertainty filters}}',
      description: 'A short description of the component should be placed here'
    },
    depth: {
      name: 'Depth',
      count: '{num, plural, one { Depth } other {# Depths}}',
      description: 'A short description of the component should be placed here'
    },
    organismQuantity: {
      name: 'Organism quantity',
      count: '{num, plural, one { Organism quantity } other {# Organism quantitys}}',
      description: 'A short description of the component should be placed here'
    },
    sampleSizeValue: {
      name: 'Sample size value',
      count: '{num, plural, one { Sample size value } other {# Sample size values}}',
      description: 'A short description of the component should be placed here'
    },
    relativeOrganismQuantity: {
      name: 'Relative organism quantity',
      count: '{num, plural, one { Relative organism quantity } other {# Relative organism quantitys}}',
      description: 'A short description of the component should be placed here'
    },
    month: {
      name: 'Month',
      count: '{num, plural, one { Month } other {# Months}}',
      description: 'A short description of the component should be placed here'
    },
    continent: {
      name: 'Continent',
      count: '{num, plural, one { Continent } other {# Continents}}',
      description: 'A short description of the component should be placed here'
    },
    protocol: {
      name: 'Protocol',
      count: '{num, plural, one { Protocol } other {# Protocols}}',
      description: 'A short description of the component should be placed here'
    },
    establishmentMeans: {
      name: 'Establishment means',
      count: '{num, plural, one { Establishment means } other {# Establishment meanss}}',
      description: 'A short description of the component should be placed here'
    },
    catalogNumber: {
      name: 'Catalog number',
      count: '{num, plural, one { Catalog number } other {# Catalog numbers}}',
      description: 'A short description of the component should be placed here'
    },
    recordedBy: {
      name: 'Recorded by',
      count: '{num, plural, one { Recorded by } other {# Recorded bys}}',
      description: 'A short description of the component should be placed here'
    },
    recordNumber: {
      name: 'Record number',
      count: '{num, plural, one { Record number } other {# Record numbers}}',
      description: 'A short description of the component should be placed here'
    },
    collectionCode: {
      name: 'Collection code',
      count: '{num, plural, one { Collection code } other {# Collection codes}}',
      description: 'A short description of the component should be placed here'
    },
    recordedById: {
      name: 'Recorded by id',
      count: '{num, plural, one { Recorded by id } other {# Recorded by ids}}',
      description: 'A short description of the component should be placed here'
    },
    identifiedById: {
      name: 'Identified by id',
      count: '{num, plural, one { Identified by id } other {# Identified by ids}}',
      description: 'A short description of the component should be placed here'
    },
    occurrenceId: {
      name: 'Occurrence id',
      count: '{num, plural, one { Occurrence id } other {# Occurrence ids}}',
      description: 'A short description of the component should be placed here'
    },
    organismId: {
      name: 'Organism id',
      count: '{num, plural, one { Organism id } other {# Organism ids}}',
      description: 'A short description of the component should be placed here'
    },
    locality: {
      name: 'Locality',
      count: '{num, plural, one { Locality } other {# Localitys}}',
      description: 'A short description of the component should be placed here'
    },
    waterBody: {
      name: 'Water body',
      count: '{num, plural, one { Water body } other {# Water bodys}}',
      description: 'A short description of the component should be placed here'
    },
    stateProvince: {
      name: 'State province',
      count: '{num, plural, one { State province } other {# State provinces}}',
      description: 'A short description of the component should be placed here'
    },
    eventId: {
      name: 'Event id',
      count: '{num, plural, one { Event id } other {# Event ids}}',
      description: 'A short description of the component should be placed here'
    },
    samplingProtocol: {
      name: 'Sampling protocol',
      count: '{num, plural, one { Sampling protocol } other {# Sampling protocols}}',
      description: 'A short description of the component should be placed here'
    },
    // -- Add filter above this line (required by plopfile.js) --
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
    },
    coordinateUncertainty: {
      between: 'Coordinate uncertainty {from}m to {to}m',
      lt: 'Coordinate uncertainty below {to}m',
      gt: 'Coordinate uncertainty above {from}m',
      e: 'Coordinate uncertainty is {from}m',
    },
    depth: {
      between: 'Depth {from} to {to}',
      lt: 'Depth below {to}',
      gt: 'Depth above {from}',
      e: 'Depth is {from}',
    },
    organismQuantity: {
      between: 'Organism quantity {from} to {to}',
      lt: 'Organism quantity below {to}',
      gt: 'Organism quantity above {from}',
      e: 'Organism quantity is {from}',
    },
    sampleSizeValue: {
      between: 'Sample size value {from} to {to}',
      lt: 'Sample size value below {to}',
      gt: 'Sample size value above {from}',
      e: 'Sample size value is {from}',
    },
    relativeOrganismQuantity: {
      between: 'Relative organism quantity {from} to {to}',
      lt: 'Relative organism quantity below {to}',
      gt: 'Relative organism quantity above {from}',
      e: 'Relative organism quantity is {from}',
    },
    // -- Add interval above this line (required by plopfile.js) --
  },
  enums: {
    basisOfRecord,
    countryCode,
    mediaTypes,
    occurrenceIssue,
    typeStatus,
    license,
    month,
    continent,
    protocol,
    establishmentMeans,
    // -- Add enum translations above this line (required by plopfile.js) --
  }
}