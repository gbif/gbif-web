import { Link, MediaBlockDetailsFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';
import { ArticleBody } from '../../components/articleBody';
import { backgroundColorMap, BlockContainer, BlockHeading } from './_shared';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';

fragmentManager.register(/* GraphQL */ `
  fragment MediaBlockDetails on MediaBlock {
    __typename
    id
    mediaTitle: title
    body
    optionalImg: primaryImage {
      file {
        url
      }
      title
      description
    }
    reverse
    subtitle
    backgroundColour
    roundImage
    callToAction {
      label
      url
    }
  }
`);

type Props = {
  resource: MediaBlockDetailsFragment;
  insideCarousel?: boolean;
};

export function MediaBlock({ resource, insideCarousel = false }: Props) {
  if (insideCarousel) return <MediaBlockContent resource={resource} insideCarousel />;

  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <BlockContainer className={backgroundColor}>
      {resource.mediaTitle && (
        <BlockHeading dangerouslySetHeading={{ __html: resource.mediaTitle }} />
      )}
      <MediaBlockContent
        className={cn('g-max-w-6xl g-m-auto md:g-px-10 g-my-10', { 'g-px-10': insideCarousel })}
        resource={resource}
      />
    </BlockContainer>
  );
}

function MediaBlockContent({
  resource,
  insideCarousel,
  className,
}: Props & { className?: string }) {
  return (
    <div
      className={cn('g-flex g-gap-6 g-items-start g-flex-col md:g-flex-row', className, {
        'md:g-flex-row-reverse': resource.reverse,
      })}
    >
      {resource.optionalImg && (
        <div className="g-flex-1">
          <img
            src={resource.optionalImg.file.url}
            alt={resource.optionalImg.description ?? ''}
            title={resource.optionalImg.title ?? ''}
            className={cn('g-w-full g-h-full g-m-auto', {
              'g-max-w-[450px]': !resource.roundImage,
              'g-max-w-[350px] g-rounded-full g-aspect-square g-object-cover': resource.roundImage,
            })}
          />
        </div>
      )}
      <div className="g-flex-1">
        {insideCarousel && (
          <h4 dir="auto" className="g-text-xl g-font-medium">
            {resource.mediaTitle}
          </h4>
        )}
        <p className="g-text-sm">{resource.subtitle}</p>
        {resource.body && (
          <ArticleBody className="g-mt-4" dangerouslySetBody={{ __html: resource.body }} />
        )}
        {resource.callToAction && (
          <div className="g-flex g-gap-4 g-flex-wrap g-mt-4">
            {resource.callToAction.map((cta) => (
              <CallToAction key={cta.url} link={cta} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function CallToAction({ link }: { link: Link }) {
  // We want to display vimeo videos directly in the browser instead of opening a new tab.
  // https://github.com/gbif/gbif-web/issues/973#issuecomment-3580526045
  if (link.url.startsWith('https://player.vimeo.com/video/')) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <button className="g-text-primary-300 hover:g-text-primary-500 hover:g-underline g-underline-offset-2">
            {link.label}
          </button>
        </DialogTrigger>
        <DialogContent
          hideCloseButton
          className="g-p-0 g-border-0 !g-rounded-none g-overflow-hidden g-shadow-none g-duration-300 g-w-[1280px] g-max-w-[min(80vw,calc(80vh/0.56))] g-max-h-full g-m-auto g-bg-black"
        >
          <div className="g-w-full g-h-0 g-pb-[56.5%] g-overflow-hidden g-relative"></div>
          <iframe
            src={link.url}
            allowFullScreen
            frameBorder="0"
            allow="autoplay; fullscreen; picture-in-picture"
            className="g-w-full g-h-full g-absolute g-top-0 g-left-0"
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <DynamicLink
      key={link.url}
      className="g-text-primary-300 hover:g-text-primary-500 hover:g-underline g-underline-offset-2"
      to={link.url}
    >
      {link.label}
    </DynamicLink>
  );
}

function Log() {
  console.log('Log');
  return null;
}
