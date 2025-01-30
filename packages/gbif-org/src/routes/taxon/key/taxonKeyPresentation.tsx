import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { TaxonClassification } from '@/components/highlights';
import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { TaxonQuery, TaxonSummaryMetricsQuery, TaxonVernacularNamesQuery } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins/dynamicLink';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { createContext, useMemo } from 'react';
import { Helmet } from 'react-helmet-async';
import { FormattedMessage } from 'react-intl';
import { Outlet } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';

// create context to pass data to children
export const TaxonKeyContext = createContext<{ key?: string; contentMetrics?: unknown }>({});

export function TaxonKey({
  data,
  taxonMetrics,
}: {
  data: TaxonQuery;
  taxonMetrics?: TaxonSummaryMetricsQuery;
  vernacularNames?: TaxonVernacularNamesQuery;
}) {
  const tabs = useMemo<{ to: string; children: React.ReactNode }[]>(() => {
    const tabsToDisplay: { to: string; children: React.ReactNode }[] = [
      { to: '.', children: <FormattedMessage id="taxon.tabs.about" /> },
    ];
    if (true) {
      tabsToDisplay.push({
        to: 'type-material',
        children: <FormattedMessage id="taxon.tabs.typeMaterial" />,
      });
    }

    return tabsToDisplay;
  }, []);

  if (data.taxon == null) throw new Error('404');
  const { taxon } = data;
  return (
    <>
      <Helmet>
        <title>{taxon.scientificName}</title>
        {/* TODO we need much richer meta data. */}
      </Helmet>
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
            <ArticleTitle
              dangerouslySetTitle={{ __html: taxon.formattedName || 'No name provided' }}
            ></ArticleTitle>
            <HeaderInfo>
              <HeaderInfoMain className="g-text-sm g-text-slate-500">
                {taxon.acceptedTaxon && (
                  <>
                    <FormattedMessage id="taxon.synonymOf" defaultMessage={'Synonym of'} />
                    <Button asChild variant="link" className="g-p-1">
                      <DynamicLink pageId="speciesKey" variables={{ key: taxon.acceptedTaxon.key }}>
                        <span
                          dangerouslySetInnerHTML={{ __html: taxon.acceptedTaxon.formattedName }}
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
                    <FormattedMessage id="taxon.publishedIn" /> {taxon.publishedIn}
                  </div>
                )}
              </HeaderInfoMain>
            </HeaderInfo>
          </ArticleTextContainer>
          <div className="g-border-b g-mt-4"></div>

          <Tabs links={tabs} />
        </PageContainer>
        <ErrorBoundary invalidateOn={data.taxon?.key}>
          <TaxonKeyContext.Provider
            value={{
              data: data,
            }}
          >
            <Outlet />
          </TaxonKeyContext.Provider>
        </ErrorBoundary>
      </article>
    </>
  );
}

export const TaxonPageSkeleton = ArticleSkeleton;
