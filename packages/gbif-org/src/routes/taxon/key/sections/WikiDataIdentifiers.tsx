import { WikiDataIdentifier } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';

const WikiDataIdentifiers = ({ identifiers }: { identifiers: WikiDataIdentifier[] }) => {
  return (
    <div className="g-text-sm g-text-slate-500">
      <div className="g-flex g-flex-wrap g-gap-1">
        {identifiers.map((i: WikiDataIdentifier, idx: number) => (
          <a
            key={idx}
            href={`${i?.url}`}
            className="g-inline-flex g-items-center g-py-px g-px-2 g-rounded-full g-border g-border-slate-300 g-bg-slate-50 g-text-primary-600 g-text-xs g-leading-normal g-whitespace-nowrap g-no-underline g-transition-colors hover:g-bg-slate-200"
          >
            {i?.label?.value}
          </a>
        ))}
      </div>
    </div>
  );
};

export function WikidataIdentifiersSource({ url, id }: { url: string; id: string }) {
  return (
    <span>
      <span>
        <FormattedMessage id="taxon.source" />
      </span>
      {': '}
      <a href={url} className="g-underline" rel="noopener noreferrer">
        wikidata:{id}
      </a>
    </span>
  );
}

export default WikiDataIdentifiers;
