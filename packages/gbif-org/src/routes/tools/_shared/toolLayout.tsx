import { DataHeader } from '@/components/dataHeader';
import PageMetaData from '@/components/PageMetaData';
import { Tabs } from '@/components/tabs';
import { ToolLayoutByIdQuery, ToolLayoutQuery, ToolPageFragment } from '@/gql/graphql';
import { LoaderArgs } from '@/reactRouterPlugins';
import { ArticleAuxiliary } from '@/routes/resource/key/components/articleAuxiliary';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { ArticleBody } from '@/routes/resource/key/components/articleBody';
import { ArticleFooterWrapper } from '@/routes/resource/key/components/articleFooterWrapper';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { SecondaryLinks } from '@/routes/resource/key/components/secondaryLinks';
import { cn } from '@/utils/shadcn';
import { ComponentProps, ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData, useLocation, useOutletContext } from 'react-router-dom';
// Side-effect import: ensures the ToolPage fragment is registered with the fragment manager.
import '@/routes/resource/key/tool/tool';

const TOOL_LAYOUT_QUERY = /* GraphQL */ `
  query ToolLayout($machineIdentifier: String!) {
    resource(machineIdentifier: $machineIdentifier) {
      __typename
      ... on Tool {
        ...ToolPage
      }
    }
  }
`;

const TOOL_LAYOUT_BY_ID_QUERY = /* GraphQL */ `
  query ToolLayoutById($id: String!) {
    resource(id: $id) {
      __typename
      ... on Tool {
        ...ToolPage
      }
    }
  }
`;

// The CMS entry is optional: the page falls back to its default title. graphql-api answers a
// missing entry with HTTP 404, which would otherwise become the page status. Other statuses pass
// through unchanged. `fallbackId` is for entries that have no machine identifier yet.
export function createToolLayoutLoader(
  machineIdentifier: string,
  { fallbackId }: { fallbackId?: string } = {}
) {
  return async (args: LoaderArgs) => {
    const response = await args.graphql.query<ToolLayoutQuery, { machineIdentifier: string }>(
      TOOL_LAYOUT_QUERY,
      { machineIdentifier }
    );
    if (response.status !== 404) return response;
    if (!fallbackId) return { data: undefined };
    const byId = await args.graphql.query<ToolLayoutByIdQuery, { id: string }>(
      TOOL_LAYOUT_BY_ID_QUERY,
      { id: fallbackId }
    );
    return byId.status === 404 ? { data: undefined } : byId;
  };
}

export type ToolLayoutData = ToolLayoutQuery | ToolLayoutByIdQuery;

export function extractCmsResource(data?: ToolLayoutData): ToolPageFragment | null {
  const resource = data?.resource;
  if (resource?.__typename === 'Tool') return resource as ToolPageFragment;
  return null;
}

type ToolOutletContext = { cmsResource: ToolPageFragment | null };

export function useToolCmsResource(): ToolPageFragment | null {
  return useOutletContext<ToolOutletContext>().cmsResource;
}

export type ToolLayoutTab = ComponentProps<typeof Tabs>['links'][number];

type ToolLayoutProps = {
  defaultTitle: string;
  apiContent: ReactElement;
  /**
   * Replaces the default "Tool" and "About" tabs. Receives whether a CMS entry exists. These tabs
   * set `isActive` themselves.
   */
  tabs?: (options: { hasCmsResource: boolean }) => ToolLayoutTab[];
  /** Loader data, when the tool loader sits on an ancestor route instead of the layout's own. */
  data?: ToolLayoutData;
};

export function ToolLayout({ defaultTitle, apiContent, tabs, data }: ToolLayoutProps) {
  const loaderData = useLoaderData() as { data?: ToolLayoutData } | undefined;
  const cmsResource = extractCmsResource(data ?? loaderData?.data);
  const location = useLocation();
  const cmsTitle = cmsResource?.title;
  const isAboutTab = location.pathname.endsWith('/about');

  const outletContext: ToolOutletContext = { cmsResource };

  return (
    <>
      <PageMetaData
        title={cmsTitle ?? defaultTitle}
        description={cmsResource?.excerpt ?? cmsResource?.summary ?? undefined}
        path={location.pathname}
        imageUrl={cmsResource?.primaryImage?.file.normal}
        imageAlt={cmsResource?.primaryImage?.description}
      />
      <DataHeader hideCatalogueSelector className="g-bg-white" apiContent={apiContent} />
      <article className="g-min-h-screen g-flex g-flex-col g-bg-slate-100">
        <PageContainer
          topPadded
          hasDataHeader
          className={cn('g-bg-white', !isAboutTab && 'g-border-b')}
        >
          <ArticleTextContainer>
            {cmsTitle ? (
              <ArticleTitle dangerouslySetTitle={{ __html: cmsTitle }} />
            ) : (
              <ArticleTitle>{defaultTitle}</ArticleTitle>
            )}

            <Tabs
              className={cn('g-mt-6', !isAboutTab && 'g-border-none')}
              disableAutoDetectActive={!!tabs}
              links={
                tabs
                  ? tabs({ hasCmsResource: !!cmsResource })
                  : [
                      {
                        to: '.',
                        children: (
                          <FormattedMessage id="cms.contentType.tool" defaultMessage="Tool" />
                        ),
                      },
                      {
                        to: 'about',
                        children: (
                          <FormattedMessage id="cms.resource.about" defaultMessage="About" />
                        ),
                        hidden: !cmsResource,
                      },
                    ]
              }
            />
          </ArticleTextContainer>
        </PageContainer>

        <Outlet context={outletContext} />
      </article>
    </>
  );
}

export function ToolAboutTab({ hideAttribution = false }: { hideAttribution?: boolean } = {}) {
  const resource = useToolCmsResource();

  if (!resource) {
    return (
      <PageContainer topPadded bottomPadded className="g-bg-white g-flex-1">
        <ArticleTextContainer>
          <p className="g-text-slate-500">
            <FormattedMessage
              id="tools.aboutNotAvailable"
              defaultMessage="No about content is available for this tool."
            />
          </p>
        </ArticleTextContainer>
      </PageContainer>
    );
  }

  return (
    <PageContainer bottomPadded className="g-bg-white g-flex-1">
      {resource.primaryImage && <ArticleBanner className="g-mb-6" image={resource.primaryImage} />}

      <ArticleTextContainer>
        {resource.body && <ArticleBody dangerouslySetBody={{ __html: resource.body }} />}

        <ArticleFooterWrapper>
          {resource.secondaryLinks && (
            <ArticleAuxiliary>
              <SecondaryLinks links={resource.secondaryLinks} className="g-mt-8" />
            </ArticleAuxiliary>
          )}

          {resource.citation && (
            <ArticleAuxiliary
              label={<FormattedMessage id="cms.auxiliary.citation" />}
              dangerouslySetValue={{
                __html: resource.citation,
                classNames: 'underlineLinks',
              }}
            />
          )}

          {!hideAttribution && resource.author && (
            <ArticleAuxiliary
              label={<FormattedMessage id="cms.resource.author" />}
              dangerouslySetValue={{
                __html: resource.author,
                classNames: 'underlineLinks',
              }}
            />
          )}

          {!hideAttribution && resource.rights && (
            <ArticleAuxiliary
              label={<FormattedMessage id="cms.resource.rights" />}
              dangerouslySetValue={{
                __html: resource.rights,
                classNames: 'underlineLinks',
              }}
            />
          )}

          {!hideAttribution && resource.rightsHolder && (
            <ArticleAuxiliary
              label={<FormattedMessage id="cms.resource.rightsHolder" />}
              dangerouslySetValue={{
                __html: resource.rightsHolder,
                classNames: 'underlineLinks',
              }}
            />
          )}
        </ArticleFooterWrapper>
      </ArticleTextContainer>
    </PageContainer>
  );
}
