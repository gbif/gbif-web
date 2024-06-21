import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/smallCard';
import { cn } from '@/utils/shadcn';
import { useEffect, useMemo, useRef, useState } from 'react';
import { FormattedMessage } from 'react-intl';

type Props = {
  sections: Array<{
    id: string;
    title: React.ReactElement;
    hidden?: boolean;
  }>;
};

export function TableOfContents({ sections }: Props) {
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
      rootMargin: '-40% 0% -40% 0px',
      threshold: 0.1,
    });

    document
      .querySelectorAll(sectionsToDisplay.map((section) => `#${section.id}`).join(', '))
      .forEach((elem) => observer.current!.observe(elem));

    return () => observer.current?.disconnect();
  }, [sectionsToDisplay]);

  return (
    <Card className="g-mb-4">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="Table of Contents" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ul>
          {sectionsToDisplay.map((section) => (
            <li key={section.id} className="g-py-1">
              <a
                href={`#${section.id}`}
                className={cn({
                  'g-text-primary-500 g-font-semibold': activeId === section.id,
                })}
                onClick={(e) => {
                  e.preventDefault();
                  document.querySelector(`#${section.id}`)?.scrollIntoView({ behavior: 'smooth' });
                }}
              >
                {section.title}
              </a>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
