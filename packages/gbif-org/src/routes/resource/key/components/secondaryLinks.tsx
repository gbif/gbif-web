import { cn } from '@/utils/shadcn';
import { MdLink } from 'react-icons/md';
type NullableLink = null | {
  label?: string | null;
  url?: string | null;
};

type LinkWithUrl = {
  label?: string | null;
  url: string;
};

type Props = {
  links: Array<NullableLink>;
  className?: string;
};

export function SecondaryLinks({ links, className }: Props) {
  return (
    <ul className={cn('g-grid g-grid-cols-1 sm:g-grid-cols-2 g-gap-4', className)}>
      {links.filter(isLinkWithUrl).map((link) => (
        <li
          key={link.url}
          className="g-border g-border-solid g-border-transparent hover:g-border-slate-100 g-p-3 hover:g-shadow-md"
        >
          <a
            className="g-flex g-flex-row g-items-center g-underline"
            target="_blank"
            rel="noopener noreferrer"
            href={link.url}
          >
            <MdLink className="g-min-w-4" />
            <div className="g-ms-4 g-font-medium">{link?.label ?? link.url}</div>
          </a>
        </li>
      ))}
    </ul>
  );
}

function isLinkWithUrl(link: NullableLink): link is LinkWithUrl {
  if (link == null) return false;
  return link.url != null;
}
