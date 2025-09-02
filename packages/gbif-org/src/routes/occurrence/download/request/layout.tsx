import { Tabs } from '@/components/tabs';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { FormattedMessage } from 'react-intl';
import { Outlet, useSearchParams } from 'react-router-dom';

export function OccurrenceDownloadPage() {
  const [searchParams] = useSearchParams();

  return (
    <article>
      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-3xl">
          <ArticleTitle>
            <FormattedMessage
              id="download.request.createNewDownload"
              defaultMessage="Create new download"
            />
          </ArticleTitle>

          <div className="g-border-b g-mt-4" />

          <Tabs
            links={[
              {
                to: { pathname: '.', search: searchParams.toString() },
                children: <FormattedMessage id="download.create" defaultMessage="Create" />,
              },
              {
                to: { pathname: 'about', search: searchParams.toString() },
                children: <FormattedMessage id="download.about" defaultMessage="About" />,
              },
            ]}
          />
        </ArticleTextContainer>
      </PageContainer>
      <Outlet />
    </article>
  );
}
