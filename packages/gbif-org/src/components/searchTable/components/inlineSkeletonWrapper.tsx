import { ConditionalWrapper } from '../../conditionalWrapper';
import { Skeleton } from '../../ui/skeleton';

type Props = {
  loading: boolean;
  children: React.ReactNode;
};

export function InlineSkeletonWrapper({ loading, children }: Props) {
  return (
    <ConditionalWrapper
      condition={loading}
      wrapper={(children) => <Skeleton className="g-inline">{children}</Skeleton>}
      children={children}
    />
  );
}
