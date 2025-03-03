import { ClientSideOnly } from '@/components/clientSideOnly';
import { useCount } from '@/components/count';
import * as charts from '@/components/dashboard';
import { AdHocMapThumbnail } from '@/components/mapThumbnail';
import { GbifLinkCard } from '@/components/TocHelp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import useBelow from '@/hooks/useBelow';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useTaxonKeyLoaderData } from '.';
import Citation from './Citation';
import Synonyms from './Synonyms';
import TaxonImages from './TaxonImages';
import { useIsFamilyOrAbove, useIsSpeciesOrBelow } from './taxonUtil';
import { VernacularNameTable } from './VernacularNameTable';
export default function AboutNonBackbone({ slowTaxon, slowTaxonLoading }) {
  const { key } = useParams();
  const { data } = useTaxonKeyLoaderData();
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
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <div className={`${removeSidebar ? '' : 'g-flex'}`}>
          <div className="g-flex-grow">
            {slowTaxon?.taxon?.media?.results?.length > 0 && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.taxonImages" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxonImages taxonKey={taxon?.key} images={slowTaxon?.taxon?.media} />
                </CardContent>
              </Card>
            )}
            {data.taxon.taxonomicStatus === 'ACCEPTED' && (
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

            {/* <AdHocMapThumbnail
                filter={{ taxonKey: taxon.key }}
                className='g-rounded g-border'
              /> */}

            {/* <section>
              <CardHeader>
                <CardTitle>
                  <span className='g-me-2'>
                    <FormattedMessage id="dataset.metrics" />
                  </span>
                  <SimpleTooltip
                    title={<FormattedMessage id="dataset.metricsOccurrenceHelpText" />}
                  >
                    <span>
                      <MdInfoOutline style={{ verticalAlign: 'middle' }} />
                    </span>
                  </SimpleTooltip>
                </CardTitle>
              </CardHeader>
              <ClientSideOnly>
                <DashBoardLayout>
                  <charts.OccurrenceSummary predicate={predicate} className='g-mb-2' />
                  <charts.DataQuality predicate={predicate} className='g-mb-2' />
                  <charts.Taxa predicate={predicate} className='g-mb-2' />
                </DashBoardLayout>
              </ClientSideOnly>
            </section> */}

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
              {!!count && count > 0 && (
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
              )}

              <GbifLinkCard path={`/species/${taxon.key}`} />
            </aside>
          )}
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
