import { FormattedMessage } from 'react-intl';

export function ColFeedback({ taxonId, datasetKey }: { taxonId?: string; datasetKey?: string }) {
  const linkToCoL = datasetKey === import.meta.env.PUBLIC_COL_CHECKLIST_KEY && taxonId;
  return (
    <>
      <FormattedMessage id="taxon.source" defaultMessage="Source" />:{' '}
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
        {linkToCoL ? 'Catalogue of Life' : 'Checklist Bank'}
      </a>
    </>
  );
}
