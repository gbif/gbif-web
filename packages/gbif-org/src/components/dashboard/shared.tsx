import formatAsPercentage from '@/utils/formatAsPercentage';
import React from 'react';
import { FormattedMessage, FormattedNumber as Number } from 'react-intl';
import { SimpleTooltip } from '../simpleTooltip';
import { Skeleton } from '../ui/skeleton';
import { CardHeader as CardHeaderSmall } from '../ui/smallCard';
import { cn } from '@/utils/shadcn';

type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
  loading?: boolean;
  error?: unknown;
};

export function Card({
  padded: _padded = true,
  loading,
  error,
  className,
  children,
  ...props
}: CardProps) {
  if (error) {
    console.error(error);
    return (
      <div>
        <div></div>
        <div>
          <h3>Error</h3>
          <p>The card could not be loaded. Please try again later or report the issue.</p>
        </div>
      </div>
    );
  }
  return (
    <div className={`gbif-card ${className ?? ''}`} {...props}>
      {loading && <div>loading</div>}
      {children}
    </div>
  );
}

type CardHeaderProps = React.HTMLAttributes<HTMLDivElement> & {
  padded?: boolean;
  options?: React.ReactNode;
};

export function CardHeader({
  padded: _padded = true,
  options,
  children,
  ...props
}: CardHeaderProps) {
  return (
    <CardHeaderSmall className="g-flex" {...props}>
      <div className="g-flex">
        <div className="g-flex-auto">{children}</div>
        {options && (
          <div className="g-flex-none">
            <div>{options}</div>
          </div>
        )}
      </div>
    </CardHeaderSmall>
  );
}

type TableProps = React.TableHTMLAttributes<HTMLTableElement> & {
  padded?: boolean;
  removeBorder?: boolean;
  className?: string;
};

export function Table({ padded: _padded = true, className, removeBorder, ...props }: TableProps) {
  return (
    <table
      className={cn(
        `g-w-full g-border-collapse [&_tr]:g-border-separate [&_tr]:g-border-spacing-0
    [&_td]:g-py-1 [&_td]:g-px-2 ${removeBorder ? '[&_tr]:g-border-t-0' : '[&_tr]:g-border-t'}
    [&_td:first-of-type]:g-ps-0 [&_td:last-of-type]:g-pe-0
     `,
        className
      )}
      {...props}
    ></table>
  );
}

type BarItemProps = React.HTMLAttributes<HTMLDivElement> & {
  children?: React.ReactNode;
  percent?: number;
};

export function BarItem({ children, percent = 0, ...props }: BarItemProps) {
  return (
    <SimpleTooltip
      asChild
      title={
        <FormattedMessage
          id="counts.nPercentOfTotal"
          values={{ percentage: formatAsPercentage(percent / 100) }}
        />
      }
      side="left"
    >
      <div className="g-relative">
        <div
          className="g-absolute g-start-0 g-bg-primary g-opacity-20 g-rounded"
          style={{ width: `${percent}%`, height: '1.6em' }}
          {...props}
        />
        <div className="g-z-10 g-ms-1">{children}</div>
      </div>
    </SimpleTooltip>
  );
}

type FormattedNumberProps = Omit<React.ComponentProps<typeof Number>, 'value'> & {
  value?: number;
};

export function FormattedNumber(props: FormattedNumberProps) {
  if (typeof props?.value === 'undefined')
    return <Skeleton style={{ width: '70px' }} className="g-inline-block" />;
  return <Number {...(props as React.ComponentProps<typeof Number>)} />;
}
