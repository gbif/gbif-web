import { Tabs } from '@/components/tabs';
import { CollectionQuery, CollectionSummaryMetricsQuery } from '@/gql/graphql';
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
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { GrGithub as Github } from 'react-icons/gr';
import useBelow from '@/hooks/useBelow';
import { SimpleTooltip } from '@/components/SimpleTooltip';
import { MdInfo } from 'react-icons/md';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';

const GBIF_REGISTRY_ENDPOINT = 'https://registry.gbif.org';
const contactThreshold = 5;

export function CollectionKey({
  data,
  collectionMetrics,
}: {
  data: CollectionQuery;
  collectionMetrics?: CollectionSummaryMetricsQuery;
}) {
  // const hideSideBar = useBelow(1100);
  const useInlineImage = useBelow(700);
  if (data.collection == null) throw new Error('404');
  const { collection } = data;
  const { occurrenceSearch } = collectionMetrics ?? {};

  const deletedAt = collection.deleted;

  // const collections = collectionCollections?.collections;
  const tabs = [{ to: '.', children: 'About' }];

  // if there is occurrences, then add a specimens tab
  if (occurrenceSearch?.documents.total > 0) {
    tabs.push({ to: 'dashboard', children: 'Dashboard' });
    tabs.push({ to: 'specimen', children: 'Specimens' });
  }

  // if there is at least a countryCode for thee address, then use that, else fall back to the mailing address
  const contactInfo = collection?.address?.country
    ? collection?.address
    : collection?.mailingAddress;
  const feedbackTemplate = `Please provide your feedback here, but leave content below for context\n\n---\nRelating to ${GBIF_REGISTRY_ENDPOINT}/collection/${collection.key}`;
  const contacts = collection?.contactPersons
    .filter((x) => x?.firstName)
    .map((x) => `${x?.firstName ?? ''} ${x?.lastName ?? ''}`);

  const imageUrl = collection.featuredImageUrl ?? collection.featuredImageUrl_fallback;
  return (
    <article>
      <Helmet>
        <title>{collection.name}</title>
        {/* TODO we need much richer meta data. */}
      </Helmet>

      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <div className="g-flex g-mb-4">
            {imageUrl && !useInlineImage && (
              <div className="g-flex-none g-me-4">
                <div className="g-bg-slate-200 g-rounded g-w-36 lg:g-w-96 g-overflow-hidden">
                  <FeaturedImageContent
                    featuredImageUrl={imageUrl}
                    featuredImageLicense={
                      collection.featuredImageUrl ? collection.featuredImageLicense : null
                    }
                  />
                </div>
              </div>
            )}
            <div className="g-flex-auto g-flex g-flex-col">
              <div className="g-flex-auto">
                <ArticlePreTitle secondary={collection?.code}>
                  <FormattedMessage id="grscicoll.collectionCode" />
                </ArticlePreTitle>
                {/* it would be nice to know for sure which fields to expect */}
                <ArticleTitle
                  dangerouslySetTitle={{ __html: collection.name || 'No title provided' }}
                >
                  {!collection.active && (
                    <span className="g-align-middle g-bg-red-100 g-text-red-800 g-text-sm g-font-medium g-ms-2 g-px-2.5 g-py-0.5 g-rounded dark:g-bg-red-900 dark:g-text-red-300">
                      <FormattedMessage id={`grscicoll.inactive`} />
                    </span>
                  )}
                </ArticleTitle>
                {collection.institution && (
                  <div className="g-mt-2">
                    <FormattedMessage
                      id="grscicoll.fromInstitution"
                      values={{
                        institution: (
                          <DynamicLink
                            className="hover:g-underline g-text-primary-500"
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
                            className="g-me-4"
                            to={`/collection/${collection.replacedByCollection.key}`}
                          >
                            {collection.replacedByCollection.name}
                          </DynamicLink>
                        ),
                      }}
                    />
                  </ErrorMessage>
                )}
              </div>

              <HeaderInfo className="g-flex-none g-mb-0">
                <HeaderInfoMain>
                  <FeatureList>
                    <Homepage url={collection?.homepage} />
                    {contactInfo?.country && (
                      <Location countryCode={contactInfo?.country} city={contactInfo.city} />
                    )}
                    {(collection?.numberSpecimens ?? 0) > 1 && (
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
                        <span className="g-text-slate-400">
                          <FormattedMessage id="grscicoll.unknownSize" />
                        </span>
                      </GenericFeature>
                    )}
                  </FeatureList>
                  {collection?.catalogUrls && collection?.catalogUrls?.length > 0 && (
                    <FeatureList>
                      <GenericFeature>
                        <CatalogIcon />
                        <span>
                          <a href={collection.catalogUrls[0]}>
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
                          {contacts.length < contactThreshold && (
                            <span>{contacts.join(' • ')}</span>
                          )}
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
                <HeaderInfoEdit className="g-flex">
                  {/* TODO Phew it is quite a few lines just to add a tooltip, I wonder if an abstraction would be appreciated. Here I repeat the provider, which doesn't help, but it didn't properly disappear and reappear without it*/}
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
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <Button
                        variant="ghost"
                        asChild
                        className="g-ms-2"
                        style={{ fontSize: '1.2em' }}
                      >
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
                </HeaderInfoEdit>
              </HeaderInfo>
            </div>
          </div>
          <div className="g-border-b g-mt-4"></div>
          <Tabs links={tabs} />
        </ArticleTextContainer>
      </PageContainer>

      <Outlet />
    </article>
  );
}

export const CollectionPageSkeleton = ArticleSkeleton;

export function FeaturedImageContent({
  featuredImageLicense,
  featuredImageUrl,
}: {
  featuredImageLicense?: string | null;
  featuredImageUrl?: string | null;
}) {
  if (!featuredImageUrl) return null;

  return (
    <div style={{ position: 'relative', width: '100%', height: 0, paddingBottom: '67%' }}>
      <img
        src={featuredImageUrl}
        style={{
          objectFit: 'cover',
          width: '100%',
          display: 'block',
          position: 'absolute',
          height: '100%',
        }}
      />
      {featuredImageLicense && (
        <div className="g-absolute g-bottom-0 g-left-0 g-p-1 g-text-white">
          <SimpleTooltip
            title={
              <div>
                <FormattedMessage id="phrases.license" />:{' '}
                <FormattedMessage id={`enums.license.${featuredImageLicense}`} />
              </div>
            }
          >
            <span>
              <MdInfo />
            </span>
          </SimpleTooltip>
        </div>
      )}
    </div>
  );
}
