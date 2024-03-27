import { Tabs } from '@/components/tabs';
import { CollectionQuery, CollectionSummaryMetricsQuery, ContactPerson } from '@/gql/graphql';
import { Helmet } from 'react-helmet-async';
import { Outlet } from 'react-router-dom';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { FormattedMessage } from 'react-intl';
import {
  DeletedMessage,
  HeaderInfo,
  HeaderInfoEdit,
  HeaderInfoMain,
} from '@/components/headerComponents';
import {
  Homepage,
  FeatureList,
  GenericFeature,
  OccurrenceIcon,
  CatalogIcon,
  Location,
  PeopleIcon,
} from '@/components/highlights';
import { ErrorMessage } from '@/components/errorMessage';
import { DynamicLink } from '@/components/dynamicLink';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { GrGithub as Github } from 'react-icons/gr';

const GBIF_REGISTRY_ENDPOINT = 'https://registry.gbif.org';
const contactThreshold = 5;

export function CollectionKey({
  data,
  collectionMetrics,
}: {
  data: CollectionQuery;
  collectionMetrics?: CollectionSummaryMetricsQuery;
}) {
  if (data.collection == null) throw new Error('404');
  const { collection } = data;
  const { occurrenceSearch } = collectionMetrics ?? {};

  const deletedAt = collection.deleted;

  // const collections = collectionCollections?.collections;
  const tabs = [
    { to: '.', children: 'About' },
    { to: 'dashboard', children: 'Dashboard' },
  ];

  // if there is occurrences, then add a specimens tab
  if (occurrenceSearch?.documents.total > 0) {
    tabs.push({ to: 'specimen', children: 'Specimens' });
  }

  // if there is at least a countryCode for thee address, then use that, else fall back to the mailing address
  const contactInfo = collection?.address?.country
    ? collection?.address
    : collection?.mailingAddress;
  const feedbackTemplate = `Please provide you feedback here, but leave content below for context\n\n---\nRelating to ${GBIF_REGISTRY_ENDPOINT}/collection/${collection.key}`;
  const contacts = collection?.contactPersons
    .filter((x) => x?.firstName)
    .map((x) => `${x?.firstName ?? ''} ${x?.lastName ?? ''}`);

  return (
    <>
      <Helmet>
        <title>{collection.name}</title>
        {/* TODO we need much richer meta data. */}
      </Helmet>

      <ArticleContainer className="pb-0">
        <ArticleTextContainer className="max-w-screen-xl">
          <ArticlePreTitle secondary={collection?.code}>
            <FormattedMessage id="grscicoll.collectionCode" />
          </ArticlePreTitle>
          {/* it would be nice to know for sure which fields to expect */}
          <ArticleTitle
            dangerouslySetTitle={{ __html: collection.name || 'No title provided' }}
          >
            {!collection.active && (
              <span className="align-middle bg-red-100 text-red-800 text-sm font-medium ms-2 px-2.5 py-0.5 rounded dark:bg-red-900 dark:text-red-300">
                <FormattedMessage id={`grscicoll.inactive`} />
              </span>
            )}
          </ArticleTitle>
          {collection.institution && (
            <div className="mt-2">
              <FormattedMessage
                id="grscicoll.fromInstitution"
                values={{
                  institution: (
                    <DynamicLink
                      className="hover:underline text-primary-500"
                      to={`/institution/${collection.institution.key}`}
                    >
                      {collection.institution.name}
                    </DynamicLink>
                  ),
                }}
              />
            </div>
          )}

          {deletedAt && <DeletedMessage date={deletedAt} />}
          {collection.replacedByCollection && (
            <ErrorMessage>
              <FormattedMessage
                id="phrases.replacedBy"
                values={{
                  newItem: (
                    <DynamicLink
                      className="me-4"
                      to={`/collection/${collection.replacedByCollection.key}`}
                    >
                      {collection.replacedByCollection.name}
                    </DynamicLink>
                  ),
                }}
              />
            </ErrorMessage>
          )}

          <HeaderInfo>
            <HeaderInfoMain>
              <FeatureList>
                <Homepage url={collection?.homepage} />
                {contactInfo?.country && (
                  <Location countryCode={contactInfo?.country} city={contactInfo.city} />
                )}
                {collection?.numberSpecimens && collection?.numberSpecimens > 1 && (
                  <GenericFeature>
                    <OccurrenceIcon />
                    <FormattedMessage
                      id="counts.nSpecimens"
                      values={{ total: collection.numberSpecimens }}
                    />
                  </GenericFeature>
                )}
                {!(collection?.numberSpecimens && collection?.numberSpecimens > 1) && (
                  <GenericFeature>
                    <OccurrenceIcon />
                    <span className="text-slate-400">
                      <FormattedMessage id="grscicoll.unknownSize" />
                    </span>
                  </GenericFeature>
                )}
              </FeatureList>
              {collection.catalogUrl && (
                <FeatureList>
                  <GenericFeature>
                    <CatalogIcon />
                    <span>
                      <a href={collection.catalogUrl}>
                        <FormattedMessage
                          id="grscicoll.dataCatalog"
                          defaultMessage="Data catalog"
                        />
                      </a>
                    </span>
                  </GenericFeature>
                  {contacts.length > 0 && (
                    <GenericFeature>
                      <PeopleIcon />
                      {contacts.length < contactThreshold && <span>{contacts.join(' • ')}</span>}
                      {contacts.length >= contactThreshold && (
                        <FormattedMessage
                          id="counts.nStaffMembers"
                          values={{ total: contacts.length }}
                        />
                      )}
                    </GenericFeature>
                  )}
                </FeatureList>
              )}
            </HeaderInfoMain>
            <HeaderInfoEdit className="flex">
              {/* TODO Phew it is quite a few lines just to add a tooltip, I wonder if an abstraction would be appreciated. Here I repeat the provider, which doesn't help, but it didn't properly disappear and reappear without it*/}
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <Button variant="outline" asChild>
                      <a href={`${GBIF_REGISTRY_ENDPOINT}/collection/${collection.key}`}>
                        <FormattedMessage id="grscicoll.edit" defaultMessage="Edit" />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <FormattedMessage
                      id="grscicoll.editHelpText"
                      defaultMessage="No login required"
                    />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <TooltipProvider>
                <Tooltip delayDuration={0}>
                  <TooltipTrigger>
                    <Button variant="ghost" asChild className="ms-2" style={{ fontSize: '1.2em' }}>
                      <a
                        href={`https://github.com/gbif/portal-feedback/issues/new?title=${encodeURIComponent(
                          `NHC: ${collection.name}`
                        )}&body=${encodeURIComponent(feedbackTemplate)}`}
                      >
                        <Github />
                      </a>
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <FormattedMessage id="grscicoll.githubHelpText" defaultMessage="Github" />
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </HeaderInfoEdit>
          </HeaderInfo>
          <div className="border-b"></div>
          <Tabs links={tabs} />
        </ArticleTextContainer>
      </ArticleContainer>

      <Outlet />
    </>
  );
}

export const CollectionPageSkeleton = ArticleSkeleton;
