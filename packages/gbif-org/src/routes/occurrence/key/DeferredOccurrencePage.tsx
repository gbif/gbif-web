import { MyLink } from '@/components/MyLink';
import { OccurrenceQuery, OccurrenceQueryVariables } from '@/gql/graphql';
import { LoaderArgs } from '@/types';
import { createGraphQLHelpers } from '@/utils/createGraphQLHelpers';
import React from 'react';
import { Helmet } from 'react-helmet-async';
import { Await, defer, useLoaderData } from 'react-router-dom';
const Map = React.lazy(() => import('@/components/Map'));

const { load } = createGraphQLHelpers<OccurrenceQuery, OccurrenceQueryVariables>(/* GraphQL */ `
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
`);

export function DeferredOcurrencePage() {
  const data = useLoaderData() as any;

  return (
    <div>
      <React.Suspense fallback={<p>Loading occurrence</p>}>
        <Await resolve={data.occurrence} errorElement={<p>Error loading occurrence</p>}>
          {(occurrence: NonNullable<OccurrenceQuery['occurrence']>) => (
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
                    <MyLink to={`/dataset/${occurrence.dataset.key}`}>
                      {occurrence.dataset.title}
                    </MyLink>
                  </h2>
                </div>
              )}
            </>
          )}
        </Await>
      </React.Suspense>
    </div>
  );
}

export async function deferredOccurrenceLoader({ params, request, config }: LoaderArgs) {
  const key = params.key;
  if (key == null) throw new Error('No key provided in the url');

  return defer({
    occurrence: load({
      request,
      endpoint: config.graphqlEndpoint,
      variables: {
        key,
      },
    })
      .then((response) => response.json())
      .then((result) => {
        if (result.data.occurrence == null) throw new Error('404');
        return result.data.occurrence;
      }),
  });
}
