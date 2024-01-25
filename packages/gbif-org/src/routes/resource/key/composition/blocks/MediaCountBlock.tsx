import { fragmentManager } from '@/services/fragmentManager';
import { MediaCountBlockDetailsFragment } from '@/gql/graphql';
import { ArticleBody } from '../../components/ArticleBody';
import { DynamicLink } from '@/components/DynamicLink';
import { cn } from '@/utils/shadcn';
import { CountResolver } from '@/components/CountResolver';
import { ArticleContainer } from '../../components/ArticleContainer';

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
  backgroundColorMap: Record<string, string>;
};

export function MediaCountBlock({ resource, insideCarousel = false, backgroundColorMap }: Props) {
  if (insideCarousel) return <MediaCountBlockContent resource={resource} />;

  const backgroundColor = backgroundColorMap[resource?.backgroundColour ?? 'white'];

  return (
    <ArticleContainer className={backgroundColor}>
      <MediaCountBlockContent className="max-w-6xl m-auto p-10 " resource={resource} />
    </ArticleContainer>
  );
}

function MediaCountBlockContent({
  resource,
  className,
}: Pick<Props, 'resource'> & { className?: string }) {
  return (
    <div
      className={cn('flex gap-6 items-center flex-col md:flex-row', className, {
        'flex-col-reverse': resource.reverse,
      })}
    >
      {resource.optionalImg && (
        <div className="flex-1">
          <img
            src={resource.optionalImg.file.mobile}
            alt={resource.optionalImg.description ?? ''}
            title={resource.optionalImg.title ?? ''}
            className={cn('max-h-[400px] w-full h-full m-auto', {
              'max-w-[500px]': !resource.roundImage,
              'max-w-[400px] rounded-full aspect-square object-cover': resource.roundImage,
            })}
          />
        </div>
      )}
      <div className="flex-1">
        <h4 className="text-xl font-medium">{resource.mediaTitle}</h4>
        <span className="text-xl font-medium">
          <CountResolver countPart={resource.titleCountPart} />
        </span>
        <p className="text-sm">{resource.subtitle}</p>
        {resource.body && (
          <ArticleBody className="mt-4" dangerouslySetInnerHTML={{ __html: resource.body }} />
        )}
        {resource.callToAction && (
          <div className="flex gap-4 flex-wrap mt-4">
            {resource.callToAction.map((cta) => (
              <DynamicLink
                className="text-primary-300 hover:text-primary-500 hover:underline underline-offset-2"
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
