import { useCount } from '@/components/count';
import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HeaderInfo, HeaderInfoEdit, HeaderInfoMain } from '@/components/headerComponents';
import { FeatureList, GenericFeature, Homepage, TaxonomyIcon } from '@/components/highlights';
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
import useBelow from '@/hooks/useBelow';
import { createContext, useMemo } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Outlet } from 'react-router-dom';
import { getTaxonSchema } from '../../../utils/schemaOrg';
import Cites from './Cites';
import { AboutContent, ApiContent } from './help';
import { HeaderImageCarousel } from './sections/SidebarImageCarousel';
import { useIsSpeciesOrBelow } from '@/hooks/taxonomyRankHooks';
import { HelpLine } from '@/components/helpText';
import { IucnTag } from '@/components/identifierTag';
import { Classification } from '@/components/classification';

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

  return (
    <PageHeader data={data}>
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
    <PageHeader data={data}>
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
            <SectionTabs isNub={false} />
          </Card>
        </ArticleTextContainer>
      </ArticleContainer>
      <Outlet />
    </TaxonKeyContext.Provider>
  );
};

const SectionTabs = ({
  isNub,
  occurrenceCount = 0,
}: {
  isNub: boolean;
  occurrenceCount?: number;
}) => {
  const tabs = useMemo<{ to: string; children: React.ReactNode }[]>(() => {
    const tabsToDisplay: { to: string; children: React.ReactNode }[] = [
      { to: '.', children: <FormattedMessage id="taxon.tabs.about" /> },
    ];
    if (isNub && occurrenceCount > 0) {
      tabsToDisplay.push({
        to: 'metrics',
        children: (
          <FormattedMessage id="taxon.tabs.occurrenceMetrics" defaultMessage="Occurrence metrics" />
        ),
      });
    }

    return tabsToDisplay;
  }, [occurrenceCount, isNub]);

  return <Tabs links={tabs} />;
};

const PageHeader = ({ data, children }: { data: TaxonKeyQuery; children?: React.ReactNode }) => {
  const { taxonInfo } = data;
  const taxon = taxonInfo?.taxon;
  if (!taxon) throw new NotFoundError();

  const isPrimaryTaxonomy = taxonInfo?.taxon?.datasetKey === primaryChecklist;
  const { count, loading: countLoading } = useCount({
    apiEndpoint: '/v1/occurrence/search',
    params: { taxonKey: taxonInfo?.taxon?.taxonID, checklistKey: primaryChecklist },
  });

  const { count: speciesCount } = useCount({
    apiEndpoint: `/v2/taxon/search/${primaryChecklist}`,
    params: {
      taxonId: taxonInfo?.taxon?.taxonID,
      taxonRank: 'SPECIES',
    },
  });

  const isSpeciesOrBelow = useIsSpeciesOrBelow(taxon.taxonRank);
  const hideHeaderImage = useBelow(700);
  const hasOccurrenceImages = (taxon?.occurrenceMedia?.count ?? 0) > 0;

  const kingdom = taxonInfo?.classification?.find((c) => c.taxonRank === 'KINGDOM')?.scientificName;
  return (
    <>
      <PageMetaData
        title={taxon.scientificName}
        jsonLd={isPrimaryTaxonomy ? getTaxonSchema(data) : undefined}
        path={`/taxon/${taxonInfo?.taxon?.taxonID}`} // TODO taxonapi: this should be updated to match the path for datasets? Or do we exclude them?
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
            <div className="g-flex">
              {!hideHeaderImage && (
                <div className="g-flex-none g-me-12 g-w-[250px] xl:g-w-[300px] g-self-start">
                  {hasOccurrenceImages && <HeaderImageCarousel taxon={taxon} />}
                  {!hasOccurrenceImages && (
                    <div
                      className="g-relative g-w-full g-bg-neutral-100 g-rounded g-overflow-hidden"
                      style={{ paddingBottom: '75%' }}
                    >
                      <div className="g-absolute g-inset-0 g-flex g-flex-col g-items-center g-justify-center">
                        <div className="g-flex g-items-center g-justify-center g-w-full g-h-full">
                          <img
                            src={taxonInfo.groupIconSVG}
                            alt=""
                            className="g-opacity-60"
                            style={{
                              maxWidth: '50%',
                              height: '100%',
                              maxHeight: '50%',
                              display: 'block',
                              objectFit: 'contain',
                            }}
                          />
                        </div>
                        <div className="g-absolute g-bottom-1 g-mx-auto g-text-center g-bg-slate-100 g-opacity-50 g-p-1 g-rounded g-text-sm g-text-slate-800">
                          <FormattedMessage
                            id="taxon.noRecordsWithImages"
                            defaultMessage="No records with images"
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="g-flex-auto g-flex g-flex-col">
                <div className="g-flex-auto">
                  <ArticlePreTitle
                    secondary={
                      taxon.taxonomicStatus === 'DOUBTFUL' ? (
                        <HelpLine
                          id="what-does-the-taxon-status-doubtful-mean-and-when-is-used"
                          icon
                          contentClassName="g-w-auto g-max-w-[min(42rem,100vw)]"
                          title={
                            <span className="">
                              <FormattedMessage
                                id={`enums.taxonomicStatus.${taxon.taxonomicStatus}`}
                              />
                            </span>
                          }
                        />
                      ) : (
                        <FormattedMessage id={`enums.taxonomicStatus.${taxon.taxonomicStatus}`} />
                      )
                    }
                  >
                    <DynamicLink pageId="taxonSearch" searchParams={{ taxonRank: taxon.taxonRank }}>
                      <FormattedMessage
                        id={`enums.taxonRank.${taxon.taxonRank}`}
                        defaultMessage={taxon.taxonRank || ''}
                      />
                    </DynamicLink>
                  </ArticlePreTitle>
                  {/* it would be nice to know for sure which fields to expect */}
                  <ArticleTitle className="lg:g-text-3xl">
                    <span
                      className="g-me-4"
                      dangerouslySetInnerHTML={{
                        __html: taxon?.label || taxon?.scientificName || '',
                      }}
                    />
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
                            pageId="taxonKey"
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

                    {!taxon.acceptedTaxon && taxonInfo.vernacularName && (
                      <div className="g-mb-1">
                        <SimpleTooltip
                          asChild
                          title={
                            <FormattedMessage
                              id="phrases.commonNameAccordingTo"
                              values={{ source: 'Catalogue of Life' }} // TODO taxonapi: if this is no longer a variable, then we can remove the variable
                            />
                          }
                        >
                          <span className="g-text-slate-600 g-inline-flex g-items-center">
                            <span className="g-me-1">
                              {taxonInfo.vernacularName.vernacularName}
                            </span>
                            <MdInfoOutline />
                          </span>
                        </SimpleTooltip>
                      </div>
                    )}

                    {!taxon.acceptedTaxon && taxonInfo?.classification && (
                      // Show the 2 top levels of classification if this is not a synonym. Then ... and then the lowest parent. ... should only show if there is something in between of course. It should be links to the entries
                      <Classification className="g-mt-2 g-flex g-flex-wrap g-gap-1 g-items-center">
                        {taxonInfo.classification.slice(0, 2).map((c) => (
                          <span key={c.taxonID} className="g-flex g-items-center">
                            <DynamicLink
                              className="hover:g-underline"
                              pageId="taxonKey"
                              variables={{ key: c.taxonID.toString() }}
                            >
                              {c.scientificName}
                            </DynamicLink>
                          </span>
                        ))}
                        {taxonInfo.classification.length > 3 && <span>...</span>}
                        {taxonInfo.classification.length > 2 && (
                          <span className="g-flex g-items-center">
                            <DynamicLink
                              className="hover:g-underline"
                              pageId="taxonKey"
                              variables={{
                                key: taxonInfo.classification[
                                  taxonInfo.classification.length - 1
                                ].taxonID.toString(),
                              }}
                            >
                              {
                                taxonInfo.classification[taxonInfo.classification.length - 1]
                                  .scientificName
                              }
                            </DynamicLink>
                          </span>
                        )}
                      </Classification>
                    )}
                  </div>
                </div>
                <HeaderInfo className="g-flex-none g-mb-0">
                  <HeaderInfoMain>
                    <FeatureList>
                      {speciesCount > 0 && (
                        <GenericFeature>
                          <TaxonomyIcon />
                          <DynamicLink
                            pageId="taxonSearch"
                            searchParams={{ taxonId: taxon.taxonID }}
                            className="hover:g-underline"
                          >
                            <FormattedMessage
                              id="counts.nSpecies"
                              values={{ total: speciesCount }}
                            />
                          </DynamicLink>
                        </GenericFeature>
                      )}
                      {!isPrimaryTaxonomy && taxon?.references && (
                        <Homepage url={taxon.references} />
                      )}
                      {/* TODO taxonapi: what is the equivallent here  */}
                      {isPrimaryTaxonomy && taxon.relatedInfo?.redlist?.threatStatus && (
                        <GenericFeature>
                          <IucnTag
                            statusCategory={taxon.relatedInfo?.redlist?.threatStatus}
                            as="a"
                            href={
                              taxon.relatedInfo?.redlist?.link ??
                              `https://www.iucnredlist.org/search?query=${taxon.scientificName}&searchType=species`
                            }
                            target="_blank"
                          />
                        </GenericFeature>
                      )}
                      {isPrimaryTaxonomy && isSpeciesOrBelow && (
                        <Cites taxonName={taxon.scientificName} kingdom={kingdom} />
                      )}
                    </FeatureList>
                  </HeaderInfoMain>
                  {isPrimaryTaxonomy && (
                    <HeaderInfoEdit>
                      <Button>
                        <DynamicLink
                          pageId="occurrenceSearch"
                          searchParams={{
                            taxonKey: taxon.taxonID.toString(),
                            checklistKey: primaryChecklist, // TODO taxonapi: this can be removed once primary checklist is default in occurrence search when taxonKey is used
                          }}
                        >
                          {countLoading ? (
                            <FormattedMessage id="phrases.loading" />
                          ) : (
                            <FormattedMessage id="counts.nOccurrences" values={{ total: count }} />
                          )}
                        </DynamicLink>
                      </Button>
                    </HeaderInfoEdit>
                  )}
                </HeaderInfo>
              </div>
            </div>
            <div className="g-border-b g-mt-4"></div>
            {/* TODO taxonapi: not sure what this is */}
            <SectionTabs isNub={isPrimaryTaxonomy} occurrenceCount={count} />
          </ArticleTextContainer>
        </PageContainer>
        <ErrorBoundary invalidateOn={taxon?.taxonID}>{children}</ErrorBoundary>
      </article>
    </>
  );
};

export const TaxonPageSkeleton = ArticleSkeleton;
