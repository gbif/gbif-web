import { ClientSideOnly } from '@/components/clientSideOnly';
import { ContactList } from '@/components/contactList';
import * as charts from '@/components/dashboard';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import EmptyValue from '@/components/emptyValue';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { HyperText } from '@/components/hyperText';
import { MapThumbnail, MapTypes, useHasMap } from '@/components/maps/mapThumbnail';
import { Message } from '@/components/message';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { TableOfContents } from '@/components/tableOfContents';
import { GbifLinkCard } from '@/components/TocHelp';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { Progress } from '@/components/ui/progress';
import { CardContent as CardContentSmall } from '@/components/ui/smallCard';
import { useConfig } from '@/config/config';
import {
  DatasetInsightsQuery,
  DatasetInsightsQueryVariables,
  DatasetQuery,
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
import {
  MdFormatQuote,
  MdGridOn,
  MdInfoOutline,
  MdLink,
  MdPlaylistAddCheck,
  MdPinDrop as OccurrenceIcon,
} from 'react-icons/md';
import { TiPipette as SamplingIcon } from 'react-icons/ti';
import { FormattedMessage, useIntl } from 'react-intl';
import { useDatasetKeyLoaderData } from '.';
import { BibliographicCitations } from './about/BibliographicCitations';
import { Citation } from './about/Citation';
import { GeographicCoverages } from './about/GeographicCoverages';
import { Images } from './about/Images';
import { Registration } from './about/Registration';
import { SamplingDescription } from './about/SamplingDescription';
import { TaxonomicCoverages } from './about/TaxonomicCoverages';
import { TemporalCoverages } from './about/TemporalCoverages';

export function DatasetKeyAbout() {
  const { data } = useDatasetKeyLoaderData();
  const { dataset, totalTaxa, accepted, synonyms } = data;
  const defaultToc = getToc(data);
  const hasPreprocessedMap = useHasMap({
    type: MapTypes.DatasetKey,
    identifier: data?.dataset?.key ?? '',
  });
  const hasLocalContext = dataset?.machineTags?.find((tag) => tag.namespace === 'localcontext');

  const [toc, setToc] = useState(defaultToc);
  const removeSidebar = useBelow(1100);
  const { formatMessage } = useIntl();
  const config = useConfig();
  const sitePredicate = config?.occurrenceSearch?.scope;
  const disableInPageOccurrenceSearch = config.datasetKey?.disableInPageOccurrenceSearch;
  const occDynamicLinkProps = disableInPageOccurrenceSearch
    ? { pageId: 'occurrenceSearch', searchParams: { datasetKey: dataset?.key } }
    : { to: './occurrences' };

  const occDynamicLinkPropsMap = disableInPageOccurrenceSearch
    ? { pageId: 'occurrenceSearch', searchParams: { datasetKey: dataset?.key, view: 'map' } }
    : { to: './occurrences?view=map' };

  const { data: insights, load } = useQuery<DatasetInsightsQuery, DatasetInsightsQueryVariables>(
    DATASET_SLOW,
    {
      throwAllErrors: false,
      lazyLoad: true,
      notifyOnErrors: true,
    }
  );

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

  const predicate = {
    type: 'equals',
    key: 'datasetKey',
    value: dataset?.key,
  };

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

  const isGridded = dataset?.gridded?.[0]?.percent > 0.5; // threshold decided in https://github.com/gbif/gridded-datasets/issues/3
  const hasDna = (insights?.unfiltered?.facet?.dwcaExtension || []).find(
    (ext) => ext.key === 'http://rs.gbif.org/terms/1.0/DNADerivedData'
  );

  const withCoordinates = insights?.withCoordinates?.documents?.total;
  const withYear = insights?.withYear?.documents?.total;
  const withTaxonMatch =
    insights?.unfiltered?.documents?.total - insights?.withTaxonMatch?.documents?.total;

  const total = insights?.unfiltered?.documents?.total;
  const withCoordinatesPercentage = formatAsPercentage(withCoordinates / total);
  const withYearPercentage = formatAsPercentage(withYear / total);
  const withTaxonMatchPercentage = formatAsPercentage(withTaxonMatch / total);

  const synonymsPercentage = formatAsPercentage(synonyms?.count / totalTaxa?.count);
  const acceptedPercentage = formatAsPercentage(accepted?.count / totalTaxa?.count);
  const gbifOverlap = dataset.metrics?.nubCoveragePct;
  const colOverlap = dataset.metrics?.colCoveragePct;

  const withEventId = insights?.unfiltered?.cardinality?.eventId;
  const labelAsEventDataset =
    dataset.type === 'SAMPLING_EVENT' || (withEventId > 1 && withEventId / total < 0.99); // Threshold chosen somewhat randomly. The issue is that some datasets assign random unique eventIds to all their occurrences. Those aren't really event datasets, it is a misunderstanding.

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

            <Card className="g-mb-4" id="description">
              <CardHeader className="gbif-word-break">
                <CardTitle>
                  <FormattedMessage id="dataset.description" />
                </CardTitle>
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

            {insights?.images?.documents?.total > 0 && (
              <>
                <Images images={insights?.images} dataset={dataset} className="g-mb-4" />
              </>
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
                {total > 0 && (
                  <CardContent>
                    <hr className="g-my-4" />
                    <p className="g-text-slate-400 g-mb-2 g-text-sm">
                      <FormattedMessage id="phrases.derivedFromOccurrenceData" />
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
                {total > 0 && (
                  <CardContent>
                    <hr className="g-my-4" />
                    <p className="g-text-slate-400 g-mb-2 g-text-sm">
                      <FormattedMessage id="phrases.derivedFromOccurrenceData" />
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
                {total > 0 && (
                  <CardContent>
                    <hr className="g-my-4" />
                    <p className="g-text-slate-400 g-mb-2 g-text-sm">
                      <FormattedMessage id="phrases.derivedFromOccurrenceData" />
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

            {toc?.metrics && (
              <section>
                <CardHeader id="metrics">
                  <CardTitle>
                    <span className="g-me-2">
                      <FormattedMessage id="dataset.metrics" />
                    </span>
                    <SimpleTooltip i18nKey="dataset.metricsOccurrenceHelpText">
                      <span>
                        <MdInfoOutline style={{ verticalAlign: 'middle' }} />
                      </span>
                    </SimpleTooltip>
                  </CardTitle>
                </CardHeader>
                <div className="g-text-slate-500">
                  <ClientSideOnly>
                    <DashBoardLayout>
                      <charts.OccurrenceSummary predicate={predicate} />
                      <charts.DataQuality predicate={predicate} />
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
                <ErrorBoundary type="BLOCK" showReportButton={false} showStackTrace={false}>
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
              {data?.literatureSearch?.documents.total > 0 && (
                <Card className="g-mb-4 gbif-word-break">
                  <CardContentSmall className="g-flex g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
                    <div className="g-flex-none g-me-2">
                      <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                        <MdFormatQuote />
                      </div>
                    </div>
                    <div className="g-flex-auto g-mt-0.5">
                      <h5 className="g-font-bold">
                        <FormattedMessage
                          id="counts.nCitations"
                          values={{ total: data?.literatureSearch?.documents.total }}
                        />
                      </h5>
                    </div>
                  </CardContentSmall>
                </Card>
              )}
              {dataset.type === 'CHECKLIST' && (
                <Card className="g-mb-4 gbif-word-break">
                  <CardContentSmall className="g-flex g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
                    <div className="g-flex-none g-me-2">
                      <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                        <MdPlaylistAddCheck />
                      </div>
                    </div>
                    <div className="g-flex-auto g-mt-0.5 g-mb-2">
                      <a
                        className="g-text-inherit"
                        href={`${import.meta.env.PUBLIC_CHECKLIST_BANK_WEBSITE}/dataset/gbif-${
                          dataset.key
                        }/imports`}
                      >
                        <h5 className="g-font-bold">
                          <FormattedMessage
                            id="counts.nNames"
                            values={{ total: totalTaxa.count }}
                          />
                        </h5>
                      </a>
                      <div className="g-text-slate-500">
                        <div className="g-mt-2">
                          <FormattedMessage
                            id="counts.nAcceptedNames"
                            values={{ total: accepted.count }}
                          />
                        </div>
                        <Progress value={acceptedPercentage} className="g-h-1" />

                        <div className="g-mt-2">
                          <FormattedMessage
                            id="counts.nSynonyms"
                            values={{ total: synonyms.count }}
                          />
                        </div>
                        <Progress value={synonymsPercentage} className="g-h-1" />

                        <div className="g-mt-2">
                          <FormattedMessage
                            id="counts.gbifOverlapPercent"
                            values={{ percent: gbifOverlap }}
                          />
                        </div>
                        <Progress value={gbifOverlap} className="g-h-1" />

                        <div className="g-mt-2">
                          <FormattedMessage
                            id="counts.colOverlapPercent"
                            values={{ percent: colOverlap }}
                          />
                        </div>
                        <Progress value={colOverlap} className="g-h-1" />
                      </div>
                    </div>
                  </CardContentSmall>
                </Card>
              )}

              {total > 0 && (
                <Card className="g-mb-4 gbif-word-break">
                  {hasPreprocessedMap && (
                    <DynamicLink {...occDynamicLinkPropsMap}>
                      <MapThumbnail type={MapTypes.DatasetKey} identifier={dataset.key} />
                    </DynamicLink>
                  )}
                  <CardContentSmall className="g-flex g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
                    <div className="g-flex-none g-me-2">
                      <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                        <OccurrenceIcon />
                      </div>
                    </div>
                    <div className="g-flex-auto g-mt-0.5 g-mb-2">
                      <DynamicLink {...occDynamicLinkProps} className="g-text-inherit">
                        <h5 className="g-font-bold">
                          <FormattedMessage id="counts.nOccurrences" values={{ total }} />
                        </h5>
                      </DynamicLink>
                      {total > 0 && (
                        <div className="g-text-slate-500">
                          <div className="g-mt-2">
                            <FormattedMessage
                              id="counts.percentWithCoordinates"
                              values={{ percent: withCoordinatesPercentage }}
                            />
                          </div>
                          <Progress value={(100 * withCoordinates) / total} className="g-h-1" />

                          <div className="g-mt-2">
                            <FormattedMessage
                              id="counts.percentWithYear"
                              values={{ percent: withYearPercentage }}
                            />
                          </div>
                          <Progress value={(100 * withYear) / total} className="g-h-1" />

                          <div className="g-mt-2">
                            <FormattedMessage
                              id="counts.percentWithTaxonMatch"
                              values={{ percent: withTaxonMatchPercentage }}
                            />
                          </div>
                          <Progress value={(100 * withTaxonMatch) / total} className="g-h-1" />
                        </div>
                      )}
                    </div>
                  </CardContentSmall>
                </Card>
              )}

              {hasDna && (
                <Card className="g-mb-4 gbif-word-break">
                  <CardContentSmall className="g-flex g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
                    <div className="g-flex-none g-me-2">
                      <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                        <GiDna1 />
                      </div>
                    </div>
                    <div className="g-flex-auto g-mt-0.5 g-mb-2">
                      <DynamicLink
                        className="g-text-inherit"
                        pageId="occurrenceSearch"
                        searchParams={{ datasetKey: dataset.key, isSequenced: true }}
                        to={`/occurrence/search?datasetKey=${dataset.key}&isSequenced=true`}
                      >
                        <h5 className="g-font-bold">
                          <FormattedMessage id="dataset.includesDna" />
                        </h5>
                      </DynamicLink>
                      <div className="g-text-slate-500 [&_a]:g-underline">
                        <Message id="dataset.includesDnaDescription" />
                      </div>
                    </div>
                  </CardContentSmall>
                </Card>
              )}

              {labelAsEventDataset && (
                <Card className="g-mb-4 gbif-word-break">
                  <CardContentSmall className="g-flex g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
                    <div className="g-flex-none g-me-2">
                      <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                        <SamplingIcon />
                      </div>
                    </div>
                    <div className="g-flex-auto g-mt-0.5 g-mb-2">
                      <h5 className="g-font-bold">
                        <FormattedMessage id="dataset.containsSamplingEvents" />
                      </h5>
                      <div className="g-text-slate-500 [&_a]:g-underline">
                        <Message id="dataset.containsSamplingEventsDescription" />
                      </div>
                    </div>
                  </CardContentSmall>
                </Card>
              )}

              {dataset?.localContext?.[0] && (
                <Card className="g-mb-4 gbif-word-break">
                  <CardContentSmall className="g-flex g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
                    <div className="g-flex-none g-me-2">
                      <div className="g-leading-6 g-text-white g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                        <img
                          src={dataset.localContext[0].img_url}
                          alt="Local context icon"
                          className="g-w-4 g-h-4"
                        />
                      </div>
                    </div>
                    <div className="g-flex-auto g-mt-0.5 g-mb-2">
                      <h5 className="g-font-bold">
                        {dataset.localContext[0].name}{' '}
                        <a
                          href={dataset.localContext[0].notice_page}
                          target="_blank"
                          rel="noreferrer"
                        >
                          <MdLink />
                        </a>
                      </h5>
                      <div className="g-text-slate-500 [&_a]:g-underline">
                        {dataset.localContext[0].default_text && (
                          <HyperText
                            text={dataset.localContext[0].default_text}
                            sanitizeOptions={{ ALLOWED_TAGS: ['a', 'strong', 'em', 'p', 'br'] }}
                          />
                        )}
                      </div>
                    </div>
                  </CardContentSmall>
                </Card>
              )}

              {isGridded && (
                <Card className="gbif-word-break g-mb-4">
                  <CardContentSmall className="g-flex g-me-2 g-pt-2 md:g-pt-4 g-text-sm">
                    <div className="g-flex-none g-me-2">
                      <div className="g-leading-6 g-bg-primary-500 g-text-white g-rounded-full g-w-6 g-h-6 g-flex g-justify-center g-items-center">
                        <MdGridOn />
                      </div>
                    </div>
                    <div className="g-flex-auto g-mt-0.5 g-mb-2">
                      <h5 className="g-font-bold">
                        <FormattedMessage id="dataset.griddedData" />
                      </h5>
                      <div className="g-text-slate-500 [&_a]:g-underline [&_a]:g-text-inherit">
                        <Message id="dataset.griddedDataDescription" />
                      </div>
                    </div>
                  </CardContentSmall>
                </Card>
              )}

              <AsideSticky className="-g-mt-4">
                <Card>
                  <h4 className="g-text-sm g-font-semibold g-mx-4 g-mt-3 g-text-slate-600">
                    <FormattedMessage id="phrases.pageToc" />
                  </h4>
                  <nav className="g-pb-2">
                    <TableOfContents sections={tableOfContents} />
                  </nav>
                </Card>
                <GbifLinkCard path={`/dataset/${dataset.key}`} className="g-mt-4" />
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
    metrics: dataset.type === 'OCCURRENCE' || insights?.unfiltered?.documents?.total > 1,
    additionalInfo: dataset?.additionalInfo,
    contacts: (dataset?.volatileContributors?.length ?? 0) > 0,
    bibliography: (dataset?.bibliographicCitations?.length ?? 0) > 0,
    registration: true,
    citation: true,
  };
  return toc;
}
