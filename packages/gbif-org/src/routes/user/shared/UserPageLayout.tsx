import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { Helmet } from 'react-helmet-async';
import { LoginBox } from '../login/login';

interface UserPageLayoutProps {
  title: string;
  children: React.ReactNode;
  backgroundImage?: string;
}

const DEFAULT_BACKGROUND_IMAGE = "https://inaturalist-open-data.s3.amazonaws.com/photos/612156/original.JPG";

export function UserPageLayout({
  title,
  children,
  backgroundImage = DEFAULT_BACKGROUND_IMAGE
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
                <LoginBox>
                  {children}
                </LoginBox>
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