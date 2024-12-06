import { useConfig } from '@/config/config';
import { Card } from './ui/smallCard';
import { cn } from '@/utils/shadcn';
import { HashLink } from 'react-router-hash-link';

export function GbifLinkCard({ path, className }: { path: string; className?: string }) {
  const config = useConfig();
  if (!config.linkToGbifOrg) return null;

  return (
    <Card className={cn('', className)}>
      <nav>
        <ul className="g-list-none g-m-0 g-p-0 g-my-2">
          <TocLi>
            <a href={`${import.meta.env.PUBLIC_GBIF_ORG}${path}`}>View on GBIF.org</a>
          </TocLi>
        </ul>
      </nav>
    </Card>
  );
}

export function TocLi({
  to,
  toc,
  href,
  children,
  ...props
}: {
  to?: string;
  href?: string;
  toc?: { [key: string]: boolean };
  children: React.ReactNode;
} & React.ComponentProps<'li'>) {
  const className =
    'g-block g-border-l [&_a]:g-block g-text-sm g-px-4 g-py-1 g-border-transparent hover:g-border-slate-400 dark:hover:g-border-slate-500 g-text-slate-700 hover:g-text-slate-900 dark:g-text-slate-400 dark:hover:g-text-slate-300';
  if (to) {
    return (
      <li className={className} {...props}>
        <HashLink to={to} replace>
          {children}
        </HashLink>
      </li>
    );
  }
  if (href) {
    return (
      <li className={className} {...props}>
        <a href={href} target="_blank" rel="noopener noreferrer">
          {children}
        </a>
      </li>
    );
  }
  return <li className={className} {...props} children={children} />;
}

export function Separator(props) {
  return <li className="g-my-1 g-border-t g-border-slate-100"></li>;
}
