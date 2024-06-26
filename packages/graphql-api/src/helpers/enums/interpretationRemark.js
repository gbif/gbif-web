/* module.exports = [
  {
    "id": "ZERO_COORDINATE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "COORDINATE_OUT_OF_RANGE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "COORDINATE_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "COORDINATE_ROUNDED",
    "severity": "INFO",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "GEODETIC_DATUM_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/geodeticDatum"
    ]
  },
  {
    "id": "GEODETIC_DATUM_ASSUMED_WGS84",
    "severity": "INFO",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/geodeticDatum"
    ]
  },
  {
    "id": "COORDINATE_REPROJECTED",
    "severity": "INFO",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/geodeticDatum",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "COORDINATE_REPROJECTION_FAILED",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/geodeticDatum",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "COORDINATE_REPROJECTION_SUSPICIOUS",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/geodeticDatum",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "COORDINATE_PRECISION_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/coordinatePrecision"
    ]
  },
  {
    "id": "COORDINATE_UNCERTAINTY_METERS_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/coordinateUncertaintyInMeters"
    ]
  },
  {
    "id": "COUNTRY_COORDINATE_MISMATCH",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/country",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/countryCode",
      "http://rs.tdwg.org/dwc/terms/geodeticDatum",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "COUNTRY_MISMATCH",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/country",
      "http://rs.tdwg.org/dwc/terms/countryCode"
    ]
  },
  {
    "id": "COUNTRY_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/country",
      "http://rs.tdwg.org/dwc/terms/countryCode"
    ]
  },
  {
    "id": "COUNTRY_DERIVED_FROM_COORDINATES",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/country",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/countryCode",
      "http://rs.tdwg.org/dwc/terms/geodeticDatum",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "CONTINENT_COUNTRY_MISMATCH",
    "severity": "WARNING",
    "relatedTerms": []
  },
  {
    "id": "CONTINENT_INVALID",
    "severity": "WARNING",
    "relatedTerms": []
  },
  {
    "id": "CONTINENT_DERIVED_FROM_COORDINATES",
    "severity": "WARNING",
    "relatedTerms": []
  },
  {
    "id": "PRESUMED_SWAPPED_COORDINATE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "PRESUMED_NEGATED_LONGITUDE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "PRESUMED_NEGATED_LATITUDE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/verbatimLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLongitude",
      "http://rs.tdwg.org/dwc/terms/decimalLatitude",
      "http://rs.tdwg.org/dwc/terms/verbatimCoordinates"
    ]
  },
  {
    "id": "RECORDED_DATE_MISMATCH",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/day",
      "http://rs.tdwg.org/dwc/terms/eventDate",
      "http://rs.tdwg.org/dwc/terms/month",
      "http://rs.tdwg.org/dwc/terms/year"
    ]
  },
  {
    "id": "RECORDED_DATE_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/day",
      "http://rs.tdwg.org/dwc/terms/eventDate",
      "http://rs.tdwg.org/dwc/terms/month",
      "http://rs.tdwg.org/dwc/terms/year"
    ]
  },
  {
    "id": "RECORDED_DATE_UNLIKELY",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/day",
      "http://rs.tdwg.org/dwc/terms/eventDate",
      "http://rs.tdwg.org/dwc/terms/month",
      "http://rs.tdwg.org/dwc/terms/year"
    ]
  },
  {
    "id": "TAXON_MATCH_FUZZY",
    "severity": "WARNING",
    "relatedTerms": [
      // "http://rs.tdwg.org/dwc/terms/scientificNameAuthorship",
      // "http://rs.tdwg.org/dwc/terms/kingdom",
      // "http://rs.tdwg.org/dwc/terms/genus",
      // "http://rs.tdwg.org/dwc/terms/class",
      // "http://rs.tdwg.org/dwc/terms/infraspecificEpithet",
      // "http://rs.tdwg.org/dwc/terms/family",
      // "http://rs.gbif.org/terms/1.0/genericName",
      // "http://rs.tdwg.org/dwc/terms/order",
      // "http://rs.tdwg.org/dwc/terms/specificEpithet",
      "http://rs.tdwg.org/dwc/terms/scientificName",
      // "http://rs.tdwg.org/dwc/terms/phylum"
    ]
  },
  {
    "id": "TAXON_MATCH_HIGHERRANK",
    "severity": "WARNING",
    "relatedTerms": [
      // "http://rs.tdwg.org/dwc/terms/scientificNameAuthorship",
      // "http://rs.tdwg.org/dwc/terms/kingdom",
      // "http://rs.tdwg.org/dwc/terms/genus",
      // "http://rs.tdwg.org/dwc/terms/class",
      // "http://rs.tdwg.org/dwc/terms/infraspecificEpithet",
      // "http://rs.tdwg.org/dwc/terms/family",
      // "http://rs.gbif.org/terms/1.0/genericName",
      // "http://rs.tdwg.org/dwc/terms/order",
      // "http://rs.tdwg.org/dwc/terms/specificEpithet",
      "http://rs.tdwg.org/dwc/terms/scientificName",
      // "http://rs.tdwg.org/dwc/terms/phylum"
    ]
  },
  {
    "id": "TAXON_MATCH_NONE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/scientificNameAuthorship",
      "http://rs.tdwg.org/dwc/terms/kingdom",
      "http://rs.tdwg.org/dwc/terms/genus",
      "http://rs.tdwg.org/dwc/terms/class",
      "http://rs.tdwg.org/dwc/terms/infraspecificEpithet",
      "http://rs.tdwg.org/dwc/terms/family",
      "http://rs.gbif.org/terms/1.0/genericName",
      "http://rs.tdwg.org/dwc/terms/order",
      "http://rs.tdwg.org/dwc/terms/specificEpithet",
      "http://rs.tdwg.org/dwc/terms/scientificName",
      "http://rs.tdwg.org/dwc/terms/phylum"
    ]
  },
  {
    "id": "DEPTH_NOT_METRIC",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/minimumDepthInMeters",
      "http://rs.tdwg.org/dwc/terms/maximumDepthInMeters"
    ]
  },
  {
    "id": "DEPTH_UNLIKELY",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/minimumDepthInMeters",
      "http://rs.tdwg.org/dwc/terms/maximumDepthInMeters"
    ]
  },
  {
    "id": "DEPTH_MIN_MAX_SWAPPED",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/minimumDepthInMeters",
      "http://rs.tdwg.org/dwc/terms/maximumDepthInMeters"
    ]
  },
  {
    "id": "DEPTH_NON_NUMERIC",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/minimumDepthInMeters",
      "http://rs.tdwg.org/dwc/terms/maximumDepthInMeters"
    ]
  },
  {
    "id": "ELEVATION_UNLIKELY",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/maximumElevationInMeters",
      "http://rs.tdwg.org/dwc/terms/minimumElevationInMeters"
    ]
  },
  {
    "id": "ELEVATION_MIN_MAX_SWAPPED",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/maximumElevationInMeters",
      "http://rs.tdwg.org/dwc/terms/minimumElevationInMeters"
    ]
  },
  {
    "id": "ELEVATION_NOT_METRIC",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/maximumElevationInMeters",
      "http://rs.tdwg.org/dwc/terms/minimumElevationInMeters"
    ]
  },
  {
    "id": "ELEVATION_NON_NUMERIC",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/maximumElevationInMeters",
      "http://rs.tdwg.org/dwc/terms/minimumElevationInMeters"
    ]
  },
  {
    "id": "MODIFIED_DATE_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://purl.org/dc/terms/modified"
    ]
  },
  {
    "id": "MODIFIED_DATE_UNLIKELY",
    "severity": "WARNING",
    "relatedTerms": [
      "http://purl.org/dc/terms/modified"
    ]
  },
  {
    "id": "IDENTIFIED_DATE_UNLIKELY",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/dateIdentified"
    ]
  },
  {
    "id": "IDENTIFIED_DATE_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/dateIdentified"
    ]
  },
  {
    "id": "BASIS_OF_RECORD_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/basisOfRecord"
    ]
  },
  {
    "id": "TYPE_STATUS_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/typeStatus"
    ]
  },
  {
    "id": "MULTIMEDIA_DATE_INVALID",
    "severity": "WARNING",
    "relatedTerms": []
  },
  {
    "id": "MULTIMEDIA_URI_INVALID",
    "severity": "WARNING",
    "relatedTerms": []
  },
  {
    "id": "REFERENCES_URI_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://purl.org/dc/terms/references"
    ]
  },
  {
    "id": "INTERPRETATION_ERROR",
    "severity": "ERROR",
    "relatedTerms": []
  },
  {
    "id": "INDIVIDUAL_COUNT_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/individualCount"
    ]
  },
  {
    "id": "INDIVIDUAL_COUNT_CONFLICTS_WITH_OCCURRENCE_STATUS",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/individualCount"
    ]
  },
  {
    "id": "OCCURRENCE_STATUS_UNPARSABLE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/occurrenceStatus"
    ]
  },
  {
    "id": "OCCURRENCE_STATUS_INFERRED_FROM_INDIVIDUAL_COUNT",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/occurrenceStatus"
    ]
  },
  {
    "id": "GEOREFERENCED_DATE_UNLIKELY",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/georeferencedDate"
    ]
  },
  {
    "id": "GEOREFERENCED_DATE_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/georeferencedDate"
    ]
  },
  {
    "id": "PARENT_NAME_USAGE_ID_INVALID",
    "severity": "ERROR",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/parentNameUsageID"
    ]
  },
  {
    "id": "ACCEPTED_NAME_USAGE_ID_INVALID",
    "severity": "ERROR",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/acceptedNameUsageID"
    ]
  },
  {
    "id": "ORIGINAL_NAME_USAGE_ID_INVALID",
    "severity": "ERROR",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/originalNameUsageID"
    ]
  },
  {
    "id": "ACCEPTED_NAME_MISSING",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/acceptedNameUsageID",
      "http://rs.tdwg.org/dwc/terms/acceptedNameUsage",
      "http://rs.tdwg.org/dwc/terms/taxonomicStatus"
    ]
  },
  {
    "id": "RANK_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/taxonRank"
    ]
  },
  {
    "id": "NOMENCLATURAL_STATUS_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/nomenclaturalStatus"
    ]
  },
  {
    "id": "TAXONOMIC_STATUS_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/taxonomicStatus"
    ]
  },
  {
    "id": "SCIENTIFIC_NAME_ASSEMBLED",
    "severity": "INFO",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/scientificNameAuthorship",
      "http://rs.tdwg.org/dwc/terms/genus",
      "http://rs.tdwg.org/dwc/terms/namePublishedInYear",
      "http://rs.tdwg.org/dwc/terms/infraspecificEpithet",
      "http://rs.tdwg.org/dwc/terms/taxonRank",
      "http://rs.tdwg.org/dwc/terms/specificEpithet",
      "http://rs.tdwg.org/dwc/terms/scientificName"
    ]
  },
  {
    "id": "CHAINED_SYNOYM",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/acceptedNameUsageID",
      "http://rs.tdwg.org/dwc/terms/acceptedNameUsage"
    ]
  },
  {
    "id": "BASIONYM_AUTHOR_MISMATCH",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/scientificNameAuthorship",
      "http://rs.tdwg.org/dwc/terms/originalNameUsageID",
      "http://rs.tdwg.org/dwc/terms/scientificName",
      "http://rs.tdwg.org/dwc/terms/originalNameUsage"
    ]
  },
  {
    "id": "TAXONOMIC_STATUS_MISMATCH",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/acceptedNameUsageID",
      "http://rs.tdwg.org/dwc/terms/acceptedNameUsage",
      "http://rs.tdwg.org/dwc/terms/taxonomicStatus"
    ]
  },
  {
    "id": "PARENT_CYCLE",
    "severity": "ERROR",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/parentNameUsage",
      "http://rs.tdwg.org/dwc/terms/parentNameUsageID"
    ]
  },
  {
    "id": "CLASSIFICATION_RANK_ORDER_INVALID",
    "severity": "ERROR",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/taxonRank",
      "http://rs.tdwg.org/dwc/terms/parentNameUsage",
      "http://rs.tdwg.org/dwc/terms/parentNameUsageID"
    ]
  },
  {
    "id": "CLASSIFICATION_NOT_APPLIED",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/kingdom",
      "http://rs.tdwg.org/dwc/terms/genus",
      "http://rs.tdwg.org/dwc/terms/class",
      "http://rs.tdwg.org/dwc/terms/family",
      "http://rs.tdwg.org/dwc/terms/order",
      "http://rs.tdwg.org/dwc/terms/phylum"
    ]
  },
  {
    "id": "VERNACULAR_NAME_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/vernacularName"
    ]
  },
  {
    "id": "DESCRIPTION_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.gbif.org/terms/1.0/Description"
    ]
  },
  {
    "id": "DISTRIBUTION_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.gbif.org/terms/1.0/Distribution"
    ]
  },
  {
    "id": "SPECIES_PROFILE_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.gbif.org/terms/1.0/SpeciesProfile"
    ]
  },
  {
    "id": "MULTIMEDIA_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.gbif.org/terms/1.0/Multimedia"
    ]
  },
  {
    "id": "BIB_REFERENCE_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.gbif.org/terms/1.0/Reference"
    ]
  },
  {
    "id": "ALT_IDENTIFIER_INVALID",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.gbif.org/terms/1.0/Identifier"
    ]
  },
  {
    "id": "BACKBONE_MATCH_NONE",
    "severity": "INFO",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/scientificNameAuthorship",
      "http://rs.tdwg.org/dwc/terms/kingdom",
      "http://rs.tdwg.org/dwc/terms/taxonRank",
      "http://rs.tdwg.org/dwc/terms/scientificName"
    ]
  },
  {
    "id": "ACCEPTED_NAME_NOT_UNIQUE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/acceptedNameUsage"
    ]
  },
  {
    "id": "PARENT_NAME_NOT_UNIQUE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/parentNameUsage"
    ]
  },
  {
    "id": "ORIGINAL_NAME_NOT_UNIQUE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/originalNameUsage"
    ]
  },
  {
    "id": "RELATIONSHIP_MISSING",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/acceptedNameUsageID",
      "http://rs.tdwg.org/dwc/terms/acceptedNameUsage",
      "http://rs.tdwg.org/dwc/terms/parentNameUsage",
      "http://rs.tdwg.org/dwc/terms/originalNameUsageID",
      "http://rs.tdwg.org/dwc/terms/parentNameUsageID",
      "http://rs.tdwg.org/dwc/terms/originalNameUsage"
    ]
  },
  {
    "id": "ORIGINAL_NAME_DERIVED",
    "severity": "INFO",
    "relatedTerms": []
  },
  {
    "id": "CONFLICTING_BASIONYM_COMBINATION",
    "severity": "WARNING",
    "relatedTerms": []
  },
  {
    "id": "NO_SPECIES",
    "severity": "INFO",
    "relatedTerms": []
  },
  {
    "id": "NAME_PARENT_MISMATCH",
    "severity": "WARNING",
    "relatedTerms": []
  },
  {
    "id": "ORTHOGRAPHIC_VARIANT",
    "severity": "INFO",
    "relatedTerms": []
  },
  {
    "id": "HOMONYM",
    "severity": "INFO",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/scientificName"
    ]
  },
  {
    "id": "PUBLISHED_BEFORE_GENUS",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/scientificNameAuthorship",
      "http://rs.tdwg.org/dwc/terms/genus",
      "http://rs.tdwg.org/dwc/terms/namePublishedInYear",
      "http://rs.tdwg.org/dwc/terms/parentNameUsage",
      "http://rs.tdwg.org/dwc/terms/parentNameUsageID",
      "http://rs.tdwg.org/dwc/terms/scientificName"
    ]
  },
  {
    "id": "UNPARSABLE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/scientificName"
    ]
  },
  {
    "id": "PARTIALLY_PARSABLE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/scientificName"
    ]
  },
  {
    "id": "AMBIGUOUS_INSTITUTION",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/institutionCode",
      "http://rs.tdwg.org/dwc/terms/ownerInstitutionCode",
      "http://rs.tdwg.org/dwc/terms/institutionID"
    ]
  },
  {
    "id": "AMBIGUOUS_COLLECTION",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/collectionID",
      "http://rs.tdwg.org/dwc/terms/collectionCode"
    ]
  },
  {
    "id": "INSTITUTION_MATCH_NONE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/institutionCode",
      "http://rs.tdwg.org/dwc/terms/ownerInstitutionCode",
      "http://rs.tdwg.org/dwc/terms/institutionID"
    ]
  },
  {
    "id": "COLLECTION_MATCH_NONE",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/collectionID",
      "http://rs.tdwg.org/dwc/terms/collectionCode"
    ]
  },
  {
    "id": "INSTITUTION_MATCH_FUZZY",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/institutionCode",
      "http://rs.tdwg.org/dwc/terms/ownerInstitutionCode",
      "http://rs.tdwg.org/dwc/terms/institutionID"
    ]
  },
  {
    "id": "COLLECTION_MATCH_FUZZY",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/collectionID",
      "http://rs.tdwg.org/dwc/terms/collectionCode"
    ]
  },
  {
    "id": "INSTITUTION_COLLECTION_MISMATCH",
    "severity": "WARNING",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/institutionCode",
      "http://rs.tdwg.org/dwc/terms/ownerInstitutionCode",
      "http://rs.tdwg.org/dwc/terms/institutionID"
    ]
  },
  {
    "id": "DIFFERENT_OWNER_INSTITUTION",
    "severity": "INFO",
    "relatedTerms": [
      "http://rs.tdwg.org/dwc/terms/institutionCode",
      "http://rs.tdwg.org/dwc/terms/ownerInstitutionCode",
      "http://rs.tdwg.org/dwc/terms/institutionID"
    ]
  }
] */

import patchedData from './interpretationRemark.json';
import getPatchedData from './patchInterpretationRemark';

export default getPatchedData(patchedData);
