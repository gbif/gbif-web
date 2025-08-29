import { NoRecords } from '@/components/noDataMessages';
import { PaginationFooter } from '@/components/pagination';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { CardHeader, CardTitle } from '@/components/ui/largeCard';
import { useUser } from '@/contexts/UserContext';
import { UserValidationsQuery, UserValidationsQueryVariables } from '@/gql/graphql';
import { useIntParam } from '@/hooks/useParam';
import useQuery from '@/hooks/useQuery';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useEffect } from 'react';
import { FormattedMessage } from 'react-intl';
import { ValidationResult } from './validationResult';

export function Validations() {
  const [offset, setOffset] = useIntParam({
    key: 'offset',
    defaultValue: 0,
    hideDefault: true,
    preventScrollReset: false,
  });

  const { user } = useUser();
  const { data, load, loading } = useQuery<UserValidationsQuery, UserValidationsQueryVariables>(
    VALIDATIONS_QUERY,
    {
      throwAllErrors: true,
      lazyLoad: true,
    }
  );

  useEffect(() => {
    const username = user?.userName; // This needs to be replaced with actual authenticated user
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
      { authorization: `Bearer ${user?.graphqlToken}` } // Use the GraphQL token from the user context);),
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

  const validations = data?.userValidations;

  return (
    <section>
      {validations?.count === 0 && (
        <>
          <NoRecords messageId="profile.noValidationReports" />
        </>
      )}
      {validations && validations.count > 0 && (
        <>
          <CardHeader id="validations">
            <CardTitle>
              <FormattedMessage
                id="counts.nValidationReports"
                values={{ total: validations.count }}
              />
            </CardTitle>
          </CardHeader>
          {validations.results.map((validation) => (
            <ValidationResult key={validation.key} validation={validation} />
          ))}

          {validations.count > validations.limit && (
            <PaginationFooter
              offset={validations.offset}
              count={validations.count}
              limit={validations.limit}
              onChange={(x) => setOffset(x)}
            />
          )}
        </>
      )}
    </section>
  );
}

const VALIDATIONS_QUERY = /* GraphQL */ `
  query UserValidations($limit: Int, $offset: Int) {
    userValidations(limit: $limit, offset: $offset) {
      limit
      offset
      count
      endOfRecords
      results {
        ...ValidationResult
      }
    }
  }
`;
