import { FormattedMessage } from 'react-intl';

export function ColFeedback() {
  return (
    <FormattedMessage
      id="taxon.colFeedback"
      defaultMessage="Source: Catalogue of Life. {link}"
      values={{
        link: (
          <a
            href="https://github.com/CatalogueOfLife/data/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
            className="g-underline"
          >
            <FormattedMessage id="link" defaultMessage="Leave feedback." />
          </a>
        ),
      }}
    />
  );
}
