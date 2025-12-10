import { cn } from '@/utils/shadcn';
import { ArticleTextContainer } from '../../components/articleTextContainer';

export const backgroundColorMap: Record<string, string> = {
  white: 'g-bg-white',
  light: 'g-bg-[#f7f9fa]',
  gray: 'g-bg-[#e8ebed]',
  black: 'g-bg-slate-900',
};

type BlockContainerProps = {
  children: React.ReactNode;
  className?: string;
  backgroundImage?: string;
};

export function BlockContainer({ className, children, backgroundImage }: BlockContainerProps) {
  const backgroundStyle: React.CSSProperties | undefined = backgroundImage
    ? {
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }
    : undefined;

  return (
    <div
      style={backgroundStyle}
      className={cn('g-p-8 dark:g-bg-zinc-900 dark:g-text-slate-200 g-overflow-hidden', className)}
    >
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
    <ArticleTextContainer className="g-mb-10">
      <h2
        dir="auto"
        className={cn(
          'g-text-2xl sm:g-text-3xl g-block g-font-extrabold g-text-slate-900 g-tracking-tight dark:g-text-slate-200 g-pt-16',
          className
        )}
        dangerouslySetInnerHTML={dangerouslySetHeading}
      />
    </ArticleTextContainer>
  );
}
