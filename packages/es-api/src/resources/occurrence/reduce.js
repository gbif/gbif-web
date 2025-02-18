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
  if (obj && typeof obj === 'object' && obj.concept) {
    return obj.concept;
  } else {
    return obj;
  }
}

function vocabularyConcepts(obj) {
  if (obj && typeof obj === 'object' && obj.concepts && Array.isArray(obj.concepts)) {
    // concatenate all concepts with a pipe
    return obj.concepts;
  } else {
    return [obj];
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
  // return _.pick(item._source, whitelist);
  const verbatim = removeUndefined({
    abstract: source.verbatim.core['http://purl.org/dc/terms/abstract'],
    acceptedNameUsage: source.verbatim.core['http://rs.tdwg.org/dwc/terms/acceptedNameUsage'],
    acceptedNameUsageID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/acceptedNameUsageID'],
    accessRights: source.verbatim.core['http://purl.org/dc/terms/accessRights'],
    accrualMethod: source.verbatim.core['http://purl.org/dc/terms/accrualMethod'],
    accrualPeriodicity: source.verbatim.core['http://purl.org/dc/terms/accrualPeriodicity'],
    accrualPolicy: source.verbatim.core['http://purl.org/dc/terms/accrualPolicy'],
    alternative: source.verbatim.core['http://purl.org/dc/terms/alternative'],
    // associatedMedia:                    source.verbatim.core['http://rs.tdwg.org/dwc/terms/associatedMedia'],
    associatedOccurrences:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/associatedOccurrences'],
    associatedOrganisms: source.verbatim.core['http://rs.tdwg.org/dwc/terms/associatedOrganisms'],
    associatedReferences: source.verbatim.core['http://rs.tdwg.org/dwc/terms/associatedReferences'],
    associatedSequences: source.verbatim.core['http://rs.tdwg.org/dwc/terms/associatedSequences'],
    associatedTaxa: source.verbatim.core['http://rs.tdwg.org/dwc/terms/associatedTaxa'],
    audience: source.verbatim.core['http://purl.org/dc/terms/audience'],
    available: source.verbatim.core['http://purl.org/dc/terms/available'],
    bed: source.verbatim.core['http://rs.tdwg.org/dwc/terms/bed'],
    behavior: source.verbatim.core['http://rs.tdwg.org/dwc/terms/behavior'],
    bibliographicCitation: source.verbatim.core['http://purl.org/dc/terms/bibliographicCitation'],
    // class:                              source.verbatim.core['http://rs.tdwg.org/dwc/terms/class'],
    collectionID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/collectionID'],
    conformsTo: source.verbatim.core['http://purl.org/dc/terms/conformsTo'],
    contributor: source.verbatim.core['http://purl.org/dc/terms/contributor'],
    county: source.verbatim.core['http://rs.tdwg.org/dwc/terms/county'],
    coverage: source.verbatim.core['http://purl.org/dc/terms/coverage'],
    creator: source.verbatim.core['http://purl.org/dc/terms/creator'],
    dataGeneralizations: source.verbatim.core['http://rs.tdwg.org/dwc/terms/dataGeneralizations'],
    date: source.verbatim.core['http://purl.org/dc/terms/date'],
    dateAccepted: source.verbatim.core['http://purl.org/dc/terms/dateAccepted'],
    dateCopyrighted: source.verbatim.core['http://purl.org/dc/terms/dateCopyrighted'],
    dateSubmitted: source.verbatim.core['http://purl.org/dc/terms/dateSubmitted'],
    description: source.verbatim.core['http://purl.org/dc/terms/description'],
    disposition: source.verbatim.core['http://rs.tdwg.org/dwc/terms/disposition'],
    dynamicProperties: source.verbatim.core['http://rs.tdwg.org/dwc/terms/dynamicProperties'],
    earliestAgeOrLowestStage:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/earliestAgeOrLowestStage'],
    earliestEonOrLowestEonothem:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/earliestEonOrLowestEonothem'],
    earliestEpochOrLowestSeries:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/earliestEpochOrLowestSeries'],
    earliestEraOrLowestErathem:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/earliestEraOrLowestErathem'],
    earliestPeriodOrLowestSystem:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/earliestPeriodOrLowestSystem'],
    educationLevel: source.verbatim.core['http://purl.org/dc/terms/educationLevel'],
    endDayOfYear: source.verbatim.core['http://rs.tdwg.org/dwc/terms/endDayOfYear'],
    eventID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/eventID'],
    eventRemarks: source.verbatim.core['http://rs.tdwg.org/dwc/terms/eventRemarks'],
    eventTime: source.verbatim.core['http://rs.tdwg.org/dwc/terms/eventTime'],
    extent: source.verbatim.core['http://purl.org/dc/terms/extent'],
    // family:                             source.verbatim.core['http://rs.tdwg.org/dwc/terms/family'],
    fieldNotes: source.verbatim.core['http://rs.tdwg.org/dwc/terms/fieldNotes'],
    fieldNumber: source.verbatim.core['http://rs.tdwg.org/dwc/terms/fieldNumber'],
    footprintSRS: source.verbatim.core['http://rs.tdwg.org/dwc/terms/footprintSRS'],
    footprintSpatialFit: source.verbatim.core['http://rs.tdwg.org/dwc/terms/footprintSpatialFit'],
    footprintWKT: source.verbatim.core['http://rs.tdwg.org/dwc/terms/footprintWKT'],
    format: source.verbatim.core['http://purl.org/dc/terms/format'],
    formation: source.verbatim.core['http://rs.tdwg.org/dwc/terms/formation'],
    // genus:                              source.verbatim.core['http://rs.tdwg.org/dwc/terms/genus'],
    geodeticDatum: source.verbatim.core['http://rs.tdwg.org/dwc/terms/geodeticDatum'] || 'WGS84',
    geologicalContextID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/geologicalContextID'],
    georeferenceProtocol: source.verbatim.core['http://rs.tdwg.org/dwc/terms/georeferenceProtocol'],
    georeferenceRemarks: source.verbatim.core['http://rs.tdwg.org/dwc/terms/georeferenceRemarks'],
    georeferenceSources: source.verbatim.core['http://rs.tdwg.org/dwc/terms/georeferenceSources'],
    georeferenceVerificationStatus:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/georeferenceVerificationStatus'],
    georeferencedBy: source.verbatim.core['http://rs.tdwg.org/dwc/terms/georeferencedBy'],
    georeferencedDate: source.verbatim.core['http://rs.tdwg.org/dwc/terms/georeferencedDate'],
    group: source.verbatim.core['http://rs.tdwg.org/dwc/terms/group'],
    habitat: source.verbatim.core['http://rs.tdwg.org/dwc/terms/habitat'],
    hasFormat: source.verbatim.core['http://purl.org/dc/terms/hasFormat'],
    hasPart: source.verbatim.core['http://purl.org/dc/terms/hasPart'],
    hasVersion: source.verbatim.core['http://purl.org/dc/terms/hasVersion'],
    higherClassification: source.verbatim.core['http://rs.tdwg.org/dwc/terms/higherClassification'],
    higherGeographyID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/higherGeographyID'],
    highestBiostratigraphicZone:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/highestBiostratigraphicZone'],
    identificationID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/identificationID'],
    identificationQualifier:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/identificationQualifier'],
    identificationReferences:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/identificationReferences'],
    identificationRemarks:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/identificationRemarks'],
    identificationVerificationStatus:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/identificationVerificationStatus'],
    identifier: source.verbatim.core['http://purl.org/dc/terms/identifier'], // for some reason this property isn't in the ES response as of 3 november 2020 - add it further down
    informationWithheld: source.verbatim.core['http://rs.tdwg.org/dwc/terms/informationWithheld'],
    infraspecificEpithet: source.verbatim.core['http://rs.tdwg.org/dwc/terms/infraspecificEpithet'],
    institutionID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/institutionID'],
    instructionalMethod: source.verbatim.core['http://purl.org/dc/terms/instructionalMethod'],
    isFormatOf: source.verbatim.core['http://purl.org/dc/terms/isFormatOf'],
    isPartOf: source.verbatim.core['http://purl.org/dc/terms/isPartOf'],
    isReferencedBy: source.verbatim.core['http://purl.org/dc/terms/isReferencedBy'],
    isReplacedBy: source.verbatim.core['http://purl.org/dc/terms/isReplacedBy'],
    isRequiredBy: source.verbatim.core['http://purl.org/dc/terms/isRequiredBy'],
    isVersionOf: source.verbatim.core['http://purl.org/dc/terms/isVersionOf'],
    island: source.verbatim.core['http://rs.tdwg.org/dwc/terms/island'],
    islandGroup: source.verbatim.core['http://rs.tdwg.org/dwc/terms/islandGroup'],
    issued: source.verbatim.core['http://purl.org/dc/terms/issued'],
    // kingdom:                            source.verbatim.core['http://rs.tdwg.org/dwc/terms/kingdom'],
    language: source.verbatim.core['http://purl.org/dc/terms/language'],
    latestAgeOrHighestStage:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/latestAgeOrHighestStage'],
    latestEonOrHighestEonothem:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/latestEonOrHighestEonothem'],
    latestEpochOrHighestSeries:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/latestEpochOrHighestSeries'],
    latestEraOrHighestErathem:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/latestEraOrHighestErathem'],
    latestPeriodOrHighestSystem:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/latestPeriodOrHighestSystem'],
    lithostratigraphicTerms:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/lithostratigraphicTerms'],
    locationAccordingTo: source.verbatim.core['http://rs.tdwg.org/dwc/terms/locationAccordingTo'],
    locationID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/locationID'],
    locationRemarks: source.verbatim.core['http://rs.tdwg.org/dwc/terms/locationRemarks'],
    lowestBiostratigraphicZone:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/lowestBiostratigraphicZone'],
    materialSampleID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/materialSampleID'],
    mediator: source.verbatim.core['http://purl.org/dc/terms/mediator'],
    medium: source.verbatim.core['http://purl.org/dc/terms/medium'],
    member: source.verbatim.core['http://rs.tdwg.org/dwc/terms/member'],
    municipality: source.verbatim.core['http://rs.tdwg.org/dwc/terms/municipality'],
    nameAccordingTo: source.verbatim.core['http://rs.tdwg.org/dwc/terms/nameAccordingTo'],
    nameAccordingToID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/nameAccordingToID'],
    namePublishedIn: source.verbatim.core['http://rs.tdwg.org/dwc/terms/namePublishedIn'],
    namePublishedInID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/namePublishedInID'],
    namePublishedInYear: source.verbatim.core['http://rs.tdwg.org/dwc/terms/namePublishedInYear'],
    nomenclaturalCode: source.verbatim.core['http://rs.tdwg.org/dwc/terms/nomenclaturalCode'],
    nomenclaturalStatus: source.verbatim.core['http://rs.tdwg.org/dwc/terms/nomenclaturalStatus'],
    occurrenceID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/occurrenceID'],
    occurrenceRemarks: source.verbatim.core['http://rs.tdwg.org/dwc/terms/occurrenceRemarks'],
    // order:                              source.verbatim.core['http://rs.tdwg.org/dwc/terms/order'],
    organismID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/organismID'],
    organismName: source.verbatim.core['http://rs.tdwg.org/dwc/terms/organismName'],
    organismQuantity: source.verbatim.core['http://rs.tdwg.org/dwc/terms/organismQuantity'],
    organismQuantityType: source.verbatim.core['http://rs.tdwg.org/dwc/terms/organismQuantityType'],
    organismRemarks: source.verbatim.core['http://rs.tdwg.org/dwc/terms/organismRemarks'],
    organismScope: source.verbatim.core['http://rs.tdwg.org/dwc/terms/organismScope'],
    originalNameUsage: source.verbatim.core['http://rs.tdwg.org/dwc/terms/originalNameUsage'],
    originalNameUsageID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/originalNameUsageID'],
    ownerInstitutionCode: source.verbatim.core['http://rs.tdwg.org/dwc/terms/ownerInstitutionCode'],
    parentEventID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/parentEventID'],
    parentNameUsage: source.verbatim.core['http://rs.tdwg.org/dwc/terms/parentNameUsage'],
    parentNameUsageID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/parentNameUsageID'],
    // phylum:                             source.verbatim.core['http://rs.tdwg.org/dwc/terms/phylum'],
    pointRadiusSpatialFit:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/pointRadiusSpatialFit'],
    previousIdentifications:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/previousIdentifications'],
    provenance: source.verbatim.core['http://purl.org/dc/terms/provenance'],
    publisher: source.verbatim.core['http://purl.org/dc/terms/publisher'],
    relation: source.verbatim.core['http://purl.org/dc/terms/relation'],
    replaces: source.verbatim.core['http://purl.org/dc/terms/replaces'],
    reproductiveCondition:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/reproductiveCondition'],
    requires: source.verbatim.core['http://purl.org/dc/terms/requires'],
    rights: source.verbatim.core['http://purl.org/dc/terms/rights'],
    rightsHolder: source.verbatim.core['http://purl.org/dc/terms/rightsHolder'],
    samplingEffort: source.verbatim.core['http://rs.tdwg.org/dwc/terms/samplingEffort'],
    scientificNameAuthorship:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/scientificNameAuthorship'],
    scientificNameID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/scientificNameID'],
    source: source.verbatim.core['http://purl.org/dc/terms/source'],
    spatial: source.verbatim.core['http://purl.org/dc/terms/spatial'],
    // specificEpithet:                    source.verbatim.core['http://rs.tdwg.org/dwc/terms/specificEpithet'],
    startDayOfYear: source.verbatim.core['http://rs.tdwg.org/dwc/terms/startDayOfYear'],
    // subgenus:                           source.verbatim.core['http://rs.tdwg.org/dwc/terms/subgenus'],
    subject: source.verbatim.core['http://purl.org/dc/terms/subject'],
    tableOfContents: source.verbatim.core['http://purl.org/dc/terms/tableOfContents'],
    taxonConceptID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/taxonConceptID'],
    taxonID: source.verbatim.core['http://rs.tdwg.org/dwc/terms/taxonID'],
    // taxonRank:                          source.verbatim.core['http://rs.tdwg.org/dwc/terms/taxonRank'],
    taxonRemarks: source.verbatim.core['http://rs.tdwg.org/dwc/terms/taxonRemarks'],
    // taxonomicStatus:                    source.verbatim.core['http://rs.tdwg.org/dwc/terms/taxonomicStatus'],
    temporal: source.verbatim.core['http://purl.org/dc/terms/temporal'],
    title: source.verbatim.core['http://purl.org/dc/terms/title'],
    type: source.verbatim.core['http://purl.org/dc/terms/type'],
    valid: source.verbatim.core['http://purl.org/dc/terms/valid'],
    verbatimCoordinateSystem:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/verbatimCoordinateSystem'],
    verbatimCoordinates: source.verbatim.core['http://rs.tdwg.org/dwc/terms/verbatimCoordinates'],
    verbatimDepth: source.verbatim.core['http://rs.tdwg.org/dwc/terms/verbatimDepth'],
    verbatimElevation: source.verbatim.core['http://rs.tdwg.org/dwc/terms/verbatimElevation'],
    verbatimEventDate: source.verbatim.core['http://rs.tdwg.org/dwc/terms/verbatimEventDate'],
    verbatimIdentification:
      source.verbatim.core['http://rs.tdwg.org/dwc/terms/verbatimIdentification'],
    verbatimLatitude: source.verbatim.core['http://rs.tdwg.org/dwc/terms/verbatimLatitude'],
    verbatimLocality: source.verbatim.core['http://rs.tdwg.org/dwc/terms/verbatimLocality'],
    verbatimLongitude: source.verbatim.core['http://rs.tdwg.org/dwc/terms/verbatimLongitude'],
    verbatimSRS: source.verbatim.core['http://rs.tdwg.org/dwc/terms/verbatimSRS'],
    verbatimTaxonRank: source.verbatim.core['http://rs.tdwg.org/dwc/terms/verbatimTaxonRank'],
    vernacularName: source.verbatim.core['http://rs.tdwg.org/dwc/terms/vernacularName'],
    verticalDatum: source.verbatim.core['http://rs.tdwg.org/dwc/terms/verticalDatum'],
  });

  const normalized = {
    basisOfRecord: source.basisOfRecord,
    catalogNumber: source.catalogNumber,
    isInCluster: source.isClustered,
    isSequenced: source.isSequenced,
    collectionCode: source.collectionCode,
    continent: source.continent,
    coordinatePrecision: source.coordinatePrecision,
    coordinateUncertaintyInMeters: source.coordinateUncertaintyInMeters,
    country: source.country,
    countryCode: source.countryCode,
    created: source.created,
    datasetKey: source.datasetKey,
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
    eventDate:
      source.eventDateInterval ??
      (source.eventDateSingle ? source.eventDateSingle.substring(0, 10) : undefined),
    identifiedBy: source.identifiedBy,
    individualCount: source.individualCount,
    institutionCode: source.institutionCode,
    license: source.license,
    lifeStage: vocabularFallback(source.lifeStage),
    pathway: vocabularFallback(source.pathway),
    degreeOfEstablishment: vocabularFallback(source.degreeOfEstablishment),
    locality: source.locality,
    higherGeography: source.higherGeography,
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
    sex: source.sex?.concept,
    // startDayOfYear:                     source.startDayOfYear,
    stateProvince: source.stateProvince,
    typeStatus: vocabularyConcepts(source.typeStatus),
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
    key: source.gbifId,
    gbifID: source.gbifId,
    acceptedScientificName: source.gbifClassification?.acceptedUsage?.name,
    acceptedTaxonKey: source.gbifClassification?.acceptedUsage?.key,
    scientificName: source.gbifClassification?.usage?.name,
    class: source.gbifClassification?.class,
    classKey: source.gbifClassification?.classKey,
    collectionKey: source.collectionKey,
    crawlId: source.crawlId,
    datasetKey: source.datasetKey,
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
    hostingOrganizationKey: source.hostingOrganizationKey,
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
    extensions: source.verbatim.extensions,
    gbifClassification: source.gbifClassification,
    iucnRedListCategory: source.gbifClassification.iucnRedListCategoryCode,

    // not in v1
    datasetTitle: source.datasetTitle,
    publisherTitle: source.publisherTitle,
    parsedEventDate: source.eventDate,
  };

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
