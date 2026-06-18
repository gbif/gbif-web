import { DataHeader } from '@/components/dataHeader';
import { ErrorBoundary } from '@/components/ErrorBoundary';
import { prettifyEnum } from '@/components/filters/displayNames';
import Globe from '@/components/globe';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import {
  FeatureList,
  GadmClassification,
  GenericFeature,
  GeologicalContext,
  Homepage,
  IIIF,
  Location,
  SamplingEvent,
  Sequenced,
  TaxonomyIcon,
  TypeStatus,
} from '@/components/highlights';
import { FormattedDateRange } from '@/components/message';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Tabs } from '@/components/tabs';
import { NotFoundLoaderResponse } from '@/errors';
import {
  OccurrenceQuery,
  OccurrenceQueryVariables,
  SlowOccurrenceKeyQuery,
  SlowOccurrenceKeyQueryVariables,
  Term,
} from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import useQuery from '@/hooks/useQuery';
import { DynamicLink, LoaderArgs, useI18n } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { is404, throwCriticalErrors, useNotifyOfPartialDataIfErrors } from '@/routes/rootErrorPage';
import { fragmentManager } from '@/services/fragmentManager';
import { required } from '@/utils/required';
import { createContext, useEffect } from 'react';
import { BsLightningFill } from 'react-icons/bs';
import { MdInfoOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Outlet, redirect, useLoaderData, useLocation } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';
import { IssueTag, IssueTags } from './properties';
import PageMetaData from '@/components/PageMetaData';
import { notNull } from '@/utils/notNull';
import { TaxonStubClassification } from '@/components/classification';
import getTitleParts from './getTitle';

const OCCURRENCE_QUERY = /* GraphQL */ `
  query Occurrence($key: ID!, $defaultChecklistKey: ID) {
    occurrence(key: $key) {
      key
      coordinates
      organismName
      lastCrawled
      countryCode
      stateProvince
      locality
      eventDate
      typeStatus
      occurrenceStatus
      references
      issues
      basisOfRecord
      dynamicProperties
      institutionKey
      collectionKey
      isInCluster
      volatile {
        globe(sphere: false, land: false, graticule: false) {
          svg
          lat
          lon
        }
        features {
          isSpecimen
          isTreament
          isSequenced
          isClustered
          isSamplingEvent
          firstIIIF
        }
      }
      datasetKey
      datasetTitle
      publishingOrgKey
      publisherTitle
      dataset {
        citation {
          text
        }
      }
      institutionCode

      earliestEonOrLowestEonothem
      earliestEraOrLowestErathem
      earliestPeriodOrLowestSystem
      earliestEpochOrLowestSeries
      earliestAgeOrLowestStage
      lowestBiostratigraphicZone

      group
      formation
      member
      bed

      extensions {
        audubon
        amplification
        germplasmAccession
        germplasmMeasurementScore
        germplasmMeasurementTrait
        germplasmMeasurementTrial
        identification
        identifier
        image
        measurementOrFact
        multimedia
        reference
        eolReference
        resourceRelationship
        cloning
        gelImage
        loan
        materialSample
        permit
        preparation
        preservation
        extendedMeasurementOrFact
        chronometricAge
        dnaDerivedData
      }

      gadm

      stillImageCount
      movingImageCount
      soundCount
      stillImages {
        ...OccurrenceMediaDetails
      }
      sounds {
        ...OccurrenceMediaDetails
      }
      movingImages {
        ...OccurrenceMediaDetails
      }

      verbatimScientificName
      classification(checklistKey: $defaultChecklistKey) {
        checklistKey
        usage {
          rank
          name
          key
        }
        acceptedUsage {
          key
          name
        }
        taxonMatch {
          usage {
            name
            key
            canonicalName
            formattedName
          }
          synonym
        }
        classification {
          key
          rank
          name
        }
        issues
        hasTaxonIssues
        iucnRedListCategoryCode
      }
      classifications {
        meta {
          mainIndex {
            datasetKey: clbDatasetKey
            datasetTitle
          }
        }
        checklistKey
        usage {
          rank
          name
          key
        }
        acceptedUsage {
          key
          name
        }
        taxonMatch {
          usage {
            name
            key
            canonicalName
            formattedName
          }
          synonym
        }
        classification {
          key
          rank
          name
        }
        issues
      }
      primaryImage {
        identifier
      }
      terms {
        ...OccurrenceTerm
      }
      scientificName
      recordedByIDs {
        type
        value
      }
      identifiedByIDs {
        type
        value
      }
    }
  }
`;

const SLOW_OCCURRENCE_QUERY = /* GraphQL */ `
  query SlowOccurrenceKey($key: ID!, $language: String!) {
    occurrence(key: $key) {
      key
      localContexts {
        project_page
        title
        notice {
          name(lang: $language)
          img_url
        }
        labels {
          name(lang: $language)
          img_url
          communityName
        }
      }
      institution {
        name
      }
      collection {
        name
      }

      classification {
        vernacularNames(lang: $language, maxLimit: 1) {
          name
          reference {
            id
            citation
          }
        }
      }
    }
    literatureSearch(gbifOccurrenceKey: [$key]) {
      documents(size: 100) {
        results {
          title
          abstract
          authors {
            firstName
            lastName
          }
          literatureType
          year
          identifiers {
            doi
          }
          websites
        }
      }
    }
  }
`;

fragmentManager.register(/* GraphQL */ `
  fragment OccurrenceMediaDetails on MultimediaItem {
    title
    type
    format
    identifier
    created
    creator
    license
    publisher
    references
    rightsHolder
    description
    originalImage: thumbor
    thumbor(height: 800)
    smallThumbnail: thumbor(height: 100, width: 100)
  }
`);

fragmentManager.register(/* GraphQL */ `
  fragment OccurrenceTerm on Term {
    simpleName
    verbatim
    value
    htmlValue
    remarks
    issues
  }
`);

export async function occurrenceKeyLoader({ params, config, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');
  if (['map', 'gallery', 'taxonomy', 'charts', 'download'].includes(key))
    throw new NotFoundLoaderResponse();
  const response = await graphql.query<OccurrenceQuery, OccurrenceQueryVariables>(
    OCCURRENCE_QUERY,
    {
      key,
      defaultChecklistKey: config.defaultChecklistKey,
    }
  );

  const { errors, data } = await response.json();

  // If the occurrence does not exist, check whether a raw fragment exists for the key.
  // If so, redirect to the tombstone/fragment page; otherwise fall through to the 404.
  const occurrenceMissing = !data?.occurrence || is404({ path: ['occurrence'], errors });
  if (occurrenceMissing) {
    try {
      const fragmentResponse = await fetch(`${config.v1Endpoint}/occurrence/${key}/fragment`);
      if (fragmentResponse.ok) {
        return redirect(`/occurrence/${key}/fragment`);
      }
    } catch {
      // ignore and let the normal 404 path handle it
    }
  }

  throwCriticalErrors({
    path404: ['occurrence'],
    errors,
    requiredObjects: [data?.occurrence],
  });

  // throwCriticalErrors will throw if the occurrence is not found, so we can safely assume it exists with !
  return { errors, occurrence: data!.occurrence! };
}

export type OccurrenceKeyLoaderResult = Exclude<
  Awaited<ReturnType<typeof occurrenceKeyLoader>>,
  Response
>;

export const OccurrenceKeyContext = createContext<{
  key?: string;
  datasetKey?: string;
  dynamicProperties?: string;
  slowOccurrence?: SlowOccurrenceKeyQuery['occurrence'];
  occurrence?: OccurrenceQuery['occurrence'];
}>({});

const notableCoordinateIssues = [
  'COORDINATE_OUT_OF_RANGE',
  'COORDINATE_INVALID',
  'GEODETIC_DATUM_INVALID',
  'COUNTRY_COORDINATE_MISMATCH',
  'PRESUMED_SWAPPED_COORDINATE',
  'PRESUMED_NEGATED_LATITUDE',
  'PRESUMED_NEGATED_LONGITUDE',
  'COORDINATE_REPROJECTION_SUSPICIOUS',
  'ZERO_COORDINATE',
];

const geologicalIssues = [
  'ERA_OR_ERATHEM_INFERRED_FROM_PARENT_RANK',
  'PERIOD_OR_SYSTEM_INFERRED_FROM_PARENT_RANK',
  'EPOCH_OR_SERIES_INFERRED_FROM_PARENT_RANK',
  'AGE_OR_STAGE_INFERRED_FROM_PARENT_RANK',
  'EON_OR_EONOTHEM_RANK_MISMATCH',
  'ERA_OR_ERATHEM_RANK_MISMATCH',
  'PERIOD_OR_SYSTEM_RANK_MISMATCH',
  'EPOCH_OR_SERIES_RANK_MISMATCH',
  'AGE_OR_STAGE_RANK_MISMATCH',
  'EON_OR_EONOTHEM_INVALID_RANGE',
  'ERA_OR_ERATHEM_INVALID_RANGE',
  'PERIOD_OR_SYSTEM_INVALID_RANGE',
  'EPOCH_OR_SERIES_INVALID_RANGE',
  'AGE_OR_STAGE_INVALID_RANGE',
  'EON_OR_EONOTHEM_AND_ERA_OR_ERATHEM_MISMATCH',
  'ERA_OR_ERATHEM_AND_PERIOD_OR_SYSTEM_MISMATCH',
  'PERIOD_OR_SYSTEM_AND_EPOCH_OR_SERIES_MISMATCH',
  'EPOCH_OR_SERIES_AND_AGE_OR_STAGE_MISMATCH',
];

export function OccurrenceKey() {
  const location = useLocation();
  const { occurrence, errors } = useLoaderData() as OccurrenceKeyLoaderResult;
  useNotifyOfPartialDataIfErrors(errors);

  const hideGlobe = useBelow(800);
  const { locale } = useI18n();

  const { data: slowData, load: slowLoad } = useQuery<
    SlowOccurrenceKeyQuery,
    SlowOccurrenceKeyQueryVariables
  >(SLOW_OCCURRENCE_QUERY, {
    lazyLoad: true,
    throwAllErrors: false,
    notifyOnErrors: true,
  });

  useEffect(() => {
    if (!occurrence.key) return;
    slowLoad({
      variables: {
        key: occurrence.key.toString(),
        language: locale.iso3LetterCode ?? 'eng',
      },
    });
  }, [slowLoad, occurrence.key, locale?.iso3LetterCode]);

  const slowOccurrence = slowData?.occurrence;

  const { terms } = occurrence;
  const termMap: { [key: string]: Term } =
    terms?.reduce((map: { [key: string]: Term }, term) => {
      if (term?.simpleName) map[term.simpleName] = term;
      return map;
    }, {}) ?? {};

  // const recorderAndIndentiferIsDifferent =
  //   JSON.stringify(termMap?.recordedBy?.value) !== JSON.stringify(termMap?.identifiedBy?.value);

  const vernacularNameInfo = slowOccurrence?.classification?.vernacularNames?.[0];

  const tabs = [
    {
      to: '.',
      children: <FormattedMessage id="occurrenceDetails.tabs.details" defaultMessage="About" />,
    },
  ];
  if (occurrence.isInCluster)
    tabs.push({
      to: 'cluster',
      children: <FormattedMessage id="occurrenceDetails.tabs.cluster" defaultMessage="Related" />,
    });
  if (occurrence.dynamicProperties) {
    try {
      const parsedDynamicProperties = JSON.parse(occurrence.dynamicProperties);
      if (parsedDynamicProperties?.phylogenies?.[0]?.phyloTreeFileName) {
        tabs.push({
          to: 'phylogenies',
          children: (
            <FormattedMessage id="occurrenceDetails.tabs.phylotree" defaultMessage="Phylogenies" />
          ),
        });
      }
    } catch (error) {
      /* empty */
    }
  }

  // if there are notable coordinate issues, then set a flag so we can show a warning in the header when we show the location
  const coordinateIssues =
    occurrence?.issues?.filter((issue) => notableCoordinateIssues.includes(issue)) ?? [];
  const hasGeologicalIssues = occurrence?.issues?.some((issue) => geologicalIssues.includes(issue));

  // const defaultClassification =
  //   occurrence?.classifications?.find(
  //     (classification) => classification?.checklistKey === config.defaultChecklistKey
  //   ) ?? occurrence?.classifications?.[0];

  const { text, title, hasTaxonIssues, state } = getTitleParts({ occurrence, termMap });

  const usageKey = occurrence.classification?.usage?.key;
  const acceptedUsage = occurrence.classification?.acceptedUsage;
  const isMatchedToSynonym = occurrence.classification?.taxonMatch?.synonym;

  return (
    <>
      <PageMetaData
        path={`/occurrence/${occurrence?.key}`}
        title={text || 'Unknown'}
        nofollow
        noCanonical
      />

      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={occurrence?.key?.toString()} />}
      />

      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <div className="g-flex">
              {!hideGlobe && occurrence?.volatile?.globe && (
                <div className="g-flex">
                  <Globe {...occurrence?.volatile?.globe} className="g-w-32 g-h-32 g-me-4 g-mb-4" />
                </div>
              )}
              <div className="g-flex-grow">
                <ArticlePreTitle
                  clickable
                  secondary={
                    occurrence.eventDate ? (
                      <FormattedDateRange date={occurrence?.eventDate} />
                    ) : (
                      <FormattedMessage id="phrases.unknownDate" />
                    )
                  }
                >
                  {occurrence.volatile?.features?.isSpecimen && (
                    <DynamicLink
                      pageId="occurrenceSearch"
                      searchParams={{ basisOfRecord: ['PRESERVED_SPECIMEN', 'FOSSIL_SPECIMEN'] }}
                    >
                      <FormattedMessage id="occurrenceDetails.specimen" defaultMessage="Specimen" />
                    </DynamicLink>
                  )}
                  {!occurrence.volatile?.features?.isSpecimen && (
                    <DynamicLink pageId="occurrenceSearch">
                      <FormattedMessage
                        id="occurrenceDetails.occurrence"
                        defaultMessage="Occurrence"
                      />
                    </DynamicLink>
                  )}
                </ArticlePreTitle>

                <ArticleTitle className="lg:g-text-3xl" dir={locale.textDirection ?? 'ltr'}>
                  <>
                    {state === 'NO_NAME' && (
                      <span className="g-me-4 g-text-slate-500" dir="auto">
                        <FormattedMessage id="phrases.unknown" defaultMessage="Unknown" />
                      </span>
                    )}
                    {state === 'NO_MATCH' && (
                      <span className="g-me-4" dir="auto">
                        "{title}"
                      </span>
                    )}
                    {state === 'MATCH_WITH_ISSUES' && (
                      <span className="g-me-4" dir="auto">
                        "{title}"
                      </span>
                    )}
                    {state === 'MATCH_NO_ISSUES' &&
                      usageKey &&
                      occurrence.classification?.checklistKey && (
                        <DynamicLink
                          pageId="taxonKey"
                          className="hover:g-underline g-text-inherit"
                          variables={{
                            key: usageKey,
                            datasetKey: occurrence.classification?.checklistKey,
                          }}
                        >
                          <span dangerouslySetInnerHTML={{ __html: title }} dir="auto"></span>
                        </DynamicLink>
                      )}
                    {(state === 'NO_MATCH' || state === 'MATCH_WITH_ISSUES') && (
                      <TooltipProvider>
                        <Tooltip delayDuration={0}>
                          <TooltipTrigger>
                            <span style={{ marginInlineStart: 8 }}>
                              <BsLightningFill style={{ color: 'orange' }} />
                            </span>
                          </TooltipTrigger>
                          <TooltipContent>
                            <FormattedMessage id="occurrenceDetails.hasTaxonMatchingIssues" />
                          </TooltipContent>
                        </Tooltip>
                      </TooltipProvider>
                    )}
                    {occurrence.occurrenceStatus === 'ABSENT' && (
                      <span
                        className="g-align-middle g-bg-red-100 g-text-red-800 g-text-sm g-font-medium g-ms-2 g-px-2.5 g-py-0.5 g-rounded dark:g-bg-red-900 dark:g-text-red-300"
                        dir="auto"
                      >
                        <FormattedMessage
                          id={`enums.occurrenceStatus.${occurrence.occurrenceStatus}`}
                        />
                      </span>
                    )}
                    {state !== 'MATCH_WITH_ISSUES' &&
                      state !== 'NO_MATCH' &&
                      occurrence.occurrenceStatus !== 'ABSENT' &&
                      vernacularNameInfo && (
                        <SimpleTooltip
                          asChild
                          title={
                            <FormattedMessage
                              id="phrases.commonNameAccordingTo"
                              values={{ source: 'Catalogue of Life' }}
                            />
                          }
                        >
                          <span
                            className="g-text-slate-300 g-inline-flex g-items-center g-ms-4"
                            style={{ fontSize: '85%' }}
                          >
                            <span className="g-me-1">{vernacularNameInfo.name}</span>
                            <MdInfoOutline />
                          </span>
                        </SimpleTooltip>
                      )}
                  </>
                </ArticleTitle>

                <HeaderInfo>
                  <HeaderInfoMain>
                    <div>
                      {/* 2 july 2025 - data products asked to hide the taxonomy - at least as an experiment */}
                      {!hasTaxonIssues &&
                        !isMatchedToSynonym &&
                        occurrence.classification?.classification?.[0] && (
                          <div>
                            <GenericFeature>
                              <TaxonomyIcon />
                              <TaxonStubClassification
                                classification={occurrence.classification?.classification}
                              />
                            </GenericFeature>
                          </div>
                        )}
                      {(hasTaxonIssues || isMatchedToSynonym) &&
                        (usageKey || acceptedUsage) &&
                        occurrence.classification?.checklistKey && (
                          <div>
                            <GenericFeature>
                              <TaxonomyIcon />
                              {hasTaxonIssues && usageKey && (
                                <>
                                  <span className="g-me-1">Matched to&nbsp;</span>
                                  <DynamicLink
                                    className="g-underline"
                                    pageId="taxonKey"
                                    variables={{
                                      key: usageKey,
                                      datasetKey: occurrence.classification?.checklistKey,
                                    }}
                                  >
                                    <span
                                      dangerouslySetInnerHTML={{
                                        __html:
                                          occurrence.classification?.taxonMatch?.usage
                                            .formattedName || '',
                                      }}
                                    ></span>
                                  </DynamicLink>
                                </>
                              )}
                              {!hasTaxonIssues &&
                                isMatchedToSynonym &&
                                acceptedUsage?.key &&
                                occurrence.classification?.checklistKey && (
                                  <>
                                    <span className="g-me-1">Accepted name&nbsp;</span>
                                    <DynamicLink
                                      className="g-underline"
                                      pageId="taxonKey"
                                      variables={{
                                        key: acceptedUsage.key,
                                        datasetKey: occurrence.classification?.checklistKey,
                                      }}
                                    >
                                      {acceptedUsage?.name}
                                    </DynamicLink>
                                  </>
                                )}
                            </GenericFeature>
                          </div>
                        )}

                      {occurrence.gadm?.level1 && (
                        <GadmClassification className="g-flex g-mb-1" gadm={occurrence.gadm}>
                          <span>
                            {coordinateIssues.length > 0 && (
                              <IssueTags>
                                {coordinateIssues.map((issue: string) => {
                                  // return <Tag className="g-bg-orange g-text-white">{issue}sdf</Tag>;
                                  // return <Tag className="g-bg-amber-500 g-text-white">{issue}</Tag>;
                                  return (
                                    <IssueTag type="WARNING" key={issue}>
                                      <FormattedMessage
                                        id={`enums.occurrenceIssue.${issue}`}
                                        defaultMessage={prettifyEnum(issue) ?? ''}
                                      />
                                    </IssueTag>
                                  );
                                })}
                              </IssueTags>
                            )}
                          </span>
                        </GadmClassification>
                      )}
                      <GeologicalContext
                        earliestEonOrLowestEonothem={occurrence.earliestEonOrLowestEonothem}
                        earliestEraOrLowestErathem={occurrence.earliestEraOrLowestErathem}
                        earliestPeriodOrLowestSystem={occurrence.earliestPeriodOrLowestSystem}
                        earliestEpochOrLowestSeries={occurrence.earliestEpochOrLowestSeries}
                        earliestAgeOrLowestStage={occurrence.earliestAgeOrLowestStage}
                        lowestBiostratigraphicZone={occurrence.lowestBiostratigraphicZone}
                        group={occurrence.group}
                        formation={occurrence.formation}
                        member={occurrence.member}
                        bed={occurrence.bed}
                        className="g-mb-1"
                      >
                        {hasGeologicalIssues && (
                          <IssueTags>
                            {occurrence.issues
                              ?.filter((issue) => geologicalIssues.includes(issue))
                              .map((issue: string) => (
                                <IssueTag type="WARNING" key={issue}>
                                  <FormattedMessage
                                    id={`enums.occurrenceIssue.${issue}`}
                                    defaultMessage={prettifyEnum(issue) ?? ''}
                                  />
                                </IssueTag>
                              ))}
                          </IssueTags>
                        )}
                      </GeologicalContext>
                      {!occurrence?.gadm?.level1 && occurrence.countryCode && (
                        <Location
                          countryCode={occurrence.countryCode}
                          city={occurrence.stateProvince}
                        />
                      )}

                      {/* {(termMap.recordedBy?.verbatim || termMap.identifiedBy?.verbatim) && (
                      <GenericFeature className='g-flex g-mb-1'>
                        <PeopleIcon />
                        {recorderAndIndentiferIsDifferent && (
                          <div>
                            {termMap?.recordedBy?.value?.length > 0 && (
                              <div>
                                <span>Recorded by</span>{' '}
                                <BulletList className='g-inline'>
                                  {termMap.recordedBy.value.map((x: string) => (
                                    <li className='g-inline' key={x}>
                                      {x}
                                    </li>
                                  ))}
                                </BulletList>
                              </div>
                            )}
                            {termMap?.identifiedBy?.value?.length > 0 && (
                              <div style={{ marginTop: 4 }}>
                                <span>Identified by</span>{' '}
                                <BulletList className='g-inline'>
                                  {termMap.identifiedBy.value.map((x: string) => (
                                    <li key={x} className='g-inline'>
                                      {x}
                                    </li>
                                  ))}
                                </BulletList>
                              </div>
                            )}
                          </div>
                        )}
                        {!recorderAndIndentiferIsDifferent && termMap?.recordedBy?.verbatim && (
                          <div>
                            <BulletList className='g-inline'>
                              {termMap.recordedBy.value.map((x: string) => (
                                <li key={x} className='g-inline'>
                                  {x}
                                </li>
                              ))}
                            </BulletList>
                          </div>
                        )}
                      </GenericFeature>
                    )} */}
                    </div>

                    <FeatureList className="">
                      {occurrence.volatile?.features?.isSamplingEvent && <SamplingEvent />}
                      {occurrence.typeStatus && occurrence.typeStatus?.length > 0 && (
                        <TypeStatus types={occurrence.typeStatus.filter(notNull)} />
                      )}
                      {occurrence?.references && <Homepage url={occurrence?.references} />}
                      {occurrence?.volatile?.features?.isSequenced && <Sequenced />}
                      {occurrence?.volatile?.features?.firstIIIF && (
                        <IIIF url={occurrence?.volatile?.features?.firstIIIF} />
                      )}
                    </FeatureList>
                  </HeaderInfoMain>
                </HeaderInfo>
              </div>
            </div>
            <div className="g-border-b g-mt-4"></div>
            <Tabs links={tabs} />
          </ArticleTextContainer>
        </PageContainer>
        <ErrorBoundary invalidateOn={occurrence?.key} showReportButton>
          <OccurrenceKeyContext.Provider
            value={{
              key: occurrence.key?.toString() ?? undefined,
              datasetKey: occurrence?.datasetKey ?? undefined,
              dynamicProperties: occurrence?.dynamicProperties ?? undefined,
              slowOccurrence,
              occurrence,
            }}
          >
            <ErrorBoundary invalidateOn={location.pathname + location.search}>
              <Outlet />
            </ErrorBoundary>
          </OccurrenceKeyContext.Provider>
        </ErrorBoundary>
      </article>
    </>
  );
}

export function OccurrenceKeySkeleton() {
  return <ArticleSkeleton />;
}
