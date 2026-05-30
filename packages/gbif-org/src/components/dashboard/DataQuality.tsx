import { useChecklistKey } from '@/hooks/useChecklistKey';
import useQuery from '@/hooks/useQuery';
import { removeEmptyPredicates } from '@/utils/removeEmptyPredicates';
import { FormattedMessage } from 'react-intl';
import { useDeepCompareEffectNoCheck as useDeepCompareEffect } from 'use-deep-compare-effect';
import { Card, CardContent, CardDescription, CardTitle } from '../ui/smallCard';
import ChartClickWrapper from './charts/ChartClickWrapper';
import { BarItem, CardHeader, FormattedNumber, Table } from './shared';

type DataQualityKey =
  | 'hasSequence'
  | 'hasCollector'
  | 'hasMedia'
  | 'hasCoordinates'
  | 'hasYear'
  | 'rank';

type Total = { documents?: { total?: number } };

type DataQualityResponse = {
  occurrenceSearch?: Total;
  rank?: Total;
  hasCoordinates?: Total;
  hasMedia?: Total;
  hasCollector?: Total;
  hasYear?: Total;
  hasSequence?: Total;
};

type RedirectFilter = Record<string, unknown[]>;

type DataQualityProps = {
  predicate?: unknown;
  q?: string;
  checklistKey?: string;
  optional?: DataQualityKey[];
  interactive?: boolean;
  detailsRoute?: string;
  [key: string]: unknown;
};

type DataQualityMainProps = DataQualityProps & {
  handleRedirect?: (args: { filter?: RedirectFilter }) => void;
};

export function DataQuality(props: DataQualityProps) {
  return (
    <ChartClickWrapper {...props}>
      <DataQualityMain />
    </ChartClickWrapper>
  );
}

function DataQualityMain({
  predicate,
  q,
  checklistKey,
  optional = [],
  interactive,
  handleRedirect,
  detailsRoute: _detailsRoute,
  ...props
}: DataQualityMainProps) {
  const defaultChecklistKey = useChecklistKey();
  const { data, error, loading, load } = useQuery<DataQualityResponse, Record<string, unknown>>(
    OCCURRENCE_STATS,
    { lazyLoad: true }
  );

  useDeepCompareEffect(() => {
    load({
      variables: {
        predicate,
        q,
        hasSpeciesRank: removeEmptyPredicates({
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'isNotNull',
              key: 'speciesKey',
              checklistKey: checklistKey ?? defaultChecklistKey,
            },
          ],
        }),
        hasCoordinates: removeEmptyPredicates({
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'equals',
              key: 'hasCoordinate',
              value: true,
            },
          ],
        }),
        hasMedia: removeEmptyPredicates({
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'isNotNull',
              key: 'mediaType',
            },
          ],
        }),
        hasCollector: removeEmptyPredicates({
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'isNotNull',
              key: 'recordedBy',
            },
          ],
        }),
        hasYear: removeEmptyPredicates({
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'isNotNull',
              key: 'year',
            },
          ],
        }),
        hasSequence: removeEmptyPredicates({
          type: 'and',
          predicates: [
            predicate,
            {
              type: 'equals',
              key: 'isSequenced',
              value: true,
            },
          ],
        }),
      },
      queue: { name: 'dashboard' },
    });
  }, [predicate, q, load, checklistKey, defaultChecklistKey]);

  const noData = !data || loading;
  const summary = data?.occurrenceSearch;
  const total = summary?.documents?.total ?? 0;

  const hideHasSequence =
    (data?.hasSequence?.documents?.total ?? 0) === 0 && optional.includes('hasSequence');
  const hideHasCollector =
    (data?.hasCollector?.documents?.total ?? 0) === 0 && optional.includes('hasCollector');
  const hideHasMedia =
    (data?.hasMedia?.documents?.total ?? 0) === 0 && optional.includes('hasMedia');

  const percentOf = (value: number | undefined) => (total > 0 ? (100 * (value ?? 0)) / total : 0);

  return (
    <Card {...props} loading={noData} error={!!error}>
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="dashboard.richness" defaultMessage="Data richness" />
        </CardTitle>
        <CardDescription>
          <FormattedMessage
            id="dashboard.numberOfOccurrences"
            defaultMessage="Number of occurrences"
          />
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div>
          <Table removeBorder>
            <tbody>
              <tr>
                <td>
                  <BarItem percent={percentOf(data?.rank?.documents?.total)}>
                    <ClickableLabel
                      filter={{
                        predicate: [
                          {
                            type: 'isNotNull',
                            parameter: 'SPECIES_KEY',
                            checklistKey: checklistKey ?? defaultChecklistKey,
                          },
                        ],
                      }}
                      interactive={interactive}
                      handleRedirect={handleRedirect}
                    >
                      <FormattedMessage
                        id="dashboard.identifiedToSpecies"
                        defaultMessage="Identified to species"
                      />
                    </ClickableLabel>
                  </BarItem>
                </td>
                <td className="g-text-end">
                  <FormattedNumber value={data?.rank?.documents?.total} />
                </td>
              </tr>
              <tr>
                <td>
                  <BarItem percent={percentOf(data?.hasCoordinates?.documents?.total)}>
                    <ClickableLabel
                      filter={{ hasCoordinate: [true] }}
                      interactive={interactive}
                      handleRedirect={handleRedirect}
                    >
                      <FormattedMessage id="dashboard.withCoordinates" />
                    </ClickableLabel>
                  </BarItem>
                </td>
                <td className="g-text-end">
                  <FormattedNumber value={data?.hasCoordinates?.documents?.total} />
                </td>
              </tr>
              <tr>
                <td>
                  <BarItem percent={percentOf(data?.hasYear?.documents?.total)}>
                    <ClickableLabel
                      filter={{ year: [{ type: 'isNotNull' }] }}
                      interactive={interactive}
                      handleRedirect={handleRedirect}
                    >
                      <FormattedMessage id="dashboard.withYear" />
                    </ClickableLabel>
                  </BarItem>
                </td>
                <td className="g-text-end">
                  <FormattedNumber value={data?.hasYear?.documents?.total} />
                </td>
              </tr>
              {!hideHasCollector && (
                <tr>
                  <td>
                    <BarItem percent={percentOf(data?.hasCollector?.documents?.total)}>
                      <ClickableLabel
                        filter={{ recordedBy: [{ type: 'isNotNull' }] }}
                        interactive={interactive}
                        handleRedirect={handleRedirect}
                      >
                        <FormattedMessage id="dashboard.withCollector" />
                      </ClickableLabel>
                    </BarItem>
                  </td>
                  <td className="g-text-end">
                    <FormattedNumber value={data?.hasCollector?.documents?.total} />
                  </td>
                </tr>
              )}
              {!hideHasMedia && (
                <tr>
                  <td>
                    <BarItem percent={percentOf(data?.hasMedia?.documents?.total)}>
                      <ClickableLabel
                        filter={{ mediaType: [{ type: 'isNotNull' }] }}
                        interactive={interactive}
                        handleRedirect={handleRedirect}
                      >
                        <FormattedMessage id="dashboard.withMedia" />
                      </ClickableLabel>
                    </BarItem>
                  </td>
                  <td className="g-text-end">
                    <FormattedNumber value={data?.hasMedia?.documents?.total} />
                  </td>
                </tr>
              )}
              {!hideHasSequence && (
                <tr>
                  <td>
                    <BarItem percent={percentOf(data?.hasSequence?.documents?.total)}>
                      <ClickableLabel
                        filter={{ isSequenced: [true] }}
                        interactive={interactive}
                        handleRedirect={handleRedirect}
                      >
                        <FormattedMessage id="dashboard.withSequence" />
                      </ClickableLabel>
                    </BarItem>
                  </td>
                  <td className="g-text-end">
                    <FormattedNumber value={data?.hasSequence?.documents?.total} />
                  </td>
                </tr>
              )}
            </tbody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}

type ClickableLabelProps = {
  filter: RedirectFilter;
  interactive?: boolean;
  handleRedirect?: (args: { filter?: RedirectFilter }) => void;
  children: React.ReactNode;
};

function ClickableLabel({ filter, interactive, handleRedirect, children }: ClickableLabelProps) {
  if (!interactive || !handleRedirect) return <>{children}</>;
  return (
    <button
      type="button"
      onClick={() => {
        handleRedirect({ filter });
      }}
      className="g-text-start hover:g-underline"
    >
      {children}
    </button>
  );
}

const OCCURRENCE_STATS = `
query summary($q: String, $predicate: Predicate, $hasSpeciesRank: Predicate, $hasCoordinates: Predicate, $hasMedia: Predicate, $hasCollector: Predicate, $hasYear: Predicate, $hasSequence: Predicate){
  occurrenceSearch(q: $q, predicate: $predicate) {
    documents(size: 0) {
      total
    }
  }
  rank: occurrenceSearch(q: $q, predicate: $hasSpeciesRank) {
    documents(size: 0) {
      total
    }
  }
  hasCoordinates: occurrenceSearch(q: $q, predicate: $hasCoordinates) {
    documents(size: 0) {
      total
    }
  }
  hasMedia: occurrenceSearch(q: $q, predicate: $hasMedia) {
    documents(size: 0) {
      total
    }
  }
  hasCollector: occurrenceSearch(q: $q, predicate: $hasCollector) {
    documents(size: 0) {
      total
    }
  }
  hasYear: occurrenceSearch(q: $q, predicate: $hasYear) {
    documents(size: 0) {
      total
    }
  }
  hasSequence: occurrenceSearch(q: $q, predicate: $hasSequence) {
    documents(size: 0) {
      total
    }
  }
}
`;
