import { OccurrenceQuery, Term } from '@/gql/graphql';

const getTitle = ({
  occurrence,
  termMap,
}: {
  occurrence: OccurrenceQuery['occurrence'];
  termMap: { [key: string]: Term };
}) => {
  if (occurrence?.classification?.usage && !occurrence?.classification?.hasTaxonIssues) {
    return occurrence.classification.usage.name;
  }
  return (
    occurrence?.verbatimScientificName ||
    termMap?.genus?.verbatim ||
    termMap?.family?.verbatim ||
    termMap?.order?.verbatim ||
    termMap?.class?.verbatim ||
    termMap?.phylum?.verbatim ||
    termMap?.kingdom?.verbatim
  );
};

export default getTitle;
