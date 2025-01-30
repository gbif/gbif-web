import useBelow from '@/hooks/useBelow';
import { SidebarLayout } from '@/routes/occurrence/key/pagelayouts';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { ArticleTitle } from '@/routes/resource/key/components/articleTitle';
import { FormattedMessage } from 'react-intl';
const TypeMaterial = () => {
  const removeSidebar = useBelow(1100);

  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {/* <div className={`${removeSidebar ? '' : 'g-flex'}`}> */}
        <SidebarLayout
          reverse
          className="g-grid-cols-[1fr_250px] xl:g-grid-cols-[1fr_300px]"
          stack={removeSidebar}
        >
          <ArticleTitle>
            <FormattedMessage id="taxon.tabs.typeMaterial" defaultMessage={'Type material'} />
          </ArticleTitle>
        </SidebarLayout>
      </ArticleTextContainer>
    </ArticleContainer>
  );
};

export default TypeMaterial;
