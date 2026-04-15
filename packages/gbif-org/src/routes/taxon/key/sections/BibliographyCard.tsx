import { Table } from '@/components/dashboard/shared';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CardDescription } from '@/components/ui/smallCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { cn } from '@/utils/shadcn';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Paging } from '@/components/paging';
import { ColFeedback } from './ColFeedback';
import { InfoPill } from './Synonyms';

const DEFAULT_LIMIT = 10;

type Props = {
  taxonInfo: TaxonKeyQuery['taxonInfo'];
  className?: string;
};

function BibliographyContent({ taxonInfo, className }: Props) {
  const [limit, setLimit] = useState(DEFAULT_LIMIT);
  const [offset, setOffset] = useState(0);
  const bibliography = taxonInfo?.bibliography ?? [];

  return (
    <Card className={cn('g-mb-4', className)} id="bibliography">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.bibliography" />
        </CardTitle>
        <CardDescription>
          <ColFeedback />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="g-text-sm g-text-slate-500 g-mb-1">
          <FormattedMessage id="counts.nResults" values={{ total: bibliography.length }} />
          {bibliography.length > limit && (
            <Button
              variant="link"
              onClick={() => {
                setLimit(bibliography.length);
                setOffset(0);
              }}
            >
              <FormattedMessage id="taxon.showAll" />
            </Button>
          )}
          {limit > DEFAULT_LIMIT && (
            <Button
              variant="link"
              onClick={() => {
                setLimit(DEFAULT_LIMIT);
                setOffset(0);
              }}
            >
              <FormattedMessage id="taxon.showLess" />
            </Button>
          )}
        </div>
        <div style={{ overflow: 'auto' }}>
          <Table removeBorder={false}>
            <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
              {bibliography.slice(offset, offset + limit).map((bib) => (
                <tr key={bib.referenceID}>
                  <td>
                    <div className="g-text-slate-800">
                      <span className="g-me-2">
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
                      </span>
                      {bib.isNamePublishedIn && (
                        <InfoPill>
                          <FormattedMessage
                            id="taxon.publishedIn"
                            defaultMessage="Name published in"
                          />
                        </InfoPill>
                      )}
                    </div>
                    {bib.remarks && (
                      <div className="g-mt-1 g-text-xs g-text-slate-500 g-italic">
                        {bib.remarks}
                      </div>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paging
            next={() => setOffset(offset + limit)}
            prev={() => setOffset(offset - limit)}
            isFirstPage={offset === 0}
            isLastPage={offset + limit >= bibliography.length}
          />
        </div>
      </CardContent>
    </Card>
  );
}

export default function BibliographyCard({ taxonInfo, className }: Props) {
  return (
    <ErrorBoundary type="BLOCK" errorMessage={<FormattedMessage id="taxon.errors.bibliography" />}>
      <BibliographyContent taxonInfo={taxonInfo} className={className} />
    </ErrorBoundary>
  );
}
