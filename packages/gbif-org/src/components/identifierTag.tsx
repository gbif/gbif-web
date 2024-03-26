import { FormattedMessage } from 'react-intl';
import licenses from '@/enums/basic/license.json';
import React from 'react';
import { cn } from '@/utils/shadcn';

const url2enum: Record<string, string> = {
  '//creativecommons.org/publicdomain/zero/1.0/legalcode': 'CC0_1_0',
  '//creativecommons.org/licenses/by/4.0/legalcode': 'CC_BY_4_0',
  '//creativecommons.org/licenses/by-nc/4.0/legalcode': 'CC_BY_NC_4_0',
};

const enum2url: Record<string, string> = {
  CC0_1_0: '//creativecommons.org/publicdomain/zero/1.0/legalcode',
  CC_BY_4_0: '//creativecommons.org/licenses/by/4.0/legalcode',
  CC_BY_NC_4_0: '//creativecommons.org/licenses/by-nc/4.0/legalcode',
};

export function LicenceTag({
  value,
  ...props
}: {
  value: string;
  className?: string;
} & React.ComponentProps<typeof IdentifierTag>) {
  const val = value.replace(/http(s)?:/, '');
  let licenceEnum = url2enum[val] || value;
  if (licenses.indexOf(licenceEnum) === -1) licenceEnum = 'UNSUPPORTED';
  const url = enum2url[licenceEnum];

  const licenseProps = url ? { as: 'a' as const, href: url } : {};

  return (
    <IdentifierTag {...licenseProps} {...props}>
      <IdentifierType>
        <FormattedMessage id="phrases.license" />
      </IdentifierType>
      <IdentifierValue>
        <FormattedMessage id={`enums.license.${licenceEnum}`} />
      </IdentifierValue>
    </IdentifierTag>
  );
}

export function DoiTag({ id = '', ...props }) {
  const sanitizedId = id.replace(/^(.*doi.org\/)?(doi:)?(10\.)/, '10.');
  return (
    <IdentifierTag as="a" href={`https://doi.org/${sanitizedId}`} {...props}>
      <IdentifierType>DOI</IdentifierType>
      <IdentifierValue>{sanitizedId}</IdentifierValue>
    </IdentifierTag>
  );
}

export function IdentifierType({
  className,
  children,
  ...props
}: {
  className?: string;
  children: React.ReactNode;
  props?: React.ComponentProps<'span'>;
}) {
  return (
    <span
      className={cn(
        className, 'gbif-identifierType px-2 rounded-s border-solid border bg-primary-500 border-e-0 text-primaryContrast-500',
      )}
      {...props}
    >
      {children}
    </span>
  );
}

export function IdentifierValue({
  className,
  children,
  ...props
}: {
  className?: string;
  children?: React.ReactNode;
  props?: React.ComponentProps<'span'>;
}) {
  return (
    <span className={cn('px-2 rounded-e border-solid border', className)} {...props}>
      {children}
    </span>
  );
}

export const IdentifierTag = React.forwardRef(
  (
    {
      as: Div = 'div',
      className,
      children,
      ...props
    }: {
      as?: React.ElementType;
      className?: string;
      children?: React.ReactNode;
    } & React.ComponentProps<'a'>,
    ref
  ) => {
    return <Div ref={ref} className={cn('inline-block text-sm [&>.gbif-identifierType]:hover:primary-600 [&>.gbif-identifierType]:hover:text-primaryContrast-600', className)} {...props} children={children} />;
  }
);
