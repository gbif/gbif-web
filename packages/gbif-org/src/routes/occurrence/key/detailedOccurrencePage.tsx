import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { OccurrenceQuery, OccurrenceQueryVariables } from '@/gql/graphql';
import { DynamicLink } from '@/components/dynamicLink';
import { required } from '@/utils/required';
import { useLoaderData } from 'react-router-dom';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { FormattedDate, FormattedMessage } from 'react-intl';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { defaultDateFormatProps } from '@/components/headerComponents';
const Map = React.lazy(() => import('@/components/map'));

const OCCURRENCE_QUERY = /* GraphQL */ `
  query Occurrence($key: ID!) {
    occurrence(key: $key) {
      eventDate
      scientificName
      coordinates
      dataset {
        key
        title
      }
    }
  }
`;

export function detailedOccurrencePageLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<OccurrenceQuery, OccurrenceQueryVariables>(OCCURRENCE_QUERY, { key });
}

export function DetailedOccurrencePage() {
  const { data } = useLoaderData() as { data: OccurrenceQuery };

  if (data.occurrence == null) throw new Error('404');
  const occurrence = data.occurrence;

  return (
    <>
      <Helmet>
        <title>{occurrence.scientificName}</title>
      </Helmet>

      <ArticleContainer className="pb-0">
        <ArticleTextContainer className="max-w-screen-xl">
          <ArticleTitle
            dangerouslySetTitle={{ __html: occurrence.scientificName || 'No title provided' }}
          ></ArticleTitle>
        </ArticleTextContainer>
        <ArticleTextContainer className="max-w-screen-xl">
          {occurrence.coordinates && (
            <React.Suspense fallback={<div>Loading map...</div>}>
              <Map coordinates={occurrence.coordinates} />
            </React.Suspense>
          )}

          {occurrence.dataset && (
            <div>
              <p className="font-bold">Dataset: </p>
              <h2>
                <DynamicLink to={`/dataset/${occurrence.dataset.key}`}>
                  {occurrence.dataset.title}
                </DynamicLink>
              </h2>
            </div>
          )}
        </ArticleTextContainer>
      </ArticleContainer>
    </>
  );
}

export function DetailedOccurrencePageSkeleton() {
  return <div>Loading...</div>;
}
