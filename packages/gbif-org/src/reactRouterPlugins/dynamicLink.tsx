import { Link, useLocation } from 'react-router-dom';
import { useI18n } from './i18n';
import { useGetRedirectUrl } from './enablePages';

type Props<T extends React.ElementType> = React.ComponentProps<T> & {
  to: string;
  as?: T;
};

export function DynamicLink<T extends React.ElementType = typeof Link>({
  to,
  as,
  ...props
}: Props<T>): React.ReactElement {
  // Localize the link
  const { localizeLink } = useI18n();
  const location = useLocation();
  let toResult = localizeLink(to as string);

  // Replace the link with a link to gbif if the target route is disabled
  const redirectToGbifLink = useGetRedirectUrl(toResult);
  if (redirectToGbifLink) {
    return <a {...props} href={redirectToGbifLink} />;
  }

  // If preview=true is present in the query params, add it to the link
  const preview = new URLSearchParams(location.search).get('preview') === 'true';
  if (preview) {
    toResult = `${toResult}${toResult.includes('?') ? '&' : '?'}preview=true`;
  }

  const LinkComponent = as ?? Link;
  return <LinkComponent to={toResult} {...props} />;
}
