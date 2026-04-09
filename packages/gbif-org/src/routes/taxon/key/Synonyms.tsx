import { DynamicLink } from '@/reactRouterPlugins';
import { TaxonKeyQuery } from '@/gql/graphql';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Button } from '@/components/ui/button';

const LIMIT = 10;
const Synonyms = ({ taxonInfo }: { taxonInfo: TaxonKeyQuery['taxonInfo'] }) => {
  const [showAll, setShowAll] = useState(false);

  const count =
    taxonInfo?.synonyms?.heterotypic?.flat().concat(taxonInfo?.synonyms?.homotypic || []).length ??
    0;
  return (
    <div>
      <div className="g-text-sm g-text-slate-500 g-mb-1">
        <FormattedMessage id="counts.nResults" values={{ total: count }} />
        {count > LIMIT && (
          <Button variant="link" onClick={() => setShowAll((prev) => !prev)}>
            {showAll ? 'Show Less' : `Show All`}
          </Button>
        )}
      </div>
      <ul>
        {taxonInfo?.synonyms?.homotypic?.slice(0, showAll ? undefined : LIMIT).map((synonym) => {
          return (
            <li key={synonym.taxonID} className="g-py-1 g-border-t g-border-gray-200">
              <Synonym synonym={synonym} type="homotypic" />
            </li>
          );
        })}
        {taxonInfo?.synonyms?.heterotypic
          ?.slice(
            0,
            showAll ? undefined : Math.max(0, LIMIT - (taxonInfo?.synonyms?.homotypic?.length || 0))
          )
          .map((synonyms) => {
            const first = synonyms[0];
            const remaining = synonyms.slice(1);
            return (
              <li key={first.taxonID} className="g-py-1 g-border-t g-border-gray-200">
                <Synonym synonym={first} type="heterotypic" />
                {remaining.map((synonym) => (
                  <ul key={synonym.taxonID} className="g-ms-4">
                    <li>
                      <Synonym synonym={synonym} type="homotypic" />
                    </li>
                  </ul>
                ))}
              </li>
            );
          })}
      </ul>
    </div>
  );
};

function Synonym({
  synonym,
  type,
}: {
  synonym: {
    taxonID: string;
    label: string;
    isOriginalNameUsage?: boolean;
  };
  type: 'homotypic' | 'heterotypic';
}) {
  console.log(synonym);
  return (
    <DynamicLink
      pageId="taxonKey"
      variables={{ key: synonym.taxonID }}
      className="g-text-decoration-none g-text-primary-500"
    >
      {type === 'homotypic' ? '≡ ' : '= '}
      <span dangerouslySetInnerHTML={{ __html: synonym.label }}></span>
      {synonym.isOriginalNameUsage && (
        <span className="g-ms-2 g-px-1 g-py-px g-bg-slate-600 g-text-slate-50 g-rounded g-border">
          <FormattedMessage id="taxon.originalNameUsage" />
        </span>
      )}
    </DynamicLink>
  );
}

export default Synonyms;
