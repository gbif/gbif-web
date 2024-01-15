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
    <ul className={cn('grid grid-cols-2 gap-4', className)}>
      {links.filter(isLinkWithUrl).map((link) => (
        <li key={link.url} className="border border-transparent hover:border-slate-100 p-3 hover:shadow-md">
          <a
            className="flex flex-row items-center underline"
            target="_blank"
            rel="noopener noreferrer"
            href={link.url}
          >
            <MdLink />
            <div className="ms-4 font-medium">{link?.label ?? link.url}</div>
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
