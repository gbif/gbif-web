import { cn } from '@/utils/shadcn';

type Props = {
  className?: string;
  image: null | {
    description?: string | null;
    title?: string | null;
    file?: null | {
      normal?: string | null;
      mobile?: string | null;
    };
  };
};

export function ArticleBanner({ className, image }: Props) {
  const { normal, mobile } = image?.file || {};
  if (!normal || !mobile) return null;

  return (
    <div className={cn('max-w-6xl m-auto', className)}>
      <figure className="m-auto">
        <picture className="rounded-md">
          <source srcSet={normal} media="(min-width: 800px)" width="1200" height="500" />
          <img
            src={mobile}
            alt={image?.description ?? 'No image description provided'}
            className="rounded-md bg-slate-200"
            width="800"
            height="400"
          />
        </picture>
        {image?.description && (
          <figcaption
            className="text-sm text-slate-500 dark:text-slate-400 [&>a]:underline-offset-1 [&>a]:underline"
            dangerouslySetInnerHTML={{ __html: image.description }}
          />
        )}
      </figure>
    </div>
  );
}
