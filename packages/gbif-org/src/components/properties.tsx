import { BulletList } from '@/components/bulletList';
import EmptyValue from '@/components/emptyValue';
import { HelpLine } from '@/components/helpText';
import useBelow from '@/hooks/useBelow';
import { cn } from '@/utils/shadcn';
import { useState } from 'react';
import { MdInfoOutline } from 'react-icons/md';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Button } from './ui/button';

export default function Properties({
  breakpoint,
  horizontal,
  dense = false,
  className,
  useDefaultTermWidths,
  children,
  ...props
}: {
  breakpoint?: number;
  horizontal?: boolean;
  dense?: boolean;
  className?: string;
  useDefaultTermWidths?: boolean;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDListElement>) {
  const isBelow = useBelow(breakpoint);
  if (!children) return null;

  const isHorizontal = typeof horizontal !== 'undefined' ? horizontal : !isBelow; // show key value pairs side by side as default on desktop

  let css = '';
  if (isHorizontal) {
    css += `g-grid g-gap-x-4 g-grid-cols-[auto_1fr] ${
      dense ? '[&>*]:g-mb-2' : '[&>*]:g-mb-3'
    } g-group [&_dl_dt]:g-text-slate-600 ${useDefaultTermWidths ? '[&>dt]:g-w-48' : ''}`;
  } else {
    css += `[&>dd]:g-mb-4 [&>dt]:g-mb-1 g-group is-vertical g-group-[.is-vertical]:g-ml-2 [&_dl_dt]:g-text-slate-600`;
  }
  return (
    <dl className={cn(`g-max-w-full ${css}`, className)} {...props}>
      {children}
    </dl>
  );
}

export function Term({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  // what is the correct type here, I cannot see dt as a type
  return (
    <dt
      className={cn(
        'g-peer g-max-w-52 g-leading-tight g-break-words g-group-[.is-vertical]:g-font-semibold last-of-type:g-mb-0',
        className
      )}
      {...props}
    >
      {children}
    </dt>
  );
}

export function Value({
  children,
  className,
  ...props
}: {
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  // what is the correct type here, I cannot see dd as a type
  return (
    <dd className={cn('g-break-words g-leading-tight last-of-type:g-mb-0', className)} {...props}>
      {children}
    </dd>
  );
}

export function PropertyLabel({
  titleId,
  children,
  helpText,
  helpTextId,
  helpTextTranslationId,
  ...props
}: {
  titleId?: string;
  helpText?: string;
  helpTextId?: string;
  helpTextTranslationId?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLSpanElement>) {
  const title = titleId ? <FormattedMessage id={titleId} defaultMessage={titleId} /> : children;
  return (
    <span {...props}>
      {title}{' '}
      <HelpIcon
        helpText={helpText}
        helpTextId={helpTextId}
        helpTextTranslationId={helpTextTranslationId}
      />
    </span>
  );
}

export function HelpIcon({
  helpText,
  helpTextId,
  helpTextTranslationId,
}: {
  helpText?: string;
  helpTextId?: string;
  helpTextTranslationId?: string;
}) {
  if (helpText) {
    return <HelpLine title={<MdInfoOutline />}>{helpText}</HelpLine>;
  } else if (helpTextTranslationId) {
    const content = (
      <FormattedMessage id={helpTextTranslationId} defaultMessage={helpTextTranslationId} />
    );
    return <HelpLine title={<MdInfoOutline />}>{content}</HelpLine>;
  } else if (helpTextId) {
    return <HelpLine id={helpTextId} title={<MdInfoOutline />} />;
  }
  return null;
}

export function AutomaticPropertyValue({
  value,
  formatter,
  showEmpty,
  ...props
}: {
  value: any;
  formatter?: (value: any) => React.ReactNode;
  showEmpty?: boolean;
}) {
  const [showAll, setShowAll] = useState(false);
  if (value === null || typeof value === 'undefined' || value === '') {
    if (showEmpty) return <EmptyValue />;
    return null;
  }
  let val = null;
  if (Array.isArray(value)) {
    if (value.length === 0) {
      if (showEmpty) return <EmptyValue />;
      return null;
    }
    val = (
      <BulletList>
        {value.map((v, i) => (
          <li key={i}>
            <AutomaticPropertyValue value={v} formatter={formatter} {...props} />
          </li>
        ))}
      </BulletList>
    );
  } else if (typeof formatter === 'function') {
    val = formatter(value);
  } else if (typeof value === 'number') {
    val = <FormattedNumber value={value} />;
  } else if (typeof value === 'string') {
    val =
      showAll || value.length < 2000 ? (
        value
      ) : (
        <>
          <span>{value.slice(0, 2000)}...</span>
          <Button className="g-p-2" variant="link" onClick={() => setShowAll(true)}>
            more
          </Button>
        </>
      );
  }
  return val;
}

export function Property({
  value,
  helpText,
  helpTextId,
  labelId,
  children,
  className,
  ...props
}: {
  value?: any;
  helpText?: string;
  helpTextId?: string;
  labelId?: string;
  showEmpty?: boolean;
  formatter?: (value: any) => React.ReactNode;
  children?: React.ReactNode;
  className?: string;
} & React.HTMLAttributes<HTMLDivElement>) {
  // if there is no value, and the user do not ask to show empty values, then do not show anything
  if (
    typeof value === 'undefined' ||
    value === null ||
    (Array.isArray(value) && value.length === 0)
  ) {
    if (!props.showEmpty) return null;
  }
  return (
    <>
      <Term>
        <PropertyLabel titleId={labelId} {...{ helpText, helpTextId }} />
      </Term>
      <Value className={className}>
        {children || <AutomaticPropertyValue value={value} {...props} />}
      </Value>
    </>
  );
}
