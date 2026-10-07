import { HyperText } from '@/components/hyperText';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { DatasetQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';

type CitationList = NonNullable<DatasetQuery['dataset']>['bibliographicCitations'];

export function BibliographicCitations({
  bibliographicCitations,
  cap = 200,
}: {
  bibliographicCitations: CitationList;
  cap?: number;
}) {
  // I really dislike "show all"-buttons that only show me one more item. Just show the damn item to begin with then. It is such a disappointing experience.
  // So instead we do: if less than 10 items then show them all. If above 10, then show 5 + expand button.
  // then it feels like you are rewarded for your action
  const [threshold, setThreshold] = useState(5);
  const allCitations = bibliographicCitations ?? [];
  const citations = allCitations.length < 10 ? allCitations : allCitations.slice(0, threshold);
  const hasHidden = allCitations.length > citations.length && threshold < cap;
  return (
    <div className="g-prose g-max-w-full">
      <ul>
        {citations.map((x, index) => (
          <BibiliographicCitation key={index} citation={x} />
        ))}
      </ul>
      {hasHidden && (
        <Button onClick={() => setThreshold(cap)}>
          <FormattedMessage id="phrases.showAll" />
        </Button>
      )}
      {!hasHidden && allCitations.length > cap && (
        <div>
          <FormattedMessage
            id="phrases.showingFirstCap"
            defaultMessage="Showing first {cap} contacts"
            values={{ cap }}
          />
        </div>
      )}
    </div>
  );
}

function BibiliographicCitation({ citation }: { citation: NonNullable<CitationList>[number] }) {
  if (!citation) return null;
  const pattern = /^http(s)?:\/\/.+/;
  const match = citation.identifier ? citation.identifier.match(pattern) : null;
  const text = (citation.text?.length ?? 0) > 0 ? citation.text : undefined;
  return (
    <li>
      <div>
        <HyperText text={text} fallback="phrases.emptyValueProvided" />
      </div>
      {citation.identifier && match && (
        <a href={citation.identifier} className="g-me-4">
          <FormattedMessage id="dataset.viewArticle" />
        </a>
      )}
      {citation.identifier && !match && (
        <>
          <span className="g-me-4 g-text-slate-400">
            <FormattedMessage id="phrases.identifier" />:{' '}
          </span>
          <span>{citation.identifier}</span>
        </>
      )}
      {citation.text && (
        <>
          <a href={'https://scholar.google.com/scholar?q=' + encodeURIComponent(citation.text)}>
            Google Scholar
          </a>
        </>
      )}
    </li>
  );
}
