import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { useStringParam } from '@/hooks/useParam';
import { cn } from '@/utils/shadcn';
import { useState } from 'react';
import { MdLink } from 'react-icons/md';
import styles from './faq.module.css';
import { fragmentManager } from '@/services/fragmentManager';
import { HelpResultFragment } from '@/gql/graphql';
import { DynamicLink } from '@/reactRouterPlugins';
import { Formatted } from 'maplibre-gl';
import { FormattedMessage } from 'react-intl';

fragmentManager.register(/* GraphQL */ `
  fragment HelpResult on Help {
    id
    identifier
    title
    body
    excerpt
  }
`);

export const HelpItemResult = ({
  item,
  className,
}: {
  item: HelpResultFragment;
  className?: string;
}) => {
  const [searchQuery, setSearchQuery] = useStringParam({
    key: 'q',
    defaultValue: '',
    hideDefault: true,
  });
  const showAsExpanded = item.excerpt && item.body && item.excerpt.length + 300 > item.body.length;
  const [expanded, setExpanded] = useState(
    searchQuery === `question:${item.identifier}` || showAsExpanded
  );

  return (
    <Card className={(cn('g-mb-4'), className)}>
      <article className="g-p-4">
        <div className="g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            <h3
              className="g-flex-auto g-text-base g-font-semibold g-mb-2"
              onClick={() => {
                setExpanded(!expanded);
              }}
            >
              {item.title}
            </h3>
          </div>
          <div>
            <DynamicLink
              className="g-text-base g-font-semibold g-pl-0"
              pageId="faq"
              searchParams={{ q: `question:${item.identifier}` }}
            >
              <MdLink />
            </DynamicLink>
          </div>
        </div>
        <div className="g-help-prose g-flex g-flex-col md:g-flex-row g-gap-4">
          <div className="g-flex-grow">
            {item.excerpt && !expanded && (
              <>
                <div
                  className="g-font-normal g-text-slate-700 g-text g-break-words"
                  dangerouslySetInnerHTML={{ __html: item.excerpt }}
                />
                <div className="g-flex g-justify-end g-mt-1">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => {
                      setExpanded(!expanded);
                    }}
                  >
                    <FormattedMessage id="phrases.seeDetails" defaultMessage="See details" />
                  </Button>
                </div>
              </>
            )}
            {item.body && expanded && (
              <div
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
