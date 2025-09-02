import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { useStringParam } from '@/hooks/useParam';
import { cn } from '@/utils/shadcn';
import { useState } from 'react';
import { MdLink } from 'react-icons/md';
import styles from './faq.module.css';

export const HelpItemResult = ({ item }) => {
  const [searchQuery, setSearchQuery] = useStringParam({
    key: 'q',
    defaultValue: '',
    hideDefault: true,
  });
  const [expanded, setExpanded] = useState(searchQuery === `question:${item.identifier}`);

  return (
    <Card className="g-mb-4">
      <article className="g-p-4">
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            <a
              className="g-text-base g-font-semibold g-pl-0"
              href=""
              /*               variant="link"
               */ onClick={(e) => {
                e.preventDefault();
                setExpanded(!expanded);
              }}
            >
              {item.title}
            </a>
          </div>
          <div>
            <Button
              className="g-text-base g-font-semibold g-pl-0"
              variant="link"
              onClick={() => {
                setSearchQuery(`question:${item.identifier}`);
                setExpanded(true);
              }}
            >
              <MdLink />
            </Button>
          </div>
        </div>
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            {item.excerpt && !expanded && (
              <p
                className="g-font-normal g-text-slate-700 g-text g-break-words"
                dangerouslySetInnerHTML={{ __html: item.excerpt }}
              />
            )}
            {item.body && expanded && (
              <p
                className={cn(styles.faq, 'g-font-normal g-text-slate-700 g-text g-break-words')}
                dangerouslySetInnerHTML={{ __html: item.body }}
              />
            )}
          </div>
        </div>
      </article>
    </Card>
  );
};
