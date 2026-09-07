import { DataHeader } from '@/components/dataHeader';
import PageMetaData from '@/components/PageMetaData';
import { Tabs } from '@/components/tabs';
import { ToolLayoutQuery, ToolPageFragment } from '@/gql/graphql';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { cn } from '@/utils/shadcn';
import { ReactElement } from 'react';
import { FormattedMessage } from 'react-intl';
import { Outlet, useLoaderData, useLocation } from 'react-router-dom';
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

// Layout for the Validation report tool, following the same shape as DerivedDatasetLayout:
// a "Dataset" tab (the tool itself — picking a dataset and viewing its report) and an "About"
// tab. No "Create" tab, since the upload-your-own-archive flow isn't built yet.
export function ValidationReportLayout({ defaultTitle, apiContent }: Props) {
  const { data } = useLoaderData() as { data?: ToolLayoutQuery };
  const cmsResource = extractCmsResource(data);
  const location = useLocation();
  const cmsTitle = cmsResource?.title;

  const isAboutTab = location.pathname.endsWith('/about');

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
                  isActive: !isAboutTab,
                  children: (
                    <FormattedMessage
                      id="tools.validationReport.tab.dataset"
                      defaultMessage="Dataset reports"
                    />
                  ),
                },
                {
                  to: 'about',
                  isActive: isAboutTab,
                  hidden: !cmsResource,
                  children: <FormattedMessage id="cms.resource.about" defaultMessage="About" />,
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
