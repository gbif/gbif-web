import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CardDescription } from '@/components/ui/smallCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';
import { ColFeedback } from './ColFeedback';

type Props = {
  taxonInfo: TaxonKeyQuery['taxonInfo'];
};

function BibliographyContent({ taxonInfo }: Props) {
  return (
    <Card className="g-mb-4">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.bibliography" />
        </CardTitle>
        <CardDescription>
          <ColFeedback />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="g-divide-y g-divide-slate-100">
          {taxonInfo?.bibliography.map((bib) => (
            <li key={bib.referenceID} className="g-py-3 first:g-pt-0 last:g-pb-0">
              <div className="g-text-sm g-text-slate-800">
                {bib.isNamePublishedIn && (
                  <span className="g-mr-1 g-px-1 g-py-px g-bg-slate-100 g-text-primary-600 g-rounded g-border">
                    <FormattedMessage id="taxon.publishedIn" defaultMessage="Name published in" />
                  </span>
                )}
                {bib.citation}{' '}
                {bib.doi && (
                  <a
                    href={`https://doi.org/${bib.doi}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="g-text-primary-500 hover:g-underline g-underline-offset-2 g-break-all"
                  >
                    {bib.doi}
                  </a>
                )}
              </div>
              {bib.remarks && (
                <div className="g-mt-1 g-text-xs g-text-slate-500 g-italic">{bib.remarks}</div>
              )}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}

export default function BibliographyCard({ taxonInfo }: Props) {
  return (
    <ErrorBoundary type="BLOCK" errorMessage={<FormattedMessage id="taxon.errors.bibliography" />}>
      <BibliographyContent taxonInfo={taxonInfo} />
    </ErrorBoundary>
  );
}
