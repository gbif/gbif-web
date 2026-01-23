import { Card, CardContent, CardTitle } from '@/components/ui/smallCard';
import { Skeleton } from '@/components/ui/skeleton';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import useQuery from '@/hooks/useQuery';
import { cn } from '@/utils/shadcn';
import { useContext, useEffect } from 'react';
import { MdHelpOutline as HelpIcon } from 'react-icons/md';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { InstitutionKeyContext } from './institutionKeyPresentation';
import {
  InstitutionQualityStatsQuery,
  InstitutionQualityStatsQueryVariables,
  Predicate,
  PredicateType,
} from '@/gql/graphql';

interface InstitutionQualityProps {
  predicate: Predicate;
  className?: string;
}

export function InstitutionQuality({ predicate, className }: InstitutionQualityProps) {
  const { contentMetrics } = useContext(InstitutionKeyContext);
  const { data, error, loading, load } = useQuery<
    InstitutionQualityStatsQuery,
    InstitutionQualityStatsQueryVariables
  >(QUALITY_STATS, {
    lazyLoad: true,
  });

  const totalOccurrences = contentMetrics?.occurrenceSearch?.documents?.total ?? 0;
  const collections = contentMetrics?.institution?.collections ?? [];

  useEffect(() => {
    if (!predicate?.value) return;

    load({
      variables: {
        predicate: {
          type: PredicateType.And,
          predicates: [
            predicate,
            {
              type: PredicateType.IsNotNull,
              key: 'collectionKey',
            },
          ],
        },
        predicate5: {
          type: PredicateType.And,
          predicates: [
            predicate,
            {
              type: PredicateType.IsNotNull,
              key: 'eventDate',
            },
            {
              type: PredicateType.IsNotNull,
              key: 'recordedBy',
            },
            {
              type: PredicateType.IsNotNull,
              key: 'identifiedBy',
            },
            {
              type: PredicateType.Not,
              predicate: {
                type: PredicateType.In,
                key: 'issue',
                values: ['TAXON_MATCH_NONE'],
              },
            },
          ],
        },
        predicateCode: {
          type: PredicateType.And,
          predicates: [
            predicate,
            {
              type: PredicateType.IsNotNull,
              key: 'collectionCode',
            },
            {
              type: PredicateType.Not,
              predicate: {
                type: PredicateType.IsNotNull,
                key: 'collectionKey',
              },
            },
          ],
        },
      },
      queue: { name: 'dashboard' },
    });
  }, [predicate, load]);

  const collectionsWithDigitizedData = collections.filter(
    (x) => (x.occurrenceCount ?? 0) > 0
  ).length;
  const hasCollections = collections.length > 0;

  const isLoading = !contentMetrics || loading || !data;

  if (error) {
    return (
      <Card className={cn('g-p-4', className)}>
        <CardContent>
          <div className="g-text-red-500">
            <FormattedMessage id="phrases.failedToLoadData" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={cn(className)}>
      <CardContent topPadding>
        {isLoading ? (
          <div>
            <Skeleton className="g-h-6 g-w-48 g-mb-4" />
            <Skeleton className="g-h-4 g-w-full g-mb-3" />
            <Skeleton className="g-h-4 g-w-full g-mb-3" />
            <Skeleton className="g-h-4 g-w-full" />
          </div>
        ) : (
          <>
            <CardTitle className="g-mb-4">
              <FormattedMessage
                id="counts.nSpecimensInGbif"
                defaultMessage="{total, number} specimen records in GBIF"
                values={{ total: totalOccurrences }}
              />
            </CardTitle>
            <div>
              <ul className="g-p-0 g-m-0 g-list-none">
                {hasCollections && collectionsWithDigitizedData > 0 && (
                  <li className="g-mb-3">
                    <ProgressItem
                      value={collectionsWithDigitizedData}
                      max={collections.length}
                      title={
                        <FormattedMessage
                          id="grscicoll.collectionsWithDataInGbif"
                          defaultMessage="Collections with data in GBIF"
                        />
                      }
                    />
                  </li>
                )}
                {(data?.big5?.documents?.total ?? 0) > 0 && (
                  <li className="g-mb-3">
                    <ProgressItem
                      value={data?.big5?.documents?.total ?? 0}
                      max={totalOccurrences}
                      title={
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <span className="g-cursor-help">
                                <FormattedMessage
                                  id="grscicoll.theBigFive"
                                  defaultMessage="The big five"
                                />{' '}
                                <HelpIcon className="g-inline g-align-middle g-text-slate-400" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <FormattedMessage
                                id="grscicoll.theBigFiveTooltip"
                                defaultMessage="What, where, when and who collected and identified are all filled."
                              />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      }
                    />
                  </li>
                )}
                {(data?.withCollection?.documents?.total ?? 0) > 0 && (
                  <li className="g-mb-3">
                    <ProgressItem
                      value={data?.withCollection?.documents?.total ?? 0}
                      max={totalOccurrences}
                      title={
                        <FormattedMessage
                          id="grscicoll.inACollection"
                          defaultMessage="In a collection"
                        />
                      }
                    />
                  </li>
                )}
                {(data?.withCode?.documents?.total ?? 0) > 0 && (
                  <li className="g-mb-3">
                    <ProgressItem
                      value={data?.withCode?.documents?.total ?? 0}
                      max={totalOccurrences}
                      title={
                        <TooltipProvider>
                          <Tooltip delayDuration={0}>
                            <TooltipTrigger asChild>
                              <span className="g-cursor-help">
                                <FormattedMessage
                                  id="grscicoll.unmatchedCollectionCodes"
                                  defaultMessage="Unmatched collection codes"
                                />{' '}
                                <HelpIcon className="g-inline g-align-middle g-text-slate-400" />
                              </span>
                            </TooltipTrigger>
                            <TooltipContent>
                              <FormattedMessage
                                id="grscicoll.unmatchedCollectionCodesTooltip"
                                defaultMessage="Records that have a collection code, but could not be matched to any collections."
                              />
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      }
                    />
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

function ProgressItem({
  value,
  max,
  title,
  color = 'g-bg-primary',
}: {
  value: number;
  max: number;
  title: React.ReactNode;
  color?: string;
}) {
  let percent = Math.round((value / max) * 1000) / 10; // Round to 1 decimal place
  if (percent === 0 && value !== 0) percent = 0.1; // Should not round down to 0% if the value is not exactly 0
  if (percent === 100 && value !== max) percent = 99.9; // Should not round up to 100% if the value is not exactly equal to the max

  return (
    <div>
      <div className="g-flex g-justify-between g-items-center g-mb-1 g-text-sm">
        <div>{title}</div>
        <span className="g-text-slate-600">
          {isNaN(percent) ? '—' : <FormattedNumber value={percent} maximumFractionDigits={1} />}
          {!isNaN(percent) && '%'}
        </span>
      </div>
      <div className="g-h-2 g-bg-slate-200 g-rounded g-overflow-hidden">
        <div
          className={cn('g-h-full g-rounded g-opacity-60', color)}
          style={{ width: `${isNaN(percent) ? 0 : percent}%` }}
        />
      </div>
    </div>
  );
}

const QUALITY_STATS = /* GraphQL */ `
  query InstitutionQualityStats(
    $predicate: Predicate
    $predicate5: Predicate
    $predicateCode: Predicate
  ) {
    withCollection: occurrenceSearch(predicate: $predicate) {
      documents(size: 0) {
        total
      }
      cardinality {
        collectionKey
      }
    }
    withCode: occurrenceSearch(predicate: $predicateCode) {
      documents(size: 0) {
        total
      }
    }
    big5: occurrenceSearch(predicate: $predicate5) {
      documents(size: 0) {
        total
      }
    }
  }
`;
