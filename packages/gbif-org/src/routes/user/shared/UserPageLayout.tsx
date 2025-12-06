import { DynamicLink } from '@/reactRouterPlugins';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { Helmet } from 'react-helmet-async';

interface UserPageLayoutProps {
  title: string;
  children: React.ReactNode;
  backgroundImage?: string;
  photoCredit?: React.ReactNode;
  occurrenceId?: string;
}

export const userLayoutBackgroundImages = {
  bird: {
    url: '/img/bird.jpeg',
    credit: 'Ploceus philippinus by Malay Mehta',
    occurrenceId: '891775469',
  },
  frog: {
    url: '/img/frog.jpeg',
    credit: 'Melanobatrachus indicus by Daniel V Raju',
    occurrenceId: '2963960883',
  },
};

export function UserPageLayout({
  title,
  children,
  backgroundImage = backgroundImages.bird.url,
  photoCredit = backgroundImages.bird.credit,
  occurrenceId = backgroundImages.bird.occurrenceId,
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
              <div className="g-flex-1 g-flex-col g-gap-2 g-hidden md:g-block">
                <div
                  className="g-relative g-flex-1 g-h-full g-rounded-2xl g-bg-slate-100 g-shadow-xl g-bg-cover g-bg-center"
                  style={{
                    backgroundImage: `url("${backgroundImage}")`,
                  }}
                ></div>
                {photoCredit && (
                  <div className="g-flex-none g-text-sm g-text-slate-400 g-mt-1 g-text-end">
                    <DynamicLink
                      pageId="occurrenceKey"
                      variables={{ key: occurrenceId }}
                      className="hover:g-underline"
                    >
                      {photoCredit}
                    </DynamicLink>
                  </div>
                )}
              </div>
            </div>
          </ArticleTextContainer>
        </PageContainer>
      </article>
    </>
  );
}
