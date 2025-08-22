import { ClientSideOnly } from '@/components/clientSideOnly';
import { useCount } from '@/components/count';
import * as charts from '@/components/dashboard';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { MapTypes, useHasMap } from '@/components/maps/mapThumbnail';
import { MapWidget } from '@/components/maps/mapWidget';
import { GbifLinkCard } from '@/components/TocHelp';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import useBelow from '@/hooks/useBelow';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { cn } from '@/utils/shadcn';
import { useContext } from 'react';
import { FormattedMessage } from 'react-intl';
import { useParams } from 'react-router-dom';
import TaxonBreakdown from './BreakDown';
import Citation from './Citation';
import ClassificationSideBar from './ClassificationSideBar';
import { InvasiveInCountries } from './InvasiveInCountries';
import OccurrenceImages from './OccurrenceImages';
import Synonyms from './Synonyms';
import { TaxonKeyContext } from './taxonKeyPresentation';
import { useIsFamilyOrAbove, useIsSpeciesOrBelow, useNextMajorRank } from './taxonUtil';
import Treatments from './Treatments';
import TypeMaterial from './TypeSpecimens';
import { VernacularNameTable } from './VernacularNameTable';
import WikiDataIdentifiers from './WikiDataIdentifiers';
import styles from './wikiIdentifiers.module.css';
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
    /*  typesSpecimenCount: {
      documents: { total: numberOfTypeSpecimens },
    }, */
    /*  imagesCount: {
      documents: { total: numberOfImages },
    }, */
  } = data;
  const isFamilyOrAbove = useIsFamilyOrAbove(taxon?.rank);
  const isSpeciesOrBelow = useIsSpeciesOrBelow(taxon?.rank);
  const nextMajorRank = useNextMajorRank(taxon?.rank);
  const predicate = {
    type: 'equals',
    key: 'taxonKey',
    value: taxon?.key,
  };
  const hasPreprocessedMap = useHasMap({
    type: MapTypes.TaxonKey,
    identifier: taxon?.key?.toString() ?? '',
  });
  if (!taxon) return null;
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        <div className={`${removeSidebar ? '' : 'g-flex'}`}>
          {/*  {!removeSidebar && (
            <aside className="g-flex-none g-w-48 g-ms-4">
              <ClassificationSideBar taxon={taxon} />
            </aside>
          )} */}
          <div className="g-flex-grow">
            {(data?.imagesCount?.documents?.total || 0) > 0 && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.occurenceImages" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <OccurrenceImages
                    total={data?.imagesCount?.documents?.total}
                    taxonKey={taxon.key}
                  />
                </CardContent>
              </Card>
            )}
            {isFamilyOrAbove && data.taxon.taxonomicStatus === 'ACCEPTED' && (
              <TaxonBreakdown taxon={taxon} className="g-mb-4" />
            )}
            {/* <Card className="g-mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="taxon.distribution" />
                </CardTitle>
              </CardHeader>
              <CardContent className="g-p-0">
                <MapWidget capabilitiesParams={{ taxonKey: taxon.key }} mapStyle="CLASSIC_HEX" />
              </CardContent>
            </Card> */}
            {hasPreprocessedMap && (
              <MapWidget
                className="g-mb-4"
                capabilitiesParams={{ taxonKey: taxon.key }}
                mapStyle="CLASSIC_HEX"
              />
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

            {isSpeciesOrBelow && (
              <ErrorBoundary
                type="BLOCK"
                errorMessage={<FormattedMessage id="taxon.errors.typeMaterial" />}
              >
                <TypeMaterial
                  taxonKey={taxon.key}
                  rank={taxon.rank}
                  acceptedTaxonKey={taxon?.acceptedTaxon?.key}
                />
              </ErrorBoundary>
            )}

            {(taxon?.vernacular?.results?.length ?? 0) > 0 && (
              <Card className="g-mb-4" id="vernacularNames">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.vernacularNames" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary
                    type="BLOCK"
                    errorMessage={<FormattedMessage id="taxon.errors.vernacularNames" />}
                  >
                    <VernacularNameTable
                      total={taxon?.vernacular?.results?.length || 0}
                      taxonKey={taxon.key}
                    />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            )}
            {isSpeciesOrBelow && (
              <ErrorBoundary
                type="BLOCK"
                errorMessage={<FormattedMessage id="taxon.errors.invasiveInCountries" />}
              >
                <InvasiveInCountries taxonKey={taxon.key.toString()} />
              </ErrorBoundary>
            )}
            <ErrorBoundary
              type="BLOCK"
              errorMessage={<FormattedMessage id="taxon.errors.treatments" />}
            >
              <Treatments taxonKey={taxon?.key?.toString()} />
            </ErrorBoundary>
            {slowTaxon && (slowTaxon?.taxon?.wikiData?.identifiers?.length ?? 0) > 0 && (
              <Card className="g-mb-4" id="taxonIdentifiers">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.taxonIdentifiers" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary
                    type="BLOCK"
                    errorMessage={<FormattedMessage id="taxon.errors.wikidata" />}
                  >
                    <WikiDataIdentifiers
                      source={slowTaxon?.taxon?.wikiData?.source}
                      identifiers={slowTaxon?.taxon?.wikiData?.identifiers}
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
            {data.taxon?.issues?.length > 0 && (
              <>
                <FormattedMessage id="filters.occurrenceIssue.name" />
                {': '}
                <div
                  style={{ display: 'inline-block' }}
                  className={cn(styles.wikidataIdentifiers, 'g-text-sm g-text-slate-500')}
                >
                  {data.taxon?.issues?.map((issue) => (
                    <span key={issue}>
                      <FormattedMessage id={`enums.taxonIssue.${issue}`} />
                    </span>
                  ))}
                </div>
              </>
            )}
          </div>

          {!removeSidebar && (
            <aside className="g-flex-none g-w-96 g-ms-4">
              <ClassificationSideBar taxon={taxon} />

              {!!count && count > 0 && (
                <>
                  {/* <div className="g-max-w-64 md:g-max-w-96 g-mb-4">
                    <AdHocMapThumbnail
                      filter={{ taxonKey: taxon.key }}
                      className="g-rounded g-border"
                    />
                  </div> */}
                  <ClientSideOnly>
                    {/*                     <charts.OccurrenceSummary predicate={predicate} className="g-mb-4" />
                     */}{' '}
                    {isFamilyOrAbove && (
                      <charts.Taxa
                        defaultRank={nextMajorRank?.toLowerCase() || 'family'}
                        predicate={predicate}
                        className="g-mb-2"
                      />
                    )}
                    {/*                     <charts.DataQuality predicate={predicate} className="g-mb-4" />
                     */}{' '}
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
