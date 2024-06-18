import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import * as charts from '@/components/dashboard';
import {
  DatasetQuery,
  DatasetInsightsQuery,
  DatasetInsightsQueryVariables,
  PredicateType,
} from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import { RouteId, useParentRouteLoaderData } from '@/hooks/useParentRouteLoaderData';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage, useIntl } from 'react-intl';
import { GeographicCoverages } from './about/GeographicCoverages';
import { TemporalCoverages } from './about/TemporalCoverages';
import { TaxonomicCoverages } from './about/TaxonomicCoverages';
import { SamplingDescription } from './about/SamplingDescription';
import { SimpleTooltip } from '@/components/SimpleTooltip';
import { MdInfo, MdInfoOutline } from 'react-icons/md';
import { ContactList } from '@/components/ContactList';
import { BibliographicCitations } from './about/BibliographicCitations';
import { Registration } from './about/Registration';
import { Citation } from './about/Citation';
import useQuery from '@/hooks/useQuery';
import { useEffect } from 'react';
import { Images } from './about/Images';
import { useConfig } from '@/contexts/config/config';
import { HyperText } from '@/components/HyperText';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ClientSideOnly } from '@/components/clientSideOnly';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import { Aside, AsideSticky, SidebarLayout } from '@/routes/occurrence/key/pagelayouts';
import { GbifLinkCard, Separator, TocLi } from '@/components/TocHelp';

export function DatasetKeyAbout() {
  const { data } = useParentRouteLoaderData(RouteId.Dataset) as { data: DatasetQuery };
  const removeSidebar = useBelow(1100);
  const { formatMessage } = useIntl();
  const config = useConfig();
  const sitePredicate = config?.occurrencePredicate;
  const { dataset } = data;

  const {
    data: insights,
    error,
    load,
    loading,
  } = useQuery<DatasetInsightsQuery, DatasetInsightsQueryVariables>(DATASET_SLOW, {
    throwAllErrors: true,
    lazyLoad: true,
  });

  useEffect(() => {
    if (!dataset?.key) return;
    const id = dataset?.key;
    const datasetPredicate = {
      type: PredicateType.Equals,
      key: 'datasetKey',
      value: id,
    };
    // we also want to know how many of those occurrences are included on the present site
    const predicates = [datasetPredicate];
    if (sitePredicate) predicates.push(sitePredicate);
    load({
      variables: {
        sitePredicate: {
          type: PredicateType.And,
          predicates,
        },
        datasetPredicate,
        imagePredicate: {
          type: PredicateType.And,
          predicates: [
            datasetPredicate,
            { type: PredicateType.Equals, key: 'mediaType', value: 'StillImage' },
          ],
        },
        coordinatePredicate: {
          type: PredicateType.And,
          predicates: [
            datasetPredicate,
            { type: PredicateType.Equals, key: 'hasCoordinate', value: 'true' },
            { type: PredicateType.Equals, key: 'hasGeospatialIssue', value: 'false' },
          ],
        },
        taxonPredicate: {
          type: PredicateType.And,
          predicates: [
            datasetPredicate,
            { type: PredicateType.Equals, key: 'issue', value: 'TAXON_MATCH_NONE' },
          ],
        },
        yearPredicate: {
          type: PredicateType.And,
          predicates: [datasetPredicate, { type: PredicateType.IsNotNull, key: 'year' }],
        },
        eventPredicate: {
          type: PredicateType.And,
          predicates: [datasetPredicate, { type: PredicateType.IsNotNull, key: 'eventId' }],
        },
      },
    });
  }, [dataset?.key]);

  if (!dataset) {
    return null; //TODO return loader or error
  }

  const hasSamplingDescription =
    dataset?.samplingDescription?.studyExtent ||
    dataset?.samplingDescription?.sampling ||
    dataset?.samplingDescription?.qualityControl ||
    (dataset?.samplingDescription?.methodSteps &&
      dataset?.samplingDescription?.methodSteps?.length > 0);

  const scopeSmallerThanDatasetMessage = formatMessage(
    {
      id: 'dataset.siteScopeSmallerThanDataset',
      defaultMessage: 'Visit [GBIF.org]({datasetUrl}) to explore the full dataset.',
    },
    { datasetUrl: `https://www.gbif.org/dataset/${dataset.key}` }
  );

  const predicate = {
    type: 'equals',
    key: 'datasetKey',
    value: dataset?.key,
  };

  const total = insights?.unfiltered?.documents?.total;
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {/* <div className={`${removeSidebar ? '' : 'g-flex'}`}> */}
        <SidebarLayout
          reverse
          className="g-grid-cols-[1fr_250px] xl:g-grid-cols-[1fr_300px]"
          stack={removeSidebar}
        >
          <div className="g-flex-grow">
            {insights?.siteOccurrences?.documents.total - total < 0 && (
              <div>
                <Alert variant="theme" className="g-mb-4">
                  <AlertDescription>
                    <HyperText
                      className="[&_a]:g-underline [&_a]:g-text-inherit"
                      text={scopeSmallerThanDatasetMessage}
                      sanitizeOptions={{ ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br'] }}
                    />
                  </AlertDescription>
                </Alert>
              </div>
            )}

            <Card className="g-mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.description" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                {dataset?.description && (
                  <div
                    className="g-prose g-mb-6 g-max-w-full"
                    dangerouslySetInnerHTML={{ __html: dataset.description }}
                  ></div>
                )}
              </CardContent>
              {total > 0 && (
                <CardContent>
                  <hr className="g-my-4" />
                  <p className="g-text-slate-400 g-mb-2 g-text-sm">Derrived from occurrence data</p>
                  <DashBoardLayout>
                    <charts.OccurrenceSummary predicate={predicate} />
                    <charts.DataQuality predicate={predicate} />
                  </DashBoardLayout>
                </CardContent>
              )}
            </Card>

            {insights?.images?.documents?.total > 0 && (
              <>
                <Images images={insights?.images} dataset={dataset} className="g-mb-4" />
              </>
            )}

            {dataset?.purpose && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="dataset.purpose" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="g-prose g-mb-6 g-max-w-full"
                    dangerouslySetInnerHTML={{ __html: dataset.purpose }}
                  ></div>
                </CardContent>
              </Card>
            )}
            {dataset?.geographicCoverages && dataset?.geographicCoverages?.length > 0 && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="dataset.geographicCoverages" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <GeographicCoverages geographicCoverages={dataset.geographicCoverages} />
                </CardContent>
                {total > 0 && (
                  <CardContent>
                    <hr className="g-my-4" />
                    <p className="g-text-slate-400 g-mb-2 g-text-sm">
                      Derrived from occurrence data
                    </p>
                    <DashBoardLayout>
                      <charts.Country
                        predicate={predicate}
                        visibilityThreshold={0}
                        interactive={false}
                      />
                      <charts.GadmGid
                        predicate={predicate}
                        visibilityThreshold={0}
                        interactive={false}
                      />
                    </DashBoardLayout>
                  </CardContent>
                )}
              </Card>
            )}
            {dataset?.temporalCoverages && dataset?.temporalCoverages?.length > 0 && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="dataset.temporalCoverages" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TemporalCoverages temporalCoverages={dataset.temporalCoverages} />
                </CardContent>
                {total > 0 && (
                  <CardContent>
                    <hr className="g-my-4" />
                    <p className="g-text-slate-400 g-mb-2 g-text-sm">
                      Derrived from occurrence data
                    </p>
                    <DashBoardLayout>
                      <charts.EventDate
                        predicate={predicate}
                        visibilityThreshold={1}
                        options={['TIME']}
                        interactive={false}
                      />
                      <charts.Months
                        predicate={predicate}
                        defaultOption="COLUMN"
                        visibilityThreshold={0}
                        interactive={false}
                      />
                    </DashBoardLayout>
                  </CardContent>
                )}
              </Card>
            )}
            {dataset?.taxonomicCoverages && dataset?.taxonomicCoverages?.length > 0 && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="dataset.taxonomicCoverages" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <TaxonomicCoverages taxonomicCoverages={dataset.taxonomicCoverages} />
                </CardContent>
                {total > 0 && (
                  <CardContent>
                    <hr className="g-my-4" />
                    <p className="g-text-slate-400 g-mb-2 g-text-sm">
                      Derrived from occurrence data
                    </p>
                    <charts.Taxa
                      predicate={predicate}
                      visibilityThreshold={0}
                      interactive={false}
                    />
                  </CardContent>
                )}
              </Card>
            )}
            {hasSamplingDescription && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="dataset.methodology" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <SamplingDescription dataset={dataset} />
                </CardContent>
              </Card>
            )}
            {total > 1 && (
              <section>
                <CardHeader>
                  <CardTitle>
                    <span className="g-me-2">
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
                <div className="g-text-slate-500">
                  <ClientSideOnly>
                    <DashBoardLayout>
                      <charts.OccurrenceIssue
                        predicate={predicate}
                        visibilityThreshold={0}
                        interactive={false}
                      />
                      <charts.Iucn
                        predicate={predicate}
                        visibilityThreshold={0}
                        interactive={false}
                      />
                      <charts.IucnCounts
                        predicate={predicate}
                        visibilityThreshold={1}
                        interactive={false}
                      />
                      <charts.RecordedBy
                        predicate={predicate}
                        visibilityThreshold={0}
                        defaultOption="TABLE"
                        interactive={false}
                      />
                    </DashBoardLayout>
                  </ClientSideOnly>
                </div>
              </section>
            )}
            {dataset?.additionalInfo && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="dataset.additionalInfo" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div
                    className="g-prose g-mb-6 g-max-w-full"
                    dangerouslySetInnerHTML={{ __html: dataset.additionalInfo }}
                  ></div>
                </CardContent>
              </Card>
            )}
            {dataset?.volatileContributors && dataset.volatileContributors.length > 0 && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="dataset.contacts" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ContactList contacts={dataset.volatileContributors} />
                </CardContent>
              </Card>
            )}
            {dataset?.bibliographicCitations && dataset.bibliographicCitations.length > 0 && (
              <Card className="g-mb-4">
                <CardHeader>
                  <CardTitle>
                    <FormattedMessage id="dataset.bibliography" />
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <BibliographicCitations
                    bibliographicCitations={dataset?.bibliographicCitations}
                  />
                </CardContent>
              </Card>
            )}
            <Card className="g-mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.registration" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Registration dataset={dataset} />
              </CardContent>
            </Card>
            <Card className="g-mb-4">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.registration" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Citation data={data} />
              </CardContent>
            </Card>
          </div>
          {!removeSidebar && (
            <Aside>
              <AsideSticky className="-g-mt-4">
                <Card>
                  <nav>
                    <ul className="g-list-none g-m-0 g-p-0 g-my-2">
                      <TocLi to="#description">Description</TocLi>
                      <TocLi to="#geographic-description">Geographic description</TocLi>
                      <TocLi to="#temporal-description">Temporal description</TocLi>
                      <TocLi to="#taxonomic-description">Taxonomic description</TocLi>
                      <TocLi to="#metrics">Metrics</TocLi>
                      <TocLi to="#additional-info">Additional info</TocLi>
                      <TocLi to="#gbif-registration">GBIF registration</TocLi>
                      <TocLi to="#citation">Citation</TocLi>
                    </ul>
                  </nav>
                </Card>
                <GbifLinkCard path={`/dataset/${dataset.key}`} />
              </AsideSticky>
            </Aside>
          )}
        </SidebarLayout>
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

const DATASET_SLOW = /* GraphQL */ `
  query DatasetInsights(
    $datasetPredicate: Predicate
    $imagePredicate: Predicate
    $coordinatePredicate: Predicate
    $taxonPredicate: Predicate
    $yearPredicate: Predicate
    $eventPredicate: Predicate
    $sitePredicate: Predicate
  ) {
    siteOccurrences: occurrenceSearch(predicate: $sitePredicate) {
      documents(size: 0) {
        total
      }
    }
    unfiltered: occurrenceSearch(predicate: $datasetPredicate) {
      documents(size: 0) {
        total
      }
      cardinality {
        eventId
      }
      facet {
        dwcaExtension {
          key
          count
        }
      }
    }
    images: occurrenceSearch(predicate: $imagePredicate) {
      documents(size: 10) {
        total
        results {
          key
          stillImages {
            identifier: thumbor(height: 400)
          }
        }
      }
    }
    withCoordinates: occurrenceSearch(predicate: $coordinatePredicate) {
      documents(size: 10) {
        total
      }
    }
    withTaxonMatch: occurrenceSearch(predicate: $taxonPredicate) {
      documents(size: 10) {
        total
      }
    }
    withYear: occurrenceSearch(predicate: $yearPredicate) {
      documents(size: 10) {
        total
      }
    }
    withEventId: occurrenceSearch(predicate: $eventPredicate) {
      documents(size: 10) {
        total
      }
    }
  }
`;
