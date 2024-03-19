import { cn } from '@/utils/shadcn';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';

export const backgroundColorMap: Record<string, string> = {
  white: 'bg-white',
  light: 'bg-slate-50',
  gray: 'bg-slate-100',
  black: 'bg-slate-900',
};

type BlockContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export function BlockContainer({ className, children }: BlockContainerProps) {
  return (
    <div className={cn('p-8 dark:bg-zinc-900 dark:text-slate-200 overflow-hidden', className)}>
      {children}
    </div>
  );
}

type BlockHeadingProps = {
  dangerouslySetHeading?: { __html: string };
  className?: string;
};

export function BlockHeading({ className, dangerouslySetHeading }: BlockHeadingProps) {
  return (
    <ArticleTextContainer className="mb-10">
      <h2
        className={cn(
          'text-2xl sm:text-3xl inline-block font-extrabold text-slate-900 tracking-tight dark:text-slate-200 pt-16',
          className
        )}
        dangerouslySetInnerHTML={dangerouslySetHeading}
      />
    </ArticleTextContainer>
  );
}
