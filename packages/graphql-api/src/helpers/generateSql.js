import config from '@/config';
import { signJson, verifyJson } from './utils';

const defaultUncertainty = 1000;

const sqlEndpoint = config.apiv1;

function generateMachineDescription(parameters, sql) {
  const signature = signJson({ sql, parameters });
  return { type: 'CUBE', signature, parameters };
}

function nameLookup(name, checklistKey) {
  if (checklistKey === config.gbifBackboneUUID) {
    if (name === 'order') return `occurrence."order"`;
    return `occurrence.${name}`;
  }
  const lowername = name.toLowerCase();
  const lookup = {};
  // generate for convinence the name lookup for the taxonomic dimensions, e.g. kingdom, phylum, class, order, family, genus
  const ranks = ['kingdom', 'phylum', 'class', 'order', 'family', 'genus', 'species', 'taxon', 'acceptedtaxon'];
  ranks.forEach((rank) => {
    lookup[rank] = `occurrence.classificationdetails['${checklistKey}']['${rank}']`;
    lookup[`${rank}key`] = `occurrence.classificationdetails['${checklistKey}']['${rank}key']`;
  });
  if (lowername === 'scientificname') {
    return `occurrence.classificationdetails['${checklistKey}']['scientificname']`;
  }
  if (lowername === 'acceptedscientificname') {
    return `occurrence.classificationdetails['${checklistKey}']['acceptedscientificname']`;
  }
  return lookup[lowername] || name;
}

export function getGbifMachineDescription(machineDescription, sql) {
  // check if the machineDescription is an object, if not return null
  if (typeof machineDescription !== 'object') return null;
  // check if the machineDescription is signed by us
  const { signature, parameters } = machineDescription;
  if (!signature || !parameters) return null;

  // sign the parameters and compare
  const signedByUs = verifyJson({ sql, parameters }, signature);
  if (signedByUs) {
    // return the machineDescription except signature
    const { signature: _, ...rest } = machineDescription;
    return rest;
  }
  return null;
}

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
    COUNTRY: [
      {
        type: 'equals',
        key: 'HAS_COORDINATE',
        value: 'true',
      },
    ],
  },
};

async function getWhereClause({ predicate, taxonomicDimension, temporalDimension, spatialDimension, checklistKey }) {
  const restrictions = [];
  if (taxonomicDimension) {
    const taxonomicRestrictions = WHERE_PREDICATE_RESTRICTIONS.taxonomicDimension[taxonomicDimension];
    if (taxonomicRestrictions) {
      if (checklistKey) taxonomicRestrictions[0].checklistKey = checklistKey;
      restrictions.push(...taxonomicRestrictions);
    }
  }
  if (temporalDimension) {
    const temporalRestrictions = WHERE_PREDICATE_RESTRICTIONS.temporalDimension[temporalDimension];
    if (temporalRestrictions) {
      restrictions.push(...temporalRestrictions);
    }
  }
  if (spatialDimension) {
    const spatialRestrictions = WHERE_PREDICATE_RESTRICTIONS.spatialDimension[spatialDimension];
    if (spatialRestrictions) {
      restrictions.push(...spatialRestrictions);
    }
  }
  if (restrictions.length === 0) {
    throw new Error('No restrictions found, which is unexpected as there should always be at least one dimension.');
  }
  const restrictionsPredicate = { type: 'and', predicates: restrictions };

  const combinedPredicate = predicate
    ? { type: 'and', predicates: [predicate, restrictionsPredicate] }
    : restrictionsPredicate;

  const sqlResponse = await fetch(`${sqlEndpoint}/occurrence/download/request/sql`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ predicate: combinedPredicate }),
  }).then((response) => response.json());

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

export default async function generateSql(parameters) {
  const {
    taxonomy,
    temporal,
    spatial,
    resolution = 0,
    randomize,
    higherGroups,
    includeTemporalUncertainty,
    includeSpatialUncertainty,
    predicate,
    checklistKey = config.gbifBackboneUUID,
  } = parameters;

  let filters;
  try {
    filters = await getWhereClause({
      predicate,
      taxonomicDimension: taxonomy,
      temporalDimension: temporal,
      spatialDimension: spatial,
      checklistKey,
    });
  } catch (error) {
    return { error: error.message, sql: null };
  }

  const dimensions = [];
  const groupBy = [];
  const measurements = ['COUNT(*) AS occurrences'];

  if (includeTemporalUncertainty === 'YES') {
    measurements.push('MIN(GBIF_TEMPORALUNCERTAINTY(eventdate, eventtime)) AS minTemporalUncertainty');
  }
  if (includeSpatialUncertainty === 'YES') {
    measurements.push('MIN(COALESCE(coordinateUncertaintyInMeters, 1000)) AS minCoordinateUncertaintyInMeters');
  }

  // prettier-ignore
  if (taxonomy) {
    const nl = (name) => nameLookup(name, checklistKey);
    const taxonomyFields = {
      KINGDOM:        [nl('kingdom'), nl('kingdomKey')],
      PHYLUM:         [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey')],
      CLASS:          [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey')],
      ORDER:          [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey')],
      FAMILY:         [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey'), nl('family'), nl('familyKey')],
      GENUS:          [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey'), nl('family'), nl('familyKey'), nl('genus'), nl('genusKey')],
      SPECIES:        [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey'), nl('family'), nl('familyKey'), nl('genus'), nl('genusKey'), nl('species'), nl('speciesKey')],
      EXACT_TAXON:    [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey'), nl('family'), nl('familyKey'), nl('genus'), nl('genusKey'), nl('species'), nl('speciesKey'), nl('taxonKey'), nl('scientificName')],
      ACCEPTED_TAXON: [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey'), nl('family'), nl('familyKey'), nl('genus'), nl('genusKey'), nl('species'), nl('speciesKey'), nl('acceptedTaxonKey'), nl('acceptedScientificName')],
    };
    const fields = taxonomyFields[taxonomy].join(', ');
    dimensions.push(fields);
    groupBy.push(fields);
  }

  const temporalLookup = {
    YEAR: { select: `"year"`, groupBy: `"year"`, dimension: `"year"` },
    YEARMONTH: {
      select: `PRINTF('%04d-%02d', "year", "month") AS yearMonth`,
      groupBy: `yearMonth`,
      dimension: `PRINTF('%04d-%02d', "year", "month")`,
    },
    DATE: {
      select: `PRINTF('%04d-%02d-%02d', "year", "month", "day") AS yearMonthDay`,
      groupBy: `yearMonthDay`,
      dimension: `PRINTF('%04d-%02d-%02d', "year", "month", "day")`,
    },
  };

  if (temporal) {
    dimensions.push(temporalLookup[temporal].select);
    groupBy.push(temporalLookup[temporal].groupBy);
  }

  const coordinateUncertaintyInMeters =
    randomize === 'YES' ? `COALESCE(coordinateUncertaintyInMeters, ${defaultUncertainty})` : '0.0';
  const gridExpr = (fn) => `${fn}(${resolution}, decimalLatitude, decimalLongitude, ${coordinateUncertaintyInMeters})`;

  // prettier-ignore
  const spatialLookup = {
    EEA_REFERENCE_GRID:            { dimension: gridExpr('GBIF_EEARGCode'),  groupBy: 'eeaCellCode' },
    EXTENDED_QUARTER_DEGREE_GRID:  { dimension: gridExpr('GBIF_EQDGCode'),   groupBy: 'eqdCellCode' },
    ISEA3H_GRID:                   { dimension: gridExpr('GBIF_ISEA3HCode'), groupBy: 'isea3hCellCode' },
    MILITARY_GRID_REFERENCE_SYSTEM:{ dimension: gridExpr('GBIF_MGRSCode'),   groupBy: 'mgrsCellCode' },
    COUNTRY:                       { dimension: 'countryCode',               groupBy: 'countryCode' },
  };

  if (spatial) {
    const { dimension, groupBy: spatialGroupBy } = spatialLookup[spatial];
    dimensions.push(`${dimension} AS ${spatialGroupBy}`);
    groupBy.push(spatialGroupBy);
  }

  if (higherGroups) {
    const higherGroupsArray = Array.isArray(higherGroups) ? higherGroups : [higherGroups];
    higherGroupsArray.forEach((rank) => {
      const rankLower = rank.toLowerCase();
      const rankKey = nameLookup(`${rankLower}Key`, checklistKey);
      const partitionBy = [rankKey];
      if (spatial) partitionBy.push(spatialLookup[spatial].dimension);
      if (temporal) partitionBy.push(temporalLookup[temporal].dimension);
      dimensions.push(`SUM(COUNT(*)) OVER (PARTITION BY ${partitionBy.join(', ')}) AS ${rankLower}Count`);
    });
  }

  const sql = template
    .replace('{{DIMENSIONS}}', dimensions.join(', '))
    .replace('{{MEASUREMENTS}}', measurements.join(', '))
    .replace('{{FILTERS}}', filters)
    .replace('{{GROUP_BY}}', groupBy.join(', '));

  return { error: null, sql };
}

export async function getSql({ query: parameters }) {
  const { error, sql } = await generateSql(parameters);
  if (error) {
    return { error, sql };
  }

  // post to https://api.gbif.org/v1/occurrence/download/request/validate to validate the sql
  const validation = await fetch(`${sqlEndpoint}/occurrence/download/request/validate`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ sql, format: 'SQL_TSV_ZIP' }),
  }).then((response) => response.json());

  if (!validation.sql) {
    return {
      error: 'Validation failed',
      validationResponse: validation,
    };
  }

  const machineDescription = generateMachineDescription(parameters, validation.sql);

  // create and sign the machineDescription
  return {
    comment:
      'This endpoint is not part of a stable public API. It is an internal endpoint to generate SQL for the occurrence download B cube service.',
    error,
    sql: validation.sql,
    machineDescription,
  };
}
