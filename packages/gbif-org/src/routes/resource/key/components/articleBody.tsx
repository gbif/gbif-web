import { cn } from '@/utils/shadcn';
import styles from './articleBody.module.css';
import { Skeleton } from '@/components/ui/skeleton';
import { FaqText } from './faqText';

type Props = {
  className?: string;
  dangerouslySetBody: { __html: string };
};

export function ArticleBody({ className, dangerouslySetBody }: Props) {
  return (
    <div className={cn('g-prose g-max-w-none dark:g-prose-invert', styles.container, className)}>
      <FaqText dangerouslySetBody={dangerouslySetBody.__html} />
    </div>
  );
}

export function ArticleBodySkeleton({ className }: Pick<Props, 'className'>) {
  return (
    <div className={cn('g-max-w-[80ch]', className)}>
      <Skeleton className="g-h-6 g-w-[calc(100%-2px)]" />
      <Skeleton className="g-h-6 g-mt-1 g-w-[calc(100%-4px)]" />

      <Skeleton className="g-h-6 g-mt-6 g-w-[calc(100%-3px)]" />
      <Skeleton className="g-h-6 g-mt-1 g-w-[calc(100%-1px)]" />
      <Skeleton className="g-h-6 g-mt-1 g-w-[calc(100%-5px)]" />
      <Skeleton className="g-h-6 g-mt-1 g-w-[calc(100%-7px)]" />
    </div>
  );
}
