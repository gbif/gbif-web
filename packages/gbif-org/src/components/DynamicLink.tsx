import React from 'react';
import { Link } from 'react-router-dom';
import { useI18n } from '@/contexts/i18n';
import { useDefaultLocale } from '@/hooks/useDefaultLocale';
import { useExternalGbifLink } from '@/hooks/useExternalGbifLink';

type Props<T extends React.ElementType> = React.ComponentProps<T> & {
  to: string;
  as?: T;
};

export function DynamicLink<T extends React.ElementType = typeof Link>({
  to,
  as,
  ...props
}: Props<T>): React.ReactElement {
  const { locale } = useI18n();
  const defaultLocale = useDefaultLocale();

  // Create localized Link
  const isDefaultLocale = defaultLocale.code === locale.code;
  const isAbsoluteLink = to.startsWith('/');
  const toResult = isAbsoluteLink && !isDefaultLocale ? `/${locale.code}${to}` : to;

  // Should this link redirect to gbif.org?
  const gbifLink = useExternalGbifLink(to);
  if (gbifLink) {
    return <a {...props} href={gbifLink} />;
  }

  const LinkComponent = as ?? Link;
  return <LinkComponent to={toResult} {...props} />;
}
