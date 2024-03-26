import React from 'react';
import { Link, useLocation } from 'react-router-dom';
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
  const location = useLocation();

  // Create localized Link
  const isDefaultLocale = defaultLocale.code === locale.code;
  const isAbsoluteLink = to.startsWith('/');
  let toResult = isAbsoluteLink && !isDefaultLocale ? `/${locale.code}${to}` : to;

  // Should this link redirect to gbif.org?
  const gbifLink = useExternalGbifLink(to);
  if (gbifLink) {
    return <a {...props} href={gbifLink} />;
  }

  // If preview=true is present in the query params, add it to the link
  const preview = new URLSearchParams(location.search).get('preview') === 'true';
  if (preview) {
    toResult = `${toResult}${toResult.includes('?') ? '&' : '?'}preview=true`;
  }

  const LinkComponent = as ?? Link;
  return <LinkComponent to={toResult} {...props} />;
}
