import { Skeleton } from '@/components/ui/skeleton';
import { DynamicLink, DynamicLinkProps } from '@/reactRouterPlugins/dynamicLink';
import { cn } from '@/utils/shadcn';
import { ComponentProps, PropsWithChildren } from 'react';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Link } from 'react-router-dom';

function Container({ children }: PropsWithChildren) {
  return (
    <div className="g-grid g-grid-cols-1 md:g-grid-cols-2 lg:g-grid-cols-4 g-gap-4 g-w-full">
      {children}
    </div>
  );
}

function Item({ className, ...props }: DynamicLinkProps<typeof Link>) {
  return <DynamicLink className={cn('g-flex-1 g-group', className)} {...props} />;
}

type CountProps = Omit<ComponentProps<typeof FormattedNumber>, 'value'> & {
  value?: number;
  loading?: boolean;
};

function Count({ loading, ...props }: CountProps) {
  if (loading || !props.value) {
    return (
      <span className="g-flex g-h-6 g-w-20 g-items-center g-justify-center">
        <Skeleton className="g-h-5 g-w-20" />
      </span>
    );
  }

  return (
    <span className="group-hover:g-underline g-font-semibold g-text-slate-800">
      {loading ? <Skeleton className="g-h-3 g-w-20" /> : <FormattedNumber {...props} />}
    </span>
  );
}

function Text(props: ComponentProps<typeof FormattedMessage>) {
  return (
    <span className="g-block group-hover:g-underline g-max-w-52 g-text-sm">
      <FormattedMessage {...props} />
    </span>
  );
}

export const MapHeader = {
  Container,
  Item,
  Count,
  Text,
};
