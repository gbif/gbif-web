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

function Count(props: ComponentProps<typeof FormattedNumber>) {
  return (
    <span className="group-hover:g-underline g-font-semibold g-text-slate-800">
      <FormattedNumber {...props} />
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
