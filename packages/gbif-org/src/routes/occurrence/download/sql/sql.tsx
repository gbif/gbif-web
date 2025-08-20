import { Tabs } from '@/components/tabs';
import { useStringParam } from '@/hooks/useParam';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { useMemo } from 'react';
import { FormattedMessage } from 'react-intl';
import { Outlet } from 'react-router-dom';

export function OccurrenceDownloadSqlPage() {
  const [sql] = useStringParam({ key: 'sql' });

  const searchParams = useMemo(() => {
    if (!sql) return '';
    return `?sql=${encodeURIComponent(sql)}`;
  }, [sql]);

  return (
    <article>
      <PageContainer topPadded className="g-bg-white">
        <ArticleTextContainer className="g-max-w-3xl">
          <ArticleTitle>
            <FormattedMessage
              id="download.sql.createNewSqlDownload"
              defaultMessage="Create new SQL download"
            />
          </ArticleTitle>

          <div className="g-border-b g-mt-4" />

          <Tabs
            links={[
              {
                to: { pathname: '.', search: searchParams },
                children: <FormattedMessage id="download.sql.create" defaultMessage="Create" />,
              },
              {
                to: { pathname: 'about', search: searchParams },
                children: <FormattedMessage id="download.sql.about" defaultMessage="About" />,
              },
            ]}
          />
        </ArticleTextContainer>
      </PageContainer>
      <Outlet />
    </article>
  );
}
