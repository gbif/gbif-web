import { cn } from '@/utils/shadcn';

type Props = {
  dangerouslySetInnerHTML?: { __html: string };
  children?: React.ReactNode;
  className?: string;
};

export function ArticleIntro({ dangerouslySetInnerHTML, className, ...props }: Props) {
  return (
    <div
      className={cn('text-lg text-slate-600 dark:text-slate-300', className)}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML} {...props} />
  );
}
