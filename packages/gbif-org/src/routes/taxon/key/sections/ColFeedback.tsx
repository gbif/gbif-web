import { FormattedMessage } from 'react-intl';

// Taxa link to Checklist Bank rather than Catalogue of Life, see
// https://github.com/gbif/gbif-web/issues/2110
export function ColFeedback({ checklistbankURL }: { checklistbankURL: string }) {
  return (
    <>
      <FormattedMessage id="taxon.source" defaultMessage="Source" />:{' '}
      <a
        href={checklistbankURL}
        target="_blank"
        rel="noopener noreferrer"
        className="g-underline g-text-inherit"
      >
        Checklist Bank
      </a>
    </>
  );
}
