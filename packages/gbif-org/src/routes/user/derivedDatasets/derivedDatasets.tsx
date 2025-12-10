import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { useUser } from '@/contexts/UserContext';
import { UserDerivedDatasetsQuery, UserDerivedDatasetsQueryVariables } from '@/gql/graphql';
import { useIntParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { DerivedDatasetResult } from './derivedDatasetResult';
import { Button } from '@/components/ui/button';

export function DerivedDatasets() {
  const [offset, setOffset] = useIntParam({
    key: 'offset',
    defaultValue: 0,
    hideDefault: true,
    preventScrollReset: false,
  });

  const { user } = useUser();
  const { data, load, loading } = useQuery<
    UserDerivedDatasetsQuery,
    UserDerivedDatasetsQueryVariables
  >(DERIVED_DATASETS_QUERY, {
    throwAllErrors: true,
    lazyLoad: true,
  });

  useEffect(() => {
    const username = user?.userName;
    if (!username || !user?.graphqlToken) {
      return;
    }
    load(
      {
        variables: {
          username,
          limit: 20,
          offset,
        },
      },
      { authorization: `Bearer ${user?.graphqlToken}` }
    );
  }, [offset, load, user?.graphqlToken, user?.userName]);

  if (loading || !data || !user)
    return (
      <PageContainer>
        <ArticleTextContainer>
          <CardListSkeleton />
        </ArticleTextContainer>
      </PageContainer>
    );

  const derivedDatasets = data?.userDerivedDatasets;

  return (
    <section>
      <div className="g-text-end">
        <Button asChild>
          <a href={`${import.meta.env.PUBLIC_TOOLS_GBIF_ORG}/derived-dataset/register`}>
            <FormattedMessage id="profile.createNew" defaultMessage="Create new" />
          </a>
        </Button>
      </div>
      {derivedDatasets?.count === 0 && (
        <>
          <NoRecords messageId="profile.noDerivedDatasets" />
        </>
      )}
      {derivedDatasets && derivedDatasets.count > 0 && (
        <>
          <CardHeader id="derivedDatasets">
            <CardTitle>
              <FormattedMessage
                id="counts.nDerivedDatasets"
                values={{ total: derivedDatasets.count }}
              />
            </CardTitle>
          </CardHeader>
          {derivedDatasets.results.map((derivedDataset) => (
            <DerivedDatasetResult key={derivedDataset.doi} derivedDataset={derivedDataset} />
          ))}

          {derivedDatasets.count > derivedDatasets.limit && (
            <PaginationFooter
              offset={derivedDatasets.offset}
              count={derivedDatasets.count}
              limit={derivedDatasets.limit}
              onChange={(x) => setOffset(x)}
            />
          )}
        </>
      )}
    </section>
  );
}

const DERIVED_DATASETS_QUERY = /* GraphQL */ `
  query UserDerivedDatasets($username: String!, $limit: Int!, $offset: Int!) {
    userDerivedDatasets(username: $username, limit: $limit, offset: $offset) {
      limit
      offset
      count
      endOfRecords
      results {
        ...DerivedDatasetResult
      }
    }
  }
`;
