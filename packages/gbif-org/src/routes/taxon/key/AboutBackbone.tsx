import { ClientSideOnly } from '@/components/clientSideOnly';
import { useCount } from '@/components/count';
import * as charts from '@/components/dashboard';
import { AdHocMapThumbnail } from '@/components/mapThumbnail';
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
import { InvasiveInCountries } from './InvasiveInCountries';
import OccurrenceImages from './OccurrenceImages';
import Synonyms from './Synonyms';
import { TaxonKeyContext } from './taxonKeyPresentation';
import { useIsFamilyOrAbove, useIsSpeciesOrBelow } from './taxonUtil';
import TypeMaterial from './TypeSpecimens';
import { VernacularNameTable } from './VernacularNameTable';
import WikiDataIdentifiers from './WikiDataIdentifiers';

export default function AboutBackbone() {
  const { slowTaxon, slowTaxonLoading, data } = useContext(TaxonKeyContext);

  const { key } = useParams();
  const { count, loading } = useCount({
    v1Endpoint: '/occurrence/search',
    params: { taxonKey: key },
  });
  const removeSidebar = useBelow(1100);
  const useInlineImage = useBelow(700);
  const {
    taxon,
    typesSpecimenCount: {
      documents: { total: numberOfTypeSpecimens },
    },
    imagesCount: {
      documents: { total: numberOfImages },
    },
  } = data;
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
            {numberOfImages > 0 && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.occurenceImages" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OccurrenceImages total={numberOfImages} taxonKey={taxon.key} />
                </CardContent>
              </Card>
            )}
            {isFamilyOrAbove && data.taxon.taxonomicStatus === 'ACCEPTED' && (
              <TaxonBreakdown taxon={taxon} className="g-mb-4" />
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
                    slowTaxon={slowTaxon}
                    loading={slowTaxonLoading}
                    total={data?.taxon?.synonyms?.results?.length}
                  />
                </CardContent>
              </Card>
            )}

            {isSpeciesOrBelow && numberOfTypeSpecimens > 0 && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.typeMaterial" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TypeMaterial total={numberOfTypeSpecimens} taxonKey={taxon.key} />
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
            {slowTaxon && (slowTaxon?.taxon?.invasiveInCountries?.length ?? 0) > 0 && (
              <Card className="g-mb-4" id="invasiveInCountries">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage
                      id="taxon.recordedAsIntrodicedInNcontries"
                      values={{ total: slowTaxon?.taxon?.invasiveInCountries?.length }}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <InvasiveInCountries slowTaxon={slowTaxon} />
                </CardContent>
              </Card>
            )}
            {slowTaxon && (slowTaxon?.taxon?.wikiData?.identifiers?.length ?? 0) > 0 && (
              <Card className="g-mb-4" id="taxonIdentifiers">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.taxonIdentifiers" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <WikiDataIdentifiers
                    source={slowTaxon?.taxon?.wikiData?.source}
                    identifiers={slowTaxon?.taxon?.wikiData?.identifiers}
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
