import { TaxonIdentifier } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';

const WikiDataIdentifiers = ({ identifiers }: { identifiers: TaxonIdentifier[] }) => {
  return (
    <div className="g-text-sm g-text-slate-500">
      <div className="g-flex g-flex-wrap g-gap-1">
        {identifiers.map((i: TaxonIdentifier, idx: number) => (
          <a
            key={idx}
            href={`${i?.url}`}
            className="g-inline-flex g-items-center g-gap-1 g-bg-slate-100 hover:g-bg-slate-200 g-text-slate-600 g-text-xs g-py-0.5 g-px-2 g-rounded-full g-no-underline g-border"
          >
            {i?.title}
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
      <a href={url} className="g-underline g-text-inherit" rel="noopener noreferrer">
        wikidata:{id}
      </a>
    </span>
  );
}

export default WikiDataIdentifiers;
