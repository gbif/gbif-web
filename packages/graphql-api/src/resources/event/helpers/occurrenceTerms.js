const _ = require('lodash');

const terms = [
  {
    "simpleName": "abstract",
    "qualifiedName": "http://purl.org/dc/terms/abstract",
    "source": "DcTerm"
  },
  {
    "simpleName": "accessRights",
    "qualifiedName": "http://purl.org/dc/terms/accessRights",
    "source": "DcTerm"
  },
  {
    "simpleName": "accrualMethod",
    "qualifiedName": "http://purl.org/dc/terms/accrualMethod",
    "source": "DcTerm"
  },
  {
    "simpleName": "accrualPeriodicity",
    "qualifiedName": "http://purl.org/dc/terms/accrualPeriodicity",
    "source": "DcTerm"
  },
  {
    "simpleName": "accrualPolicy",
    "qualifiedName": "http://purl.org/dc/terms/accrualPolicy",
    "source": "DcTerm"
  },
  {
    "simpleName": "alternative",
    "qualifiedName": "http://purl.org/dc/terms/alternative",
    "source": "DcTerm"
  },
  {
    "simpleName": "audience",
    "qualifiedName": "http://purl.org/dc/terms/audience",
    "source": "DcTerm"
  },
  {
    "simpleName": "available",
    "qualifiedName": "http://purl.org/dc/terms/available",
    "source": "DcTerm"
  },
  {
    "simpleName": "bibliographicCitation",
    "qualifiedName": "http://purl.org/dc/terms/bibliographicCitation",
    "source": "DcTerm"
  },
  {
    "simpleName": "conformsTo",
    "qualifiedName": "http://purl.org/dc/terms/conformsTo",
    "source": "DcTerm"
  },
  {
    "simpleName": "contributor",
    "qualifiedName": "http://purl.org/dc/terms/contributor",
    "source": "DcTerm"
  },
  {
    "simpleName": "coverage",
    "qualifiedName": "http://purl.org/dc/terms/coverage",
    "source": "DcTerm"
  },
  {
    "simpleName": "creator",
    "qualifiedName": "http://purl.org/dc/terms/creator",
    "source": "DcTerm"
  },
  {
    "simpleName": "date",
    "qualifiedName": "http://purl.org/dc/terms/date",
    "source": "DcTerm"
  },
  {
    "simpleName": "dateAccepted",
    "qualifiedName": "http://purl.org/dc/terms/dateAccepted",
    "source": "DcTerm"
  },
  {
    "simpleName": "dateCopyrighted",
    "qualifiedName": "http://purl.org/dc/terms/dateCopyrighted",
    "source": "DcTerm"
  },
  {
    "simpleName": "dateSubmitted",
    "qualifiedName": "http://purl.org/dc/terms/dateSubmitted",
    "source": "DcTerm"
  },
  {
    "simpleName": "description",
    "qualifiedName": "http://purl.org/dc/terms/description",
    "source": "DcTerm"
  },
  {
    "simpleName": "educationLevel",
    "qualifiedName": "http://purl.org/dc/terms/educationLevel",
    "source": "DcTerm"
  },
  {
    "simpleName": "extent",
    "qualifiedName": "http://purl.org/dc/terms/extent",
    "source": "DcTerm"
  },
  {
    "simpleName": "format",
    "qualifiedName": "http://purl.org/dc/terms/format",
    "source": "DcTerm"
  },
  {
    "simpleName": "hasFormat",
    "qualifiedName": "http://purl.org/dc/terms/hasFormat",
    "source": "DcTerm"
  },
  {
    "simpleName": "hasPart",
    "qualifiedName": "http://purl.org/dc/terms/hasPart",
    "source": "DcTerm"
  },
  {
    "simpleName": "hasVersion",
    "qualifiedName": "http://purl.org/dc/terms/hasVersion",
    "source": "DcTerm"
  },
  {
    "simpleName": "identifier",
    "qualifiedName": "http://purl.org/dc/terms/identifier",
    "source": "DcTerm"
  },
  {
    "simpleName": "instructionalMethod",
    "qualifiedName": "http://purl.org/dc/terms/instructionalMethod",
    "source": "DcTerm"
  },
  {
    "simpleName": "isFormatOf",
    "qualifiedName": "http://purl.org/dc/terms/isFormatOf",
    "source": "DcTerm"
  },
  {
    "simpleName": "isPartOf",
    "qualifiedName": "http://purl.org/dc/terms/isPartOf",
    "source": "DcTerm"
  },
  {
    "simpleName": "isReferencedBy",
    "qualifiedName": "http://purl.org/dc/terms/isReferencedBy",
    "source": "DcTerm"
  },
  {
    "simpleName": "isReplacedBy",
    "qualifiedName": "http://purl.org/dc/terms/isReplacedBy",
    "source": "DcTerm"
  },
  {
    "simpleName": "isRequiredBy",
    "qualifiedName": "http://purl.org/dc/terms/isRequiredBy",
    "source": "DcTerm"
  },
  {
    "simpleName": "isVersionOf",
    "qualifiedName": "http://purl.org/dc/terms/isVersionOf",
    "source": "DcTerm"
  },
  {
    "simpleName": "issued",
    "qualifiedName": "http://purl.org/dc/terms/issued",
    "source": "DcTerm"
  },
  {
    "simpleName": "language",
    "qualifiedName": "http://purl.org/dc/terms/language",
    "source": "DcTerm"
  },
  {
    "simpleName": "mediator",
    "qualifiedName": "http://purl.org/dc/terms/mediator",
    "source": "DcTerm"
  },
  {
    "simpleName": "medium",
    "qualifiedName": "http://purl.org/dc/terms/medium",
    "source": "DcTerm"
  },
  {
    "simpleName": "provenance",
    "qualifiedName": "http://purl.org/dc/terms/provenance",
    "source": "DcTerm"
  },
  {
    "simpleName": "publisher",
    "qualifiedName": "http://purl.org/dc/terms/publisher",
    "source": "DcTerm"
  },
  {
    "simpleName": "relation",
    "qualifiedName": "http://purl.org/dc/terms/relation",
    "source": "DcTerm"
  },
  {
    "simpleName": "replaces",
    "qualifiedName": "http://purl.org/dc/terms/replaces",
    "source": "DcTerm"
  },
  {
    "simpleName": "requires",
    "qualifiedName": "http://purl.org/dc/terms/requires",
    "source": "DcTerm"
  },
  {
    "simpleName": "rights",
    "qualifiedName": "http://purl.org/dc/terms/rights",
    "source": "DcTerm"
  },
  {
    "simpleName": "rightsHolder",
    "qualifiedName": "http://purl.org/dc/terms/rightsHolder",
    "source": "DcTerm"
  },
  {
    "simpleName": "source",
    "qualifiedName": "http://purl.org/dc/terms/source",
    "source": "DcTerm"
  },
  {
    "simpleName": "spatial",
    "qualifiedName": "http://purl.org/dc/terms/spatial",
    "source": "DcTerm"
  },
  {
    "simpleName": "subject",
    "qualifiedName": "http://purl.org/dc/terms/subject",
    "source": "DcTerm"
  },
  {
    "simpleName": "tableOfContents",
    "qualifiedName": "http://purl.org/dc/terms/tableOfContents",
    "source": "DcTerm"
  },
  {
    "simpleName": "temporal",
    "qualifiedName": "http://purl.org/dc/terms/temporal",
    "source": "DcTerm"
  },
  {
    "simpleName": "title",
    "qualifiedName": "http://purl.org/dc/terms/title",
    "source": "DcTerm"
  },
  {
    "simpleName": "type",
    "qualifiedName": "http://purl.org/dc/terms/type",
    "source": "DcTerm"
  },
  {
    "simpleName": "valid",
    "qualifiedName": "http://purl.org/dc/terms/valid",
    "source": "DcTerm"
  },
  {
    "simpleName": "institutionID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/institutionID",
    "group": "Record",
    "source": "DwcTerm"
  },
  {
    "simpleName": "collectionID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/collectionID",
    "group": "Record",
    "source": "DwcTerm"
  },
  {
    "simpleName": "datasetID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/datasetID",
    "group": "Record",
    "source": "DwcTerm"
  },
  {
    "simpleName": "datasetName",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/datasetName",
    "group": "Record",
    "source": "DwcTerm"
  },
  {
    "simpleName": "ownerInstitutionCode",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/ownerInstitutionCode",
    "group": "Record",
    "source": "DwcTerm"
  },
  {
    "simpleName": "informationWithheld",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/informationWithheld",
    "group": "Record",
    "source": "DwcTerm"
  },
  {
    "simpleName": "dataGeneralizations",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/dataGeneralizations",
    "group": "Record",
    "source": "DwcTerm"
  },
  {
    "simpleName": "dynamicProperties",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/dynamicProperties",
    "group": "Record",
    "source": "DwcTerm"
  },
  {
    "simpleName": "occurrenceID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/occurrenceID",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "reproductiveCondition",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/reproductiveCondition",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "behavior",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/behavior",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "occurrenceStatus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/occurrenceStatus",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "preparations",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/preparations",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "disposition",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/disposition",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "associatedReferences",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedReferences",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "associatedSequences",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedSequences",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "associatedTaxa",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedTaxa",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "otherCatalogNumbers",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/otherCatalogNumbers",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "occurrenceRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/occurrenceRemarks",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "organismID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/organismID",
    "group": "Organism",
    "source": "DwcTerm"
  },
  {
    "simpleName": "organismName",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/organismName",
    "group": "Organism",
    "source": "DwcTerm"
  },
  {
    "simpleName": "organismScope",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/organismScope",
    "group": "Organism",
    "source": "DwcTerm"
  },
  {
    "simpleName": "associatedOccurrences",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedOccurrences",
    "group": "Organism",
    "source": "DwcTerm"
  },
  {
    "simpleName": "associatedOrganisms",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedOrganisms",
    "group": "Organism",
    "source": "DwcTerm"
  },
  {
    "simpleName": "previousIdentifications",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/previousIdentifications",
    "group": "Organism",
    "source": "DwcTerm"
  },
  {
    "simpleName": "organismRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/organismRemarks",
    "group": "Organism",
    "source": "DwcTerm"
  },
  {
    "simpleName": "materialSampleID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/materialSampleID",
    "group": "MaterialSample",
    "source": "DwcTerm"
  },
  {
    "simpleName": "eventID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/eventID",
    "group": "Event",
    "source": "DwcTerm"
  },
  {
    "simpleName": "parentEventID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/parentEventID",
    "group": "Event",
    "source": "DwcTerm"
  },
  {
    "simpleName": "fieldNumber",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/fieldNumber",
    "group": "Event",
    "source": "DwcTerm"
  },
  {
    "simpleName": "eventDate",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/eventDate",
    "group": "Event",
    "source": "DwcTerm"
  },
  {
    "simpleName": "eventTime",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/eventTime",
    "group": "Event",
    "source": "DwcTerm"
  },
  {
    "simpleName": "verbatimEventDate",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimEventDate",
    "group": "Event",
    "source": "DwcTerm"
  },
  {
    "simpleName": "habitat",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/habitat",
    "group": "Event",
    "source": "DwcTerm"
  },
  {
    "simpleName": "samplingEffort",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/samplingEffort",
    "group": "Event",
    "source": "DwcTerm"
  },
  {
    "simpleName": "fieldNotes",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/fieldNotes",
    "group": "Event",
    "source": "DwcTerm"
  },
  {
    "simpleName": "eventRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/eventRemarks",
    "group": "Event",
    "source": "DwcTerm"
  },
  {
    "simpleName": "locationID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/locationID",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "higherGeographyID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/higherGeographyID",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "higherGeography",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/higherGeography",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "islandGroup",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/islandGroup",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "island",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/island",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "county",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/county",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "municipality",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/municipality",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "verbatimLocality",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimLocality",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "verbatimElevation",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimElevation",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "verbatimDepth",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimDepth",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "locationAccordingTo",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/locationAccordingTo",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "locationRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/locationRemarks",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "pointRadiusSpatialFit",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/pointRadiusSpatialFit",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "verbatimCoordinateSystem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimCoordinateSystem",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "verbatimSRS",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimSRS",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "footprintWKT",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/footprintWKT",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "footprintSRS",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/footprintSRS",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "footprintSpatialFit",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/footprintSpatialFit",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "georeferencedBy",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferencedBy",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "georeferencedDate",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferencedDate",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "georeferenceProtocol",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferenceProtocol",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "georeferenceSources",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferenceSources",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "georeferenceVerificationStatus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferenceVerificationStatus",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "georeferenceRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/georeferenceRemarks",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "geologicalContextID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/geologicalContextID",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "earliestEonOrLowestEonothem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/earliestEonOrLowestEonothem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "latestEonOrHighestEonothem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/latestEonOrHighestEonothem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "earliestEraOrLowestErathem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/earliestEraOrLowestErathem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "latestEraOrHighestErathem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/latestEraOrHighestErathem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "earliestPeriodOrLowestSystem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/earliestPeriodOrLowestSystem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "latestPeriodOrHighestSystem",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/latestPeriodOrHighestSystem",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "earliestEpochOrLowestSeries",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/earliestEpochOrLowestSeries",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "latestEpochOrHighestSeries",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/latestEpochOrHighestSeries",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "earliestAgeOrLowestStage",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/earliestAgeOrLowestStage",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "latestAgeOrHighestStage",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/latestAgeOrHighestStage",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "lowestBiostratigraphicZone",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/lowestBiostratigraphicZone",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "highestBiostratigraphicZone",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/highestBiostratigraphicZone",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "lithostratigraphicTerms",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/lithostratigraphicTerms",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "group",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/group",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "formation",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/formation",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "member",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/member",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "bed",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/bed",
    "group": "GeologicalContext",
    "source": "DwcTerm"
  },
  {
    "simpleName": "identificationID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identificationID",
    "group": "Identification",
    "source": "DwcTerm"
  },
  {
    "simpleName": "identificationQualifier",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identificationQualifier",
    "group": "Identification",
    "source": "DwcTerm"
  },
  {
    "simpleName": "identifiedBy",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identifiedBy",
    "group": "Identification",
    "source": "DwcTerm"
  },
  {
    "simpleName": "identificationReferences",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identificationReferences",
    "group": "Identification",
    "source": "DwcTerm"
  },
  {
    "simpleName": "identificationVerificationStatus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identificationVerificationStatus",
    "group": "Identification",
    "source": "DwcTerm"
  },
  {
    "simpleName": "identificationRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/identificationRemarks",
    "group": "Identification",
    "source": "DwcTerm"
  },
  {
    "simpleName": "taxonID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/taxonID",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "scientificNameID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/scientificNameID",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "acceptedNameUsageID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/acceptedNameUsageID",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "parentNameUsageID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/parentNameUsageID",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "originalNameUsageID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/originalNameUsageID",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "nameAccordingToID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/nameAccordingToID",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "namePublishedInID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/namePublishedInID",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "taxonConceptID",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/taxonConceptID",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "scientificName",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/scientificName",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "acceptedNameUsage",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/acceptedNameUsage",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "parentNameUsage",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/parentNameUsage",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "originalNameUsage",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/originalNameUsage",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "nameAccordingTo",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/nameAccordingTo",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "namePublishedIn",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/namePublishedIn",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "namePublishedInYear",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/namePublishedInYear",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "higherClassification",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/higherClassification",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "kingdom",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/kingdom",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "phylum",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/phylum",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "class",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/class",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "order",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/order",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "family",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/family",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "genus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/genus",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "subgenus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/subgenus",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "specificEpithet",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/specificEpithet",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "infraspecificEpithet",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/infraspecificEpithet",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "taxonRank",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/taxonRank",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "verbatimTaxonRank",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimTaxonRank",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "vernacularName",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/vernacularName",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "nomenclaturalCode",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/nomenclaturalCode",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "taxonomicStatus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/taxonomicStatus",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "nomenclaturalStatus",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/nomenclaturalStatus",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "taxonRemarks",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/taxonRemarks",
    "group": "Taxon",
    "source": "DwcTerm"
  },
  {
    "simpleName": "associatedMedia",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/associatedMedia",
    "group": "Occurrence",
    "source": "DwcTerm"
  },
  {
    "simpleName": "geodeticDatum",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/geodeticDatum",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "verbatimCoordinates",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimCoordinates",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "verbatimLatitude",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "verbatimLongitude",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
    "group": "Location",
    "source": "DwcTerm"
  },
  {
    "simpleName": "scientificNameAuthorship",
    "qualifiedName": "http://rs.tdwg.org/dwc/terms/scientificNameAuthorship",
    "group": "Taxon",
    "source": "DwcTerm"
  }
];

module.exports = terms.reduce((acc, cur) => {
  acc[cur.simpleName] = ({ verbatim }) => {
    return _.get(verbatim, `core["${cur.qualifiedName}"]`);}
  return acc;
}, {});

// console.log(JSON.stringify(terms.map(x => x.simpleName), null, 2));