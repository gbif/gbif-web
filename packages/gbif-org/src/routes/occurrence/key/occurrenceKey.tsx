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
import { Tabs } from '@/components/tabs';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import {
  OccurrenceCommonNameQuery,
  OccurrenceCommonNameQueryVariables,
  OccurrenceIssue,
  OccurrenceQuery,
  OccurrenceQueryVariables,
  Term,
} from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import useQuery from '@/hooks/useQuery';
import { LoaderArgs, useI18n } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { fragmentManager } from '@/services/fragmentManager';
import { required } from '@/utils/required';
import { createContext, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { BsLightningFill } from 'react-icons/bs';
import { FormattedMessage } from 'react-intl';
import { Outlet, redirect, useLoaderData } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';

const OCCURRENCE_QUERY = /* GraphQL */ `
  query Occurrence($key: ID!) {
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

const OCCURRENCE_COMMON_NAME_QUERY = /* GraphQL */ `
  query OccurrenceCommonName($key: ID!, $language: String!) {
    occurrence(key: $key) {
      acceptedTaxon {
        vernacularNames(limit: 1, language: $language) {
          results {
            vernacularName
            source
          }
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

export async function occurrenceKeyLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  const response = await graphql.query<OccurrenceQuery, OccurrenceQueryVariables>(
    OCCURRENCE_QUERY,
    {
      key,
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
  const { locale } = useI18n();
  const hideGlobe = useBelow(800);

  const { data: slowData, load: slowLoad } = useQuery<
    OccurrenceCommonNameQuery,
    OccurrenceCommonNameQueryVariables
  >(OCCURRENCE_COMMON_NAME_QUERY, {
    lazyLoad: true,
    throwAllErrors: true,
  });

  useEffect(() => {
    if (data?.occurrence?.key) {
      slowLoad({
        variables: {
          key: data.occurrence.key,
          language: locale.iso3LetterCode ?? 'eng',
        },
      });
    }
  }, [data?.occurrence?.key, slowLoad, locale?.iso3LetterCode]);

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

  const vernacularName =
    slowData?.occurrence?.acceptedTaxon?.vernacularNames?.results?.[0]?.vernacularName;

  const hasRelated = occurrence.related?.count && occurrence.related?.count > 0;

  const tabs = [{ to: '.', children: 'Overview' }];
  if (hasRelated) tabs.push({ to: 'related', children: 'Related' });
  if (occurrence?.dynamicProperties) {
    try {
      const parsedDynamicProperties = JSON.parse(occurrence.dynamicProperties);
      if (parsedDynamicProperties?.phylogenies?.[0]?.phyloTreeFileName) {
        tabs.push({ to: 'phylogenies', children: 'Phylogenies' });
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
                    <FormattedMessage id="specimen" defaultMessage="Specimen" />
                  )}
                  {!occurrence.volatile?.features?.isSpecimen && (
                    <FormattedMessage id="observation" defaultMessage="Observation" />
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
                      {vernacularName && (
                        <span
                          className="g-text-slate-300 g-inline-block"
                          style={{ fontSize: '85%' }}
                        >
                          {vernacularName}
                        </span>
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
                          This name could not be matched confidently to the GBIF backbone. The
                          clostest match is{' '}
                          <span
                            dangerouslySetInnerHTML={{
                              __html:
                                occurrence?.gbifClassification?.usage?.formattedName ??
                                occurrence.scientificName ??
                                'Uknown scientific name',
                            }}
                          />
                        </TooltipContent>
                      </Tooltip>
                    </>
                  )}
                </ArticleTitle>
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
