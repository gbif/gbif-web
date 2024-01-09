import { cn } from '@/utils/shadcn';
import { MdInsertLink } from 'react-icons/md';

type Props = {
  links: Array<null | {
    label?: string | null;
    url?: string | null;
  }>;
  className?: string;
};

export function SecondaryLinks({ links, className }: Props) {
  return (
    <div className={cn('flex flex-wrap gap-2', className)}>
      {links.filter(isValidLink).map((link) => (
        <a
          key={link.url}
          className="flex-auto border p-2 shadow-sm hover:shadow-md flex items-center gap-2"
          href={link.url}
        >
          <MdInsertLink />
          <span>{link.label}</span>
        </a>
      ))}
    </div>
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
