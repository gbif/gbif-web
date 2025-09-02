import { DiscreteCardTitle } from '@/components/ui/largeCard';
import { Skeleton } from '@/components/ui/skeleton';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { FormattedMessage } from 'react-intl';

export function OccurrenceDownloadRequestCreateSkleton() {
  return (
    <ArticleContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl g-flex g-flex-col g-gap-4">
        <DiscreteCardTitle>
          <FormattedMessage id="download.request.currentFilter" defaultMessage="Current filter" />
        </DiscreteCardTitle>

        <Skeleton className="g-w-full g-h-[200px]" />

        <DiscreteCardTitle>
          <FormattedMessage id="download.downloadOptions.title" defaultMessage="Download options" />
        </DiscreteCardTitle>

        <Skeleton className="g-w-full g-h-[300px]" />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
