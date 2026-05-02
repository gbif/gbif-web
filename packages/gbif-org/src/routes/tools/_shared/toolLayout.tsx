import { DataHeader } from '@/components/dataHeader';
import PageMetaData from '@/components/PageMetaData';
import { Tabs } from '@/components/tabs';
import { ToolLayoutQuery, ToolPageFragment } from '@/gql/graphql';
import { DynamicLink, LoaderArgs } from '@/reactRouterPlugins';
import { ArticleAuxiliary } from '@/routes/resource/key/components/articleAuxiliary';
import { ArticleBanner } from '@/routes/resource/key/components/articleBanner';
import { ArticleBody } from '@/routes/resource/key/components/articleBody';
import { ArticleFooterWrapper } from '@/routes/resource/key/components/articleFooterWrapper';
import { ArticlePreTitle, PreTitleDate } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { SecondaryLinks } from '@/routes/resource/key/components/secondaryLinks';
import { cn } from '@/utils/shadcn';
import { ReactElement } from 'react';
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

export function createToolLayoutLoader(machineIdentifier: string) {
  return (args: LoaderArgs) =>
    args.graphql.query<ToolLayoutQuery, { machineIdentifier: string }>(TOOL_LAYOUT_QUERY, {
      machineIdentifier,
    });
}

function extractCmsResource(data?: ToolLayoutQuery): ToolPageFragment | null {
  const resource = data?.resource;
  if (resource?.__typename === 'Tool') return resource as ToolPageFragment;
  return null;
}

type ToolOutletContext = { cmsResource: ToolPageFragment | null };

export function useToolCmsResource(): ToolPageFragment | null {
  return useOutletContext<ToolOutletContext>().cmsResource;
}

type ToolLayoutProps = {
  defaultTitle: string;
  apiContent: ReactElement;
};

export function ToolLayout({ defaultTitle, apiContent }: ToolLayoutProps) {
  const { data } = useLoaderData() as { data?: ToolLayoutQuery };
  const cmsResource = extractCmsResource(data);
  const location = useLocation();
  const cmsTitle = cmsResource?.title;
  const date = cmsResource?.publicationDate ?? cmsResource?.createdAt;
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
            <ArticlePreTitle clickable secondary={date ? <PreTitleDate date={date} /> : undefined}>
              <DynamicLink to="/resource/search?contentType=tool">
                <FormattedMessage id="cms.contentType.tool" defaultMessage="Tool" />
              </DynamicLink>
            </ArticlePreTitle>

            {cmsTitle ? (
              <ArticleTitle dangerouslySetTitle={{ __html: cmsTitle }} />
            ) : (
              <ArticleTitle>{defaultTitle}</ArticleTitle>
            )}

            <Tabs
              className={cn('g-mt-6', !isAboutTab && 'g-border-none')}
              links={[
                {
                  to: '.',
                  children: <FormattedMessage id="cms.contentType.tool" defaultMessage="Tool" />,
                },
                {
                  to: 'about',
                  children: <FormattedMessage id="cms.resource.about" defaultMessage="About" />,
                  hidden: !cmsResource,
                },
              ]}
            />
          </ArticleTextContainer>
        </PageContainer>

        <Outlet context={outletContext} />
      </article>
    </>
  );
}

export function ToolAboutTab() {
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

          {resource.author && (
            <ArticleAuxiliary
              label={<FormattedMessage id="cms.resource.author" />}
              dangerouslySetValue={{
                __html: resource.author,
                classNames: 'underlineLinks',
              }}
            />
          )}

          {resource.rights && (
            <ArticleAuxiliary
              label={<FormattedMessage id="cms.resource.rights" />}
              dangerouslySetValue={{
                __html: resource.rights,
                classNames: 'underlineLinks',
              }}
            />
          )}

          {resource.rightsHolder && (
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
