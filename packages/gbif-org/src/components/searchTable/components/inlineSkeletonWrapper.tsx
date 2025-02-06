import { cn } from '@/utils/shadcn';
import { skeletonClasses } from '../../ui/skeleton';

type Props = {
  loading: boolean;
  children: React.ReactNode;
};

const classes = skeletonClasses + ' g-inline';

export function InlineSkeletonWrapper({ loading, children }: Props) {
  return <div className={cn({ [classes]: loading })}>{children}</div>;
}
