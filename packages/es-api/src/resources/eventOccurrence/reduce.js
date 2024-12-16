const _ = require('lodash');
const gadmLevels = [0, 1, 2, 3, 4, 5];

const indexedExtraFields = ['collectionKey', 'datasetPublishingCountry', 'institutionKey'];

function removeUndefined(obj) {
  for (let k in obj) if (obj[k] === undefined) delete obj[k];
  return obj;
}

/*
 * Temporary function to parse vocaulary values. The schemas differ in prod and uat, and to easy deployment the UI use a fallback
 * https://github.com/gbif/gbif-web/issues/109
 */
function vocabularFallback(obj) {
  if (typeof obj === 'object' && obj != null && obj.concept) {
    return obj.concept;
  } else {
    return obj;
  }
}
/**
 * Map ES response to something similar to v1
 */
function reduce(item) {
  // take dwc items from verbatim
  // overwrite with selected interpreted fields
  // const source = item._source;
  const source = item._source.occurrence != null ? item._source.occurrence : item._source;
  const sourceVerbatim = item._source.verbatim;

  // return _.pick(item._source, whitelist);
  const verbatim = removeUndefined({
    abstract: sourceVerbatim.core['http://purl.org/dc/terms/abstract'],
    acceptedNameUsage: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/acceptedNameUsage'],
    acceptedNameUsageID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/acceptedNameUsageID'],
    accessRights: sourceVerbatim.core['http://purl.org/dc/terms/accessRights'],
    accrualMethod: sourceVerbatim.core['http://purl.org/dc/terms/accrualMethod'],
    accrualPeriodicity: sourceVerbatim.core['http://purl.org/dc/terms/accrualPeriodicity'],
    accrualPolicy: sourceVerbatim.core['http://purl.org/dc/terms/accrualPolicy'],
    alternative: sourceVerbatim.core['http://purl.org/dc/terms/alternative'],
    associatedOccurrences:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/associatedOccurrences'],
    associatedOrganisms: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/associatedOrganisms'],
    associatedReferences: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/associatedReferences'],
    associatedSequences: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/associatedSequences'],
    associatedTaxa: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/associatedTaxa'],
    audience: sourceVerbatim.core['http://purl.org/dc/terms/audience'],
    available: sourceVerbatim.core['http://purl.org/dc/terms/available'],
    bed: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/bed'],
    behavior: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/behavior'],
    bibliographicCitation: sourceVerbatim.core['http://purl.org/dc/terms/bibliographicCitation'],
    collectionID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/collectionID'],
    conformsTo: sourceVerbatim.core['http://purl.org/dc/terms/conformsTo'],
    contributor: sourceVerbatim.core['http://purl.org/dc/terms/contributor'],
    county: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/county'],
    coverage: sourceVerbatim.core['http://purl.org/dc/terms/coverage'],
    creator: sourceVerbatim.core['http://purl.org/dc/terms/creator'],
    dataGeneralizations: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/dataGeneralizations'],
    date: sourceVerbatim.core['http://purl.org/dc/terms/date'],
    dateAccepted: sourceVerbatim.core['http://purl.org/dc/terms/dateAccepted'],
    dateCopyrighted: sourceVerbatim.core['http://purl.org/dc/terms/dateCopyrighted'],
    dateSubmitted: sourceVerbatim.core['http://purl.org/dc/terms/dateSubmitted'],
    description: sourceVerbatim.core['http://purl.org/dc/terms/description'],
    disposition: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/disposition'],
    dynamicProperties: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/dynamicProperties'],
    earliestAgeOrLowestStage:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/earliestAgeOrLowestStage'],
    earliestEonOrLowestEonothem:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/earliestEonOrLowestEonothem'],
    earliestEpochOrLowestSeries:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/earliestEpochOrLowestSeries'],
    earliestEraOrLowestErathem:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/earliestEraOrLowestErathem'],
    earliestPeriodOrLowestSystem:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/earliestPeriodOrLowestSystem'],
    educationLevel: sourceVerbatim.core['http://purl.org/dc/terms/educationLevel'],
    endDayOfYear: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/endDayOfYear'],
    eventID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/eventID'],
    eventRemarks: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/eventRemarks'],
    eventTime: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/eventTime'],
    extent: sourceVerbatim.core['http://purl.org/dc/terms/extent'],
    fieldNotes: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/fieldNotes'],
    fieldNumber: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/fieldNumber'],
    footprintSRS: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/footprintSRS'],
    footprintSpatialFit: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/footprintSpatialFit'],
    footprintWKT: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/footprintWKT'],
    format: sourceVerbatim.core['http://purl.org/dc/terms/format'],
    formation: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/formation'],
    geodeticDatum: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/geodeticDatum'] || 'WGS84',
    geologicalContextID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/geologicalContextID'],
    georeferenceProtocol: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/georeferenceProtocol'],
    georeferenceRemarks: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/georeferenceRemarks'],
    georeferenceSources: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/georeferenceSources'],
    georeferenceVerificationStatus:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/georeferenceVerificationStatus'],
    georeferencedBy: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/georeferencedBy'],
    georeferencedDate: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/georeferencedDate'],
    group: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/group'],
    habitat: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/habitat'],
    hasFormat: sourceVerbatim.core['http://purl.org/dc/terms/hasFormat'],
    hasPart: sourceVerbatim.core['http://purl.org/dc/terms/hasPart'],
    hasVersion: sourceVerbatim.core['http://purl.org/dc/terms/hasVersion'],
    higherClassification: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/higherClassification'],
    higherGeography: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/higherGeography'],
    higherGeographyID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/higherGeographyID'],
    highestBiostratigraphicZone:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/highestBiostratigraphicZone'],
    identificationID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/identificationID'],
    identificationQualifier:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/identificationQualifier'],
    identificationReferences:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/identificationReferences'],
    identificationRemarks:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/identificationRemarks'],
    identificationVerificationStatus:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/identificationVerificationStatus'],
    identifier: sourceVerbatim.core['http://purl.org/dc/terms/identifier'], // for some reason this property isn't in the ES response as of 3 november 2020 - add it further down
    informationWithheld: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/informationWithheld'],
    infraspecificEpithet: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/infraspecificEpithet'],
    institutionID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/institutionID'],
    instructionalMethod: sourceVerbatim.core['http://purl.org/dc/terms/instructionalMethod'],
    isFormatOf: sourceVerbatim.core['http://purl.org/dc/terms/isFormatOf'],
    isPartOf: sourceVerbatim.core['http://purl.org/dc/terms/isPartOf'],
    isReferencedBy: sourceVerbatim.core['http://purl.org/dc/terms/isReferencedBy'],
    isReplacedBy: sourceVerbatim.core['http://purl.org/dc/terms/isReplacedBy'],
    isRequiredBy: sourceVerbatim.core['http://purl.org/dc/terms/isRequiredBy'],
    isVersionOf: sourceVerbatim.core['http://purl.org/dc/terms/isVersionOf'],
    island: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/island'],
    islandGroup: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/islandGroup'],
    issued: sourceVerbatim.core['http://purl.org/dc/terms/issued'],
    language: sourceVerbatim.core['http://purl.org/dc/terms/language'],
    latestAgeOrHighestStage:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/latestAgeOrHighestStage'],
    latestEonOrHighestEonothem:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/latestEonOrHighestEonothem'],
    latestEpochOrHighestSeries:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/latestEpochOrHighestSeries'],
    latestEraOrHighestErathem:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/latestEraOrHighestErathem'],
    latestPeriodOrHighestSystem:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/latestPeriodOrHighestSystem'],
    lithostratigraphicTerms:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/lithostratigraphicTerms'],
    locationAccordingTo: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/locationAccordingTo'],
    locationID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/locationID'],
    locationRemarks: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/locationRemarks'],
    lowestBiostratigraphicZone:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/lowestBiostratigraphicZone'],
    materialSampleID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/materialSampleID'],
    mediator: sourceVerbatim.core['http://purl.org/dc/terms/mediator'],
    medium: sourceVerbatim.core['http://purl.org/dc/terms/medium'],
    member: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/member'],
    municipality: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/municipality'],
    nameAccordingTo: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/nameAccordingTo'],
    nameAccordingToID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/nameAccordingToID'],
    namePublishedIn: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/namePublishedIn'],
    namePublishedInID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/namePublishedInID'],
    namePublishedInYear: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/namePublishedInYear'],
    nomenclaturalCode: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/nomenclaturalCode'],
    nomenclaturalStatus: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/nomenclaturalStatus'],
    occurrenceID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/occurrenceID'],
    occurrenceRemarks: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/occurrenceRemarks'],
    organismID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/organismID'],
    organismName: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/organismName'],
    organismQuantity: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/organismQuantity'],
    organismQuantityType: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/organismQuantityType'],
    organismRemarks: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/organismRemarks'],
    organismScope: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/organismScope'],
    originalNameUsage: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/originalNameUsage'],
    originalNameUsageID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/originalNameUsageID'],
    ownerInstitutionCode: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/ownerInstitutionCode'],
    parentEventID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/parentEventID'],
    parentNameUsage: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/parentNameUsage'],
    parentNameUsageID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/parentNameUsageID'],
    pointRadiusSpatialFit:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/pointRadiusSpatialFit'],
    previousIdentifications:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/previousIdentifications'],
    provenance: sourceVerbatim.core['http://purl.org/dc/terms/provenance'],
    publisher: sourceVerbatim.core['http://purl.org/dc/terms/publisher'],
    relation: sourceVerbatim.core['http://purl.org/dc/terms/relation'],
    replaces: sourceVerbatim.core['http://purl.org/dc/terms/replaces'],
    reproductiveCondition:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/reproductiveCondition'],
    requires: sourceVerbatim.core['http://purl.org/dc/terms/requires'],
    rights: sourceVerbatim.core['http://purl.org/dc/terms/rights'],
    rightsHolder: sourceVerbatim.core['http://purl.org/dc/terms/rightsHolder'],
    samplingEffort: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/samplingEffort'],
    scientificNameAuthorship:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/scientificNameAuthorship'],
    scientificNameID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/scientificNameID'],
    source: sourceVerbatim.core['http://purl.org/dc/terms/source'],
    spatial: sourceVerbatim.core['http://purl.org/dc/terms/spatial'],
    startDayOfYear: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/startDayOfYear'],
    subject: sourceVerbatim.core['http://purl.org/dc/terms/subject'],
    tableOfContents: sourceVerbatim.core['http://purl.org/dc/terms/tableOfContents'],
    taxonConceptID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/taxonConceptID'],
    taxonID: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/taxonID'],
    taxonRemarks: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/taxonRemarks'],
    temporal: sourceVerbatim.core['http://purl.org/dc/terms/temporal'],
    title: sourceVerbatim.core['http://purl.org/dc/terms/title'],
    type: sourceVerbatim.core['http://purl.org/dc/terms/type'],
    valid: sourceVerbatim.core['http://purl.org/dc/terms/valid'],
    verbatimCoordinateSystem:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verbatimCoordinateSystem'],
    verbatimCoordinates: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verbatimCoordinates'],
    verbatimDepth: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verbatimDepth'],
    verbatimElevation: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verbatimElevation'],
    verbatimEventDate: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verbatimEventDate'],
    verbatimIdentification:
      sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verbatimIdentification'],
    verbatimLatitude: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verbatimLatitude'],
    verbatimLocality: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verbatimLocality'],
    verbatimLongitude: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verbatimLongitude'],
    verbatimSRS: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verbatimSRS'],
    verbatimTaxonRank: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verbatimTaxonRank'],
    vernacularName: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/vernacularName'],
    verticalDatum: sourceVerbatim.core['http://rs.tdwg.org/dwc/terms/verticalDatum'],
  });

  const normalized = {
    basisOfRecord: source.basisOfRecord,
    catalogNumber: source.catalogNumber,
    isInCluster: source.isClustered,
    collectionCode: source.collectionCode,
    continent: source.continent,
    coordinatePrecision: source.coordinatePrecision,
    coordinateUncertaintyInMeters: source.coordinateUncertaintyInMeters,
    country: source.country,
    countryCode: source.countryCode,
    created: source.created,
    datasetKey: item._source.metadata.datasetKey,
    dateIdentified: source.dateIdentified,
    day: source.day,
    decimalLatitude: source.decimalLatitude,
    decimalLongitude: source.decimalLongitude,
    depth: source.depth,
    depthAccuracy: source.depthAccuracy,
    elevation: source.elevation,
    elevationAccuracy: source.elevationAccuracy,
    endDayOfYear: source.endDayOfYear,
    establishmentMeans: vocabularFallback(source.establishmentMeans),
    eventDate: source.eventDateSingle,
    identifiedBy: source.identifiedBy,
    individualCount: source.individualCount,
    institutionCode: source.institutionCode,
    license: source.license,
    lifeStage: vocabularFallback(source.lifeStage),
    pathway: vocabularFallback(source.pathway),
    degreeOfEstablishment: vocabularFallback(source.degreeOfEstablishment),
    locality: source.locality,
    identifier: source.id,

    // the range fields are replaced by accuracy
    // maximumDepthInMeters:               source.maximumDepthInMeters,
    // maximumDistanceAboveSurfaceInMeters:source.maximumDistanceAboveSurfaceInMeters,
    // maximumElevationInMeters:           source.maximumElevationInMeters,
    // minimumDepthInMeters:               source.minimumDepthInMeters,
    // minimumDistanceAboveSurfaceInMeters:source.minimumDistanceAboveSurfaceInMeters,
    // minimumElevationInMeters:           source.minimumElevationInMeters,

    modified: source.modified,
    month: source.month,
    occurrenceStatus: source.occurrenceStatus,
    // organismQuantity:                   source.organismQuantity,// this field is only present when it can be interpreted as a number
    organismQuantityType: source.organismQuantityType,
    protocol: source.protocol,
    publishingCountry: source.publishingCountry,
    recordNumber: source.recordNumber,
    recordedBy: source.recordedBy,
    references: source.references,
    relativeOrganismQuantity: source.relativeOrganismQuantity,
    sampleSizeUnit: source.sampleSizeUnit,
    sampleSizeValue: source.sampleSizeValue,
    samplingProtocol: source.samplingProtocol,
    sex: source.sex,
    // startDayOfYear:                     source.startDayOfYear,
    stateProvince: source.stateProvince,
    typeStatus: source.typeStatus,
    typifiedName: source.typifiedName,
    waterBody: source.waterBody,
    year: source.year,
    identifiedByIDs: source.identifiedByIds || [],
    recordedByIDs: source.recordedByIds || [],

    preparations: source.preparations,
    datasetID: source.datasetID,
    datasetName: source.datasetName,
    otherCatalogNumbers: source.otherCatalogNumbers,
    eventHierarchy: source.eventHierarchy,
    eventTypeHierarchy: source.eventTypeHierarchy,
  };

  const gbifSpecific = {
    key: source.id,
    gbifID: source.gbifId,
    acceptedScientificName: source.gbifClassification?.acceptedUsage?.name,
    acceptedTaxonKey: source.gbifClassification?.acceptedUsage?.guid,
    scientificName: source.gbifClassification?.usage?.name,
    class: source.gbifClassification?.class,
    classKey: source.gbifClassification?.classKey,
    collectionKey: source.collectionKey,
    crawlId: source.crawlId,
    datasetKey: item._source.metadata.datasetKey,
    depth: source.depth,
    depthAccuracy: source.depthAccuracy,
    distanceAboveSurface: source.distanceAboveSurface,
    distanceAboveSurfaceAccuracy: source.distanceAboveSurfaceAccuracy,
    elevation: source.elevation,
    elevationAccuracy: source.elevationAccuracy,
    family: source.gbifClassification.family,
    familyKey: source.gbifClassification.familyKey,
    genericName: source.gbifClassification?.usageParsedName?.genericName,
    genus: source.gbifClassification.genus,
    genusKey: source.gbifClassification.genusKey,
    installationKey: source.installationKey,
    institutionKey: source.institutionKey,
    issues: source.issues || [],
    kingdom: source.gbifClassification.kingdom,
    kingdomKey: source.gbifClassification.kingdomKey,
    lastCrawled: source.lastCrawled,
    // lastInterpreted:                    source.lastInterpreted,
    lastParsed: source.lastParsed,
    // mediaType:                          source.mediaType,
    // networkKey:                         source.networkKeys || [],
    order: source.gbifClassification.order,
    orderKey: source.gbifClassification.orderKey,
    phylum: source.gbifClassification.phylum,
    phylumKey: source.gbifClassification.phylumKey,
    protocol: source.protocol,
    publishingCountry: source.publishingCountry,
    publishingOrgKey: source.publishingOrganizationKey,
    relativeOrganismQuantity: source.relativeOrganismQuantity,
    // repatriated:                        source.repatriated,
    species: source.gbifClassification.species,
    speciesKey: source.gbifClassification.speciesKey,
    specificEpithet: source.gbifClassification?.usageParsedName?.specificEpithet,
    subgenus: source.gbifClassification.subgenus,
    subgenusKey: source.gbifClassification.subgenusKey,
    taxonKey: source.gbifClassification.usage?.key,
    taxonomicStatus: source.gbifClassification?.diagnostics?.status,
    taxonRank: source.gbifClassification.usage?.rank,
    // typifiedName:                       source.typifiedName,
    verbatimScientificName: source.gbifClassification.verbatimScientificName,
    media: source.multimediaItems || [],
    facts: source.measurementOrFactItems || [],
    identifiers: [],
    relations: [],
    extensions: sourceVerbatim.extensions,
    gbifClassification: source.gbifClassification,

    // not in v1
    datasetTitle: item._source.metadata.datasetTitle,
    publisherTitle: source.publisherTitle,
    parsedEventDate: source.eventDate,
  };

  if (gbifSpecific?.gbifClassification?.acceptedUsage?.guid) {
    gbifSpecific.gbifClassification.acceptedUsage.key =
      gbifSpecific?.gbifClassification?.acceptedUsage?.guid;
    delete gbifSpecific?.gbifClassification?.acceptedUsage?.guid;
  }

  // extra gadm specific fields
  let gadm = { gadm: {} };
  if (source.gadm) {
    gadm.gadm = gadmLevels.reduce((p, c) => {
      if (source.gadm[`level${c}Gid`]) {
        p[`level${c}`] = {
          gid: source.gadm[`level${c}Gid`],
          name: source.gadm[`level${c}Name`],
        };
      }
      return p;
    }, {});
  }

  const merged = Object.assign({}, gbifSpecific, verbatim, normalized, gadm);

  return merged;
}

module.exports = {
  reduce,
};
