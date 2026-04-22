import Properties, { Property, Term, Value } from '@/components/properties';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/largeCard';
import { DeprecatedTaxonQuery, DeprecatedTaxonQueryVariables } from '@/gql/graphql';
import { DynamicLink, LoaderArgs } from '@/reactRouterPlugins';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { redirect, useLoaderData } from 'react-router-dom';

const primaryChecklist = import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY;

export async function speciesLoader({ params, graphql, locale }: LoaderArgs) {
  const key = params.key as string;
  const response = await graphql.query<DeprecatedTaxonQuery, DeprecatedTaxonQueryVariables>(
    SPECIES_QUERY,
    {
      key,
      oldDatasetKey: import.meta.env.PUBLIC_CLASSIC_BACKBONE_KEY,
      newDatasetKey: primaryChecklist,
    }
  );

  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['taxon'],
    errors,
    requiredObjects: [data?.taxon],
  });

  const newTaxonID = data?.taxon?.related?.[0]?.taxonID;
  if (newTaxonID) {
    return redirect(`${locale.gbifOrgLocalePrefix}/taxon/${newTaxonID}`);
  }

  return { errors, data };
}

export function SpeciesKey() {
  const { data } = useLoaderData() as { data: DeprecatedTaxonQuery };

  return (
    <article>
      <PageContainer topPadded hasDataHeader className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-md">
          <Card>
            <CardHeader>
              <CardTitle>This page no longer exists</CardTitle>
              <CardDescription>
                After 25 years we have retired the GBIF backbone taxonomy and replaced it with a new
                checklist. This taxon do not have a match in the new checklist and hence cannot be
                redirected
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="g-bg-gray-50 g-p-4 g-rounded g-border g-border-gray-200"
                style={{ fontFamily: 'monospace' }}
              >
                <Properties>
                  <Property labelId="Scientific name" value={data.taxon?.scientificName} />
                  <Property labelId="status" value={data.taxon?.taxonomicStatus} />
                  <Property labelId="rank" value={data.taxon?.taxonRank} />
                  {(data.taxon?.parentTree?.length ?? 0) > 0 && (
                    <>
                      <Term>Classification</Term>
                      <Value>
                        <Properties>
                          {data.taxon?.parentTree?.map((parent) => (
                            <Property
                              key={parent.taxonID}
                              labelId={`${parent.taxonRank}:`}
                              value={parent.scientificName}
                            />
                          ))}
                        </Properties>
                      </Value>
                    </>
                  )}
                </Properties>
              </div>
              <Button asChild className="g-mt-4 g-w-full">
                <DynamicLink
                  pageId="taxonSearch"
                  searchParams={{
                    q: data.taxon?.scientificName ?? '',
                  }}
                >
                  Go to taxon search
                </DynamicLink>
              </Button>
            </CardContent>
          </Card>
        </ArticleTextContainer>
      </PageContainer>
    </article>
  );
}

const SPECIES_QUERY = /* GraphQL */ `
  query DeprecatedTaxon($key: ID!, $oldDatasetKey: ID!, $newDatasetKey: ID!) {
    taxon(datasetKey: $oldDatasetKey, key: $key) {
      taxonID
      scientificName
      taxonRank
      taxonomicStatus
      parentTree {
        taxonID
        scientificName
        taxonRank
      }
      related(datasetKey: [$newDatasetKey]) {
        taxonID
        scientificName
        datasetKey
      }
    }
  }
`;
