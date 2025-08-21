import { Skeleton } from '@/components/ui/skeleton';
import {
  OrphanCollectionCodesForInstitutionQuery,
  OrphanCollectionCodesForInstitutionQueryVariables,
  PredicateType,
} from '@/gql/graphql';
import useQuery from '@/hooks/useQuery';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';

export default function OrphanedCollectionCodes({ institutionKey }: { institutionKey: string }) {
  const { data, error, loading, load } = useQuery<
    OrphanCollectionCodesForInstitutionQuery,
    OrphanCollectionCodesForInstitutionQueryVariables
  >(OCCURRENCE_STATS, { lazyLoad: true, notifyOnErrors: true });

  useEffect(() => {
    load({
      variables: {
        predicate: {
          type: PredicateType.And,
          predicates: [
            {
              type: PredicateType.Equals,
              key: 'institutionKey',
              value: institutionKey,
            },
            {
              type: PredicateType.Not,
              predicate: {
                type: PredicateType.IsNotNull,
                key: 'collectionKey',
              },
            },
            {
              type: PredicateType.IsNotNull,
              key: 'collectionCode',
            },
          ],
        },
      },
    });
  }, [institutionKey, load]);

  if (!data && loading) return <Skeleton style={{ margin: '12px 0' }} className="g-w-48" />;
  if (!data?.orphaned || data?.orphaned?.cardinality?.collectionCode === 0 || error || loading)
    return null;

  return (
    <div className="g-py-12 g-text-slate-500">
      <div className="g-text-orange-500 g-font-semibold g-mb-4">
        <FormattedMessage id="institution.unknownCollectionCodesForInstitution" />
      </div>
      <ul style={{ fontFamily: 'monospace' }}>
        {data?.orphaned?.facet?.collectionCode &&
          data?.orphaned?.facet?.collectionCode.map((code) => (
            <li key={code.key}>
              <span className="g-font-semibold">{code.key}:</span>
              <span className="g-mx-2 g-text-slate-500">
                <FormattedMessage id="counts.nRecords" values={{ total: code.count }} />
              </span>
            </li>
          ))}
      </ul>
    </div>
  );
}

const OCCURRENCE_STATS = /* GraphQL */ `
  query orphanCollectionCodesForInstitution($predicate: Predicate) {
    orphaned: occurrenceSearch(predicate: $predicate) {
      cardinality {
        collectionCode
      }
      facet {
        collectionCode(size: 10) {
          key
          count
        }
      }
    }
  }
`;
