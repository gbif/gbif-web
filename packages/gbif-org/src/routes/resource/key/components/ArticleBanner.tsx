import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/utils/shadcn';

type Props = {
  className?: string;
  image: null | {
    description?: string | null;
    title?: string | null;
    file?: null | {
      details?: null | {
        image?: null | {
          width?: null | number;
          height?: null | number;
        };
      };
      url?: string | null;
      normal?: string | null;
      mobile?: string | null;
    };
  };
};

export function ArticleBanner({ className, image }: Props) {
  const { normal, mobile, url, details } = image?.file || {};
  if (!normal || !mobile || !url) return null;

  const { width, height } = details?.image ?? {};
  const isImageTooSmallForBanner =
    (typeof width === 'number' && width < 800) || (typeof height === 'number' && height < 400);

  if (isImageTooSmallForBanner)
    return (
      <div className={cn('max-w-6xl m-auto', className)}>
        <figure className="flex flex-col items-center">
          <img
            src={url}
            alt={image?.description ?? 'No image description provided'}
            className="rounded-md bg-slate-200 max-h-[400px] md:max-h-[500px]"
          />
          {image?.description && (
            <figcaption
              className="text-sm text-slate-500 dark:text-slate-400 [&>a]:underline-offset-1 [&>a]:underline"
              dangerouslySetInnerHTML={{ __html: image.description }}
            />
          )}
        </figure>
      </div>
    );

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

export function ArticleBannerSkeleton({ className }: Pick<Props, 'className'>) {
  return (
    <div className={cn('max-w-6xl w-full m-auto', className)}>
      <Skeleton className="w-full aspect-[2/1] md:aspect-[12/5]" />
      <Skeleton className="w-5/6 h-4 mt-1" />
    </div>
  );
}
