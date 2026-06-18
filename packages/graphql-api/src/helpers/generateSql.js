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

const isNotNull = (parameter) => ({ type: 'isNotNull', parameter });
const hasCoordinate = { type: 'equals', key: 'HAS_COORDINATE', value: 'true' };

// prettier-ignore
const WHERE_PREDICATE_RESTRICTIONS = {
  taxonomicDimension: {
    KINGDOM:        [isNotNull('KINGDOM_KEY')],
    PHYLUM:         [isNotNull('PHYLUM_KEY')],
    CLASS:          [isNotNull('CLASS_KEY')],
    ORDER:          [isNotNull('ORDER_KEY')],
    FAMILY:         [isNotNull('FAMILY_KEY')],
    GENUS:          [isNotNull('GENUS_KEY')],
    SPECIES:        [isNotNull('SPECIES_KEY')],
    EXACT_TAXON:    [isNotNull('TAXON_KEY')],
    ACCEPTED_TAXON: [isNotNull('ACCEPTED_TAXON_KEY')],
  },
  temporalDimension: {
    YEAR:      [isNotNull('YEAR')],
    YEARMONTH: [isNotNull('YEAR'), isNotNull('MONTH')],
    DATE:      [isNotNull('YEAR'), isNotNull('MONTH'), isNotNull('DAY')],
  },
  spatialDimension: {
    EEA_REFERENCE_GRID:             [hasCoordinate],
    EXTENDED_QUARTER_DEGREE_GRID:   [hasCoordinate],
    ISEA3H_GRID:                    [hasCoordinate],
    MILITARY_GRID_REFERENCE_SYSTEM: [hasCoordinate],
    COUNTRY:                        [hasCoordinate],
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
      KINGDOM: {
        select: [`${nl('kingdom')} AS kingdom`, `${nl('kingdomKey')} AS kingdomKey`],
        groupBy: [nl('kingdom'), nl('kingdomKey')],
      },
      PHYLUM: {
        select: [`${nl('kingdom')} AS kingdom`, `${nl('kingdomKey')} AS kingdomKey`, `${nl('phylum')} AS phylum`, `${nl('phylumKey')} AS phylumKey`],
        groupBy: [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey')],
      },
      CLASS: {
        select: [`${nl('kingdom')} AS kingdom`, `${nl('kingdomKey')} AS kingdomKey`, `${nl('phylum')} AS phylum`, `${nl('phylumKey')} AS phylumKey`, `${nl('class')} AS class`, `${nl('classKey')} AS classKey`],
        groupBy: [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey')],
      },
      ORDER: {
        select: [`${nl('kingdom')} AS kingdom`, `${nl('kingdomKey')} AS kingdomKey`, `${nl('phylum')} AS phylum`, `${nl('phylumKey')} AS phylumKey`, `${nl('class')} AS class`, `${nl('classKey')} AS classKey`, `${nl('order')} AS "order"`, `${nl('orderKey')} AS orderKey`],
        groupBy: [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey')],
      },
      FAMILY: {
        select: [`${nl('kingdom')} AS kingdom`, `${nl('kingdomKey')} AS kingdomKey`, `${nl('phylum')} AS phylum`, `${nl('phylumKey')} AS phylumKey`, `${nl('class')} AS class`, `${nl('classKey')} AS classKey`, `${nl('order')} AS "order"`, `${nl('orderKey')} AS orderKey`, `${nl('family')} AS family`, `${nl('familyKey')} AS familyKey`],
        groupBy: [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey'), nl('family'), nl('familyKey')],
      },
      GENUS: {
        select: [`${nl('kingdom')} AS kingdom`, `${nl('kingdomKey')} AS kingdomKey`, `${nl('phylum')} AS phylum`, `${nl('phylumKey')} AS phylumKey`, `${nl('class')} AS class`, `${nl('classKey')} AS classKey`, `${nl('order')} AS "order"`, `${nl('orderKey')} AS orderKey`, `${nl('family')} AS family`, `${nl('familyKey')} AS familyKey`, `${nl('genus')} AS genus`, `${nl('genusKey')} AS genusKey`],
        groupBy: [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey'), nl('family'), nl('familyKey'), nl('genus'), nl('genusKey')],
      },
      SPECIES: {
        select: [`${nl('kingdom')} AS kingdom`, `${nl('kingdomKey')} AS kingdomKey`, `${nl('phylum')} AS phylum`, `${nl('phylumKey')} AS phylumKey`, `${nl('class')} AS class`, `${nl('classKey')} AS classKey`, `${nl('order')} AS "order"`, `${nl('orderKey')} AS orderKey`, `${nl('family')} AS family`, `${nl('familyKey')} AS familyKey`, `${nl('genus')} AS genus`, `${nl('genusKey')} AS genusKey`, `${nl('species')} AS species`, `${nl('speciesKey')} AS speciesKey`],
        groupBy: [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey'), nl('family'), nl('familyKey'), nl('genus'), nl('genusKey'), nl('species'), nl('speciesKey')],
      },
      EXACT_TAXON: {
        select: [`${nl('kingdom')} AS kingdom`, `${nl('kingdomKey')} AS kingdomKey`, `${nl('phylum')} AS phylum`, `${nl('phylumKey')} AS phylumKey`, `${nl('class')} AS class`, `${nl('classKey')} AS classKey`, `${nl('order')} AS "order"`, `${nl('orderKey')} AS orderKey`, `${nl('family')} AS family`, `${nl('familyKey')} AS familyKey`, `${nl('genus')} AS genus`, `${nl('genusKey')} AS genusKey`, `${nl('species')} AS species`, `${nl('speciesKey')} AS speciesKey`, `${nl('taxonKey')} AS taxonKey`, `${nl('scientificName')} AS scientificName`],
        groupBy: [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey'), nl('family'), nl('familyKey'), nl('genus'), nl('genusKey'), nl('species'), nl('speciesKey'), nl('taxonKey'), nl('scientificName')],
      },
      ACCEPTED_TAXON: {
        select: [`${nl('kingdom')} AS kingdom`, `${nl('kingdomKey')} AS kingdomKey`, `${nl('phylum')} AS phylum`, `${nl('phylumKey')} AS phylumKey`, `${nl('class')} AS class`, `${nl('classKey')} AS classKey`, `${nl('order')} AS "order"`, `${nl('orderKey')} AS orderKey`, `${nl('family')} AS family`, `${nl('familyKey')} AS familyKey`, `${nl('genus')} AS genus`, `${nl('genusKey')} AS genusKey`, `${nl('species')} AS species`, `${nl('speciesKey')} AS speciesKey`, `${nl('acceptedTaxonKey')} AS acceptedTaxonKey`, `${nl('acceptedScientificName')} AS acceptedScientificName`],
        groupBy: [nl('kingdom'), nl('kingdomKey'), nl('phylum'), nl('phylumKey'), nl('class'), nl('classKey'), nl('order'), nl('orderKey'), nl('family'), nl('familyKey'), nl('genus'), nl('genusKey'), nl('species'), nl('speciesKey'), nl('acceptedTaxonKey'), nl('acceptedScientificName')],
      },
    };
    const { select, groupBy: taxonGroupBy } = taxonomyFields[taxonomy];
    dimensions.push(select.join(', '));
    groupBy.push(taxonGroupBy.join(', '));
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
