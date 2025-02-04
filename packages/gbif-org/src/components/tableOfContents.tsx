import { cn } from '@/utils/shadcn';
import { useEffect, useMemo, useRef, useState } from 'react';
import { HashLink } from 'react-router-hash-link';

type Props = {
  sections: Array<{
    id: string;
    title: React.ReactElement;
    hidden?: boolean;
  }>;
  className?: string;
};

export function TableOfContents({ sections, className }: Props) {
  const sectionsToDisplay = useMemo(
    () => sections.filter((section) => !section.hidden),
    [sections]
  );

  const [activeId, setActiveId] = useState<string | null>(sectionsToDisplay[0].id);
  const observer = useRef<IntersectionObserver>();

  useEffect(() => {
    const handleObsever = (entries: IntersectionObserverEntry[]) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    };

    observer.current = new IntersectionObserver(handleObsever, {
      rootMargin: `-200px 0px -60% 0px`,
      threshold: 0.1,
    });

    document
      .querySelectorAll(sectionsToDisplay.map((section) => `#${section.id}`).join(', '))
      .forEach((elem) => observer.current!.observe(elem));

    return () => observer.current?.disconnect();
  }, [sectionsToDisplay]);

  return (
    <ul className={cn('gbif-word-break g-list-none g-m-0 g-p-0', className)}>
      {sectionsToDisplay.map((section) => (
        <li key={section.id}>
          <HashLink
            to={`#${section.id}`}
            replace
            // href={`#${section.id}`}
            className={cn(
              'g-block g-border-l g-text-sm g-px-4 g-py-1 g-border-transparent hover:g-border-slate-400 dark:hover:g-border-slate-500 g-text-slate-700 dark:g-text-slate-400 dark:hover:g-text-slate-300 hover:g-text-primary-600',
              {
                'g-text-primary-500 g-font-semibold': activeId === section.id,
              }
            )}
          >
            {section.title}
          </HashLink>
        </li>
      ))}
    </ul>
  );
}
