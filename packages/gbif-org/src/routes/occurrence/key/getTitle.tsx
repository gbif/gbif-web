import { OccurrenceQuery, Term } from '@/gql/graphql';

const criticalTaxonIssues = ['TAXON_MATCH_HIGHERRANK', 'TAXON_MATCH_AGGREGATE', 'TAXON_MATCH_NONE'];

const states = ['NO_NAME', 'NO_MATCH', 'MATCH_WITH_ISSUES', 'MATCH_NO_ISSUES'] as const;

const getTitleParts = ({
  occurrence,
  termMap,
}: {
  occurrence: OccurrenceQuery['occurrence'];
  termMap: { [key: string]: Term };
}): {
  // plain text, never render it as HTML
  title: string;
  // the formatted (HTML) name, only set when the occurrence is matched without important issues
  titleHtml?: string;
  hasTaxonIssues: boolean;
  noMatch: boolean;
  state: (typeof states)[number];
} => {
  const verbatimNameOrHigestRank =
    occurrence?.verbatimScientificName ||
    termMap?.genus?.verbatim ||
    termMap?.family?.verbatim ||
    termMap?.order?.verbatim ||
    termMap?.class?.verbatim ||
    termMap?.phylum?.verbatim ||
    termMap?.kingdom?.verbatim;

  const hasImportantIssues = occurrence?.classification?.issues?.some((issue) =>
    criticalTaxonIssues.includes(issue)
  );

  const usage = occurrence?.classification?.usage;
  const noTaxonMatch = !usage;

  // there is no taxon match and no name to show, so show unknown
  if (noTaxonMatch && !verbatimNameOrHigestRank) {
    return {
      title: 'Unknown',
      hasTaxonIssues: false,
      noMatch: true,
      state: 'NO_NAME',
    };
  }

  // if there is no match, then we want to show the verbatim scientific name or the highest rank available
  // we should also indicate that there is no match
  if (noTaxonMatch) {
    return {
      title: verbatimNameOrHigestRank,
      hasTaxonIssues: false,
      noMatch: true,
      state: 'NO_MATCH',
    };
  }

  // there is a taxon match, but there are important issues with the match
  // so show the verbatim
  if (hasImportantIssues) {
    return {
      title: verbatimNameOrHigestRank,
      hasTaxonIssues: true,
      noMatch: false,
      state: 'MATCH_WITH_ISSUES',
    };
  }

  // there is a match and no important issues, so show the matched name
  return {
    title: usage.name ?? 'No title provided',
    titleHtml: occurrence.classification?.taxonMatch?.usage?.formattedName ?? undefined,
    hasTaxonIssues: false,
    noMatch: false,
    state: 'MATCH_NO_ISSUES',
  };
};

export default getTitleParts;
