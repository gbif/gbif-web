import { useCount } from '@/components/count';
import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { FeatureList, GenericFeature, Homepage } from '@/components/highlights';
import { HyperText } from '@/components/hyperText';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { SlowTaxonQuery, TaxonKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins/dynamicLink';
import EntityDrawer from '@/routes/occurrence/search/views/browseList/ListBrowser';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { createContext, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { MdInfoOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Outlet } from 'react-router-dom';
import Cites from './Cites';
import { AboutContent, ApiContent } from './help';
import SourceDataset from './SourceDataset';
import SourceLink from './SourceLink';
import { useIsSpeciesOrBelow } from './taxonUtil';
// create context to pass data to children
export const TaxonKeyContext = createContext<{
  key?: string;
  data: TaxonKeyQuery;
  slowTaxon?: SlowTaxonQuery;
  slowTaxonLoading?: boolean;
}>({
  data: {
    __typename: undefined,
    taxon: undefined,
    imagesCount: undefined,
    /*     typesSpecimenCount: undefined,
     */
  },
  slowTaxon: {
    __typename: undefined,
    taxon: undefined,
  },
});

export function TaxonKey({
  data,
  slowTaxon,
  slowTaxonLoading,
}: {
  data: TaxonKeyQuery;
  slowTaxon?: SlowTaxonQuery;
  slowTaxonLoading: boolean;
}) {
  if (data.taxon == null) throw new Error('404');

  const vernacularNameInfo = slowTaxon?.taxon?.vernacularNames?.results?.[0];

  return (
    <PageHeader data={data} vernacularNameInfo={vernacularNameInfo}>
      <TaxonKeyContext.Provider
        value={{
          data: data,
          slowTaxon: slowTaxon,
          slowTaxonLoading: slowTaxonLoading,
        }}
      >
        <Outlet />
      </TaxonKeyContext.Provider>
    </PageHeader>
  );
}

export const NonBackbonePresentation = ({
  data,
  slowTaxon,
  slowTaxonLoading,
  headLess = false,
}: {
  data: TaxonKeyQuery;
  slowTaxon?: SlowTaxonQuery;
  slowTaxonLoading: boolean;
  headLess: boolean;
}) => {
  return !headLess ? (
    <PageHeader data={data} vernacularNameInfo={undefined}>
      <TaxonKeyContext.Provider
        value={{
          data: data,
          slowTaxon: slowTaxon,
          slowTaxonLoading: slowTaxonLoading,
        }}
      >
        <Outlet />
      </TaxonKeyContext.Provider>
    </PageHeader>
  ) : (
    <TaxonKeyContext.Provider
      value={{
        data: data,
        slowTaxon: slowTaxon,
        slowTaxonLoading: slowTaxonLoading,
      }}
    >
      <ArticleContainer className="g-bg-slate-100 g-p-0 lg:g-pb-0">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <Card>
            <SectionTabs isNub={false} hasVerbatim={data.taxon?.origin === 'SOURCE'} />
          </Card>
        </ArticleTextContainer>
      </ArticleContainer>
      <Outlet />
    </TaxonKeyContext.Provider>
  );
};

const SectionTabs = ({ isNub, hasVerbatim }: { isNub: boolean; hasVerbatim: boolean }) => {
  const tabs = useMemo<{ to: string; children: React.ReactNode }[]>(() => {
    const tabsToDisplay: { to: string; children: React.ReactNode }[] = [
      { to: '.', children: <FormattedMessage id="taxon.tabs.about" /> },
    ];
    if (isNub) {
      tabsToDisplay.push({
        to: 'metrics',
        children: <FormattedMessage id="taxon.tabs.metrics" />,
      });
    }
    if (hasVerbatim && !isNub) {
      tabsToDisplay.push({
        to: 'verbatim',
        children: <FormattedMessage id="taxon.tabs.verbatim" />,
      });
    }

    return tabsToDisplay;
  }, []);

  return <Tabs links={tabs} />;
};

const PageHeader = ({ data, vernacularNameInfo, children }) => {
  const { taxon } = data;
  const isNub = taxon?.nubKey === taxon?.key;
  const { count, loading: countLoading } = useCount({
    v1Endpoint: '/occurrence/search',
    params: { taxonKey: taxon.key },
  });

  const isSpeciesOrBelow = useIsSpeciesOrBelow(taxon?.rank);
  return (
    <>
      <Helmet>
        <title>{taxon.scientificName}</title>
        {/* TODO we need much richer meta data. */}
      </Helmet>
      <EntityDrawer />

      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={taxon.key} />}
      ></DataHeader>

      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <ArticlePreTitle
              secondary={
                <FormattedMessage
                  id={`enums.taxonomicStatus.${taxon.taxonomicStatus}`}
                  defaultMessage={taxon.taxonomicStatus || ''}
                />
              }
            >
              <FormattedMessage id={`enums.rank.${taxon.rank}`} defaultMessage={taxon.rank || ''} />
            </ArticlePreTitle>
            {/* it would be nice to know for sure which fields to expect */}
            <ArticleTitle className="lg:g-text-3xl">
              <span
                className="g-me-4"
                dangerouslySetInnerHTML={{
                  __html: taxon?.formattedName || taxon?.scientificName || '',
                }}
              />
              {vernacularNameInfo && (
                <SimpleTooltip
                  asChild
                  title={
                    <FormattedMessage
                      id="phrases.commonNameAccordingTo"
                      values={{ source: vernacularNameInfo.source }}
                    />
                  }
                >
                  <span
                    className="g-text-slate-300 g-inline-flex g-items-center"
                    style={{ fontSize: '85%' }}
                  >
                    <span className="g-me-1">{vernacularNameInfo.vernacularName}</span>
                    <MdInfoOutline />
                  </span>
                </SimpleTooltip>
              )}
            </ArticleTitle>
            <div>
              {!isNub && taxon.dataset && (
                <div className="g-mt-2">
                  <FormattedMessage
                    id="taxon.inChecklist"
                    values={{
                      checklist: (
                        <DynamicLink
                          className="hover:g-underline g-text-primary-500 g-ml-1"
                          to={`/dataset/${taxon.dataset.key}`}
                          pageId="datasetKey"
                          variables={{ key: taxon.dataset.key }}
                        >
                          {taxon.dataset.title}
                        </DynamicLink>
                      ),
                    }}
                  />
                </div>
              )}

              {taxon.acceptedTaxon && (
                <>
                  <FormattedMessage id="taxon.synonymOf" defaultMessage={'Synonym of'} />
                  <Button asChild variant="link" className="g-p-1">
                    <DynamicLink
                      pageId="speciesKey"
                      variables={{ key: taxon?.acceptedTaxon?.key.toString() }}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html:
                            taxon?.acceptedTaxon?.formattedName ||
                            taxon?.acceptedTaxon?.scientificName ||
                            '',
                        }}
                      ></span>
                    </DynamicLink>
                  </Button>
                </>
              )}
              {isNub && <SourceDataset taxon={data.taxon} />}
              {taxon.publishedIn && (
                <div>
                  <FormattedMessage id="taxon.publishedIn" />
                  {': '}
                  <span style={{ display: 'inline-block' }}>
                    <HyperText text={taxon.publishedIn} />
                  </span>
                </div>
              )}
            </div>
            <HeaderInfo>
              <HeaderInfoMain>
                <FeatureList>
                  {!isNub && taxon?.references && <Homepage url={taxon.references} />}
                  {isNub && taxon?.iucnStatus?.distribution?.threatStatus && (
                    <GenericFeature>
                      <a href={taxon?.iucnStatus?.references} target="_blank">
                        <img
                          width={200}
                          src={`/iucnStatus/${taxon?.iucnStatus?.distribution?.threatStatus}.png`}
                        />
                      </a>
                    </GenericFeature>
                  )}
                  {isNub && isSpeciesOrBelow && (
                    <Cites taxonName={data.taxon?.canonicalName} kingdom={data.taxon?.kingdom} />
                  )}
                  {isNub && (
                    <GenericFeature>
                      <SourceLink taxon={data.taxon} />
                    </GenericFeature>
                  )}

                  {isNub && (
                    <>
                      <div className="g-flex-auto g-min-w-0" />
                      <Button>
                        <DynamicLink
                          pageId="occurrenceSearch"
                          searchParams={{ taxonKey: taxon.key.toString() }}
                        >
                          {countLoading ? (
                            <FormattedMessage id="taxon.loading" />
                          ) : (
                            <FormattedMessage id="counts.nOccurrences" values={{ total: count }} />
                          )}
                        </DynamicLink>
                      </Button>
                    </>
                  )}
                </FeatureList>
              </HeaderInfoMain>
            </HeaderInfo>
            <div className="g-border-b g-mt-4"></div>
            <SectionTabs isNub={isNub} hasVerbatim={taxon?.origin === 'SOURCE'} />
          </ArticleTextContainer>
        </PageContainer>
        <ErrorBoundary invalidateOn={data.taxon?.key}>{children}</ErrorBoundary>
      </article>
    </>
  );
};

export const TaxonPageSkeleton = ArticleSkeleton;
