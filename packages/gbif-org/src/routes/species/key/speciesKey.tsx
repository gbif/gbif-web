import Properties, { Property, Term, Value } from '@/components/properties';
import { Button } from '@/components/ui/button';
import { DeprecatedTaxonQuery, DeprecatedTaxonQueryVariables } from '@/gql/graphql';
import { DynamicLink, LoaderArgs } from '@/reactRouterPlugins';
import { ArticleIntro } from '@/routes/resource/key/components/articleIntro';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { throwCriticalErrors } from '@/routes/rootErrorPage';
import { FormattedMessage } from 'react-intl';
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
      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer>
          <ArticlePreTitle clickable>
            <DynamicLink pageId="taxonSearch">Taxon</DynamicLink>
          </ArticlePreTitle>
          <ArticleTitle>{data.taxon?.scientificName ?? 'Unknown taxon'}</ArticleTitle>
          <ArticleIntro>
            <p className="g-text-red-500 g-text-base g-font-medium g-pb-2">
              <FormattedMessage
                id="taxon.deletedMessage"
                defaultMessage="This record has been deleted."
              />
            </p>
            <p className="g-text-base">
              <FormattedMessage
                id="taxon.deletedDescription"
                defaultMessage="This record has been deleted."
              />
            </p>
          </ArticleIntro>
        </ArticleTextContainer>
        <div className="g-py-8">
          <div className="g-bg-slate-100 g-p-4 md:g-p-8 g-w-full g-max-w-7xl g-m-auto g-overflow-auto">
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
          <div className="g-max-w-7xl g-m-auto g-mt-4">
            <Button asChild className="g-w-full">
              <DynamicLink
                pageId="taxonSearch"
                searchParams={{
                  q: data.taxon?.scientificName ?? '',
                }}
              >
                Go to taxon search
              </DynamicLink>
            </Button>
          </div>
        </div>
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
