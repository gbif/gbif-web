import { DataHeader } from '@/components/dataHeader';
import Globe from '@/components/globe';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import {
  FeatureList,
  GadmClassification,
  Homepage,
  IIIF,
  Location,
  SamplingEvent,
  Sequenced,
  TaxonClassification,
  TypeStatus,
} from '@/components/highlights';
import { FormattedDateRange } from '@/components/message';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Tabs } from '@/components/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { OccurrenceIssue, OccurrenceQuery, OccurrenceQueryVariables, Term } from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { fragmentManager } from '@/services/fragmentManager';
import { required } from '@/utils/required';
import { createContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { BsLightningFill } from 'react-icons/bs';
import { MdInfoOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Outlet, redirect, useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';

const OCCURRENCE_QUERY = /* GraphQL */ `
  query Occurrence($key: ID!, $language: String!, $source: String) {
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
      references
      issues
      basisOfRecord
      dynamicProperties
      institution {
        name
        key
      }
      collection {
        name
        key
      }
      related {
        count
      }
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
      recordedByIDs {
        value
        person(expand: true) {
          name
          birthDate
          deathDate
          image
        }
      }
      identifiedByIDs {
        value
        person(expand: true) {
          name
          birthDate
          deathDate
          image
        }
      }

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

      gbifClassification {
        kingdom
        kingdomKey
        phylum
        phylumKey
        class
        classKey
        order
        orderKey
        family
        familyKey
        genus
        genusKey
        species
        speciesKey
        synonym
        classification {
          key
          rank
          name
        }
        usage {
          rank
          formattedName
          key
        }
        acceptedUsage {
          formattedName
          key
        }
      }

      primaryImage {
        identifier
      }

      terms {
        ...OccurrenceTerm
      }

      scientificName
      dataset {
        key
        title
      }

      acceptedTaxon {
        vernacularNames(limit: 1, language: $language, source: $source) {
          results {
            vernacularName
            source
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
    thumbor(height: 800)
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

export async function occurrenceKeyLoader({ params, graphql, locale, config }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  const response = await graphql.query<OccurrenceQuery, OccurrenceQueryVariables>(
    OCCURRENCE_QUERY,
    {
      key,
      language: locale.iso3LetterCode ?? 'eng',
      source: config?.vernacularNames?.sourceTitle,
    }
  );

  // If the occurrence does not exist, we try to redirect to the occurrence tombstone page
  const result = await response.json();
  if (result.errors?.some((error) => error.message === '404: Not Found')) {
    return redirect('fragment');
  }

  return result;
}
export const OccurrenceKeyContext = createContext<{
  key?: string;
  datasetKey?: string;
  dynamicProperties?: string;
}>({});

export function OccurrenceKey() {
  const { data } = useLoaderData() as { data: OccurrenceQuery };
  const hideGlobe = useBelow(800);
  if (data.occurrence == null) throw new Error('404');
  const occurrence = data.occurrence;

  const { terms } = occurrence;
  const termMap: { [key: string]: Term } =
    terms?.reduce((map: { [key: string]: Term }, term) => {
      if (term?.simpleName) map[term.simpleName] = term;
      return map;
    }, {}) ?? {};

  // const recorderAndIndentiferIsDifferent =
  //   JSON.stringify(termMap?.recordedBy?.value) !== JSON.stringify(termMap?.identifiedBy?.value);

  const vernacularNameInfo = occurrence?.acceptedTaxon?.vernacularNames?.results?.[0];

  const hasRelated = occurrence.related?.count && occurrence.related?.count > 0;

  const tabs = [
    {
      to: '.',
      children: <FormattedMessage id="occurrenceDetails.tabs.details" defaultMessage="About" />,
    },
  ];
  if (hasRelated)
    tabs.push({
      to: 'related',
      children: <FormattedMessage id="occurrenceDetails.tabs.cluster" defaultMessage="Related" />,
    });
  if (occurrence?.dynamicProperties) {
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

  return (
    <>
      <Helmet>
        <title>{occurrence.scientificName}</title>
      </Helmet>
      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={data?.occurrence?.key?.toString()} />}
      ></DataHeader>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <div className="g-flex">
              {!hideGlobe && data?.occurrence?.volatile?.globe && (
                <div className="g-flex">
                  <Globe
                    {...data?.occurrence?.volatile?.globe}
                    className="g-w-32 g-h-32 g-me-4 g-mb-4"
                  />
                </div>
              )}
              <div className="g-flex-grow">
                <ArticlePreTitle
                  secondary={
                    occurrence.eventDate ? (
                      <FormattedDateRange date={occurrence?.eventDate} />
                    ) : (
                      <FormattedMessage id="phrases.unknownDate" />
                    )
                  }
                >
                  {occurrence.volatile?.features?.isSpecimen && (
                    <FormattedMessage id="occurrenceDetails.specimen" defaultMessage="Specimen" />
                  )}
                  {!occurrence.volatile?.features?.isSpecimen && (
                    <FormattedMessage
                      id="occurrenceDetails.occurrence"
                      defaultMessage="Occurrence"
                    />
                  )}
                </ArticlePreTitle>
                {/* <ArticleTitle
                dangerouslySetTitle={{ __html: occurrence.scientificName || 'No title provided' }}
              ></ArticleTitle> */}
                <ArticleTitle className="lg:g-text-3xl">
                  {!occurrence?.issues?.includes(OccurrenceIssue.TaxonMatchHigherrank) && (
                    <>
                      <span
                        className="g-me-4"
                        dangerouslySetInnerHTML={{
                          __html:
                            occurrence?.gbifClassification?.usage?.formattedName ??
                            occurrence.scientificName ??
                            'No title provided',
                        }}
                      />
                      {vernacularNameInfo && (
                        <SimpleTooltip
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
                    </>
                  )}
                  {occurrence?.issues?.includes(OccurrenceIssue.TaxonMatchHigherrank) && (
                    <>
                      <span>{termMap.scientificName.verbatim}</span>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <span style={{ marginInlineStart: 8 }}>
                            <BsLightningFill style={{ color: 'orange' }} />
                          </span>
                        </TooltipTrigger>
                        <TooltipContent>
                          <FormattedMessage id="enums.issueHelp.TAXON_MATCH_HIGHERRANK" />
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </ArticleTitle>
                {/* <div className="g-bg-orange-300 g-p-4 g-rounded g-mt-4">
                  <p>
                    <FormattedMessage id="enums.issueHelp.TAXON_MATCH_HIGHERRANK" />
                  </p>
                  <p>
                    Interpreted as :{' '}
                    <span
                      dangerouslySetInnerHTML={{
                        __html:
                          occurrence?.gbifClassification?.usage?.formattedName ??
                          occurrence.scientificName ??
                          'Uknown scientific name',
                      }}
                    />
                  </p>
                </div> */}
                {occurrence.organismName && <h2>Organism name: {occurrence.organismName}</h2>}
                <HeaderInfo>
                  <HeaderInfoMain>
                    <div>
                      {occurrence.gbifClassification?.classification && (
                        <div>
                          <TaxonClassification
                            className="g-flex g-mb-2"
                            majorOnly
                            classification={occurrence.gbifClassification?.classification}
                          />
                        </div>
                      )}

                      {occurrence.gadm?.level1 && (
                        <GadmClassification className="g-flex g-mb-1" gadm={occurrence.gadm}>
                          {occurrence.locality && <div>{occurrence.locality}</div>}
                        </GadmClassification>
                      )}
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

                    <FeatureList className="g-mt-2">
                      {occurrence.volatile?.features?.isSamplingEvent && <SamplingEvent />}
                      {occurrence.typeStatus && occurrence.typeStatus?.length > 0 && (
                        <TypeStatus types={occurrence.typeStatus} />
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
        <OccurrenceKeyContext.Provider
          value={{
            key: data?.occurrence?.key,
            datasetKey: data?.occurrence?.datasetKey,
            dynamicProperties: data?.occurrence?.dynamicProperties,
          }}
        >
          <Outlet />
        </OccurrenceKeyContext.Provider>
      </article>
    </>
  );
}

export function OccurrenceKeySkeleton() {
  return <ArticleSkeleton />;
}
