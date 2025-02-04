import EmptyValue from '@/components/emptyValue';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';

export default function EmptyTab({ children }: { children?: React.ReactNode }) {
  return (
    <ArticleContainer className="g-bg-slate-100 g-pt-4">
      <ArticleTextContainer className="g-max-w-screen-xl g-relative g-min-h-[50vh]">
        {children ?? <EmptyValue />}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
