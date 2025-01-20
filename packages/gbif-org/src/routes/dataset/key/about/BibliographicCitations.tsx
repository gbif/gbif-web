import { HyperText } from '@/components/hyperText';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

export function BibliographicCitations({ bibliographicCitations = [], ...props }) {
  // I really dislike "show all"-buttons that only show me one more item. Just show the damn item to begin with then. It is such a disappointing experience.
  // So instead we do: if less than 10 items then show them all. If above 10, then show 5 + expand button.
  // then it feels like you are rewarded for your action
  const [threshold, setThreshold] = useState(5);
  const citations =
    bibliographicCitations.length < 10
      ? bibliographicCitations
      : bibliographicCitations.slice(0, threshold);
  const hasHidden = bibliographicCitations.length > citations.length;
  return (
    <div className="g-prose">
      <ul>
        {citations.map((x, index) => (
          <BibiliographicCitation key={index} citation={x} />
        ))}
      </ul>
      {hasHidden && (
        <Button onClick={() => setThreshold(500)}>
          <FormattedMessage id="phrases.showAll" />
        </Button>
      )}
    </div>
  );
}

function BibiliographicCitation({ citation }) {
  const pattern = /^http(s)?:\/\/.+/;
  const match = citation.identifier ? citation.identifier.match(pattern) : null;
  const text = citation?.text?.length > 0 ? citation?.text : undefined;
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
