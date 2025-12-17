import { Card } from '@/components/ui/largeCard';
import { EventQuery } from '@/gql/graphql';
import { useEffect, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { Group } from '@/routes/occurrence/key/About/groups';
import { GenericExtensionContent } from '@/routes/occurrence/key/About/extensions';

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

  return (
    <Group label={label} id={id} className="g-pt-0 md:g-pt-0" {...props}>
      {list.length === 1 && (
        <GenericExtensionContent
          item={list[0]}
          extensionName={extensionName}
          overwrites={overwrites}
        />
      )}
      {list.length > 1 && (
        <div>
          <div style={{ fontSize: '12px' }}>
            <FormattedMessage id="counts.nRows" values={{ total: list.length }} />
          </div>
          {list.map((item, i) => (
            <ListCard key={i}>
              <GenericExtensionContent
                item={item}
                extensionName={extensionName}
                overwrites={overwrites}
                style={{ fontSize: '90%' }}
              />
            </ListCard>
          ))}
        </div>
      )}
    </Group>
  );
}
