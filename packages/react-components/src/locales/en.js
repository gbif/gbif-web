import basisOfRecord from './enums/basisOfRecord.json';
import countryCode from './enums/countryCode.json';
import mediaTypes from './enums/mediaTypes.json';
import occurrenceIssue from './enums/occurrenceIssue.json';
import typeStatus from './enums/typeStatus.json';
import taxonRank from './enums/taxonRank.json';
import taxonomicStatus from './enums/taxonomicStatus.json';
import license from './enums/license.json';
import month from './enums/month.json';
import continent from './enums/continent.json';
import protocol from './enums/protocol.json';
import establishmentMeans from './enums/establishmentMeans.json';
import occurrenceStatus from './enums/occurrenceStatus.json';
import role from './enums/role.json';

// -- Add imports above this line (required by plopfile.js) --

export const en = {
  first: 'First',
  previous: 'Previous',
  next: 'Next',
  options: 'Options',
  'pagination.pageXofY': 'Page {current} of {total}',
  moreFilters: 'more',
  nResults: '{total, plural, one {# result} other {# results}}',
  nResultsWithCoordinates: '{total, plural, one {# result } other {# results}} with coordinates',
  nResultsWithImages: '{total, plural, one {# result } other {# results}} with images',
  tableHeaders: {
    features: 'Features'
  },
  nullOrNot: {
    isNotNull: 'Must be defined',
    isNull: 'Must not be defined',
  },
  dataset: {
    samplingDescription: {
      sampling: 'Sampling',
      studyExtent: 'Study extent',
      qualityControl: 'Quality control',
      methodSteps: 'Method steps'
    }
  },
  filter: {
    taxonKey: {
      name: 'Scientific name',
      count: '{num, plural, one {scientific name} other {# scientific names}}',
      description: 'The scientific name as it appears in the GBIF backbone taxonomy'
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
      name: 'Coordinates',
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
      count: '{num, plural, one { sample size value } other {# sample size values}}',
      description: 'A short description of the component should be placed here'
    },
    relativeOrganismQuantity: {
      name: 'Relative organism quantity',
      count: '{num, plural, one { relative organism quantity } other {# relative organism quantitys}}',
      description: 'A short description of the component should be placed here'
    },
    month: {
      name: 'Month',
      count: '{num, plural, one { month } other {# months}}',
      description: 'A short description of the component should be placed here'
    },
    continent: {
      name: 'Continent',
      count: '{num, plural, one { continent } other {# continents}}',
      description: 'A short description of the component should be placed here'
    },
    protocol: {
      name: 'Protocol',
      count: '{num, plural, one { protocol } other {# protocols}}',
      description: 'A short description of the component should be placed here'
    },
    establishmentMeans: {
      name: 'Establishment means',
      count: '{num, plural, one { establishment means } other {# establishment means}}',
      description: 'A short description of the component should be placed here'
    },
    catalogNumber: {
      name: 'Catalog number',
      count: '{num, plural, one { catalog number } other {# catalog numbers}}',
      description: 'A short description of the component should be placed here'
    },
    recordedBy: {
      name: 'Recorded by',
      count: '{num, plural, one { recorded by } other {# recorded bys}}',
      description: 'A short description of the component should be placed here'
    },
    recordNumber: {
      name: 'Record number',
      count: '{num, plural, one { record number } other {# record numbers}}',
      description: 'A short description of the component should be placed here'
    },
    collectionCode: {
      name: 'Collection code',
      count: '{num, plural, one { collection code } other {# collection codes}}',
      description: 'A short description of the component should be placed here'
    },
    recordedById: {
      name: 'Recorded by id',
      count: '{num, plural, one { recorded by id } other {# recorded by ids}}',
      description: 'A short description of the component should be placed here'
    },
    identifiedById: {
      name: 'Identified by id',
      count: '{num, plural, one { identified by id } other {# identified by ids}}',
      description: 'A short description of the component should be placed here'
    },
    occurrenceId: {
      name: 'Occurrence id',
      count: '{num, plural, one { occurrence id } other {# occurrence ids}}',
      description: 'A short description of the component should be placed here'
    },
    organismId: {
      name: 'Organism id',
      count: '{num, plural, one { organism id } other {# organism ids}}',
      description: 'A short description of the component should be placed here'
    },
    locality: {
      name: 'Locality',
      count: '{num, plural, one { locality } other {# localities}}',
      description: 'A short description of the component should be placed here'
    },
    waterBody: {
      name: 'Water body',
      count: '{num, plural, one { water body } other {# water bodies}}',
      description: 'A short description of the component should be placed here'
    },
    stateProvince: {
      name: 'State province',
      count: '{num, plural, one { state province } other {# state provinces}}',
      description: 'A short description of the component should be placed here'
    },
    eventId: {
      name: 'Event id',
      count: '{num, plural, one { event id } other {# event ids}}',
      description: 'A short description of the component should be placed here'
    },
    samplingProtocol: {
      name: 'Sampling protocol',
      count: '{num, plural, one { Sampling protocol } other {# Sampling protocols}}',
      description: 'A short description of the component should be placed here'
    },
    elevation: {
      name: 'Elevation',
      count: '{num, plural, one { Elevation } other {# Elevations}}',
      description: 'A short description of the component should be placed here'
    },
    occurrenceStatus: {
      name: 'Occurrence status',
      count: '{num, plural, one { Occurrence status } other {# Occurrence statuss}}',
      description: 'A short description of the component should be placed here'
    },
    gadmGid: {
      name: 'Administrative area',
      count: '{num, plural, one { administrative area } other {# administrative areas}}',
      description: 'Administrative areas as provided by GADM.org - this division can differ from the ISO 3166-1 standard used by GBIF.org for country processing.'
    },
    identifiedBy: {
      name: 'Identified by',
      count: '{num, plural, one { Identified by } other {# Identified bys}}',
      description: 'This filter is an example where one can search using wildcards. ?: matches any single character. *: matches zero or more characters'
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
    compact: {
      between: '{from} to {to}',
      lt: 'Below {to}',
      gt: 'Above {from}',
      e: '{from}',
    },
    compactMeters: {
      between: '{from}m to {to}m',
      lt: 'Below {to}m',
      gt: 'Above {from}m',
      e: '{from}m',
    },
    compactTime: {
      between: '{from} to {to}',
      lt: 'Before {to}',
      gt: 'After {from}',
      e: '{from}',
    },
    year: {
      between: 'Year {from} to {to}',
      lt: 'Before year {to}',
      gt: 'After year {from}',
      e: 'Year is {from}',
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
    elevation: {
      between: 'Elevation {from} to {to}',
      lt: 'Elevation below {to}',
      gt: 'Elevation above {from}',
      e: 'Elevation is {from}',
    },
    // -- Add interval above this line (required by plopfile.js) --
  },
  enums: {
    basisOfRecord,
    countryCode,
    mediaTypes,
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
    role
    // -- Add enum translations above this line (required by plopfile.js) --
  }
}