const template = `SELECT 
  {{DIMENSIONS}},
  COUNT(*) AS occurrences, 
  MIN(COALESCE(coordinateUncertaintyInMeters, 1000)) AS minCoordinateUncertaintyInMeters,
  MIN(GBIF_TemporalUncertainty(eventDate)) AS minTemporalUncertainty,
  {{HIGHER_TAXA_MEASUREMENTS}}
FROM
  occurrence
WHERE 
  {{FILTERS}}
GROUP BY
  {{GROUP_BY}}`;

const ranks = [
  'kingdom',
  'phylum',
  'class',
  'order',
  'family',
  'genus',
  'species',
];

function getRankString(rank) {
  return ranks
    .slice(0, ranks.indexOf(rank) + 1)
    .map((x) => `"${x}", "${x}key"`)
    .join(', ');
}

const taxa = {
  KINGDOM: getRankString('kingdom'),
  PHYLUM: getRankString('phylum'),
  CLASS: getRankString('class'),
  ORDER: getRankString('order'),
  FAMILY: getRankString('family'),
  GENUS: getRankString('genus'),
  SPECIES: getRankString('species'),
};

export default async function generateSql({
  taxonomy,
  temporal,
  spatial,
  resolution,
  randomize,
  higherGroups,
}) {
  // generate SQL query
  let dimensions = ``;
  let filters = `countryCode = 'PL'`;
  let groupBy = ``;
  let higherTaxaMeasurements = ``;

  if (taxonomy) {
    dimensions += `${taxa[taxonomy]}, `;
    groupBy += `${taxa[taxonomy]}, `;
  }

  const sql = template
    .replace('{{DIMENSIONS}}', dimensions)
    .replace('{{FILTERS}}', filters)
    .replace('{{GROUP_BY}}', groupBy)
    .replace('{{HIGHER_TAXA_MEASUREMENTS}}', higherTaxaMeasurements);

  console.log(taxa);
  return { error: null, sql };
}