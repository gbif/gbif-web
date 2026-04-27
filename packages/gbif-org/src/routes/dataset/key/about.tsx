import { ClientSideOnly } from '@/components/clientSideOnly';
import { ContactList } from '@/components/contactList';
import * as charts from '@/components/dashboard';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import EmptyValue from '@/components/emptyValue';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HyperText } from '@/components/hyperText';
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
import { Aside, AsideSticky, SidebarLayout } from '@/routes/occurrence/key/pagelayouts';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage, useIntl } from 'react-intl';
import { LongDate } from '@/components/dateFormats';
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
import { notNull } from '@/utils/notNull';
import { MapWidget } from '@/components/maps/mapWidget';
import { useHasMap } from '@/components/maps/mapThumbnail';
import { PublishingCountries } from './about/PublishingCountries';
import { UserAvatarSection } from '@/components/userAvatarSection';
import { useUser } from '@/contexts/UserContext';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { DatasetKeyLoaderResult } from './datasetKey';

export function DatasetKeyAbout() {
  const config = useConfig();
  const { dataset } = useDatasetKeyLoaderData().data;
  const hasPreprocessedMap = useHasMap({
    datasetKey: dataset?.key ?? '',
    checklistKey: config.defaultChecklistKey,
  });
  const hasLocalContext =
    (dataset.localContexts?.length ?? 0) > 0 && config.experimentalFeatures.localContextEnabled;

  const removeSidebar = useBelow(1100);
  const { formatMessage } = useIntl();
  const [scopedDatasetPredicate, setScopedDatasetPredicate] = useState<Predicate>({
    type: PredicateType.Equals,
    key: 'datasetKey',
    value: dataset.key,
  });

  const sitePredicate = config?.occurrenceSearch?.scope as Predicate;
  useEffect(() => {
    const datasetPredicate = {
      type: PredicateType.Equals,
      key: 'datasetKey',
      value: dataset.key,
    };
    const scope = (sitePredicate as Predicate)
      ? { type: PredicateType.And, predicates: [sitePredicate, datasetPredicate] }
      : datasetPredicate;
    setScopedDatasetPredicate(scope);
  }, [sitePredicate, dataset.key]);

  const { data: insights, load } = useQuery<DatasetInsightsQuery, DatasetInsightsQueryVariables>(
    DATASET_SLOW,
    {
      throwAllErrors: false,
      lazyLoad: true,
      notifyOnErrors: true,
    }
  );

  useEffect(() => {
    const datasetPredicate = {
      type: PredicateType.Equals,
      key: 'datasetKey',
      value: dataset.key,
    };
    // we also want to know how many of those occurrences are included on the present site
    const predicates: Predicate[] = [datasetPredicate];
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
  }, [dataset.key, sitePredicate, load]);

  const scopeSmallerThanDatasetMessage = formatMessage(
    {
      id: 'dataset.siteScopeSmallerThanDataset',
      defaultMessage: 'Visit [GBIF.org]({datasetUrl}) to explore the full dataset.',
    },
    { datasetUrl: `https://www.gbif.org/dataset/${dataset.key}` }
  );

  const chartPredicate = scopedDatasetPredicate;

  const toc = useMemo(() => getToc(dataset), [dataset]);
  const tableOfContents = useMemo(() => {
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
  }, [toc]);

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

            <Trusted dataset={dataset} />

            {siteTotal > 0 && dataset.type === DatasetType.Metadata && (
              <Alert variant="destructive" className="g-mb-4">
                <AlertTitle>
                  <FormattedMessage id="dataset.metadataOnlyWithData.title" />
                </AlertTitle>
                <AlertDescription>
                  <FormattedMessage id="dataset.metadataOnlyWithData.description" />
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
                        <LongDate value={dataset.pubDate} />
                      </div>
                    )}
                  </div>
                </CardDescription>
              </CardHeader>
              <CardContent>
                {dataset.description && (
                  <div
                    className="gbif-word-break g-prose g-mb-6 g-max-w-full"
                    dangerouslySetInnerHTML={{ __html: dataset.description }}
                  />
                )}
                {!dataset.description && <EmptyValue />}
              </CardContent>
            </Card>

            {/* <DataSummary data={data} insights={insights} /> */}

            {insights?.images?.documents?.total > 0 && (
              <>
                <Images
                  results={insights?.images?.documents.results}
                  datasetKey={dataset.key}
                  total={insights?.images?.documents?.total}
                  className="g-mb-4"
                />
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

            {toc.purpose && dataset.purpose && (
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
                  />
                </CardContent>
              </Card>
            )}

            {toc.geographicDescription && (
              <Card className="g-mb-4" id="geographic-description">
                <CardHeader className="gbif-word-break">
                  <CardTitle>
                    <FormattedMessage id="dataset.geographicCoverages" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="gbif-word-break">
                  <GeographicCoverages geographicCoverages={dataset.geographicCoverages} />
                  {siteTotal > 0 && (
                    <div className="g-mt-4">
                      <Button asChild variant="primaryOutline" size="sm">
                        <Link to="./metrics?group=geographic">
                          <FormattedMessage
                            id="dataset.metricsLink"
                            defaultMessage="Occurrence metrics"
                          />
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            <PublishingCountries datasetKey={dataset.key} />

            {toc.temporalDescription && (
              <Card className="g-mb-4" id="temporal-description">
                <CardHeader className="gbif-word-break">
                  <CardTitle>
                    <FormattedMessage id="dataset.temporalCoverages" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="gbif-word-break">
                  <TemporalCoverages temporalCoverages={dataset.temporalCoverages} />
                  {siteTotal > 0 && (
                    <div className="g-mt-4">
                      <Button asChild variant="primaryOutline" size="sm">
                        <Link to="./metrics?group=temporal">
                          <FormattedMessage
                            id="dataset.metricsLink"
                            defaultMessage="Occurrence metrics"
                          />
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            {toc.taxonomicDescription && (
              <Card className="g-mb-4" id="taxonomic-description">
                <CardHeader className="gbif-word-break">
                  <CardTitle>
                    <FormattedMessage id="dataset.taxonomicCoverages" />
                  </CardTitle>
                </CardHeader>
                <CardContent className="gbif-word-break">
                  <TaxonomicCoverages taxonomicCoverages={dataset.taxonomicCoverages} />
                  {siteTotal > 0 && (
                    <div className="g-mt-4">
                      <Button asChild variant="primaryOutline" size="sm">
                        <Link to="./metrics?group=taxonomic">
                          <FormattedMessage
                            id="dataset.metricsLink"
                            defaultMessage="Occurrence metrics"
                          />
                        </Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
            {toc.methodology && (
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
            {toc.additionalInfo && dataset.additionalInfo && (
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
                  />
                </CardContent>
              </Card>
            )}
            {toc.bibliography && (
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
            {toc.contacts && (
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
                {dataset.citation?.text && (
                  <Citation text={dataset.citation.text} doi={dataset.doi} />
                )}
              </CardContent>
            </Card>
          </div>
          {!removeSidebar && (
            <Aside>
              {hasLocalContext && <LocalContextCards localContexts={dataset.localContexts} />}
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

function getToc(dataset: DatasetKeyLoaderResult['data']['dataset']) {
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
    additionalInfo: dataset?.additionalInfo,
    contacts: (dataset?.volatileContributors?.length ?? 0) > 0,
    bibliography: (dataset?.bibliographicCitations?.length ?? 0) > 0,
    registration: true,
    citation: true,
  };
  return toc;
}

function Trusted({ dataset }: { dataset: NonNullable<DatasetQuery['dataset']> }) {
  const { user } = useUser();

  const isUserDatasetContact = useMemo(() => {
    if (!user || !dataset.volatileContributors) return false;
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
  }, [user, dataset.volatileContributors]);

  if (!isUserDatasetContact) {
    return null;
  }

  return (
    <UserAvatarSection>
      <div className="g-text-slate-600 g-mb-1">
        <FormattedMessage id="dataset.registry.becauseTrustedContact" />
      </div>
      <div className="g-flex g-gap-2">
        <Button asChild>
          <a
            href={`${import.meta.env.PUBLIC_REGISTRY}/dataset/${dataset.key}/ingestion-history`}
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
            <LongDate value={dataset.modified} />
          </div>
        )}
      </div>
    </UserAvatarSection>
  );
}

type LocalContexts = NonNullable<DatasetQuery['dataset']>['localContexts'];

function LocalContextCards({ localContexts }: { localContexts?: LocalContexts }) {
  return (
    <>
      {localContexts?.filter(notNull).map((localContext) => {
        if (!localContext.project_page) return null;
        const notices = (localContext.notice ?? [])
          .filter(notNull)
          .filter((n) => n.name && n.img_url);
        const labels = (localContext.labels ?? [])
          .filter(notNull)
          .filter((l) => l.name && l.img_url);

        // Group labels by community name
        const labelsByCommunity = new Map<string, typeof labels>();
        for (const label of labels) {
          const community = label.communityName ?? '';
          if (!labelsByCommunity.has(community)) {
            labelsByCommunity.set(community, []);
          }
          labelsByCommunity.get(community)!.push(label);
        }

        return (
          <Card className="g-mb-4 gbif-word-break" key={localContext.project_page}>
            <CardContentSmall className="g-flex g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
              <div className="g-flex-none g-me-2">
                <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                  <ExternalLinkIcon />
                </div>
              </div>
              <div className="g-flex-auto g-mt-0.5">
                <a
                  href={localContext.project_page}
                  target="_blank"
                  rel="noreferrer"
                  className="g-flex g-items-center g-underline"
                >
                  <h5 className="g-font-bold">{localContext.title}</h5>
                </a>
                {notices.length > 0 && (
                  <ul className="g-mt-2">
                    {notices.map((notice, i) => (
                      <li className="g-flex g-items-center g-mb-2" key={`${notice.name}-${i}`}>
                        <img
                          className="g-flex-none g-me-2 g-w-5 g-h-5 g-object-contain"
                          src={notice.img_url ?? undefined}
                          alt={notice.name ?? undefined}
                          title={notice.name ?? undefined}
                        />
                        <span>{notice.name}</span>
                      </li>
                    ))}
                  </ul>
                )}
                {[...labelsByCommunity.entries()].map(([communityName, communityLabels]) => (
                  <div key={communityName}>
                    {communityName && (
                      <p className="g-mt-2 g-text-slate-500">
                        <FormattedMessage
                          id="dataset.localContextsLabelsAppliedBy"
                          defaultMessage="{count, plural, one{Label} other{Labels}} applied by {communityName}"
                          values={{
                            count: communityLabels.length,
                            communityName,
                          }}
                        />
                      </p>
                    )}
                    <ul className="g-mt-2">
                      {communityLabels.map((label, i) => (
                        <li className="g-flex g-items-center g-mb-2" key={`${label.name}-${i}`}>
                          <img
                            className="g-flex-none g-me-2 g-w-5 g-h-5 g-object-contain"
                            src={label.img_url ?? undefined}
                            alt={label.name ?? undefined}
                            title={label.name ?? undefined}
                          />
                          <span>{label.name}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </CardContentSmall>
          </Card>
        );
      })}
    </>
  );
}
