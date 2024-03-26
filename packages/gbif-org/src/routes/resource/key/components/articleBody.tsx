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
    <div
      className={cn('prose max-w-none dark:prose-invert', styles.container, className)}
    >
      <FaqText dangerouslySetBody={dangerouslySetBody.__html} />
    </div>
  );
}

export function ArticleBodySkeleton({ className }: Pick<Props, 'className'>) {
  return (
    <div className={cn('max-w-[80ch]', className)}>
      <Skeleton className="h-6 w-[calc(100%-2px)]" />
      <Skeleton className="h-6 mt-1 w-[calc(100%-4px)]" />

      <Skeleton className="h-6 mt-6 w-[calc(100%-3px)]" />
      <Skeleton className="h-6 mt-1 w-[calc(100%-1px)]" />
      <Skeleton className="h-6 mt-1 w-[calc(100%-5px)]" />
      <Skeleton className="h-6 mt-1 w-[calc(100%-7px)]" />
    </div>
  );
}
