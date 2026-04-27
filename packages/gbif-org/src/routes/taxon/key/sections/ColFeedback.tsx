import { FormattedMessage } from 'react-intl';

export function ColFeedback({ taxonId, datasetKey }: { taxonId?: string; datasetKey?: string }) {
  const linkToCoL = datasetKey === import.meta.env.PUBLIC_COL_CHECKLIST_KEY && taxonId;
  return (
    <FormattedMessage
      id="taxon.colFeedback"
      defaultMessage="Source: Catalogue of Life. {link}"
      values={{
        link: (
          <a
            href={
              linkToCoL
                ? `https://www.catalogueoflife.org/data/taxon/${encodeURIComponent(taxonId)}`
                : `https://github.com/CatalogueOfLife/data/issues/new?body=${encodeURIComponent(`Regarding Taxon ID: ${taxonId} in dataset: ${datasetKey}`)}`
            }
            target="_blank"
            rel="noopener noreferrer"
            className="g-underline"
          >
            <FormattedMessage id="taxon.colLeaveFeedback" defaultMessage="Leave feedback." />
          </a>
        ),
      }}
    />
  );
}
