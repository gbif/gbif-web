import { safeHref } from '@/utils/safeHref';

/**
 * An <a> for URLs we don't control. If the URL isn't safe to link to
 * (see safeHref), the children are rendered as plain text instead.
 */
export function SafeLink({
  href,
  children,
  ...props
}: Omit<React.ComponentProps<'a'>, 'href'> & { href?: string | null }) {
  const safe = safeHref(href);
  if (!safe) return <span className={props.className}>{children}</span>;
  return (
    <a href={safe} {...props}>
      {children}
    </a>
  );
}
