import { CountResolver } from '@/components/countResolver';
import { MediaCountBlockDetailsFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';
import { cn } from '@/utils/shadcn';
import { ArticleBody } from '../../components/articleBody';
import { backgroundColorMap, BlockContainer, BlockHeading } from './_shared';

fragmentManager.register(/* GraphQL */ `
  fragment MediaCountBlockDetails on MediaCountBlock {
    __typename
    id
    mediaTitle: title
    body
    optionalImg: primaryImage {
      file {
        mobile: thumbor(width: 500, height: 400)
      }
      title
      description
    }
    reverse
    subtitle
    titleCountPart
    backgroundColour
    roundImage
    callToAction {
      label
      url
    }
  }
`);

type Props = {
  resource: MediaCountBlockDetailsFragment;
  insideCarousel?: boolean;
};

export function MediaCountBlock({ resource, insideCarousel = false }: Props) {
  if (insideCarousel) return <MediaCountBlockContent resource={resource} insideCarousel />;

  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <BlockContainer className={backgroundColor}>
      {resource.mediaTitle && (
        <BlockHeading dangerouslySetHeading={{ __html: resource.mediaTitle }} />
      )}
      <MediaCountBlockContent
        className={cn('g-max-w-6xl g-m-auto md:g-px-10 g-my-10', { 'g-px-10': insideCarousel })}
        resource={resource}
      />
    </BlockContainer>
  );
}

function MediaCountBlockContent({
  resource,
  className,
  insideCarousel,
}: Props & { className?: string }) {
  return (
    <div
      className={cn('g-flex g-gap-6 g-items-center g-flex-col md:g-flex-row', className, {
        'md:g-flex-row-reverse': resource.reverse,
      })}
    >
      {resource.optionalImg && (
        <div className="g-flex-1">
          <img
            src={resource.optionalImg.file.mobile}
            alt={resource.optionalImg.description ?? ''}
            title={resource.optionalImg.title ?? ''}
            className={cn('g-max-h-[400px] g-w-full g-h-full g-m-auto', {
              'g-max-w-[500px]': !resource.roundImage,
              'g-max-w-[400px] g-rounded-full g-aspect-square g-object-cover': resource.roundImage,
            })}
          />
        </div>
      )}
      <div className="g-flex-1">
        {insideCarousel && <h4 className="g-text-xl g-font-medium">{resource.mediaTitle}</h4>}
        <span className="g-text-xl g-font-medium">
          <CountResolver countPart={resource.titleCountPart} />
        </span>
        <p className="g-text-sm">{resource.subtitle}</p>
        {resource.body && (
          <ArticleBody className="g-mt-4" dangerouslySetBody={{ __html: resource.body }} />
        )}
        {resource.callToAction && (
          <div className="g-flex g-gap-4 g-flex-wrap g-mt-4">
            {resource.callToAction.map((cta) => (
              <DynamicLink
                key={cta.url}
                className="g-text-primary-300 hover:g-text-primary-500 hover:g-underline g-underline-offset-2"
                to={cta.url}
              >
                {cta.label}
              </DynamicLink>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
