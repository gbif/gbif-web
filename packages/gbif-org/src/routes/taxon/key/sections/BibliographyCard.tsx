import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HyperText } from '@/components/hyperText';
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
          {taxonInfo?.taxon?.namePublishedIn && (
            <div className="g-mb-1">
              <FormattedMessage id="taxon.publishedIn" defaultMessage="Name published in" />
              {': '}
              <HyperText
                className="prose-links g-inline [&_p]:g-inline"
                text={taxonInfo.taxon.namePublishedIn}
              />
            </div>
          )}
          <ColFeedback />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ul>
          {taxonInfo?.bibliography.map((bib) => (
            <li key={bib.referenceID} className="g-mb-2">
              <div>
                {bib.citation}{' '}
                {bib.doi && (
                  <a href={`https://doi.org/${bib.doi}`} target="_blank" rel="noopener noreferrer">
                    {bib.doi}
                  </a>
                )}
              </div>
              {bib.remarks && <div className="g-text-slate-600">{bib.remarks}</div>}
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
