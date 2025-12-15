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

type MediaBlockImageProps = {
  src: string;
  alt?: string | null;
  title?: string | null;
  description?: string | null;
  className?: string;
};

export function MediaBlockImage({ src, alt, title, description, className }: MediaBlockImageProps) {
  return (
    <div className="g-flex-1 g-group">
      <figure className="g-relative">
        <img src={src} alt={alt ?? ''} title={title ?? ''} className={className} />
        {description && (
          <figcaption
            dir="auto"
            className="g-absolute g-bottom-0 g-left-0 g-right-0 g-mx-auto g-max-w-[400px] g-text-sm g-text-slate-500 dark:g-text-slate-400 g-bg-white dark:g-bg-zinc-800 g-border g-border-slate-200 dark:g-border-slate-700 g-px-3 g-py-2 underlineLinks coloredLinks g-opacity-0 group-hover:g-opacity-100 g-transition-opacity g-rounded-md"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        )}
      </figure>
    </div>
  );
}
