import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { TaxonClassification } from '@/components/highlights';
import { HyperText } from '@/components/hyperText';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { SlowTaxonQuery, TaxonKeyQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins/dynamicLink';
import EntityDrawer from '@/routes/occurrence/search/views/browseList/ListBrowser';
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
import AboutNonBackbone from './AboutNonBackbone';
import { AboutContent, ApiContent } from './help';

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
    typesSpecimenCount: undefined,
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
}: {
  data: TaxonKeyQuery;
  slowTaxon?: SlowTaxonQuery;
  slowTaxonLoading: boolean;
}) => {
  return (
    <PageHeader data={data} vernacularNameInfo={undefined}>
      <AboutNonBackbone slowTaxon={slowTaxon} slowTaxonLoading={slowTaxonLoading} />
    </PageHeader>
  );
};

const PageHeader = ({ data, vernacularNameInfo, children }) => {
  const { taxon } = data;
  const isNub = taxon?.nubKey === taxon?.key;
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

    return tabsToDisplay;
  }, []);
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
            <HeaderInfo>
              <HeaderInfoMain className="g-text-sm g-text-slate-500">
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
                <div>
                  {taxon.parents && (
                    <div>
                      <TaxonClassification
                        showIcon={false}
                        className="g-flex g-mb-2"
                        majorOnly
                        classification={taxon.parents.map((p) => ({
                          ...p,
                          name: p.scientificName,
                        }))}
                      />
                    </div>
                  )}
                </div>
                {taxon.publishedIn && (
                  <div>
                    <FormattedMessage id="taxon.publishedIn" />{' '}
                    <HyperText text={taxon.publishedIn} />
                  </div>
                )}
                {!isNub && taxon?.references && (
                  <a href={taxon?.references} target="_blank" rel="noreferrer">
                    source
                  </a>
                )}
              </HeaderInfoMain>
            </HeaderInfo>
          </ArticleTextContainer>
          <div className="g-border-b g-mt-4"></div>

          <Tabs links={tabs} />
        </PageContainer>
        <ErrorBoundary invalidateOn={data.taxon?.key}>{children}</ErrorBoundary>
      </article>
    </>
  );
};

export const TaxonPageSkeleton = ArticleSkeleton;
