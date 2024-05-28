import { Tabs } from '@/components/tabs';
import {
  InstitutionQuery,
  InstitutionQueryVariables,
  InstitutionSummaryMetricsQuery,
} from '@/gql/graphql';
import { LoaderArgs } from '@/types';
import { required } from '@/utils/required';
import { Helmet } from 'react-helmet-async';
import { Outlet, useLoaderData } from 'react-router-dom';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleSkeleton } from '@/routes/resource/key/components/articleSkeleton';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { FormattedDate, FormattedMessage } from 'react-intl';
import {
  DeletedMessage,
  HeaderInfo,
  HeaderInfoEdit,
  HeaderInfoMain,
  defaultDateFormatProps,
} from '@/components/headerComponents';
import {
  Homepage,
  FeatureList,
  GenericFeature,
  OccurrenceIcon,
  CatalogIcon,
  Location,
} from '@/components/highlights';
import { ErrorMessage } from '@/components/errorMessage';
import { DynamicLink } from '@/components/dynamicLink';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { GrGithub as Github } from 'react-icons/gr';

const GBIF_REGISTRY_ENDPOINT = 'https://registry.gbif.org';

export function InstitutionKey({
  data,
  institutionMetrics,
}: {
  data: InstitutionQuery;
  institutionMetrics: InstitutionSummaryMetricsQuery;
}) {
  if (data.institution == null) throw new Error('404');
  const { institution } = data;
  const { occurrenceSearch, institution: institutionCollections } = institutionMetrics ?? {};

  const deletedAt = institution.deleted;

  // const collections = institutionCollections?.collections;
  const tabs = [
    { to: '.', children: 'About' },
    { to: 'collection', children: 'Collections' }, // TODO, tabs can only be strings <FormattedMessage id="counts.nCollections" values={{ total: collections?.length }} />
  ];

  // if there is occurrences, then add a specimens tab
  if (occurrenceSearch?.documents.total > 0) {
    tabs.push({ to: 'specimen', children: 'Specimens' });
  }

  // if there is at least a countryCode for thee address, then use that, else fall back to the mailing address
  const contactInfo = institution?.address?.country
    ? institution?.address
    : institution?.mailingAddress;
  const feedbackTemplate = `Please provide you feedback here, but leave content below for context\n\n---\nRelating to ${GBIF_REGISTRY_ENDPOINT}/institution/${institution.key}`;

  return (
    <>
      <Helmet>
        <title>{institution.name}</title>
        {/* TODO we need much richer meta data. */}
      </Helmet>

      <ArticleContainer className="pb-0">
        <ArticleTextContainer className="max-w-screen-xl">
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
                      className="me-4"
                      to={`/institution/${institution.replacedByInstitution.key}`}
                    >
                      {institution.replacedByInstitution.name}
                    </DynamicLink>
                  ),
                }}
              />
            </ErrorMessage>
          )}

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
                    <span className="text-slate-400">
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
                      <a href={institution.catalogUrls[0]}>
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
            <HeaderInfoEdit className="flex">
              {/* TODO Phew it is quite a few lines just to add a tooltip, I wonder if an abstraction would be appreciated. Here I repeat the provider, which doesn't help, but it didn't properly disappear and reappear without it*/}
              <Tooltip delayDuration={0}>
                <TooltipTrigger>
                  <Button variant="outline" asChild>
                    <a href={`${GBIF_REGISTRY_ENDPOINT}/institution/${institution.key}`}>
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
                  <Button variant="ghost" asChild className="ms-2" style={{ fontSize: '1.2em' }}>
                    <a
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

export const InstitutionPageSkeleton = ArticleSkeleton;
