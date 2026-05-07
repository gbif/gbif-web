import { FormattedMessage } from 'react-intl';

export function ColFeedback({
  taxonId,
  datasetKey,
  checklistbankURL,
}: {
  taxonId?: string;
  datasetKey?: string;
  checklistbankURL: string;
}) {
  const linkToCoL = datasetKey === import.meta.env.PUBLIC_COL_CHECKLIST_KEY && taxonId;
  return (
    <>
      <FormattedMessage id="taxon.source" defaultMessage="Source" />:{' '}
      <a
        href={
          linkToCoL
            ? `https://www.catalogueoflife.org/data/taxon/${encodeURIComponent(taxonId)}`
            : checklistbankURL
        }
        target="_blank"
        rel="noopener noreferrer"
        className="g-underline"
      >
        {linkToCoL ? 'Catalogue of Life' : 'Checklist Bank'}
      </a>
    </>
  );
}
