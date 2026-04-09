import { Table } from '@/components/dashboard/shared';
import { HyperText } from '@/components/hyperText';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { useState } from 'react';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Paging } from './VernacularNameTable';
import { ErrorBoundary } from '@/components/ErrorBoundary';

const DEFAULT_LIMIT = 10;

export default function TreatmentsCard({ taxonInfo }: { taxonInfo: TaxonKeyQuery['taxonInfo'] }) {
  return (
    <ErrorBoundary type="BLOCK" errorMessage={<FormattedMessage id="taxon.errors.treatments" />}>
      <Treatments taxonInfo={taxonInfo} />
    </ErrorBoundary>
  );
}

const Treatments = ({ taxonInfo }: { taxonInfo: TaxonKeyQuery['taxonInfo'] }) => {
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(DEFAULT_LIMIT);

  return (
    <Card className="g-mb-4" id="treatments">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.treatments" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="g-text-sm g-text-slate-500 g-mb-1">
          <>
            <FormattedMessage
              id="counts.nResults"
              values={{ total: taxonInfo?.taxon?.treatments?.length || 0 }}
            />
            {(taxonInfo?.taxon?.treatments?.length ?? 0) > limit && (
              <Button
                variant="link"
                onClick={() => {
                  setLimit(taxonInfo?.taxon?.treatments?.length || 0);
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
          </>
        </div>
        <div style={{ overflow: 'auto' }}>
          <Table removeBorder={false}>
            <tbody className="[&_td]:g-align-baseline [&_th]:g-text-sm [&_th]:g-font-normal">
              {taxonInfo?.taxon?.treatments?.slice(offset, offset + limit).map((treatment, i) => (
                <tr key={i}>
                  <td>
                    <div className="g-mt-1 g-mb-1">
                      <div className="g-flex g-text-sm g-text-slate-500 g-mb-1">
                        <div className="g-flex-auto" />
                        <a href={treatment?.link} target="_blank" rel="noreferrer">
                          <MdLink /> {treatment?.dataset?.publishingOrganizationTitle}
                        </a>
                      </div>
                      <HyperText text={treatment?.dataset?.citation?.text} />
                      <div className="g-text-sm g-text-slate-500 g-mt-1">
                        <FormattedMessage id={`taxon.source`} />:{' '}
                        <DynamicLink pageId="datasetKey" variables={{ key: treatment?.datasetKey }}>
                          {treatment?.dataset?.title}
                        </DynamicLink>
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <Paging
            next={() => setOffset(offset + limit)}
            prev={() => setOffset(offset - limit)}
            isFirstPage={offset === 0}
            isLastPage={offset + limit >= (taxonInfo?.taxon?.treatments?.length || 0)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
