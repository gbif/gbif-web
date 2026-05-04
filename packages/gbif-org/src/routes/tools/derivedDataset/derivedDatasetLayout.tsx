import { DataHeader } from '@/components/dataHeader';
import PageMetaData from '@/components/PageMetaData';
import { Tabs } from '@/components/tabs';
import { ToolLayoutQuery, ToolPageFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { ArticlePreTitle } from '@/routes/resource/key/components/articlePreTitle';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { cn } from '@/utils/shadcn';
import { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData, useLocation, useParams } from 'react-router-dom';
// Side-effect import: ensures the ToolPage fragment is registered with the fragment manager.
import '@/routes/resource/key/tool/tool';

function extractCmsResource(data?: ToolLayoutQuery): ToolPageFragment | null {
  const resource = data?.resource;
  if (resource?.__typename === 'Tool') return resource as ToolPageFragment;
  return null;
}

type Props = {
  defaultTitle: string;
  apiContent: ReactElement;
};

// Layout dedicated to the Derived Dataset tool. The standard ToolLayout has just
// "Tool" and "About" tabs — but we have two distinct authenticated forms (create
// a new derived dataset, edit an existing one) that should each be a tab. Edit
// is hidden unless the user is actually on an edit URL, since it has no
// destination otherwise.
export function DerivedDatasetLayout({ defaultTitle, apiContent }: Props) {
  const { data } = useLoaderData() as { data?: ToolLayoutQuery };
  const cmsResource = extractCmsResource(data);
  const location = useLocation();
  const params = useParams<{ doiPrefix?: string; doiSuffix?: string }>();
  const cmsTitle = cmsResource?.title;

  const isAboutTab = location.pathname.endsWith('/about');
  const isEditTab = !!(params.doiPrefix && params.doiSuffix);
  const isCreateTab = !isAboutTab && !isEditTab;

  const editTo =
    params.doiPrefix && params.doiSuffix ? `edit/${params.doiPrefix}/${params.doiSuffix}` : '.';

  // Same outlet context shape as ToolLayout, so ToolAboutTab and
  // useToolCmsResource work without any change.
  const outletContext = { cmsResource };

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
            <ArticlePreTitle clickable>
              {/* We do not need to use pageId as this is a gbif.org tool only */}
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
                  isActive: isCreateTab,
                  children: (
                    <FormattedMessage
                      id="tools.derivedDataset.tab.create"
                      defaultMessage="Create"
                    />
                  ),
                },
                {
                  to: 'about',
                  isActive: isAboutTab,
                  hidden: !cmsResource,
                  children: <FormattedMessage id="cms.resource.about" defaultMessage="About" />,
                },
                {
                  to: editTo,
                  isActive: isEditTab,
                  hidden: !isEditTab,
                  children: (
                    <FormattedMessage id="tools.derivedDataset.tab.edit" defaultMessage="Edit" />
                  ),
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
