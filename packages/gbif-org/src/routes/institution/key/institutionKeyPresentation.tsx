import { DataHeader } from '@/components/dataHeader';
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
} from '@/components/highlights';
import PageMetaData from '@/components/PageMetaData';
import { Tabs } from '@/components/tabs';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { InstitutionQuery, InstitutionSummaryMetricsQuery } from '@/gql/graphql';
import useBelow from '@/hooks/useBelow';
import { DynamicLink } from '@/reactRouterPlugins';
import { FeaturedImageContent } from '@/routes/collection/key/collectionKeyPresentation';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { createContext } from 'react';
import { GrGithub as Github } from 'react-icons/gr';
import { FormattedMessage } from 'react-intl';
import { Outlet } from 'react-router-dom';
import { AboutContent, ApiContent } from './help';
const GBIF_REGISTRY_ENDPOINT = import.meta.env.PUBLIC_REGISTRY;

// create context to pass data to children
export const InstitutionKeyContext = createContext<{
  key?: string;
  contentMetrics?: InstitutionSummaryMetricsQuery;
}>({});

export function InstitutionKey({
  data,
  institutionMetrics,
  fallbackImage,
}: {
  data: InstitutionQuery;
  institutionMetrics?: InstitutionSummaryMetricsQuery;
  fallbackImage?: string | null;
}) {
  const useInlineImage = useBelow(800);
  if (data.institution == null) throw new Error('404');
  const { institution } = data;
  const { occurrenceSearch } = institutionMetrics ?? {};

  const deletedAt = institution.deleted;

  const tabs = [{ to: '.', children: <FormattedMessage id="grscicoll.tabs.about" /> }];
  if (institution.collectionCount && institution.collectionCount > 0) {
    tabs.push({
      to: 'collections',
      children: (
        <FormattedMessage
          id="counts.nCollections"
          values={{ total: institution.collectionCount }}
        />
      ),
    });
  }

  // if there ire occurrences, then add a specimens tab
  if (occurrenceSearch?.documents.total > 0) {
    tabs.push({ to: 'specimens', children: <FormattedMessage id="grscicoll.specimens" /> });
  }

  // if there is at least a countryCode for thee address, then use that, else fall back to the mailing address
  const contactInfo = institution?.address?.country
    ? institution?.address
    : institution?.mailingAddress;
  const feedbackTemplate = `Please provide your feedback here, but leave content below for context\n\n---\nRelating to ${GBIF_REGISTRY_ENDPOINT}/institution/${institution.key}`;

  const imageUrl =
    institution.featuredImageUrl ?? institution.featuredImageUrl_fallback ?? fallbackImage;

  return (
    <>
      <PageMetaData
        title={institution.name}
        description={institution.description}
        imageUrl={imageUrl}
        noindex={!!institution.deleted}
        nofollow={!!institution.deleted}
        path={`/institution/${institution.key}`}
      />

      <DataHeader
        className="g-bg-white"
        aboutContent={<AboutContent />}
        apiContent={<ApiContent id={institution?.key?.toString()} />}
      ></DataHeader>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <div className="g-flex g-pb-4">
              {imageUrl && !useInlineImage && (
                <div className="g-flex-none g-me-4">
                  <div className="g-bg-slate-200 g-rounded g-w-64 lg:g-w-96 g-overflow-hidden">
                    <FeaturedImageContent
                      featuredImageUrl={imageUrl}
                      featuredImageLicense={
                        institution.featuredImageUrl ? institution.featuredImageLicense : null
                      }
                    />
                  </div>
                </div>
              )}
              <div className="g-flex-auto g-flex g-flex-col">
                <div className="g-flex-auto">
                  <ArticlePreTitle secondary={institution?.code}>
                    <FormattedMessage id="grscicoll.institutionCode" />
                  </ArticlePreTitle>
                  {/* it would be nice to know for sure which fields to expect */}
                  <ArticleTitle
                    dangerouslySetTitle={{ __html: institution.name || 'No title provided' }}
                  ></ArticleTitle>

                  {deletedAt && <DeletedMessage date={deletedAt} />}
                  {institution.replacedByInstitution && (
                    <ErrorMessage>
                      <FormattedMessage
                        id="phrases.replacedBy"
                        values={{
                          newItem: (
                            <DynamicLink
                              className="g-me-4"
                              pageId="institutionKey"
                              variables={{ key: institution.replacedByInstitution.key }}
                              to={`/institution/${institution.replacedByInstitution.key}`}
                            >
                              {institution.replacedByInstitution.name}
                            </DynamicLink>
                          ),
                        }}
                      />
                    </ErrorMessage>
                  )}
                </div>

                <HeaderInfo>
                  <HeaderInfoMain>
                    <FeatureList>
                      <Homepage url={institution?.homepage} />
                      {contactInfo?.country && (
                        <Location countryCode={contactInfo?.country} city={contactInfo.city} />
                      )}
                      {institution?.numberSpecimens && institution?.numberSpecimens > 1 && (
                        <GenericFeature>
                          <OccurrenceIcon />
                          <FormattedMessage
                            id="counts.nSpecimens"
                            values={{ total: institution.numberSpecimens }}
                          />
                        </GenericFeature>
                      )}
                      {!(institution?.numberSpecimens && institution?.numberSpecimens > 1) && (
                        <GenericFeature>
                          <OccurrenceIcon />
                          <span className="g-text-slate-400">
                            <FormattedMessage id="grscicoll.unknownSize" />
                          </span>
                        </GenericFeature>
                      )}
                    </FeatureList>
                    {institution?.catalogUrls && institution?.catalogUrls?.length > 0 && (
                      <FeatureList>
                        <GenericFeature>
                          <CatalogIcon />
                          <span>
                            <a
                              className="g-text-inherit hover:g-underline"
                              href={institution.catalogUrls[0]}
                            >
                              <FormattedMessage
                                id="grscicoll.dataCatalog"
                                defaultMessage="Data catalog"
                              />
                            </a>
                          </span>
                        </GenericFeature>
                      </FeatureList>
                    )}
                  </HeaderInfoMain>
                  <HeaderInfoEdit className="g-flex g-mt-4">
                    {/* TODO Phew it is quite a few lines just to add a tooltip, I wonder if an abstraction would be appreciated. Here I repeat the provider, which doesn't help, but it didn't properly disappear and reappear without it*/}
                    <TooltipProvider>
                      <Tooltip delayDuration={0}>
                        <TooltipTrigger>
                          <Button variant="outline" asChild>
                            <a
                              className="g-text-inherit hover:g-text-primary-500"
                              href={`${GBIF_REGISTRY_ENDPOINT}/institution/${institution.key}`}
                            >
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
                          <Button
                            variant="ghost"
                            asChild
                            className="g-ms-2"
                            style={{ fontSize: '1.2em' }}
                          >
                            <a
                              className="g-text-inherit hover:g-text-primary-500"
                              href={`https://github.com/gbif/portal-feedback/issues/new?title=${encodeURIComponent(
                                `NHC: ${institution.name}`
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
              </div>
            </div>
            {tabs.length > 1 && (
              <>
                <div className="g-border-b"></div>
                <Tabs links={tabs} />
              </>
            )}
          </ArticleTextContainer>
        </PageContainer>

        <InstitutionKeyContext.Provider
          value={{ key: data?.institution?.key, contentMetrics: institutionMetrics }}
        >
          <Outlet />
        </InstitutionKeyContext.Provider>
      </article>
    </>
  );
}

export const InstitutionPageSkeleton = ArticleSkeleton;
