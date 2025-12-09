import { ClientSideOnly } from '@/components/clientSideOnly';
import { ContactList } from '@/components/contactList';
import * as charts from '@/components/dashboard';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import EmptyValue from '@/components/emptyValue';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HyperText } from '@/components/hyperText';
import { Message } from '@/components/message';
import { TableOfContents } from '@/components/tableOfContents';
import { GbifLinkCard } from '@/components/TocHelp';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/largeCard';
import { Progress } from '@/components/ui/progress';
import { CardContent as CardContentSmall } from '@/components/ui/smallCard';
import { useConfig } from '@/config/config';
import {
  DatasetInsightsQuery,
  DatasetInsightsQueryVariables,
  DatasetQuery,
  DatasetType,
  Predicate,
  PredicateType,
} from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import useQuery from '@/hooks/useQuery';
import { DynamicLink } from '@/reactRouterPlugins';
import { Aside, AsideSticky, SidebarLayout } from '@/routes/occurrence/key/pagelayouts';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import formatAsPercentage from '@/utils/formatAsPercentage';
import { useEffect, useMemo, useState } from 'react';
import { GiDna1 } from 'react-icons/gi';
import { MdGridOn, MdInfoOutline } from 'react-icons/md';
import { TiPipette as SamplingIcon } from 'react-icons/ti';
import { FormattedDate, FormattedMessage, useIntl } from 'react-intl';
import { useDatasetKeyLoaderData } from '.';
import { BibliographicCitations } from './about/BibliographicCitations';
import { Citation } from './about/Citation';
import { GeographicCoverages } from './about/GeographicCoverages';
import { Images } from './about/Images';
import { Registration } from './about/Registration';
import { SamplingDescription } from './about/SamplingDescription';
import { TaxonomicCoverages } from './about/TaxonomicCoverages';
import { TemporalCoverages } from './about/TemporalCoverages';
import { ExternalLinkIcon } from '@radix-ui/react-icons';
import { truncate } from '@/utils/truncate';
import { MapWidget } from '@/components/maps/mapWidget';
import { MapTypes, useHasMap } from '@/components/maps/mapThumbnail';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/utils/shadcn';
import { PublishingCountries } from './about/PublishingCountries';
import { TrustedSection } from '@/routes/occurrence/download/key/sections/deletionNotice';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';

export function DatasetKeyAbout() {
  const { user } = useUser();
  const config = useConfig();
  const { data } = useDatasetKeyLoaderData() as { data: DatasetQuery };
  const { dataset } = data;
  const defaultToc = getToc(data);
  const hasPreprocessedMap = useHasMap({
    type: MapTypes.DatasetKey,
    identifier: data?.dataset?.key ?? '',
  });
  const hasLocalContext =
    (dataset?.localContexts?.length ?? 0) > 0 && config.experimentalFeatures.localContextEnabled;

  const [toc, setToc] = useState(defaultToc);
  const removeSidebar = useBelow(1100);
  const { formatMessage } = useIntl();
  const [scopedDatasetPredicate, setScopedDatasetPredicate] = useState<Predicate>({
    type: PredicateType.Equals,
    key: 'datasetKey',
    value: dataset?.key,
  });

  const sitePredicate = config?.occurrenceSearch?.scope as Predicate;
  useEffect(() => {
    if (!dataset?.key) return;
    const datasetPredicate = {
      type: PredicateType.Equals,
      key: 'datasetKey',
      value: dataset.key,
    };
    const scope = (sitePredicate as Predicate)
      ? { type: PredicateType.And, predicates: [sitePredicate, datasetPredicate] }
      : datasetPredicate;
    setScopedDatasetPredicate(scope);
  }, [sitePredicate, dataset?.key]);

  const { data: insights, load } = useQuery<DatasetInsightsQuery, DatasetInsightsQueryVariables>(
    DATASET_SLOW,
    {
      throwAllErrors: false,
      lazyLoad: true,
      notifyOnErrors: true,
    }
  );

  const isUserDatasetContact = useMemo(() => {
    if (!user || !dataset?.volatileContributors) return false;
    // has matching email
    const matchingEmail = dataset.volatileContributors.some((contact) =>
      contact?.email?.some((email) => email === user.email)
    );
    // or has matching orcid in userIdentifiers
    const matchingOrcid = dataset.volatileContributors.some((contact) =>
      contact?.userId?.some((identifier) => identifier === user.orcid)
    );
    // or user is registry admin
    const isAdmin = user?.roles?.includes('REGISTRY_ADMIN');
    return matchingEmail || matchingOrcid || isAdmin;
  }, [user, dataset?.volatileContributors]);

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
            ...predicates,
            { type: PredicateType.Equals, key: 'mediaType', value: 'StillImage' },
          ],
        },
        coordinatePredicate: {
          type: PredicateType.And,
          predicates: [
            ...predicates,
            { type: PredicateType.Equals, key: 'hasCoordinate', value: 'true' },
            { type: PredicateType.Equals, key: 'hasGeospatialIssue', value: 'false' },
          ],
        },
        taxonPredicate: {
          type: PredicateType.And,
          predicates: [
            ...predicates,
            { type: PredicateType.Equals, key: 'issue', value: 'TAXON_MATCH_NONE' },
          ],
        },
        eventDatePredicate: {
          type: PredicateType.And,
          predicates: [...predicates, { type: PredicateType.IsNotNull, key: 'eventDate' }],
        },
        eventPredicate: {
          type: PredicateType.And,
          predicates: [...predicates, { type: PredicateType.IsNotNull, key: 'eventId' }],
        },
      },
    });
  }, [dataset?.key, sitePredicate, load]);

  // when dataset or insights change, then recalculate which items go into the table of contents
  useEffect(() => {
    setToc(getToc(data, insights));
  }, [data, insights]);

  const scopeSmallerThanDatasetMessage = formatMessage(
    {
      id: 'dataset.siteScopeSmallerThanDataset',
      defaultMessage: 'Visit [GBIF.org]({datasetUrl}) to explore the full dataset.',
    },
    { datasetUrl: `https://www.gbif.org/dataset/${dataset.key}` }
  );

  const chartPredicate = scopedDatasetPredicate;

  const tableOfContents = useMemo(() => {
    if (!dataset || !toc) return [];
    const tableOfContents = [
      { id: 'description', title: <FormattedMessage id="dataset.description" /> },
    ];
    if (toc.purpose) {
      tableOfContents.push({
        id: 'purpose',
        title: <FormattedMessage id="dataset.purpose" />,
      });
    }
    if (toc.geographicDescription) {
      tableOfContents.push({
        id: 'geographic-description',
        title: <FormattedMessage id="dataset.geographicCoverages" />,
      });
    }
    if (toc.temporalDescription) {
      tableOfContents.push({
        id: 'temporal-description',
        title: <FormattedMessage id="dataset.temporalCoverages" />,
      });
    }
    if (toc.taxonomicDescription) {
      tableOfContents.push({
        id: 'taxonomic-description',
        title: <FormattedMessage id="dataset.taxonomicCoverages" />,
      });
    }
    if (toc.methodology) {
      tableOfContents.push({
        id: 'methodology',
        title: <FormattedMessage id="dataset.methodology" />,
      });
    }
    if (toc.metrics) {
      tableOfContents.push({
        id: 'metrics',
        title: <FormattedMessage id="dataset.metrics" />,
      });
    }
    if (toc.additionalInfo) {
      tableOfContents.push({
        id: 'additional-info',
        title: <FormattedMessage id="dataset.additionalInfo" />,
      });
    }
    if (toc.bibliography) {
      tableOfContents.push({
        id: 'bibliography',
        title: <FormattedMessage id="dataset.bibliography" />,
      });
    }
    if (toc.contacts) {
      tableOfContents.push({
        id: 'contacts',
        title: <FormattedMessage id="dataset.contacts" />,
      });
    }
    tableOfContents.push({
      id: 'registration',
      title: <FormattedMessage id="dataset.registration" />,
    });
    tableOfContents.push({ id: 'citation', title: <FormattedMessage id="dataset.citation" /> });
    return tableOfContents;
  }, [dataset, toc]);

  if (!dataset) {
    return null; //TODO return loader or error
  }

  const total = insights?.unfiltered?.documents?.total;
  const siteTotal = insights?.siteOccurrences?.documents?.total;
  const reducedOccurrenceScope = siteTotal - total < 0;

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
            {reducedOccurrenceScope && (
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

            {isUserDatasetContact && (
              <TrustedSection>
                <div className="g-text-slate-600 g-mb-1">
                  <FormattedMessage id="dataset.registry.becauseTrustedContact" />
                </div>
                <div className="g-flex g-gap-2">
                  <Button asChild>
                    <a
                      href={`${import.meta.env.PUBLIC_REGISTRY}/dataset/${
                        dataset.key
                      }/ingestion-history`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FormattedMessage id="dataset.history" defaultMessage="History" />
                    </a>
                  </Button>
                  <Button variant="outline" asChild>
                    <a
                      href={`https://logs.gbif.org/app/discover#/?_g=(filters:!(),refreshInterval:(pause:!t,value:60000),time:(from:now-30m,to:now))&_a=(columns:!(),dataSource:(dataViewId:'439da4d0-290a-11ed-8155-a37cb1ead50e',type:dataView),filters:!(),interval:auto,query:(language:kuery,query:'datasetKey.keyword%20%3D%20${dataset.key}'),sort:!(!('@timestamp',desc)))`}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <FormattedMessage id="dataset.logs" defaultMessage="Logs" />
                    </a>
                  </Button>
                </div>
                <div className="g-text-slate-600 g-mt-2">
                  {dataset.modified && (
                    <div>
                      <FormattedMessage id="dataset.registry.metdataLastModified" />:{' '}
                      <FormattedDate
                        value={dataset.modified}
                        year="numeric"
                        month="long"
                        day="2-digit"
                      />
                    </div>
                  )}
                </div>
              </TrustedSection>
            )}

            {siteTotal > 0 && dataset.type === DatasetType.Metadata && (
              <Alert variant="destructive" className="g-mb-4">
                <AlertTitle>Metadata only dataset with data</AlertTitle>
                <AlertDescription>
                  This dataset was published as a metadata-only dataset but contains occurrence
                  data. This indicates that the data was wrongly mapped.
                </AlertDescription>
              </Alert>
            )}

            <Card className="g-mb-4" id="description">
              <CardHeader className="gbif-word-break">
                <CardTitle>
                  <FormattedMessage id="dataset.description" />
                </CardTitle>
                <CardDescription>
                  <div className="g-text-sm g-text-slate-500 g-flex g-flex-wrap g-gap-2 g-justify-between">
                    {dataset.pubDate && (
                      <div>
                        <FormattedMessage id="dataset.registry.pubDate" />:{' '}
                        <FormattedDate
                          value={dataset.pubDate}
                          year="numeric"
                          month="long"
                          day="2-digit"
                        />
                      </div>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dataset?.description && (
                  <div
                    className="gbif-word-break g-prose g-mb-6 g-max-w-full"
                    dangerouslySetInnerHTML={{ __html: dataset.description }}
                  ></div>
                )}
                {!dataset?.description && <EmptyValue />}
              </CardContent>
            </Card>

            {/* <DataSummary data={data} insights={insights} /> */}

            {insights?.images?.documents?.total > 0 && (
              <>
                <Images images={insights?.images} dataset={dataset} className="g-mb-4" />
              </>
            )}

            {hasPreprocessedMap && !reducedOccurrenceScope && (
              <ClientSideOnly>
                <MapWidget
                  className="g-mb-4"
                  capabilitiesParams={{ datasetKey: dataset.key }}
                  mapStyle="CLASSIC_HEX"
                />
              </ClientSideOnly>
            )}
            {siteTotal > 0 && (
              <div className="g-text-slate-500">
                <ClientSideOnly>
                  <DashBoardLayout>
                    <charts.OccurrenceSummary predicate={chartPredicate} />
                    <charts.DataQuality
                      predicate={chartPredicate}
                      optional={['hasSequence', 'hasMedia', 'hasCollector']}
                    />
                  </DashBoardLayout>
                </ClientSideOnly>
              </div>
            )}

            {toc.purpose && (
              <Card className="g-mb-4 gbif-word-break" id="purpose">
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

            {toc?.geographicDescription && (
              <Card className="g-mb-4" id="geographic-description">
                <CardHeader className="gbif-word-break">
                  <CardTitle>
                    <FormattedMessage id="dataset.geographicCoverages" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="gbif-word-break">
                  <GeographicCoverages geographicCoverages={dataset.geographicCoverages} />
                </CardContent>
              </Card>
            )}

            <PublishingCountries datasetKey={dataset.key} />

            {toc?.temporalDescription && (
              <Card className="g-mb-4" id="temporal-description">
                <CardHeader className="gbif-word-break">
                  <CardTitle>
                    <FormattedMessage id="dataset.temporalCoverages" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="gbif-word-break">
                  <TemporalCoverages temporalCoverages={dataset.temporalCoverages} />
                </CardContent>
              </Card>
            )}
            {toc?.taxonomicDescription && (
              <Card className="g-mb-4" id="taxonomic-description">
                <CardHeader className="gbif-word-break">
                  <CardTitle>
                    <FormattedMessage id="dataset.taxonomicCoverages" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="gbif-word-break">
                  <TaxonomicCoverages taxonomicCoverages={dataset.taxonomicCoverages} />
                </CardContent>
              </Card>
            )}
            {toc?.methodology && (
              <Card className="g-mb-4 gbif-word-break" id="methodology">
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
            {toc?.additionalInfo && (
              <Card className="g-mb-4 gbif-word-break" id="additional-info">
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
            {toc?.bibliography && (
              <Card className="g-mb-4 gbif-word-break" id="bibliography">
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
            {toc?.contacts && (
              <Card className="g-mb-4 gbif-word-break" id="contacts">
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
            <Card className="g-mb-4 gbif-word-break" id="registration">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.registration" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ErrorBoundary type="BLOCK" showReportButton={false}>
                  <Registration dataset={dataset} />
                </ErrorBoundary>
              </CardContent>
            </Card>
            <Card className="g-mb-4 gbif-word-break" id="citation">
              <CardHeader>
                <CardTitle>
                  <FormattedMessage id="dataset.citation" />
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Citation data={data} />
              </CardContent>
            </Card>
          </div>
          {!removeSidebar && (
            <Aside>
              {hasLocalContext &&
                dataset?.localContexts?.map((localContext) => {
                  if (!localContext?.project_page) return null;
                  return (
                    <Card className="g-mb-4 gbif-word-break" key={localContext?.project_page}>
                      <CardContentSmall className="g-flex g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
                        <div className="g-flex-none g-me-2">
                          <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                            <ExternalLinkIcon />
                          </div>
                        </div>
                        <div className="g-flex-auto g-mt-0.5">
                          <a
                            href={localContext?.project_page}
                            target="_blank"
                            rel="noreferrer"
                            className="g-flex g-items-center g-underline"
                          >
                            <h5 className="g-font-bold">{localContext?.title}</h5>
                          </a>
                          {localContext?.description && (
                            <div className="g-text-slate-500 [&_a]:g-underline">
                              {truncate(localContext?.description, 120)}
                            </div>
                          )}
                          <ul className="g-mt-2">
                            {localContext?.notes
                              ?.filter((x) => x)
                              .map((note, i) => {
                                if (!note || !note.img_url) return null;
                                return (
                                  <li
                                    className="g-flex g-items-start g-mb-2"
                                    key={`${note.name}-${i}`}
                                  >
                                    <img
                                      className="g-flex-none g-me-2 g-w-5 g-h-5"
                                      src={note.img_url}
                                      alt={note.name}
                                      title={note.name}
                                    />
                                    <div className="g-flex-auto">
                                      <a
                                        href={note.pageUrl}
                                        target="_blank"
                                        rel="noreferrer"
                                        className="g-underline g-text-inherit"
                                      >
                                        {note.name}
                                      </a>
                                    </div>
                                  </li>
                                );
                              })}
                          </ul>
                        </div>
                      </CardContentSmall>
                    </Card>
                  );
                })}
              <AsideSticky className="-g-mt-4">
                <Card>
                  <h4 className="g-text-sm g-font-semibold g-mx-4 g-mt-3 g-text-slate-600">
                    <FormattedMessage id="phrases.pageToc" />
                  </h4>
                  <nav className="g-pb-2">
                    <TableOfContents sections={tableOfContents} />
                  </nav>
                </Card>
                <GbifLinkCard path={`/dataset/${dataset.key}`} className="g-mt-4 g-mb-4" />
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
    $eventDatePredicate: Predicate
    $eventPredicate: Predicate
    $sitePredicate: Predicate
  ) {
    unfiltered: occurrenceSearch(predicate: $datasetPredicate) {
      documents(size: 0) {
        total
      }
    }
    siteOccurrences: occurrenceSearch(predicate: $sitePredicate) {
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
    withEventDate: occurrenceSearch(predicate: $eventDatePredicate) {
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

function getToc(data?: DatasetQuery, insights?: DatasetInsightsQuery) {
  const dataset = data?.dataset;
  if (!dataset) return;

  const hasSamplingDescription =
    dataset?.samplingDescription?.studyExtent ||
    dataset?.samplingDescription?.sampling ||
    dataset?.samplingDescription?.qualityControl ||
    (dataset?.samplingDescription?.methodSteps &&
      dataset?.samplingDescription?.methodSteps?.length > 0);

  const toc = {
    description: true,
    purpose: dataset?.purpose,
    geographicDescription: (dataset?.geographicCoverages?.length ?? 0) > 0,
    temporalDescription: (dataset?.temporalCoverages?.length ?? 0) > 0,
    taxonomicDescription: (dataset?.taxonomicCoverages?.length ?? 0) > 0,
    methodology: hasSamplingDescription,
    metrics: insights?.siteOccurrences?.documents?.total > 1,
    additionalInfo: dataset?.additionalInfo,
    contacts: (dataset?.volatileContributors?.length ?? 0) > 0,
    bibliography: (dataset?.bibliographicCitations?.length ?? 0) > 0,
    registration: true,
    citation: true,
  };
  return toc;
}

function DataSummary({ data, insights }: { data: DatasetQuery; insights?: DatasetInsightsQuery }) {
  const { dataset, totalTaxa, accepted, synonyms } = data;
  if (!dataset || dataset.type === DatasetType.Metadata) return null;

  const siteTotal = insights?.siteOccurrences?.documents?.total ?? 0;

  // Calculate percentages
  const withCoordinates = insights?.withCoordinates?.documents?.total ?? 0;
  const withEventDate = insights?.withEventDate?.documents?.total ?? 0;
  const withTaxonMatch = siteTotal - (insights?.withTaxonMatch?.documents?.total ?? 0);

  const withCoordinatesPercentage = formatAsPercentage(withCoordinates / siteTotal);
  const eventDatePercentage = formatAsPercentage(withEventDate / siteTotal);
  const withTaxonMatchPercentage = formatAsPercentage(withTaxonMatch / siteTotal);

  // Check for special dataset types
  const isGridded = (dataset?.gridded?.[0]?.percent ?? 0) > 0.5;
  const hasDna = (insights?.siteOccurrences?.facet?.dwcaExtension || []).find(
    (ext) => ext?.key === 'http://rs.gbif.org/terms/1.0/DNADerivedData'
  );
  const withEventId = insights?.siteOccurrences?.cardinality?.eventId ?? 0;
  const labelAsEventDataset =
    dataset.type === 'SAMPLING_EVENT' || (withEventId > 1 && withEventId / siteTotal < 0.99);

  const taxonMatchFilter = {
    must: { datasetKey: [dataset.key], taxonKey: [{ type: 'isNotNull' }] },
  };
  const taxonMatchLink = btoa(JSON.stringify(taxonMatchFilter));

  const eventNotNullFilter = {
    must: { datasetKey: [dataset.key], eventDate: [{ type: 'isNotNull' }] },
  };
  const eventDateLink = btoa(JSON.stringify(eventNotNullFilter));

  // for checklists
  const colOverlap = dataset.metrics?.colCoveragePct;
  const synonymsPercentage = formatAsPercentage((synonyms?.count ?? 0) / (totalTaxa?.count ?? 0));
  const acceptedPercentage = formatAsPercentage((accepted?.count ?? 0) / (totalTaxa?.count ?? 0));

  return (
    <>
      <div className="g-mb-4 g-text-slate-600 g-text-sm g-bg-slate-500/5 g-p-4 g-rounded">
        {/* Occurrence quality metrics - linkable to occurrence search */}
        {siteTotal > 0 && (
          <DataSummaryBlock>
            <DataSummaryLink
              pageId="occurrenceSearch"
              searchParams={{
                datasetKey: [dataset.key],
                hasCoordinate: ['true'],
                hasGeospatialIssue: ['false'],
              }}
            >
              <FormattedMessage
                id="counts.percentWithCoordinates"
                values={{ percent: withCoordinatesPercentage }}
              />
              <Progress value={parseFloat(withCoordinatesPercentage)} className="g-h-1" />
            </DataSummaryLink>
            <DataSummaryLink pageId="occurrenceSearch" searchParams={{ filter: eventDateLink }}>
              <FormattedMessage
                id="counts.percentWithDate"
                values={{ percent: eventDatePercentage }}
              />
              <Progress value={parseFloat(eventDatePercentage)} className="g-h-1" />
            </DataSummaryLink>
            <DataSummaryLink pageId="occurrenceSearch" searchParams={{ filter: taxonMatchLink }}>
              <FormattedMessage
                id="counts.percentWithTaxonMatch"
                values={{ percent: withTaxonMatchPercentage }}
              />
              <Progress value={parseFloat(withTaxonMatchPercentage)} className="g-h-1" />
            </DataSummaryLink>
          </DataSummaryBlock>
        )}

        {/* checklist based metrics - linkable to the taxonomy tab */}
        {dataset?.type === DatasetType.Checklist && (
          <DataSummaryBlock>
            <DataSummaryLink to={`./species?status=ACCEPTED`}>
              <FormattedMessage
                id="counts.nAcceptedNames"
                values={{ total: accepted?.count ?? 0 }}
              />
              <Progress value={acceptedPercentage} className="g-h-1" />
            </DataSummaryLink>
            <DataSummaryLink to={`./species?status=SYNONYM`}>
              <FormattedMessage id="counts.nSynonyms" values={{ total: synonyms?.count ?? 0 }} />
              <Progress value={synonymsPercentage} className="g-h-1" />
            </DataSummaryLink>

            {/* {gbifOverlap && (
              <DataSummaryInfo>
                <FormattedMessage
                  id="counts.gbifOverlapPercent"
                  values={{ percent: gbifOverlap }}
                />{' '}
              </DataSummaryInfo>
            )} */}

            {colOverlap && (
              <DataSummaryInfo>
                <FormattedMessage id="counts.colOverlapPercent" values={{ percent: colOverlap }} />{' '}
              </DataSummaryInfo>
            )}
          </DataSummaryBlock>
        )}

        {/* Special dataset type indicators - informational only */}
        {siteTotal > 0 && (isGridded || hasDna || labelAsEventDataset) && (
          <DataSummaryBlock className="g-mt-4">
            {isGridded && (
              <DataSummaryInfo popupContent={<Message id="dataset.griddedDataDescription" />}>
                <MdGridOn className="g-me-2" />
                <FormattedMessage id="dataset.griddedData" />
                <MdInfoOutline />
              </DataSummaryInfo>
            )}
            {hasDna && (
              <DataSummaryInfo popupContent={<Message id="dataset.includesDnaDescription" />}>
                <GiDna1 className="g-me-2" />
                <FormattedMessage id="dataset.includesDna" />
                <MdInfoOutline />
              </DataSummaryInfo>
            )}
            {labelAsEventDataset && (
              <DataSummaryInfo
                popupContent={<Message id="dataset.containsSamplingEventsDescription" />}
              >
                <SamplingIcon className="g-me-2" />
                <FormattedMessage id="dataset.containsSamplingEvents" />
                <MdInfoOutline />
              </DataSummaryInfo>
            )}
          </DataSummaryBlock>
        )}
      </div>
    </>
  );
}

function DataSummaryBlock({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'g-w-full g-flex g-flex-wrap md:g-flex-nowrap sm:g-items-end g-flex-col sm:g-flex-row',
        className
      )}
    >
      {children}
    </div>
  );
}

function DataSummaryLink({
  children,
  pageId,
  searchParams,
  to,
  className,
}: {
  children: React.ReactNode;
  pageId?: string;
  searchParams?: Record<string, string | string[]>;
  to?: string;
  className?: string;
}) {
  return (
    <DynamicLink
      to={to}
      pageId={pageId}
      searchParams={searchParams}
      className={cn('sm:g-w-1/3 sm:g-flex-none g-px-2 hover:g-text-primary-700', className)}
    >
      {children}
    </DynamicLink>
  );
}

function DataSummaryInfo({
  children,
  popupContent,
  className,
}: {
  children: React.ReactNode;
  popupContent?: React.ReactNode;
  className?: string;
}) {
  const classes =
    'sm:g-w-1/3 sm:g-flex-none g-border-2 g-rounded-full g-border-primary-500 g-px-2 g-py-1 g-flex-inline g-gap-1 g-items-center';
  if (!popupContent) {
    return <div className={cn(classes, className)}>{children}</div>;
  }
  return (
    <Popover>
      <PopoverTrigger className={cn(classes, 'g-cursor-pointer', className)}>
        {children}
      </PopoverTrigger>
      <PopoverContent className="g-prose g-w-96">{popupContent}</PopoverContent>
    </Popover>
  );
}
