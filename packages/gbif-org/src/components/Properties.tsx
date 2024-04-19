import { cn } from '@/utils/shadcn';
import useBelow from '@/hooks/useBelow';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { MdInfoOutline } from 'react-icons/md';
import { HelpLine } from '@/components/helpText';
import EmptyValue from '@/components/EmptyValue';
import { BulletList } from '@/components/BulletList';

export default function Properties({
  breakpoint,
  horizontal,
  dense = false,
  className,
  children,
  ...props
}: {
  breakpoint?: number;
  horizontal?: boolean;
  dense?: boolean;
  className?: string;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDListElement>) {
  const isBelow = useBelow(breakpoint);
  if (!children) return null;

  const isHorizontal = typeof horizontal !== 'undefined' ? horizontal : !isBelow; // show key value pairs side by side as default on desktop

  let css = '';
  if (isHorizontal) {
    css += `grid gap-x-4 grid-cols-[auto_1fr] ${dense ? '[&>*]:mb-2' : '[&>*]:mb-3'} group [&_dl_dt]:text-slate-600`;
  } else {
    css += '[&>dd]:mb-4 [&>dt]:mb-1 group is-vertical group-[.is-vertical]:ml-2 [&_dl_dt]:text-slate-600';
  }
  return (
    <dl className={cn(`max-w-full ${css}`, className)} {...props}>
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
        'peer max-w-52 leading-tight break-words group-[.is-vertical]:font-semibold last-of-type:mb-0',
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
    <dd className={cn('leading-tight [&_a]:underline last-of-type:mb-0', className)} {...props}>
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
  if (!value) {
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
    val = value; // consider doing markdown rendering, sanitizing html and rendering links etc as a hyper text component
  }
  return val;
}

export function Property({
  value,
  helpText,
  helpTextId,
  labelId,
  children,
  ...props
}: {
  value?: any;
  helpText?: string;
  helpTextId?: string;
  labelId?: string;
  showEmpty?: boolean;
  formatter?: (value: any) => React.ReactNode;
  children?: React.ReactNode;
} & React.HTMLAttributes<HTMLDivElement>) {
  // if there is no value, and the user do not ask to show empty values, then do not show anything
  if (
    (typeof value === 'undefined' ||
      value === null ||
      (Array.isArray(value) && value.length === 0)) &&
    !children
  ) {
    if (!props.showEmpty) return null;
  }
  return (
    <>
      <Term>
        <PropertyLabel titleId={labelId} {...{ helpText, helpTextId }} />
      </Term>
      <Value>{children || <AutomaticPropertyValue value={value} {...props} />}</Value>
    </>
  );
}
