import { useCount } from '@/components/count';
import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { FeatureList, GenericFeature, Homepage } from '@/components/highlights';
import { HyperText } from '@/components/hyperText';
import PageMetaData from '@/components/PageMetaData';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { NotFoundError } from '@/errors';
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
import { MdInfoOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Outlet } from 'react-router-dom';
import { getTaxonSchema } from '../../../utils/schemaOrg';
import Cites from './Cites';
import { AboutContent, ApiContent } from './help';
import { useIsSpeciesOrBelow } from './taxonUtil';
import { HelpLine } from '@/components/helpText';

const primaryChecklist = '7ddf754f-d193-4cc9-b351-99906754a03b'; // TODO taxonapi: move to env file

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
  if (data.taxonInfo?.taxon == null) throw new NotFoundError();

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

const PageHeader = ({
  data,
  vernacularNameInfo,
  children,
}: {
  data: TaxonKeyQuery;
  vernacularNameInfo?: any;
  children?: React.ReactNode;
}) => {
  const { taxonInfo } = data;
  const taxon = taxonInfo?.taxon;
  if (!taxon) throw new NotFoundError();

  const isPrimaryTaxonomy = taxonInfo?.taxon?.datasetKey === primaryChecklist;
  const { count, loading: countLoading } = useCount({
    v1Endpoint: '/occurrence/search',
    params: { taxonKey: taxonInfo?.taxon?.taxonID, checklistKey: primaryChecklist },
  });

  const isSpeciesOrBelow = useIsSpeciesOrBelow(taxon.taxonRank);
  return (
    <>
      <PageMetaData
        title={taxon.scientificName}
        jsonLd={isPrimaryTaxonomy ? getTaxonSchema(data) : undefined}
        path={`/species/${taxonInfo?.taxon?.taxonID}`}
        noCanonical
      />

      <EntityDrawer />

      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={taxon.taxonID} />}
      />

      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <ArticlePreTitle
              secondary={
                taxon.taxonomicStatus === 'DOUBTFUL' ? (
                  <HelpLine
                    id="what-does-the-taxon-status-doubtful-mean-and-when-is-used"
                    icon
                    contentClassName="g-w-auto g-max-w-[min(42rem,100vw)]"
                    title={
                      <span className="g-uppercase">
                        <FormattedMessage id={`enums.taxonomicStatus.${taxon.taxonomicStatus}`} />
                      </span>
                    }
                  />
                ) : (
                  <FormattedMessage id={`enums.taxonomicStatus.${taxon.taxonomicStatus}`} />
                )
              }
            >
              <FormattedMessage
                id={`enums.rank.${taxon.taxonRank}`}
                defaultMessage={taxon.taxonRank || ''}
              />
            </ArticlePreTitle>
            {/* it would be nice to know for sure which fields to expect */}
            <ArticleTitle className="lg:g-text-3xl">
              <span
                className="g-me-4"
                dangerouslySetInnerHTML={{
                  __html: taxon?.label || taxon?.scientificName || '',
                }}
              />
              {taxonInfo.vernacularName && (
                <SimpleTooltip
                  asChild
                  title={
                    <FormattedMessage
                      id="phrases.commonNameAccordingTo"
                      values={{ source: 'Catalogue of Life' }} // TODO taxonapi: if this is no longer a variable, then we can remove the variable
                    />
                  }
                >
                  <span
                    className="g-text-slate-300 g-inline-flex g-items-center"
                    style={{ fontSize: '85%' }}
                  >
                    <span className="g-me-1">{taxonInfo.vernacularName.vernacularName}</span>
                    <MdInfoOutline />
                  </span>
                </SimpleTooltip>
              )}
            </ArticleTitle>
            <div>
              {!isPrimaryTaxonomy && taxon.dataset && (
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
                      variables={{ key: taxon?.acceptedTaxon?.taxonID.toString() }}
                    >
                      <span
                        dangerouslySetInnerHTML={{
                          __html:
                            taxon?.acceptedTaxon?.label ||
                            taxon?.acceptedTaxon?.scientificName ||
                            '',
                        }}
                      ></span>
                    </DynamicLink>
                  </Button>
                </>
              )}
              {taxon.namePublishedIn && (
                <span className="g-inline">
                  <FormattedMessage id="taxon.publishedIn" />
                  {': '}
                  <HyperText
                    className="prose-links g-inline [&_p]:g-inline"
                    text={taxon.namePublishedIn}
                  />
                </span>
              )}
            </div>
            <HeaderInfo>
              <HeaderInfoMain>
                <FeatureList>
                  {!isPrimaryTaxonomy && taxon?.references && <Homepage url={taxon.references} />}
                  {/* TODO taxonapi: what is the equivallent here */}
                  {/* {isPrimaryTaxonomy && taxon?.iucnStatus?.distribution?.threatStatus && (
                    <GenericFeature>
                      <a href={taxon?.iucnStatus?.references} target="_blank">
                        <img
                          width={200}
                          src={`/iucnStatus/${taxon?.iucnStatus?.distribution?.threatStatus}.png`}
                        />
                      </a>
                    </GenericFeature>
                  )} */}
                  {/* {isPrimaryTaxonomy && isSpeciesOrBelow && (
                    <Cites taxonName={data.taxon?.canonicalName} kingdom={data.taxon?.kingdom} />
                  )} */}

                  {isPrimaryTaxonomy && (
                    <>
                      <div className="g-flex-auto g-min-w-0" />
                      <Button>
                        <DynamicLink
                          pageId="occurrenceSearch"
                          searchParams={{
                            taxonKey: taxon.taxonID.toString(),
                            checklistKey: primaryChecklist, // TODO taxonapi: this can be removed once primary checklist is default in occurrence search when taxonKey is used
                          }}
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
            {/* TODO taxonapi: not sure what this is */}
            {/* <SectionTabs isNub={isPrimaryTaxonomy} hasVerbatim={taxon?.origin === 'SOURCE'} /> */}
          </ArticleTextContainer>
        </PageContainer>
        <ErrorBoundary invalidateOn={taxon?.taxonID}>{children}</ErrorBoundary>
      </article>
    </>
  );
};

export const TaxonPageSkeleton = ArticleSkeleton;
