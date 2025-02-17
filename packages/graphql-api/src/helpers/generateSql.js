import config from '#/config';

const defaultUncertainty = 1000;

const sqlEndpoint = config.sqlapi ?? config.apiv1;

const WHERE_PREDICATE_RESTRICTIONS = {
  taxonomicDimension: {
    KINGDOM: [
      {
        type: 'isNotNull',
        parameter: 'KINGDOM_KEY',
      },
    ],
    PHYLUM: [
      {
        type: 'isNotNull',
        parameter: 'PHYLUM_KEY',
      },
    ],
    CLASS: [
      {
        type: 'isNotNull',
        parameter: 'CLASS_KEY',
      },
    ],
    ORDER: [
      {
        type: 'isNotNull',
        parameter: 'ORDER_KEY',
      },
    ],
    FAMILY: [
      {
        type: 'isNotNull',
        parameter: 'FAMILY_KEY',
      },
    ],
    GENUS: [
      {
        type: 'isNotNull',
        parameter: 'GENUS_KEY',
      },
    ],
    SPECIES: [
      {
        type: 'isNotNull',
        parameter: 'SPECIES_KEY',
      },
    ],
    EXACT_TAXON: [
      {
        type: 'isNotNull',
        parameter: 'TAXON_KEY',
      },
    ],
    ACCEPTED_TAXON: [
      {
        type: 'isNotNull',
        parameter: 'ACCEPTED_TAXON_KEY',
      },
    ],
  },
  temporalDimension: {
    YEAR: [
      {
        type: 'isNotNull',
        parameter: 'YEAR',
      },
    ],
    YEARMONTH: [
      {
        type: 'isNotNull',
        parameter: 'YEAR',
      },
      {
        type: 'isNotNull',
        parameter: 'MONTH',
      },
    ],
    DATE: [
      {
        type: 'isNotNull',
        parameter: 'YEAR',
      },
      {
        type: 'isNotNull',
        parameter: 'MONTH',
      },
      {
        type: 'isNotNull',
        parameter: 'DAY',
      },
    ],
  },
  spatialDimension: {
    EEA_REFERENCE_GRID: [
      {
        type: 'equals',
        key: 'HAS_COORDINATE',
        value: 'true',
      },
    ],
    EXTENDED_QUARTER_DEGREE_GRID: [
      {
        type: 'equals',
        key: 'HAS_COORDINATE',
        value: 'true',
      },
    ],
    ISEA3H_GRID: [
      {
        type: 'equals',
        key: 'HAS_COORDINATE',
        value: 'true',
      },
    ],
    MILITARY_GRID_REFERENCE_SYSTEM: [
      {
        type: 'equals',
        key: 'HAS_COORDINATE',
        value: 'true',
      },
    ],
  },
};
async function getWhereClause({
  predicate,
  taxonomicDimension,
  temporalDimension,
  spatialDimension,
}) {
  const restrictions = [];
  if (taxonomicDimension) {
    const taxonomicRestrictions =
      WHERE_PREDICATE_RESTRICTIONS.taxonomicDimension[taxonomicDimension];
    if (taxonomicRestrictions) {
      restrictions.push(...taxonomicRestrictions);
    }
  }
  if (temporalDimension) {
    const temporalRestrictions =
      WHERE_PREDICATE_RESTRICTIONS.temporalDimension[temporalDimension];
    if (temporalRestrictions) {
      restrictions.push(...temporalRestrictions);
    }
  }
  if (spatialDimension) {
    const spatialRestrictions =
      WHERE_PREDICATE_RESTRICTIONS.spatialDimension[spatialDimension];
    if (spatialRestrictions) {
      restrictions.push(...spatialRestrictions);
    }
  }
  if (restrictions.length === 0) {
    throw new Error(
      'No restrictions found, which is unexpected as there should always be at least one dimension.',
    );
  }
  const restrictionsPredicate = { type: 'and', predicates: restrictions };

  const combinedPredicate = predicate
    ? { type: 'and', predicates: [predicate, restrictionsPredicate] }
    : restrictionsPredicate;

  const sqlResponse = await fetch(
    `${sqlEndpoint}/occurrence/download/request/sql`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ predicate: combinedPredicate }),
    },
  ).then((response) => response.json());
  // replace newlines with spaces and replace double spaces with single spaces
  const sqlString = sqlResponse.sql.replace(/\n/g, ' ').replace(/\s\s/g, ' ');

  // get rest of text after "WHERE" upper case
  const whereIndex = sqlString.toUpperCase().indexOf('WHERE');
  const sqlWhereClause = sqlString.substring(whereIndex);
  return ` ${sqlWhereClause} `;
}

const template = `SELECT 
  {{DIMENSIONS}},
  {{MEASUREMENTS}}
FROM
  occurrence 
{{FILTERS}}
GROUP BY
  {{GROUP_BY}}`;

export default async function generateSql({
  taxonomy,
  temporal,
  spatial,
  resolution,
  randomize,
  higherGroups,
  includeTemporalUncertainty,
  includeSpatialUncertainty,
  predicate,
}) {
  // generate SQL query
  const dimensions = [];
  let filters = '';
  try {
    filters = await getWhereClause({
      predicate,
      taxonomicDimension: taxonomy,
      temporalDimension: temporal,
      spatialDimension: spatial,
    });
  } catch (error) {
    return { error: error.message, sql: null };
  }
  const groupBy = ['taxonRank', 'taxonomicStatus'];
  const measurements = ['COUNT(*) AS occurrences'];
  if (includeTemporalUncertainty === 'YES') {
    measurements.push(
      'MIN(GBIF_TemporalUncertainty(eventDate)) AS minTemporalUncertainty',
    );
  }
  if (includeSpatialUncertainty === 'YES') {
    measurements.push(
      'MIN(COALESCE(coordinateUncertaintyInMeters, 1000)) AS minCoordinateUncertaintyInMeters',
    );
  }

  if (taxonomy) {
    const KINGDOM = 'kingdom, kingdomKey';
    const PHYLUM = `${KINGDOM}, phylum, phylumKey`;
    const CLASS = `${PHYLUM}, class, classKey`;
    // const ORDER = `${CLASS}, "order_" as "order", orderKey`; // dev, uat and prod are not aligned on column naming
    const ORDER = `${CLASS}, "order", orderKey`;
    const FAMILY = `${ORDER}, family, familyKey`;
    const GENUS = `${FAMILY}, genus, genusKey`;
    const SPECIES = `${GENUS}, species, speciesKey`;
    const EXACT_TAXON = `${SPECIES}, taxonKey, scientificName`;
    const ACCEPTED_TAXON = `${SPECIES}, acceptedTaxonKey, acceptedScientificName`;

    const KINGDOM_GROUP = 'kingdom, kingdomKey';
    const PHYLUM_GROUP = `${KINGDOM_GROUP}, phylum, phylumKey`;
    const CLASS_GROUP = `${PHYLUM_GROUP}, class, classKey`;
    const ORDER_GROUP = `${CLASS_GROUP}, "order", orderKey`;
    const FAMILY_GROUP = `${ORDER_GROUP}, family, familyKey`;
    const GENUS_GROUP = `${FAMILY_GROUP}, genus, genusKey`;
    const SPECIES_GROUP = `${GENUS_GROUP}, species, speciesKey`;
    const EXACT_TAXON_GROUP = `${SPECIES_GROUP}, taxonKey, scientificName`;
    const ACCEPTED_TAXON_GROUP = `${SPECIES_GROUP}, acceptedTaxonKey, acceptedScientificName`;

    const lookup = {
      KINGDOM: {
        dimension: KINGDOM,
        groupBy: KINGDOM_GROUP,
      },
      PHYLUM: {
        dimension: PHYLUM,
        groupBy: PHYLUM_GROUP,
      },
      CLASS: {
        dimension: CLASS,
        groupBy: CLASS_GROUP,
      },
      ORDER: {
        dimension: ORDER,
        groupBy: ORDER_GROUP,
      },
      FAMILY: {
        dimension: FAMILY,
        groupBy: FAMILY_GROUP,
      },
      GENUS: {
        dimension: GENUS,
        groupBy: GENUS_GROUP,
      },
      SPECIES: {
        dimension: SPECIES,
        groupBy: SPECIES_GROUP,
      },
      EXACT_TAXON: {
        dimension: EXACT_TAXON,
        groupBy: EXACT_TAXON_GROUP,
      },
      ACCEPTED_TAXON: {
        dimension: ACCEPTED_TAXON,
        groupBy: ACCEPTED_TAXON_GROUP,
      },
    };
    dimensions.push(lookup[taxonomy].dimension);
    groupBy.push(lookup[taxonomy].groupBy);
  }

  if (temporal) {
    const lookup = {
      YEAR: {
        dimension: `"year"`,
        groupBy: `"year"`,
      },
      YEARMONTH: {
        dimension: `PRINTF('%04d-%02d', "year", "month") AS yearMonth`,
        groupBy: `yearMonth`,
      },
      DATE: {
        dimension: `PRINTF('%04d-%02d-%02d', "year", "month", "day") AS yearMonthDay`,
        groupBy: `yearMonthDay`,
      },
    };
    dimensions.push(lookup[temporal].dimension);
    groupBy.push(lookup[temporal].groupBy);
  }

  if (spatial) {
    let coordinateUncertaintyInMeters = 0;
    if (randomize === 'YES') {
      coordinateUncertaintyInMeters = `COALESCE(coordinateUncertaintyInMeters, ${defaultUncertainty})`;
    }
    const lookup = {
      EEA_REFERENCE_GRID: {
        dimension: `GBIF_EEARGCode(
          ${resolution},
          decimalLatitude,
          decimalLongitude,
          ${coordinateUncertaintyInMeters}
        ) AS eeaCellCode`,
        groupBy: `eeaCellCode`,
      },
      EXTENDED_QUARTER_DEGREE_GRID: {
        dimension: `GBIF_EQDGCCode(
          ${resolution},
          decimalLatitude,
          decimalLongitude,
          ${coordinateUncertaintyInMeters}
        ) AS eqdCellCode`,
        groupBy: 'eqdCellCode',
      },
      ISEA3H_GRID: {
        dimension: `GBIF_ISEA3HCode(
          ${resolution},
          decimalLatitude,
          decimalLongitude,
          ${coordinateUncertaintyInMeters}
        ) AS isea3hCellCode`,
        groupBy: 'isea3hCellCode',
      },
      MILITARY_GRID_REFERENCE_SYSTEM: {
        dimension: `GBIF_MGRSCode(
          ${resolution},
          decimalLatitude,
          decimalLongitude,
          ${coordinateUncertaintyInMeters}
        ) AS mgrsCellCode`,
        groupBy: 'mgrsCellCode',
      },
    };
    dimensions.push(lookup[spatial].dimension);
    groupBy.push(lookup[spatial].groupBy);
  }

  // cast higherGroups as array
  const higherGroupsArray =
    higherGroups && Array.isArray(higherGroups) ? higherGroups : [higherGroups];

  if (higherGroupsArray.length > 0) {
    const generate = (rank) =>
      `IF(ISNULL(${rank}Key), NULL, SUM(COUNT(*)) OVER (PARTITION BY ${rank}Key)) AS ${rank}Count`;
    const lookup = {
      KINGDOM: generate('kingdom'),
      PHYLUM: generate('phylum'),
      CLASS: generate('class'),
      ORDER: generate('order'),
      FAMILY: generate('family'),
      GENUS: generate('genus'),
    };
    higherGroupsArray.forEach((rank) => {
      dimensions.push(lookup[rank]);
    });
  }
  // remove undefined and null values from dimensions
  const filteredDimensions = dimensions.filter((dimension) => dimension);
  const sql = template
    .replace('{{DIMENSIONS}}', filteredDimensions.join(', '))
    .replace('{{MEASUREMENTS}}', measurements.join(', '))
    .replace('{{FILTERS}}', filters)
    .replace('{{GROUP_BY}}', groupBy.join(', '));
  return { error: null, sql };
}

export async function getSql({ query }) {
  const { error, sql } = await generateSql(query);
  if (error) {
    return { error, sql };
  }

  // post to https://api.gbif.org/v1/occurrence/download/request/validate to validate the sql
  const validation = await fetch(
    `${sqlEndpoint}/occurrence/download/request/validate`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ sql, format: 'SQL_TSV_ZIP' }),
    },
  ).then((response) => response.json());

  if (!validation.sql) {
    return {
      error: 'Validation failed',
      validationResponse: validation,
    };
  }
  return {
    comment:
      'This is an unstable endpoint to generate SQL queries for the occurrence download service.',
    error,
    sql,
    validationResponse: validation,
  };
}
