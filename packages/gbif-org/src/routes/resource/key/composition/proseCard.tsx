import { ConditionalWrapper } from '@/components/conditionalWrapper';
import { ProseCardImgFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment ProseCardImg on AssetImage {
    file {
      mobile: thumbor(width: 500, height: 400)
    }
    title
    description
  }
`);

type Props = {
  title: string;
  url?: string;
  image?: ProseCardImgFragment | null;
};

export function ProseCard({ title, url, image }: Props) {
  return (
    <div className="g-mx-auto g-max-w-[min(24rem,100%)] g-bg-white g-border g-border-solid g-border-gray-200 g-rounded-lg g-shadow hover:g-shadow-md g-transition-shadow dark:g-bg-gray-800 dark:g-border-gray-700 g-w-full">
      {image && (
        <ConditionalWrapper
          condition={typeof url === 'string'}
          wrapper={(children) => <DynamicLink to={url!}>{children}</DynamicLink>}
        >
          <img
            className="g-rounded-t-lg g-aspect-[5/4] g-w-full"
            src={image.file.mobile}
            title={image.title ?? ''}
          />
        </ConditionalWrapper>
      )}
      <div className="g-p-5">
        <ConditionalWrapper
          condition={typeof url === 'string'}
          wrapper={(children) => <DynamicLink to={url!}>{children}</DynamicLink>}
        >
          <h5
            className="g-mb-2 g-text-lg g-font-semibold g-tracking-tight g-text-gray-900 dark:g-text-white g-break-words"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </ConditionalWrapper>
      </div>
    </div>
  );
}
