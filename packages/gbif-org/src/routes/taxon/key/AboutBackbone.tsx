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
// import ClassificationSideBar from './ClassificationSideBar';
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
import { NotFoundError } from '@/errors';
import { useConfig } from '@/config/config';

export default function AboutBackbone() {
  const config = useConfig();
  const { slowTaxon, slowTaxonLoading, data } = useContext(TaxonKeyContext);

  const { count, loading } = useCount({
    v1Endpoint: '/occurrence/search',
    params: {
      taxonKey: data.taxonInfo?.taxon?.taxonID,
      checklistKey: data.taxonInfo?.taxon?.datasetKey,
    },
  });

  const removeSidebar = useBelow(1100);
  const taxon = data?.taxonInfo?.taxon;
  const taxonInfo = data?.taxonInfo;
  if (!taxonInfo || !taxon) throw new NotFoundError();

  const isFamilyOrAbove = useIsFamilyOrAbove(taxon?.taxonRank);
  const isSpeciesOrBelow = useIsSpeciesOrBelow(taxon?.taxonRank);
  const nextMajorRank = useNextMajorRank(taxon?.taxonRank);
  const predicate = {
    type: 'equals',
    key: 'taxonKey',
    value: taxon?.taxonID,
  };

  const hasPreprocessedMap = useHasMap({
    [MapTypes.TaxonKey]: taxon?.taxonID,
    checklistKey: config.defaultChecklistKey,
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
            {taxon?.occurrenceMedia?.results &&
              taxon?.occurrenceMedia?.count &&
              taxon.occurrenceMedia.count > 0 && (
                <Card className="g-mb-4">
                  <CardHeader>
                    <CardTitle>
                      <FormattedMessage id="taxon.occurrenceImages" />
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <OccurrenceImages
                      results={taxon.occurrenceMedia.results}
                      total={taxon.occurrenceMedia.count}
                      taxonKey={taxon.taxonID}
                    />
                  </CardContent>
                </Card>
              )}
            {isFamilyOrAbove && taxon.taxonomicStatus === 'ACCEPTED' && (
              <TaxonBreakdown taxon={taxon} className="g-mb-4" />
            )}
            {hasPreprocessedMap && (
              <MapWidget
                className="g-mb-4"
                capabilitiesParams={{ taxonKey: taxon.taxonID, checklistKey: taxon.datasetKey }}
                mapStyle="CLASSIC_HEX"
              />
            )}
            {taxon.taxonomicStatus === 'ACCEPTED' && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.synonymsAndCombinations" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* <Synonyms
                    taxonKey={taxon.taxonID}
                    slowTaxon={slowTaxon}
                    loading={slowTaxonLoading}
                    total={data?.taxon?.synonyms?.results?.length}
                  /> */}
                </CardContent>
              </Card>
            )}

            {/* {isSpeciesOrBelow && (
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
            )} */}

            {(taxonInfo?.vernacularNames?.length ?? 0) > 0 && (
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
                    <VernacularNameTable vernacularNames={taxonInfo?.vernacularNames} />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            )}

            {/* {isSpeciesOrBelow && (
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
            </ErrorBoundary> */}

            {/* {slowTaxon && (slowTaxon?.taxon?.wikiData?.identifiers?.length ?? 0) > 0 && (
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
            )} */}

            <Card className="g-mb-4" id="citation">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="phrases.citation" />
                </CardTitle>
              </CardHeader>
              <CardContent>{/* <Citation taxon={taxon} /> */}</CardContent>
            </Card>

            {/* {data.taxon?.issues?.length > 0 && (
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
            )} */}
          </div>

          {!removeSidebar && (
            <aside className="g-flex-none g-w-96 g-ms-4">
              {/* <ClassificationSideBar taxon={taxon} /> */}

              {!!count && count > 0 && (
                <>
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
                  </ClientSideOnly>
                </>
              )}
              {/* TODO taxonapi: fix link */}
              <GbifLinkCard path={`/species/${taxon.taxonID}`} />
            </aside>
          )}
        </div>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
