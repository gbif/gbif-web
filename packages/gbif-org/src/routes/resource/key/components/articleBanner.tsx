import { Skeleton } from '@/components/ui/skeleton';
import { ArticleBannerFragment } from '@/gql/graphql';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';

fragmentManager.register(/* GraphQL */ `
  fragment ArticleBanner on AssetImage {
    description
    title
    file {
      url
      details {
        image {
          width
          height
        }
      }
      normal: thumbor(width: 1200, height: 500)
      mobile: thumbor(width: 800, height: 400)
    }
  }
`);

type Props = {
  className?: string;
  image?: null | ArticleBannerFragment;
  testId?: string;
};

export function ArticleBanner({ className, image, testId }: Props) {
  const { normal, mobile, url, details } = image?.file || {};
  if (!normal || !mobile || !url) return null;

  const { width, height } = details?.image ?? {};
  const isImageTooSmallForBanner =
    (typeof width === 'number' && width < 800) || (typeof height === 'number' && height < 400);

  if (isImageTooSmallForBanner)
    return (
      <div className={cn('g-max-w-6xl g-m-auto', className)}>
        <figure className="g-flex g-flex-col g-items-center">
          <img
            data-cy={testId}
            src={url}
            alt={image?.description ?? 'No image description provided'}
            className="g-rounded-md g-bg-slate-200 g-max-h-[400px] md:g-max-h-[500px]"
          />
          {image?.description && (
            <figcaption
              className="g-text-sm g-text-slate-500 dark:g-text-slate-400 underlineLinks"
              dangerouslySetInnerHTML={{ __html: image.description }}
            />
          )}
        </figure>
      </div>
    );

  return (
    <div className={cn('g-max-w-6xl g-m-auto', className)}>
      <figure className="g-m-auto">
        <picture className="g-rounded-md">
          <source srcSet={normal} media="(min-width: 800px)" width="1200" height="500" />
          <img
            data-cy={testId}
            src={mobile}
            alt={image?.description ?? 'No image description provided'}
            className="g-rounded-md g-bg-slate-200 g-border g-border-solid g-border-slate-100"
            width="800"
            height="400"
          />
        </picture>
        {image?.description && (
          <figcaption
            className="g-text-sm g-text-slate-500 dark:g-text-slate-400 underlineLinks"
            dangerouslySetInnerHTML={{ __html: image.description }}
          />
        )}
      </figure>
    </div>
  );
}

export function ArticleBannerSkeleton({ className }: Pick<Props, 'className'>) {
  return (
    <div className={cn('g-max-w-6xl g-w-full g-m-auto', className)}>
      <Skeleton className="g-w-full g-aspect-[2/1] md:g-aspect-[12/5]" />
      <Skeleton className="g-w-5/6 g-h-4 g-mt-1" />
    </div>
  );
}
