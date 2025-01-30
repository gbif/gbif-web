import { ClientSideOnly } from '@/components/clientSideOnly';
import { useCount } from '@/components/count';
import * as charts from '@/components/dashboard';
import EmptyValue from '@/components/emptyValue';
import { AdHocMapThumbnail } from '@/components/mapThumbnail';
import Properties, { Property } from '@/components/properties';
import { GbifLinkCard } from '@/components/TocHelp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import useBelow from '@/hooks/useBelow';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import { useTaxonKeyLoaderData } from '.';
import OccurrenceImages from './OccurrenceImages';
import { useIsFamilyOrAbove, useIsSpeciesOrBelow } from './taxonUtil';
import { VernacularNameTable } from './VernacularNameTable';
export default function About() {
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

  /*   const addressesIdentical =
    JSON.stringify(taxon?.mailingAddress) === JSON.stringify(taxon?.address);
  const contacts = taxon?.contactPersons.filter((x) => x.firstName);

  const imageUrl = taxon.featuredImageUrl ?? taxon.featuredImageUrl_fallback; */
  console.log(data);
  if (!taxon) return null;
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <div className={`${removeSidebar ? '' : 'g-flex'}`}>
          <div className="g-flex-grow">
            <Card className="g-mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="taxon.images" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <OccurrenceImages taxonKey={taxon.key} />
              </CardContent>
            </Card>

            <Card className="g-mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.description" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="g-prose g-mb-6 g-max-w-full">
                  {taxon?.description && (
                    <div dangerouslySetInnerHTML={{ __html: taxon.description }}></div>
                  )}
                  {!taxon.description && <EmptyValue />}
                </div>
                <Properties style={{ fontSize: 16, marginBottom: 12 }} breakpoint={800}>
                  {/* <Property value={taxon.description} labelId="grscicoll.description" showEmpty /> */}
                  <Property value={taxon.rank} labelId="taxon.rank" showEmpty />
                </Properties>
              </CardContent>
            </Card>

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

            <Card className="g-mb-4" id="vernacularNames">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="taxon.vernacularNames" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <VernacularNameTable
                  taxonKey={taxon.key}
                  columnTitle={undefined}
                  onClick={undefined}
                />
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
