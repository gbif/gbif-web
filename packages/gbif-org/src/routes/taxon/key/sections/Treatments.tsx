import { Table } from '@/components/dashboard/shared';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/largeCard';
import { TaxonKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { useState } from 'react';
import { MdLink } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Paging } from '@/components/paging';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { ColFeedback } from './ColFeedback';
import { DatasetLabel } from '@/components/filters/displayNames';

const DEFAULT_LIMIT = 3;

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
  if (!taxonInfo) return null;

  return (
    <Card className="g-mb-4" id="treatments">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="taxon.treatments" />
        </CardTitle>
        <CardDescription>
          <ColFeedback
            taxonId={taxonInfo?.taxonID}
            datasetKey={taxonInfo?.datasetKey}
            checklistbankURL={taxonInfo.checklistbankURL}
          />
        </CardDescription>
      </CardHeader>
      <CardContent className="g-overflow-x-auto">
        <div className="g-text-sm g-text-slate-500 g-mb-1">
          <>
            <FormattedMessage
              id="counts.nResults"
              values={{ total: taxonInfo?.treatments?.length || 0 }}
            />
            {(taxonInfo?.treatments?.length ?? 0) > limit && (
              <Button
                variant="link"
                onClick={() => {
                  setLimit(taxonInfo?.treatments?.length || 0);
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
              {taxonInfo?.treatments?.slice(offset, offset + limit).map((treatment, i) => (
                <tr key={i}>
                  <td>
                    <div className="g-mt-1 g-mb-1">
                      <div className="g-flex g-text-sm g-text-slate-500 g-mb-1">
                        <div className="g-flex-auto" />
                        {/* {treatment?.references && (
                          <a href={treatment?.references} target="_blank" rel="noreferrer">
                            <MdLink /> {treatment?.dataset?.publishingOrganizationTitle}
                          </a>
                        )} */}
                      </div>
                      <div className="[&_a]:g-underline">
                        {treatment?.datasetKey && (
                          <div className="">
                            <DatasetLabel id={treatment.datasetKey} />
                          </div>
                        )}
                      </div>
                      <div className="g-flex g-items-center g-text-sm g-text-slate-500 g-mt-1">
                        {treatment?.references && (
                          <a
                            href={treatment?.references}
                            target="_blank"
                            rel="noreferrer"
                            className="g-me-2 g-inline-flex g-items-center g-gap-1 g-bg-slate-100 hover:g-bg-slate-200 g-text-slate-600 g-text-xs g-py-0.5 g-px-2 g-rounded-full g-no-underline g-border"
                          >
                            <MdLink /> Source
                          </a>
                        )}
                        {treatment?.datasetKey && (
                          <DynamicLink
                            pageId="datasetKey"
                            variables={{ key: treatment.datasetKey }}
                            className="g-me-2 g-inline-flex g-items-center g-gap-1 g-bg-slate-100 hover:g-bg-slate-200 g-text-slate-600 g-text-xs g-py-0.5 g-px-2 g-rounded-full g-no-underline g-border"
                          >
                            <MdLink /> <FormattedMessage id={`dataset.dataset`} />
                          </DynamicLink>
                        )}
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
            isLastPage={offset + limit >= (taxonInfo?.treatments?.length || 0)}
          />
        </div>
      </CardContent>
    </Card>
  );
};
