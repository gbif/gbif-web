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
  const filters = `"year" BETWEEN 2000 AND 2030`; //  TODO we need a way to get the filter as SQL https://github.com/gbif/occurrence/issues/356
  const groupBy = ['taxonRank', 'taxonomicStatus'];
  const measurements = ['COUNT(*) AS occurrences'];
  if (includeTemporalUncertainty) {
    measurements.push(
      'MIN(GBIF_TemporalUncertainty(eventDate)) AS minTemporalUncertainty',
    );
  }
  if (includeSpatialUncertainty) {
    measurements.push(
      'MIN(COALESCE(coordinateUncertaintyInMeters, 1000)) AS minCoordinateUncertaintyInMeters',
    );
  }

  if (taxonomy) {
    const KINGDOM = 'kingdom, kingdomKey';
    const PHYLUM = `${KINGDOM}, phylum, phylumKey`;
    const CLASS = `${PHYLUM}, class, classKey`;
    const ORDER = `${CLASS}, "order_", orderKey`;
    const FAMILY = `${ORDER}, family, familyKey`;
    const GENUS = `${FAMILY}, genus, genusKey`;
    const SPECIES = `${GENUS}, species, speciesKey`;
    const EXACT_TAXON = `${SPECIES}, taxonKey, scientificName`;
    const ACCEPTED_TAXON = `${SPECIES}, acceptedTaxonKey, acceptedScientificName`;

    const lookup = {
      KINGDOM: {
        dimension: KINGDOM,
        groupBy: KINGDOM,
      },
      PHYLUM: {
        dimension: PHYLUM,
        groupBy: PHYLUM,
      },
      CLASS: {
        dimension: CLASS,
        groupBy: CLASS,
      },
      ORDER: {
        dimension: ORDER,
        groupBy: ORDER,
      },
      FAMILY: {
        dimension: FAMILY,
        groupBy: FAMILY,
      },
      GENUS: {
        dimension: GENUS,
        groupBy: GENUS,
      },
      SPECIES: {
        dimension: SPECIES,
        groupBy: SPECIES,
      },
      EXACT_TAXON: {
        dimension: EXACT_TAXON,
        groupBy: EXACT_TAXON,
      },
      ACCEPTED_TAXON: {
        dimension: ACCEPTED_TAXON,
        groupBy: ACCEPTED_TAXON,
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
    if (randomize === 'yes') {
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

  if (higherGroups && higherGroups.length > 0) {
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
    higherGroups.forEach((rank) => {
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
