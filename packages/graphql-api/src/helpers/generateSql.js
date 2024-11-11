import config from "#/config";

const defaultUncertainty = 1000;

const template = `SELECT 
  {{DIMENSIONS}},
  {{MEASUREMENTS}}
FROM
  occurrence
WHERE 
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
}) {
  // generate SQL query
  const dimensions = [];
  const filters = `"year" > 2000`; //  TODO we need a way to get the filter as SQL https://github.com/gbif/occurrence/issues/356
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

  const sql = template
    .replace('{{DIMENSIONS}}', dimensions.join(', '))
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
    `${config.apiv1}/occurrence/download/request/validate`,
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
      'This is an experimental endpoint to generate SQL queries for the occurrence download service. Currently filters (WHERE) is hardcoded and is waiting for https://github.com/gbif/occurrence/issues/356',
    error,
    sql,
    validationResponse: validation,
  };
}
