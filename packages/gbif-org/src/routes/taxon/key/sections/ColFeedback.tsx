import { FormattedMessage } from 'react-intl';

export function ColFeedback({
  taxonId,
  checklistbankURL,
}: {
  taxonId?: string;
  datasetKey?: string;
  checklistbankURL: string;
}) {
  // disable all links to CoL . https://github.com/gbif/gbif-web/issues/2110
  // datasetKey is still passed by callers so the link can be turned back on.
  const linkToCoL = false; // datasetKey === import.meta.env.PUBLIC_COL_CHECKLIST_KEY && taxonId;
  return (
    <>
      <FormattedMessage id="taxon.source" defaultMessage="Source" />:{' '}
      <a
        href={
          linkToCoL && taxonId
            ? `https://www.catalogueoflife.org/data/taxon/${encodeURIComponent(taxonId)}`
            : checklistbankURL
        }
        target="_blank"
        rel="noopener noreferrer"
        className="g-underline g-text-inherit"
      >
        {linkToCoL ? 'Catalogue of Life' : 'Checklist Bank'}
      </a>
    </>
  );
}
