import licenses from '@/enums/basic/license.json';
import { cn } from '@/utils/shadcn';
import React from 'react';
import { FormattedMessage } from 'react-intl';

export const licenseUrl2enum: Record<string, string> = {
  '//creativecommons.org/publicdomain/zero/1.0/legalcode': 'CC0_1_0',
  '//creativecommons.org/licenses/by/4.0/legalcode': 'CC_BY_4_0',
  '//creativecommons.org/licenses/by-nc/4.0/legalcode': 'CC_BY_NC_4_0',
  unsupported: 'UNSUPPORTED',
  unspecified: 'UNSPECIFIED',
};

export const enum2licenseUrl: Record<string, string> = {
  CC0_1_0: '//creativecommons.org/publicdomain/zero/1.0/legalcode',
  CC_BY_4_0: '//creativecommons.org/licenses/by/4.0/legalcode',
  CC_BY_NC_4_0: '//creativecommons.org/licenses/by-nc/4.0/legalcode',
};

export function LicenceTag({
  value,
  ...props
}: {
  value?: string | null;
  className?: string;
} & React.ComponentProps<typeof IdentifierTag>) {
  const fallback = value ?? 'unknown';
  const val = fallback.replace(/http(s)?:/, '');
  let licenceEnum = licenseUrl2enum[val] || fallback;
  if (licenses.indexOf(licenceEnum) === -1) licenceEnum = 'UNSUPPORTED';
  const url = enum2licenseUrl[licenceEnum];

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

export function OrcId({ href, className }: { href: string; className?: string }) {
  return (
    <a dir="ltr" className={cn('g-inline-block g-no-underline', className)} href={href}>
      <img
        alt="ORCID logo"
        className="g-mr-1 g-inline-block"
        src="https://info.orcid.org/wp-content/uploads/2019/11/orcid_16x16.png"
        width="16"
        height="16"
      />
      {href}
    </a>
  );
}

export function Lsid({ identifier = '', ...props }) {
  return (
    <IdentifierTag as="a" href={`http://lsid.info/${identifier}`} {...props}>
      <IdentifierType>URN:LSID:</IdentifierType>
      <IdentifierValue>{identifier.replace('urn:lsid:', '')}</IdentifierValue>
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
        className,
        'gbif-identifierType g-px-2 g-rounded-s g-bg-primary-500 g-border g-border-primary-600 g-border-opacity-20 g-text-primaryContrast-500'
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
    <span
      className={cn(
        'g-px-2 g-rounded-e g-border-solid g-border g-border-s-0 g-border-slate-800 g-border-opacity-20 ',
        className
      )}
      {...props}
    >
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
    return (
      <Div
        dir="ltr"
        ref={ref}
        className={cn(
          'g-inline-block g-text-sm g-text-inherit g-no-underline [&>.gbif-identifierType]:hover:g-primary-600 [&>.gbif-identifierType]:hover:g-text-primaryContrast-600',
          className
        )}
        {...props}
        children={children}
      />
    );
  }
);
