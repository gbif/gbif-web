import basisOfRecord from './enums/basisOfRecord.json';
import countryCode from './enums/countryCode.json';
import mediaType from './enums/mediaType.json';
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
import literatureType from './enums/literatureType.json';
import role from './enums/role.json';
import isInCluster from './enums/isInCluster.json';
import datasetType from './enums/datasetType.json';
import datasetSubtype from './enums/datasetSubtype.json';
import { dataset } from './components/dataset';
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
    features: 'Features',
    citations: 'Citations',
    occurrences: 'Occurrences',
    numberSpecimens: 'Number of specimens',
    gbifNumberSpecimens: 'Specimens in GBIF',
    title: 'Title',
    titleAndAbstract: 'Title and abstract',
    altmetric: 'Altmetric',
    registered: 'Registered',
    hostedDatasets: 'Hosted datasets',
    pubDatasets: 'Published datasets',
  },
  nullOrNot: {
    isNotNull: 'Must be defined',
    isNull: 'Must not be defined',
  },
  components: {
    dataset
  },
  filter: {
    taxonKey: {
      name: 'Scientific name',
      count: '{num, plural, one {scientific name} other {# scientific names}}',
      description: 'The scientific name as it appears in the GBIF backbone taxonomy. These names are normalized to ease search across datasets. It is possible that an originally-provided name might be misinterpreted or unknown. To search the names as provided use the "Verbatim scientific name" filter.'
    },
    basisOfRecord: {
      name: 'Basis of record',
      count: '{num, plural, one {basis of record} other {# bases of records}}',
      isNotNull: 'Has a basis of record',
      isNull: 'Has no basis of record',
      description: 'The nature of the evidence upon which the record is based.'
    },
    institutionCode: {
      name: 'Institution code',
      count: '{num, plural, one {institution code} other {# institution codes}}',
      description: 'The code (or acronym) for the institution having custody of the object(s) or information referred to in the record.'
    },
    catalogNumber: {
      name: 'Catalog number',
      count: '{num, plural, one {catalog number} other {# catalog numbers}}',
      description: 'The catalog number for this record.'
    },
    mediaType: {
      name: 'Media type',
      count: '{num, plural, one {media type} other {# media types}}',
      description: 'The types of media accessible for this record.'
    },
    occurrenceIssue: {
      name: 'Issues and flags',
      count: '{num, plural, one {issue or flag} other {# issues and flags}}',
      isNotNull: 'Has issues',
      isNull: 'Has no issues',
      description: 'The types of issues or flags of potential interest discovered in processing the data.'
    },
    occurrenceCountry: {
      name: 'Country',
      count: '{num, plural, one {country} other {# countries}}',
      description: 'The country or territory where the event occurred'
    },
    publishingCountryCode: {
      name: 'Publishing country',
      count: '{num, plural, one {publishing country} other {# publishing countries}}',
      description: 'The country or territory from which the data were published'
    },
    q: {
      name: 'Text search',
      count: '{num, plural, one {text string} other {# search strings}}',
      description: 'Find records with similar matching text among text fields. For matching text within a specific field, use corresponding filter, such as the one for "Scientific Name".'
    },
    coordinates: {
      name: 'Coordinates',
    },
    elevation: {
      name: 'Elevation',
      count: '{num, plural, one {elevation filter} other {# elevation filters}}',
      description: 'The distance above a vertical reference point (usually mean sea level or a geoid) in meters.'
    },
    license: {
      name: 'License',
      count: '{num, plural, one {license} other {# licenses}}',
      description: 'The legal license or waiver under which the record is shared.'
    },
    datasetKey: {
      name: 'Dataset',
      count: '{num, plural, one {dataset} other {# datasets}}',
      description: 'The title of the dataset under which the record is shared.'
    },
    publisherKey: {
      name: 'Publisher',
      count: '{num, plural, one {publisher} other {# publishers}}',
      description: 'The name of the organization under which the dataset for the record is registered.'
    },
    hostingOrganizationKey: {
      name: 'Hosting organization',
      count: '{num, plural, one {host} other {# hosts}}',
      description: 'The name of the organization hosting the dataset in which the record is published.'
    },
    country: {
      name: 'Country',
      count: '{num, plural, one {country} other {# countries}}',
    },
    countriesOfCoverage: {
      name: 'Country of coverage',
      count: '{num, plural, one {country of coverage} other {# countries of coverage}}',
    },
    countriesOfResearcher: {
      name: 'Country of researcher',
      count: '{num, plural, one {country of researcher} other {# countries of researchers}}',
    },
    typeStatus: {
      name: 'Type status',
      count: '{num, plural, one {type status} other {# type statuses}}',
      isNotNull: 'Has a type status',
      isNull: 'The type status',
      description: 'The type designation of a specimen.'
    },
    year: {
      name: 'Year',
      count: '{num, plural, one {year filter} other {# year filters}}',
      description: 'The year in which the event occurred.'
    },
    sampleSizeUnit: {
      name: "Sample size unit",
      count: '{num, plural, one {sample size unit} other {# sample size units}}',
      description: 'The unit of measurement for the "sample size value".'
    },
    coordinateUncertainty: {
      name: 'Coordinate uncertainty',
      count: '{num, plural, one {Coordinate uncertainty} other {# coordinate uncertainty filters}}',
      description: 'A measure of the minimum distance in meters from a coordinate within which a locality might be interpreted to be.'
    },
    depth: {
      name: 'Depth',
      count: '{num, plural, one { Depth } other {# Depths}}',
      description: 'The distance below a local surface, in meters.'
    },
    organismQuantity: {
      name: 'Organism quantity',
      count: '{num, plural, one { Organism quantity } other {# Organism quantitys}}',
      description: 'The value for the quantity of organisms, where the type of measurement is given in the "Organism quantity type".'
    },
    sampleSizeValue: {
      name: 'Sample size value',
      count: '{num, plural, one { sample size value } other {# sample size values}}',
      description: 'The value for the size of a sample, where the units of measurement are given in the "Sample size unit".'
    },
    relativeOrganismQuantity: {
      name: 'Relative organism quantity',
      count: '{num, plural, one { relative organism quantity } other {# relative organism quantitys}}',
      description: 'The amount of biological material relative to the size of a sample, calculated as organismQuantity per sampleSize when the organismQuantityType and sampleSizeUnit are unambiguous.'
    },
    month: {
      name: 'Month',
      count: '{num, plural, one { month } other {# months}}',
      description: 'The integer month in which the Event occurred.'
    },
    continent: {
      name: 'Continent',
      count: '{num, plural, one { continent } other {# continents}}',
      description: 'The name of the continent in which the Location occurs.'
    },
    protocol: {
      name: 'Publishing protocol',
      count: '{num, plural, one { protocol } other {# protocols}}',
      description: 'The technical protocol through which the dataset is shared.'
    },
    establishmentMeans: {
      name: 'Establishment means',
      count: '{num, plural, one { establishment means } other {# establishment means}}',
      description: 'The means by which the organism was introduced to a given place at a given time.'
    },
    catalogNumber: {
      name: 'Catalog number',
      count: '{num, plural, one { catalog number } other {# catalog numbers}}',
      description: 'The identifier for the record within a catalog or collection.'
    },
    recordedBy: {
      name: 'Recorded by',
      count: '{num, plural, one { recorded by } other {# recorded bys}}',
      description: 'The names of the people, groups, or organizations responsible for recording the original Occurrence.'
    },
    recordNumber: {
      name: 'Record number',
      count: '{num, plural, one { record number } other {# record numbers}}',
      description: 'An identifier given to the Occurrence at the time it was recorded.'
    },
    collectionCode: {
      name: 'Collection code',
      count: '{num, plural, one { collection code } other {# collection codes}}',
      description: 'A short description of the component should be placed here'
    },
    recordedById: {
      name: 'Recorded by id',
      count: '{num, plural, one { recorded by id } other {# recorded by ids}}',
      description: 'The identifier for the people, groups, or organizations responsible for recording the original Occurrence.'
    },
    identifiedById: {
      name: 'Identified by id',
      count: '{num, plural, one { identified by id } other {# identified by ids}}',
      description: 'The identifier for the people, groups, or organizations responsible for determining the scientific name of the Organism.'
    },
    occurrenceId: {
      name: 'Occurrence id',
      count: '{num, plural, one { occurrence id } other {# occurrence ids}}',
      description: 'The unique identifier for the Occurrence record.'
    },
    organismId: {
      name: 'Organism id',
      count: '{num, plural, one { organism id } other {# organism ids}}',
      description: 'The unique identifier for the Organism in the record.'
    },
    locality: {
      name: 'Locality',
      count: '{num, plural, one { locality } other {# localities}}',
      description: 'The specific part of the description of the place.'
    },
    waterBody: {
      name: 'Water body',
      count: '{num, plural, one { water body } other {# water bodies}}',
      description: 'The name of the water body in which the Location occurs.'
    },
    stateProvince: {
      name: 'State province',
      count: '{num, plural, one { state province } other {# state provinces}}',
      description: 'The name of the next smaller administrative region than country in which the Location occurs.'
    },
    eventId: {
      name: 'Event id',
      count: '{num, plural, one { event id } other {# event ids}}',
      description: 'The unique identifier for the Event in the record.'
    },
    samplingProtocol: {
      name: 'Sampling protocol',
      count: '{num, plural, one { Sampling protocol } other {# Sampling protocols}}',
      description: 'The name of, reference to, or description of the method or protocol used during an Event.'
    },
    occurrenceStatus: {
      name: 'Occurrence status',
      count: '{num, plural, one { Occurrence status } other {# Occurrence statuss}}',
      description: 'The presence or absence of any organisms of the given Taxon.'
    },
    gadmGid: {
      name: 'Administrative area',
      count: '{num, plural, one { administrative area } other {# administrative areas}}',
      description: 'The name of any administrative area from GADM.org determined during record processing.'
    },
    identifiedBy: {
      name: 'Identified by',
      count: '{num, plural, one { Identified by } other {# Identified bys}}',
      description: 'The people, groups, or organizations responsible for determining the scientific name of the Organism.'
    },
    isInCluster: {
      name: 'Is in cluster',
      count: '{num, plural, one { Is in cluster } other {# Is in clusters}}',
      description: 'Whether the record was determined to have related records.'
    },
    datasetType: {
      name: 'Dataset type',
      count: '{num, plural, one { Dataset type } other {# Dataset types}}',
      description: 'A short description of the component should be placed here'
    },
    datasetSubtype: {
      name: 'Dataset subtype',
      count: '{num, plural, one { Dataset subtype } other {# Dataset subtypes}}',
      description: 'A short description of the component should be placed here'
    },
    institutionKey: {
      name: 'Institution',
      count: '{num, plural, one { Institution } other {# Institutions}}',
      description: 'The name of the institution having custody of the object(s) or information referred to in the record.'
    },
    name: {
      name: 'Name',
      count: '{num, plural, one { Name } other {# Names}}',
      description: 'A short description of the component should be placed here'
    },
    city: {
      name: 'City',
      count: '{num, plural, one { City } other {# Cities}}',
      description: 'A short description of the component should be placed here'
    },
    code: {
      name: 'Code',
      count: '{num, plural, one { Code } other {# Codes}}',
      description: 'A short description of the component should be placed here'
    },
    verbatimScientificName: {
      name: 'Verbatim scientific name',
      count: '{num, plural, one { Verbatim scientific name } other {# Verbatim scientific names}}',
      description: 'The scientific name as provided by the data publisher without any normalisation.'
    },
    networkKey: {
      name: 'Network key',
      count: '{num, plural, one { Network key } other {# Network keys}}',
      description: 'A short description of the component should be placed here'
    },
    literatureType: {
      name: 'Literature type',
      count: '{num, plural, one { Literature type } other {# Literature types}}',
      description: 'What type of literature does the citation come from.'
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
    datasetSubtype,
    literatureType,
    // -- Add enum translations above this line (required by plopfile.js) --
  }
}