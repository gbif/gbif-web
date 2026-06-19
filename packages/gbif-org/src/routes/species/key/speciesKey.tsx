import Properties, { Property, Term, Value } from '@/components/properties';
import { Button } from '@/components/ui/button';
import { NotFoundLoaderResponse } from '@/errors';
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

export async function speciesLoader({ params, graphql, locale, config }: LoaderArgs) {
  const key = params.key as string;
  // if not a number just throw a 404
  if (isNaN(Number(key))) {
    throw new NotFoundLoaderResponse();
  }
  const response = await graphql.query<DeprecatedTaxonQuery, DeprecatedTaxonQueryVariables>(
    SPECIES_QUERY,
    {
      key,
      oldDatasetKey: import.meta.env.PUBLIC_CLASSIC_BACKBONE_KEY,
      newDatasetKey: config.defaultChecklistKey,
    }
  );

  const { errors, data } = await response.json();
  throwCriticalErrors({
    path404: ['speciesKey'],
    errors,
    requiredObjects: [],
  });
  debugger;

  // if backbone key we can sometimes redirect to new CoL page
  const newTaxonID = data?.speciesKey?.taxon?.related?.[0]?.taxonID;
  if (newTaxonID) {
    return redirect(`${locale.gbifOrgLocalePrefix}/taxon/${newTaxonID}`);
  }
  const taxonId = data.speciesKey?.taxonID;
  const datasetKey = data.speciesKey?.datasetKey;

  if (!taxonId || !datasetKey) {
    throw new NotFoundLoaderResponse();
  }

  // for species keys that refer to CoL, we jsut need to remap
  if (taxonId && datasetKey && datasetKey === import.meta.env.PUBLIC_COL_CHECKLIST_KEY) {
    return redirect(`${locale.gbifOrgLocalePrefix}/taxon/${encodeURIComponent(taxonId)}`);
  }

  // for anything that isn't the backbone or CoL we can redirect to the dataset specific page
  if (taxonId && datasetKey && datasetKey !== import.meta.env.PUBLIC_CLASSIC_BACKBONE_KEY) {
    return redirect(
      `${locale.gbifOrgLocalePrefix}/dataset/${datasetKey}/taxon/${encodeURIComponent(taxonId)}`
    );
  }

  // this is a bit an odd one. If the speciesKey is present so should the taxon, since the data should always be in CoL
  // but in case of an inconsistency, we fail. We could also show speciesKey information instead in the tombstone page.
  if (!data?.speciesKey?.taxon) {
    throw new NotFoundLoaderResponse();
  }

  // It is not a mappable backbone key, not a CoL key and not another known species key.
  // so it must be a backbone key that has no mapping to CoL.
  // we will have to show a tombstone page
  return { errors, data };
}

export function SpeciesKey() {
  const { data } = useLoaderData() as { data: DeprecatedTaxonQuery };
  const taxon = data.speciesKey?.taxon;

  return (
    <article>
      <PageContainer topPadded bottomPadded className="g-bg-white">
        <ArticleTextContainer>
          <ArticlePreTitle clickable>
            <DynamicLink pageId="taxonSearch">Taxon</DynamicLink>
          </ArticlePreTitle>
          <ArticleTitle>{taxon?.scientificName ?? 'Unknown taxon'}</ArticleTitle>
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
              <Property labelId="Scientific name" value={taxon?.scientificName} />
              <Property labelId="status" value={taxon?.taxonomicStatus} />
              <Property labelId="rank" value={taxon?.taxonRank} />
              {(taxon?.parentTree?.length ?? 0) > 0 && (
                <>
                  <Term>Classification</Term>
                  <Value>
                    <Properties>
                      {taxon?.parentTree?.map((parent) => (
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
                  q: taxon?.scientificName ?? '',
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
    speciesKey(key: $key) {
      taxonID
      datasetKey
      kingdom
      phylum
      order
      family
      genus
      species
      scientificName
      taxon(ifDatasetKey: $oldDatasetKey) {
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
  }
`;
