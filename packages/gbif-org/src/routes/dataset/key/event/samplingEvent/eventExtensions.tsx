import { Card } from '@/components/ui/largeCard';
import { Button } from '@/components/ui/button';
import { EventQuery } from '@/gql/graphql';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Group } from '@/routes/occurrence/key/About/groups';
import { GenericExtensionContent } from '@/routes/occurrence/key/About/extensions';

const INITIAL_LIMIT = 5;
const MAX_LIMIT = 100;

function ListCard(props) {
  return <Card className="g-mb-2 g-p-4 " {...props} />;
}

export function GenericEventExtension({
  event,
  label,
  id,
  extensionName,
  overwrites,
  updateToc,
  ...props
}: {
  event: EventQuery['event'];
  extensionName: string;
  overwrites?: { [key: string]: (props: { item: any }) => React.ReactNode };
  label: string;
  id: string;
  updateToc?: (id: string, visible: boolean) => void;
}) {
  const [visible, setVisible] = useState(false);
  const [expanded, setExpanded] = useState(false);
  useEffect(() => {
    if (id && updateToc) {
      updateToc && updateToc(id, visible);
    }
  }, [visible, updateToc, id]);

  const list = event?.extensions?.[extensionName];
  if (!list || list.length === 0) {
    if (visible) setVisible(false);
    return null;
  } else {
    if (!visible) setVisible(true);
  }

  const total = list.length;
  const renderCap = Math.min(total, MAX_LIMIT);
  const visibleCount = expanded ? renderCap : Math.min(INITIAL_LIMIT, total);
  const visibleItems = list.slice(0, visibleCount);
  const hiddenCount = renderCap - visibleCount;
  const overCap = total > MAX_LIMIT;

  return (
    <Group label={label} id={id} className="g-pt-0 md:g-pt-0" {...props}>
      {total === 1 && (
        <GenericExtensionContent
          item={list[0]}
          extensionName={extensionName}
          overwrites={overwrites}
        />
      )}
      {total > 1 && (
        <div>
          <div style={{ fontSize: '12px' }}>
            <FormattedMessage id="counts.nRows" values={{ total }} />
          </div>
          {visibleItems.map((item, i) => (
            <ListCard key={i}>
              <GenericExtensionContent
                item={item}
                extensionName={extensionName}
                overwrites={overwrites}
              />
            </ListCard>
          ))}
          {hiddenCount > 0 && (
            <Button
              variant="outline"
              size="sm"
              className="g-mt-2"
              onClick={() => setExpanded(true)}
            >
              <FormattedMessage
                id="phrases.showAllNItems"
                defaultMessage="Show all {total} items"
                values={{ total: renderCap }}
              />
            </Button>
          )}
          {expanded && visibleCount > INITIAL_LIMIT && (
            <Button
              variant="outline"
              size="sm"
              className="g-mt-2 g-ms-2"
              onClick={() => setExpanded(false)}
            >
              <FormattedMessage
                id="occurrenceDetails.showLess"
                defaultMessage="Show less"
              />
            </Button>
          )}
          {overCap && (
            <div className="g-mt-2 g-text-xs g-text-slate-500">
              <FormattedMessage
                id="eventDetails.extensionTruncated"
                defaultMessage="Only the first {shown} of {total} items are shown."
                values={{ shown: MAX_LIMIT, total }}
              />
            </div>
          )}
        </div>
      )}
    </Group>
  );
}
