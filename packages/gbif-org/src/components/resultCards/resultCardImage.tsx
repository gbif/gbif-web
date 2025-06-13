import { ResultCardImageFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { fragmentManager } from '@/services/fragmentManager';

fragmentManager.register(/* GraphQL */ `
  fragment ResultCardImage on AssetImage {
    file {
      url: thumbor(width: 180, height: 120)
    }
  }
`);

type Props = {
  image: ResultCardImageFragment;
  link: string;
};

export function ResultCardImage({ image, link }: Props) {
  return (
    <div className="g-flex-none">
      <DynamicLink to={link} tabIndex={-1}>
        <img
          width={180}
          height={120}
          className="g-border g-border-solid g-border-slate-200/50 g-rounded g-w-[180px] g-h-[120px]"
          src={image.file.url}
        />
      </DynamicLink>
    </div>
  );
}
