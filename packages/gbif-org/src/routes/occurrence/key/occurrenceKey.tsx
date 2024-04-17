import React from 'react';
import { Helmet } from 'react-helmet-async';
import { LoaderArgs } from '@/types';
import { OccurrenceIssue, OccurrenceQuery, OccurrenceQueryVariables } from '@/gql/graphql';
import { DynamicLink } from '@/components/dynamicLink';
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
import { FeatureList, TaxonClassification, GadmClassification, PeopleIcon, GenericFeature, SamplingEvent, TypeStatus } from '@/components/highlights';
import { BulletList } from '@/components/BulletList';
const Map = React.lazy(() => import('@/components/map'));

const OCCURRENCE_QUERY = /* GraphQL */ `
  query Occurrence($key: ID!) {
    occurrence(key: $key) {
      key
      coordinates
      countryCode
      eventDate
      typeStatus
      issues
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
      }
      sounds {
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
      }
      movingImages {
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
        simpleName
        verbatim
        value
        htmlValue
        remarks
        issues
      }

      scientificName
      dataset {
        key
        title
      }
    }
  }
`;

export function occurrenceKeyLoader({ params, graphql }: LoaderArgs) {
  const key = required(params.key, 'No key was provided in the URL');

  return graphql.query<OccurrenceQuery, OccurrenceQueryVariables>(OCCURRENCE_QUERY, { key });
}

export function OccurrenceKey() {
  const { data } = useLoaderData() as { data: OccurrenceQuery };

  if (data.occurrence == null) throw new Error('404');
  const occurrence = data.occurrence;

  const { terms } = occurrence;
  const termMap =
    terms?.reduce((map: { [key: string]: any }, term) => {
      if (term?.simpleName) map[term.simpleName] = term;
      return map;
    }, {}) ?? {};

    const recorderAndIndentiferIsDifferent = JSON.stringify(termMap?.recordedBy?.value) !== JSON.stringify(termMap?.identifiedBy?.value);

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
                <FormattedMessage id="occurrence" defaultMessage="Occurrence" />
              </ArticlePreTitle>
              {/* <ArticleTitle
                dangerouslySetTitle={{ __html: occurrence.scientificName || 'No title provided' }}
              ></ArticleTitle> */}
              <ArticleTitle className="lg:text-3xl">
                {!occurrence?.issues?.includes(OccurrenceIssue.TaxonMatchHigherrank) && (
                  <span
                    dangerouslySetInnerHTML={{
                      __html:
                        occurrence?.gbifClassification?.usage?.formattedName ??
                        occurrence.scientificName ??
                        'No title provided',
                    }}
                  />
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
              <HeaderInfo>
                <HeaderInfoMain>
                  <div>
                    <TaxonClassification
                      className="flex mb-1"
                      majorOnly
                      classification={occurrence.gbifClassification?.classification}
                    />

                    <GadmClassification className="flex mb-1" gadm={occurrence.gadm} />

                    {(termMap.recordedBy || termMap.identifiedBy) && <GenericFeature className="flex mb-1">
                      <PeopleIcon />
                      {recorderAndIndentiferIsDifferent && <div>
                        {termMap?.recordedBy?.value?.length > 0 && <div><span>Recorded by</span> <BulletList className="inline">{termMap.recordedBy.value.map(x => <li className="inline" key={x}>{x}</li>)}</BulletList></div>}
                        {termMap?.identifiedBy?.value?.length > 0 && <div style={{ marginTop: 4 }}><span>Identified by</span> <BulletList className="inline">{termMap.identifiedBy.value.map(x => <li key={x} className="inline">{x}</li>)}</BulletList></div>}
                      </div>}
                      {!recorderAndIndentiferIsDifferent && <div>
                        <BulletList className="inline">{termMap.recordedBy.value.map(x => <li key={x} className="inline">{x}</li>)}</BulletList>
                      </div>}
                    </GenericFeature>}
                  </div>
                  
                  <FeatureList className="mt-2">
                    {occurrence.volatile?.features?.isSamplingEvent && <SamplingEvent />}
                    {occurrence.typeStatus?.length > 0 && <TypeStatus types={occurrence.typeStatus} />}
                  </FeatureList>
                </HeaderInfoMain>
              </HeaderInfo>
            </div>
          </div>
          <div className="border-b"></div>
          <Tabs
            links={[
              { to: '.', children: 'Overview' },
              { to: 'media', children: 'Media' },
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
