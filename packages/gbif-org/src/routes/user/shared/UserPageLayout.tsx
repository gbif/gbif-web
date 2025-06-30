import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { Helmet } from 'react-helmet-async';

interface UserPageLayoutProps {
  title: string;
  children: React.ReactNode;
  backgroundImage?: string;
}

const DEFAULT_BACKGROUND_IMAGE = '/img/bird.jpeg';

export function UserPageLayout({
  title,
  children,
  backgroundImage = DEFAULT_BACKGROUND_IMAGE,
}: UserPageLayoutProps) {
  return (
    <>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <article>
        <PageContainer topPadded hasDataHeader className="g-bg-white">
          <ArticleTextContainer className="g-max-w-screen-xl">
            <div className="g-flex g-gap-4 g-h-full g-pb-16 g-flex-row">
              <div className="g-flex-1">
                <div className="g-flex g-items-center g-justify-center g-p-4">
                  <div className="g-max-w-md g-w-full g-bg-white g-p-8 g-space-y-6">{children}</div>
                </div>
              </div>
              <div
                className="g-flex-1 g-rounded-2xl g-bg-slate-100 g-shadow-xl g-bg-cover g-bg-center g-hidden md:g-block"
                style={{
                  backgroundImage: `url("${backgroundImage}")`,
                }}
              ></div>
            </div>
          </ArticleTextContainer>
        </PageContainer>
      </article>
    </>
  );
}
