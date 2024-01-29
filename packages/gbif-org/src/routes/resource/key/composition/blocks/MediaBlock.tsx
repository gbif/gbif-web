import { fragmentManager } from '@/services/_FragmentManager';
import { MediaBlockDetailsFragment } from '@/gql/graphql';
import { DynamicLink } from '@/components/DynamicLink';
import { cn } from '@/utils/shadcn';
import { ArticleBody } from '../../components/ArticleBody';
import { ArticleContainer } from '../../components/ArticleContainer';
import { backgroundColorMap } from './_shared';
import { ArticleTextContainer } from '../../components/ArticleTextContainer';
import { ArticleTitle } from '../../components/ArticleTitle';

fragmentManager.register(/* GraphQL */ `
  fragment MediaBlockDetails on MediaBlock {
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
    <ArticleContainer className={backgroundColor}>
      {resource.mediaTitle && (
        <ArticleTextContainer>
          <ArticleTitle title={resource.mediaTitle}></ArticleTitle>
        </ArticleTextContainer>
      )}
      <MediaBlockContent className="max-w-6xl m-auto p-10" resource={resource} />
    </ArticleContainer>
  );
}
function MediaBlockContent({
  resource,
  insideCarousel,
  className,
}: Props & { className?: string }) {
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
        {insideCarousel && <h4 className="text-xl font-medium">{resource.mediaTitle}</h4>}
        <p className="text-sm">{resource.subtitle}</p>
        {resource.body && (
          <ArticleBody className="mt-4" dangerouslySetInnerHTML={{ __html: resource.body }} />
        )}
        {resource.callToAction && (
          <div className="flex gap-4 flex-wrap mt-4">
            {resource.callToAction.map((cta) => (
              <DynamicLink
                key={cta.url}
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
