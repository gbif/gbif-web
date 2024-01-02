import { cn } from '@/utils/shadcn';

type Props = {
  dangerouslySetInnerHTML: { __html: string };
  className?: string;
};

export function ArticleIntro({ dangerouslySetInnerHTML, className }: Props) {
  return (
    <div
      className={cn('text-lg text-slate-600', className)}
      dangerouslySetInnerHTML={dangerouslySetInnerHTML}
    />
  );
}
