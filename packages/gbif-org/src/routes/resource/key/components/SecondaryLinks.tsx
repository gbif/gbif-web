import { cn } from '@/utils/shadcn';
import { MdInsertLink, MdLink } from 'react-icons/md';

type Props = {
  links: Array<null | {
    label?: string | null;
    url?: string | null;
  }>;
  className?: string;
};

export function SecondaryLinks({ links, className }: Props) {
  return (
    <ul className={cn('grid grid-cols-2 gap-4', className)}>
      {links.filter(isValidLink).map((link, index) => (
        <li key={link.url} className="border p-3 shadow-sm hover:shadow-md">
          <a
            className="flex flex-row items-center underline"
            target="_blank" rel="noopener noreferrer"
            href={link.url}
          >
            <MdLink />
            <div className="ms-4 font-medium">
              {link?.label ?? link?.url}
            </div>
          </a>
        </li>
      ))}
    </ul>
  );
}

function isValidLink(
  link: null | {
    label?: string | null;
    url?: string | null;
  }
): link is { label: string; url: string } {
  if (link == null) return false;
  return link.label != null && link.url != null;
}
