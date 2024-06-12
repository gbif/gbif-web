import { ConditionalWrapper } from '@/components/conditionalWrapper';
import { DynamicLink } from '@/components/dynamicLink';
import { ProseCardImgFragment } from '@/gql/graphql';
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
    <div className="mx-auto max-w-[min(24rem,100%)] bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
      {image && (
        <ConditionalWrapper
          condition={typeof url === 'string'}
          wrapper={(children) => <DynamicLink to={url!}>{children}</DynamicLink>}
        >
          <img
            className="rounded-t-lg"
            src={image.file.mobile}
            alt={image.description ?? ''}
            title={image.title ?? ''}
          />
        </ConditionalWrapper>
      )}
      <div className="p-5">
        <ConditionalWrapper
          condition={typeof url === 'string'}
          wrapper={(children) => <DynamicLink to={url!}>{children}</DynamicLink>}
        >
          <h5
            className="mb-2 text-lg font-semibold tracking-tight text-gray-900 dark:text-white break-words"
            dangerouslySetInnerHTML={{ __html: title }}
          />
        </ConditionalWrapper>
      </div>
    </div>
  );
}
