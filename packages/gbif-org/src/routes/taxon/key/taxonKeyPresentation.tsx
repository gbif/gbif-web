import { ErrorMessage } from '@/components/errorMessage';
import {
  DeletedMessage,
  HeaderInfo,
  HeaderInfoEdit,
  HeaderInfoMain,
} from '@/components/headerComponents';
import {
  CatalogIcon,
  FeatureList,
  GenericFeature,
  Homepage,
  Location,
  OccurrenceIcon,
  PeopleIcon,
} from '@/components/highlights';
import { SimpleTooltip } from '@/components/simpleTooltip';
import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { TaxonQuery, TaxonSummaryMetricsQuery } from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { createContext } from 'react';
import { Helmet } from 'react-helmet-async';
import { GrGithub as Github } from 'react-icons/gr';
import { MdInfo } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';
import { Outlet } from 'react-router-dom';
import { HashLink } from 'react-router-hash-link';

const GBIF_REGISTRY_ENDPOINT = 'https://registry.gbif.org';
const contactThreshold = 5;

// create context to pass data to children
export const TaxonKeyContext = createContext<{ key?: string; contentMetrics?: unknown }>({});

export function TaxonKey({
  data,
  taxonMetrics,
}: {
  data: TaxonQuery;
  taxonMetrics?: TaxonSummaryMetricsQuery;
}) {
  // const hideSideBar = useBelow(1100);
  const useInlineImage = useBelow(700);
  if (data.taxon == null) throw new Error('404');
  const { taxon } = data;
  const { occurrenceSearch } = taxonMetrics ?? {};

  const deletedAt = taxon.deleted;

  // const taxons = taxonTaxons?.taxons;
  const tabs = [{ to: '.', children: 'About' }];

  // if there is occurrences, then add a specimens tab
  if (occurrenceSearch?.documents.total > 0) {
    tabs.push({ to: 'dashboard', children: 'Dashboard' });
    tabs.push({ to: 'specimen', children: 'Specimens' });
  }

  // if there is at least a countryCode for thee address, then use that, else fall back to the mailing address
  const contactInfo = taxon?.address?.country ? taxon?.address : taxon?.mailingAddress;
  /* const contactInfo = taxon?.address?.country
    ? taxon?.address
    : taxon?.mailingAddress; */
  const feedbackTemplate = `Please provide your feedback here, but leave content below for context\n\n---\nRelating to ${GBIF_REGISTRY_ENDPOINT}/taxon/${taxon.key}`;
  const contacts = taxon?.contactPersons
    .filter((x) => x?.firstName || x?.lastName)
    .map((x) => `${x?.firstName ?? ''} ${x?.lastName ?? ''}`);

  const imageUrl = taxon.featuredImageUrl ?? taxon.featuredImageUrl_fallback;
  return (
    <article>
      <Helmet>
        <title>{taxon.name}</title>
        {/* TODO we need much richer meta data. */}
      </Helmet>

      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-screen-xl">
          <div className="g-flex g-pb-4">
            {imageUrl && !useInlineImage && (
              <div className="g-flex-none g-me-4">
                <div className="g-bg-slate-200 g-rounded g-w-36 lg:g-w-96 g-overflow-hidden">
                  <FeaturedImageContent
                    featuredImageUrl={imageUrl}
                    featuredImageLicense={
                      taxon.featuredImageUrl ? taxon.featuredImageLicense : null
                    }
                  />
                </div>
              </div>
            )}
            <div className="g-flex-auto g-flex g-flex-col">
              <div className="g-flex-auto">
                <ArticlePreTitle secondary={taxon?.code}>
                  <FormattedMessage id="grscicoll.taxonCode" />
                </ArticlePreTitle>
                {/* it would be nice to know for sure which fields to expect */}
                <ArticleTitle dangerouslySetTitle={{ __html: taxon.name || 'No title provided' }}>
                  {!taxon.active && (
                    <span className="g-align-middle g-bg-red-100 g-text-red-800 g-text-sm g-font-medium g-ms-2 g-px-2.5 g-py-0.5 g-rounded dark:g-bg-red-900 dark:g-text-red-300">
                      <FormattedMessage id={`grscicoll.inactive`} />
                    </span>
                  )}
                </ArticleTitle>
                {taxon.institution && (
                  <div className="g-mt-2">
                    <FormattedMessage
                      id="grscicoll.fromInstitution"
                      values={{
                        institution: (
                          <DynamicLink
                            className="hover:g-underline g-text-primary-500"
                            to={`/institution/${taxon.institution.key}`}
                          >
                            {taxon.institution.name}
                          </DynamicLink>
                        ),
                      }}
                    />
                  </div>
                )}

                {deletedAt && <DeletedMessage date={deletedAt} />}
                {taxon.replacedByTaxon && (
                  <ErrorMessage>
                    <FormattedMessage
                      id="phrases.replacedBy"
                      values={{
                        newItem: (
                          <DynamicLink
                            className="g-me-4"
                            to={`/taxon/${taxon.replacedByTaxon.key}`}
                            pageId="speciesKey"
                            variables={{ key: taxon.replacedByTaxon.key }}
                          >
                            {taxon.replacedByTaxon.name}
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
                    <Homepage url={taxon?.homepage} />
                    {contactInfo?.country && (
                      <Location countryCode={contactInfo?.country} city={contactInfo.city} />
                    )}
                    {(taxon?.numberSpecimens ?? 0) > 1 && (
                      <GenericFeature>
                        <OccurrenceIcon />
                        <FormattedMessage
                          id="counts.nSpecimens"
                          values={{ total: taxon.numberSpecimens }}
                        />
                      </GenericFeature>
                    )}
                    {!(taxon?.numberSpecimens && taxon?.numberSpecimens > 1) && (
                      <GenericFeature>
                        <OccurrenceIcon />
                        <span className="g-text-slate-400">
                          <FormattedMessage id="grscicoll.unknownSize" />
                        </span>
                      </GenericFeature>
                    )}
                  </FeatureList>
                  {(taxon?.catalogUrls?.length ?? 0) > 0 ||
                    (contacts.length > 0 && (
                      <FeatureList>
                        {taxon.catalogUrls && (
                          <GenericFeature>
                            <CatalogIcon />
                            <span>
                              <a href={taxon.catalogUrls[0]}>
                                <FormattedMessage
                                  id="grscicoll.dataCatalog"
                                  defaultMessage="Data catalog"
                                />
                              </a>
                            </span>
                          </GenericFeature>
                        )}
                        {contacts.length > 0 && (
                          <GenericFeature>
                            <PeopleIcon />
                            <HashLink to="#contact">
                              {contacts.length < contactThreshold && (
                                <span>{contacts.join(' • ')}</span>
                              )}
                              {contacts.length >= contactThreshold && (
                                <FormattedMessage
                                  id="counts.nStaffMembers"
                                  values={{ total: contacts.length }}
                                />
                              )}
                            </HashLink>
                          </GenericFeature>
                        )}
                      </FeatureList>
                    ))}
                </HeaderInfoMain>
                <HeaderInfoEdit className="g-flex">
                  {/* TODO Phew it is quite a few lines just to add a tooltip, I wonder if an abstraction would be appreciated. Here I repeat the provider, which doesn't help, but it didn't properly disappear and reappear without it*/}
                  <Tooltip delayDuration={0}>
                    <TooltipTrigger>
                      <Button variant="outline" asChild>
                        <a href={`${GBIF_REGISTRY_ENDPOINT}/taxon/${taxon.key}`}>
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
                            `NHC: ${taxon.name}`
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
          <div className="g-border-b"></div>
          <Tabs links={tabs} />
        </ArticleTextContainer>
      </PageContainer>

      <TaxonKeyContext.Provider value={{ key: data?.taxon?.key, contentMetrics: taxonMetrics }}>
        <Outlet />
      </TaxonKeyContext.Provider>
    </article>
  );
}

export const TaxonPageSkeleton = ArticleSkeleton;

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
