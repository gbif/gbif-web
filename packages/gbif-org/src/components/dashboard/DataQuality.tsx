import { useChecklistKey } from '@/hooks/useChecklistKey';
import useQuery from '@/hooks/useQuery';
import { removeEmptyPredicates } from '@/utils/removeEmptyPredicates';
import { FormattedMessage } from 'react-intl';
import { useDeepCompareEffectNoCheck as useDeepCompareEffect } from 'use-deep-compare-effect';
import { Card, CardContent, CardDescription, CardTitle } from '../ui/smallCard';
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

type DataQualityProps = {
  predicate?: unknown;
  q?: string;
  checklistKey?: string;
  optional?: DataQualityKey[];
  [key: string]: unknown;
};

export function DataQuality({
  predicate,
  q,
  checklistKey,
  optional = [],
  ...props
}: DataQualityProps) {
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

  const percentOf = (value: number | undefined) =>
    total > 0 ? (100 * (value ?? 0)) / total : 0;

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
                    <FormattedMessage
                      id="dashboard.identifiedToSpecies"
                      defaultMessage="Identified to species"
                    />
                  </BarItem>
                </td>
                <td className="g-text-end">
                  <FormattedNumber value={data?.rank?.documents?.total} />
                </td>
              </tr>
              <tr>
                <td>
                  <BarItem percent={percentOf(data?.hasCoordinates?.documents?.total)}>
                    <FormattedMessage id="dashboard.withCoordinates" />
                  </BarItem>
                </td>
                <td className="g-text-end">
                  <FormattedNumber value={data?.hasCoordinates?.documents?.total} />
                </td>
              </tr>
              <tr>
                <td>
                  <BarItem percent={percentOf(data?.hasYear?.documents?.total)}>
                    <FormattedMessage id="dashboard.withYear" />
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
                      <FormattedMessage id="dashboard.withCollector" />
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
                      <FormattedMessage id="dashboard.withMedia" />
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
                      <FormattedMessage id="dashboard.withSequence" />
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
