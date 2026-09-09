import { EntityLink } from '@/hooks/useTaxonLinks';
import { DynamicLink } from '@/reactRouterPlugins';
import { cn } from '@/utils/shadcn';

/** Renders whatever useTaxonLinks resolved to, falling back to plain text when there is nowhere to link. */
export function EntityLinkPresentation({
  link,
  children,
  ...props
}: { link: EntityLink; children?: React.ReactNode } & React.ComponentProps<'a'>) {
  if (link.kind === 'internal') {
    return (
      <DynamicLink pageId={link.pageId} variables={link.variables} {...props}>
        {children}
      </DynamicLink>
    );
  }
  if (link.kind === 'external') {
    return (
      <a href={link.url} target="_blank" rel="noopener noreferrer" {...props}>
        {children}
      </a>
    );
  }
  return (
    <span {...props} className={cn(props.className, 'g-no-underline')}>
      {children}
    </span>
  );
}
