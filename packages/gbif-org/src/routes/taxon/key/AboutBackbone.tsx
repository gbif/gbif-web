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
import { CardDescription } from '@/components/ui/smallCard';

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

  const hasSynonyms =
    (taxonInfo.synonyms?.homotypic?.length ?? 0) > 0 ||
    (taxonInfo.synonyms?.heterotypic?.flat().length ?? 0) > 0;

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
            {taxon.taxonomicStatus === 'ACCEPTED' && hasSynonyms && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.synonymsAndCombinations" />
                  </CardTitle>
                  <CardDescription>
                    <ColFeedback />
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ErrorBoundary
                    type="BLOCK"
                    errorMessage={<FormattedMessage id="taxon.errors.vernacularNames" />}
                  >
                    <Synonyms taxonInfo={taxonInfo} />
                  </ErrorBoundary>
                </CardContent>
              </Card>
            )}
            {isSpeciesOrBelow && (
              <ErrorBoundary
                type="BLOCK"
                errorMessage={<FormattedMessage id="taxon.errors.typeMaterial" />}
              >
                <TypeMaterial taxonInfo={taxonInfo} />
              </ErrorBoundary>
            )}

            {(taxonInfo?.vernacularNames?.length ?? 0) > 0 && (
              <Card className="g-mb-4" id="vernacularNames">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="taxon.vernacularNames" />
                  </CardTitle>
                  <CardDescription>
                    <ColFeedback />
                  </CardDescription>
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
            {isSpeciesOrBelow && (
              <ErrorBoundary
                type="BLOCK"
                errorMessage={<FormattedMessage id="taxon.errors.invasiveInCountries" />}
              >
                <InvasiveInCountries taxonInfo={taxonInfo} />
              </ErrorBoundary>
            )}

            {(taxonInfo?.taxon?.treatments?.length ?? 0) > 0 && (
              <ErrorBoundary
                type="BLOCK"
                errorMessage={<FormattedMessage id="taxon.errors.treatments" />}
              >
                <Treatments taxonInfo={taxonInfo} />
              </ErrorBoundary>
            )}

            {slowTaxon && (slowTaxon?.taxonInfo?.taxon?.wikiData?.identifiers?.length ?? 0) > 0 && (
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
                      source={slowTaxon?.taxonInfo?.taxon?.wikiData?.source}
                      identifiers={slowTaxon?.taxonInfo?.taxon?.wikiData?.identifiers}
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
                <Citation taxonInfo={taxonInfo} />
              </CardContent>
            </Card>
            {/* TODO taxonapi: there are some fields missing here https://github.com/gbif/taxon-ws/issues/20 */}
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

function ColFeedback() {
  return (
    <FormattedMessage
      id="taxon.colFeedback"
      defaultMessage="Source: Catalogue of Life. {link}"
      values={{
        link: (
          <a
            href="https://github.com/CatalogueOfLife/data/issues/new/choose"
            target="_blank"
            rel="noopener noreferrer"
            className="g-underline"
          >
            <FormattedMessage id="link" defaultMessage="Leave feedback." />
          </a>
        ),
      }}
    />
  );
}
