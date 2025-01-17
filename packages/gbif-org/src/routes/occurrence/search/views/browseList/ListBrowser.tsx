import { Drawer } from '@/components/drawer/drawer';
import { useStringParam } from '@/hooks/useParam';
import usePrevious from '@/hooks/usePrevious';
import { useDynamicLink } from '@/reactRouterPlugins/dynamicLink';
import { StandaloneOccurrenceKeyPage } from '@/routes/occurrence/key/standalone';
import { useEffect, useRef } from 'react';
import { FormattedMessage } from 'react-intl';
import { useOrderedList } from './useOrderedList';

const entityTypes = {
  o: 'occurrence',
  d: 'dataset',
  p: 'publisher',
  t: 'species',
  c: 'collection',
  i: 'institution',
  n: 'network',
  in: 'installation',
};

export default function EntityDrawer() {
  const { orderedList } = useOrderedList();
  const [previewKey, setPreviewKey] = useStringParam({ key: 'entity' });
  // use a switch to set type from previewKey. If it starts with o_ it is an occurrence key, d_ is dataset key, p_ is publisher key, c_ is collection key, i_ is institution key, n_ is network key, in_ is installation key
  let type;
  if (previewKey) {
    const abbreviation = previewKey?.indexOf('_') > 0 ? previewKey?.split('_')[0] : undefined;
    if (abbreviation) {
      type = entityTypes[abbreviation as keyof typeof entityTypes];
    } else {
      type = 'occurrence';
    }
  }
  const key = previewKey ? previewKey.split('_')[1] ?? previewKey : undefined;
  const entitylink = useDynamicLink({ pageId: `${type}Key`, variables: { key: key } });

  // We need to keep track of the history of keys to be able to go back and forth
  // This is because the drawer can display related occurrences that has an id that is not in the orderedList
  // If we encounter such an id, we need to be able to go back to the previous id in the history until we find an id that is in the orderedList
  const keyHistory = useRef<string[]>([]);

  const getCurrentIndex = (key: string | undefined = previewKey) => {
    if (key == null) return -1;

    const index = orderedList.findIndex((o) => o.toString() === key?.toString());
    if (index !== -1) return index;

    return getCurrentIndex(keyHistory.current.pop());
  };

  useEffect(() => {
    if (previewKey) {
      keyHistory.current.push(previewKey);
    }
  }, [previewKey]);

  const handleNext = () => {
    // Logic to go to the next item in `orderedList`
    const currentIndex = getCurrentIndex();
    const nextIndex = currentIndex + 1;
    if (nextIndex < orderedList.length) {
      setPreviewKey(orderedList[nextIndex].toString());
    }
  };

  const handlePrevious = () => {
    // Logic to go to the previous item in `orderedList`
    const currentIndex = getCurrentIndex();
    const previousIndex = currentIndex - 1;
    if (previousIndex >= 0) {
      setPreviewKey(orderedList[previousIndex]?.toString());
    }
  };

  const noList = !orderedList || orderedList.length < 2;
  const isFirst = noList || orderedList[0] === key;
  const isLast = noList || orderedList[orderedList.length - 1] === key;

  // Used to find the trigger to focus on close. The previewKey is undefined by the time the drawer closes
  const prevPreviewKey = usePrevious(previewKey);

  return (
    <Drawer
      isOpen={typeof key === 'string'}
      close={() => setPreviewKey()}
      viewOnGbifHref={entitylink.to}
      next={isFirst ? undefined : handleNext}
      previous={isLast ? undefined : handlePrevious}
      onCloseAutoFocus={(e) => handleCloseAutoFocus(e, prevPreviewKey)}
      screenReaderTitle={
        type === 'occurrence' ? (
          <FormattedMessage
            id={'occurrenceDetails.screenReader.title'}
            defaultMessage="Occurrence details"
          />
        ) : undefined
      }
      screenReaderDescription={undefined}
    >
      {type === 'occurrence' && <StandaloneOccurrenceKeyPage url={`/occurrence/${key}`} />}
      {type === 'dataset' && <StandaloneOccurrenceKeyPage url={`/dataset/${key}`} />}
      {type === 'publisher' && <StandaloneOccurrenceKeyPage url={`/publisher/${key}`} />}
      {type === 'collection' && <StandaloneOccurrenceKeyPage url={`/collection/${key}`} />}
      {type === 'institution' && <StandaloneOccurrenceKeyPage url={`/institution/${key}`} />}
      {type === 'network' && <StandaloneOccurrenceKeyPage url={`/network/${key}`} />}
      {type === 'installation' && <StandaloneOccurrenceKeyPage url={`/installation/${key}`} />}
      {type === 'species' && <StandaloneOccurrenceKeyPage url={`/species/${key}`} />}
    </Drawer>
  );
}

// In radix the dialog trigger and dialog is colocated, making it easy to let radix handle the refocus of the trigger on close
// We can't really do that here, with the drawer trigger and drawer content being in different components + it could give more performance overhead for the table
// So we need to look for the trigger. We do this by adding the entity query param as a data attribute on the trigger
function handleCloseAutoFocus(e: Event, previewKey: string | undefined) {
  if (!previewKey) {
    console.warn('No previewKey to focus on close');
    return;
  }

  const trigger = document.querySelector(`[data-entity-trigger="${previewKey}"]`);

  if (trigger && 'focus' in trigger && typeof trigger.focus === 'function') {
    trigger.focus();
    e.preventDefault();
    return;
  }

  console.warn('Could not find trigger to focus on close');
}
