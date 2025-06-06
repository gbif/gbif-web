import { useCount } from '@/components/count';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { FeatureList, Homepage } from '@/components/highlights';
import { HyperText } from '@/components/hyperText';
import { GbifLinkCard } from '@/components/TocHelp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import useBelow from '@/hooks/useBelow';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import TaxonBreakdown from './BreakDown';
import Citation from './Citation';
import ClassificationSideBar from './ClassificationSideBar';
import { DistributionsTable } from './Distributions';
import Synonyms from './Synonyms';
import TaxonImages from './TaxonImages';
import { TaxonKeyContext } from './taxonKeyPresentation';
import { useIsFamilyOrAbove, useIsSpeciesOrBelow } from './taxonUtil';
import { VernacularNameTable } from './VernacularNameTable';
export default function AboutNonBackbone({ headLess = false }: { headLess?: boolean }) {
  const { slowTaxon, slowTaxonLoading, data } = useContext(TaxonKeyContext);

  const { key } = useParams();
  // const { data } = useTaxonKeyLoaderData();
  const { count, loading } = useCount({
    v1Endpoint: '/occurrence/search',
    params: { taxonKey: key },
  });
  const removeSidebar = useBelow(1100);
  const useInlineImage = useBelow(700);
  const { taxon } = data;
  const isFamilyOrAbove = useIsFamilyOrAbove(taxon?.rank);
  const isSpeciesOrBelow = useIsSpeciesOrBelow(taxon?.rank);

  const predicate = {
    type: 'equals',
    key: 'taxonKey',
    value: taxon?.key,
  };

  if (!taxon) return null;
  return (
    <ArticleContainer className={`g-bg-slate-100 ${headLess ? 'g-p-4 lg:g-pt-4' : ''}`}>
      <ArticleTextContainer className="g-max-w-screen-xl">
        <div className={`${removeSidebar ? '' : 'g-flex'}`}>
          <div className="g-flex-grow">
            {headLess && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <span
                      dangerouslySetInnerHTML={{
                        __html: taxon?.formattedName || taxon?.scientificName || '',
                      }}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/*  {taxon.parents && (
                    <div>
                      <TaxonClassification
                        showIcon={false}
                        className="g-flex g-mb-2"
                        majorOnly
                        datasetKey={taxon.datasetKey}
                        classification={taxon.parents.map((p) => ({
                          ...p,
                          name: p.canonicalName,
                        }))}
                      />
                    </div>
                  )} */}
                  {taxon.publishedIn && (
                    <div>
                      <FormattedMessage id="taxon.publishedIn" />{' '}
                      <HyperText text={taxon.publishedIn} />
                    </div>
                  )}
                  <FeatureList>
                    {taxon?.references && <Homepage url={taxon.references} />}
                  </FeatureList>
                </CardContent>
              </Card>
            )}
            {slowTaxon?.taxon?.media?.results?.length > 0 && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.taxonImages" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary type="BLOCK" errorMessage="taxon.errors.images">
                    <TaxonImages taxonKey={taxon?.key} images={slowTaxon?.taxon?.media} />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            )}
            {isFamilyOrAbove &&
              data?.taxon?.taxonomicStatus === 'ACCEPTED' &&
              data.taxon.origin !== 'DENORMED_CLASSIFICATION' && (
                <TaxonBreakdown taxon={taxon} className="g-mb-4" />
              )}
            {data?.taxon?.taxonomicStatus === 'ACCEPTED' && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.synonymsAndCombinations" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Synonyms
                    taxonKey={taxon.key}
                    loading={slowTaxonLoading}
                    slowTaxon={slowTaxon}
                    total={data?.taxon?.synonyms?.results?.length}
                  />
                </CardContent>
              </Card>
            )}

            {(taxon?.vernacularCount?.results?.length ?? 0) > 0 && (
              <Card className="g-mb-4" id="vernacularNames">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.vernacularNames" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <VernacularNameTable
                    total={taxon?.vernacularCount?.results?.length || 0}
                    taxonKey={taxon.key}
                  />
                </CardContent>
              </Card>
            )}
            {(taxon?.distributionsCount?.results?.length ?? 0) > 0 && (
              <Card className="g-mb-4" id="distributions">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.distributions" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary type="BLOCK" errorMessage="taxon.errors.distributions">
                    <DistributionsTable
                      total={taxon?.distributionsCount?.results?.length || 0}
                      taxonKey={taxon.key}
                    />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            )}

            <Card className="g-mb-4" id="citation">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="phrases.citation" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Citation taxon={taxon} />
              </CardContent>
            </Card>
          </div>

          {!removeSidebar && (
            <aside className="g-flex-none g-w-96 g-ms-4">
              <ClassificationSideBar taxon={taxon} />
              {/* {!!count && count > 0 && (
                <>
                  <div className="g-max-w-64 md:g-max-w-96 g-mb-4">
                    <AdHocMapThumbnail
                      filter={{ taxonKey: taxon.key }}
                      className="g-rounded g-border"
                    />
                  </div>
                  <ClientSideOnly>
                    <charts.OccurrenceSummary predicate={predicate} className="g-mb-4" />
                    {isFamilyOrAbove && <charts.Taxa predicate={predicate} className="g-mb-2" />}

                    <charts.DataQuality predicate={predicate} className="g-mb-4" />
                  </ClientSideOnly>
                </>
              )} */}

              <GbifLinkCard path={`/species/${taxon.key}`} />
            </aside>
          )}
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
