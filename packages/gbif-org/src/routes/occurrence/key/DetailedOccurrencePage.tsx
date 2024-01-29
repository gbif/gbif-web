import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { OccurrenceQuery, OccurrenceQueryVariables } from '@/gql/graphql';
import { DynamicLink } from '@/components/DynamicLink';
import { required } from '@/utils/required';
import { useLoaderData } from 'react-router-dom';
const Map = React.lazy(() => import('@/components/Map'));

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

export function loader({ params, graphql }: LoaderArgs) {
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

      <h1>{occurrence.scientificName}</h1>
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
    </>
  );
}

export function DetailedOccurrencePageLoading() {
  return <div>Loading...</div>;
}
