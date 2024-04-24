import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import {
  OccurrenceMediaDetailsFragment,
  OccurrenceIssue,
  OccurrenceQuery,
  OccurrenceQueryVariables,
  Term,
} from '@/gql/graphql';
import { required } from '@/utils/required';
import { Outlet, useLoaderData } from 'react-router-dom';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { FormattedMessage } from 'react-intl';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { HeaderInfo, HeaderInfoMain } from '@/components/headerComponents';
import { FormattedDateRange } from '@/components/message';
import Globe from '@/components/Globe';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { BsLightningFill } from 'react-icons/bs';
import { Tabs } from '@/components/tabs';
import {
  FeatureList,
  TaxonClassification,
  GadmClassification,
  PeopleIcon,
  GenericFeature,
  SamplingEvent,
  TypeStatus,
  Location,
  Homepage,
  Sequenced,
} from '@/components/highlights';
import { BulletList } from '@/components/BulletList';
import { fragmentManager } from '@/services/fragmentManager';
const Map = React.lazy(() => import('@/components/map'));

const OCCURRENCE_QUERY = /* GraphQL */ `
  query Occurrence($key: ID!, $language: String!) {
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
      institution {
        name
        key
      }
      collection {
        name
        key
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
        vernacularNames(limit: 1, language: $language) {
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

export function occurrenceKeyLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<OccurrenceQuery, OccurrenceQueryVariables>(OCCURRENCE_QUERY, {
    key,
    language: 'eng',
  });
}

export function OccurrenceKey() {
  const { data } = useLoaderData() as { data: OccurrenceQuery };
  if (data.occurrence == null) throw new Error('404');
  const occurrence = data.occurrence;

  const { terms } = occurrence;
  const termMap: { [key: string]: Term } =
    terms?.reduce((map: { [key: string]: Term }, term) => {
      if (term?.simpleName) map[term.simpleName] = term;
      return map;
    }, {}) ?? {};

  const recorderAndIndentiferIsDifferent =
    JSON.stringify(termMap?.recordedBy?.value) !== JSON.stringify(termMap?.identifiedBy?.value);

  const vernacularName = occurrence?.acceptedTaxon?.vernacularNames?.results?.[0]?.vernacularName;
  return (
    <>
      <Helmet>
        <title>{occurrence.scientificName}</title>
      </Helmet>

      <ArticleContainer className="pb-0">
        <ArticleTextContainer className="max-w-screen-xl">
          <div className="flex">
            {data?.occurrence?.volatile?.globe && (
              <div className="flex">
                <Globe {...data?.occurrence?.volatile?.globe} className="w-32 h-32 me-4 mb-4" />
              </div>
            )}
            <div className="flex-grow">
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
              <ArticleTitle className="lg:text-3xl">
                {!occurrence?.issues?.includes(OccurrenceIssue.TaxonMatchHigherrank) && (
                  <>
                    <span
                      className="me-4"
                      dangerouslySetInnerHTML={{
                        __html:
                          occurrence?.gbifClassification?.usage?.formattedName ??
                          occurrence.scientificName ??
                          'No title provided',
                      }}
                    />
                    {vernacularName && (
                      <span className="text-slate-300 inline-block" style={{ fontSize: '85%' }}>
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
                      <TaxonClassification
                        className="flex mb-2"
                        majorOnly
                        classification={occurrence.gbifClassification?.classification}
                      />
                    )}

                    {occurrence.gadm?.level1 && (
                      <GadmClassification className="flex mb-1" gadm={occurrence.gadm}>
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
                      <GenericFeature className="flex mb-1">
                        <PeopleIcon />
                        {recorderAndIndentiferIsDifferent && (
                          <div>
                            {termMap?.recordedBy?.value?.length > 0 && (
                              <div>
                                <span>Recorded by</span>{' '}
                                <BulletList className="inline">
                                  {termMap.recordedBy.value.map((x: string) => (
                                    <li className="inline" key={x}>
                                      {x}
                                    </li>
                                  ))}
                                </BulletList>
                              </div>
                            )}
                            {termMap?.identifiedBy?.value?.length > 0 && (
                              <div style={{ marginTop: 4 }}>
                                <span>Identified by</span>{' '}
                                <BulletList className="inline">
                                  {termMap.identifiedBy.value.map((x: string) => (
                                    <li key={x} className="inline">
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
                            <BulletList className="inline">
                              {termMap.recordedBy.value.map((x: string) => (
                                <li key={x} className="inline">
                                  {x}
                                </li>
                              ))}
                            </BulletList>
                          </div>
                        )}
                      </GenericFeature>
                    )} */}
                  </div>

                  <FeatureList className="mt-2">
                    {occurrence.volatile?.features?.isSamplingEvent && <SamplingEvent />}
                    {occurrence.typeStatus && occurrence.typeStatus?.length > 0 && (
                      <TypeStatus types={occurrence.typeStatus} />
                    )}
                    {occurrence?.references && <Homepage url={occurrence?.references} />}
                    {occurrence?.volatile?.features?.isSequenced && <Sequenced />}
                  </FeatureList>
                </HeaderInfoMain>
              </HeaderInfo>
            </div>
          </div>
          <div className="border-b"></div>
          <Tabs
            links={[
              { to: '.', children: 'Overview' },
              // { to: 'media', children: 'Media' },
              { to: 'related', children: 'Related' },
              // { to: 'citations', children: 'Citations' },
            ]}
          />
        </ArticleTextContainer>
      </ArticleContainer>

      <Outlet />
    </>
  );
}

export function OccurrenceKeySkeleton() {
  return <ArticleSkeleton />;
}
