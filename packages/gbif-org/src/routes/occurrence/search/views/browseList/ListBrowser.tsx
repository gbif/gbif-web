import { Drawer } from '@/components/drawer/drawer';
import usePrevious from '@/hooks/usePrevious';
import { useLink } from '@/reactRouterPlugins/dynamicLink';
import { StandaloneOccurrenceKeyPage } from '@/routes/occurrence/key/standalone';
import { FormattedMessage } from 'react-intl';
import { useEntityDrawer } from './useEntityDrawer';
import { useOrderedList } from './useOrderedList';

const entityTypes = {
  o: 'occurrenceKey',
  d: 'datasetKey',
  p: 'publisherKey',
  t: 'speciesKey',
  tx: 'speciesKey',
  c: 'collectionKey',
  i: 'institutionKey',
  n: 'networkKey',
  in: 'installationKey',
  dl: 'downloadKey',
};

export default function EntityDrawer() {
  const { orderedList } = useOrderedList();
  const [previewKey, setPreviewKey] = useEntityDrawer();
  const createLink = useLink();
  // use a switch to set type from previewKey. If it starts with o_ it is an occurrence key, d_ is dataset key, p_ is publisher key, c_ is collection key, i_ is institution key, n_ is network key, in_ is installation key
  let type;
  let abbreviation;
  if (previewKey) {
    abbreviation = previewKey?.indexOf('_') > 0 ? previewKey?.split('_')[0] : undefined;
    if (abbreviation) {
      type = entityTypes[abbreviation as keyof typeof entityTypes];
    } else {
      type = 'occurrenceKey';
    }
  }
  const key = previewKey ? previewKey.split('_')[1] ?? previewKey : undefined;
  const entitylink =
    abbreviation === 'tx'
      ? null
      : key
      ? createLink({ pageId: `${type}`, variables: { key: key } })
      : null;

  const getCurrentIndex = () => {
    return orderedList.findIndex((o) => o?.toString() === previewKey?.toString());
  };

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
      viewOnGbifHref={entitylink?.to}
      next={isFirst ? undefined : handleNext}
      previous={isLast ? undefined : handlePrevious}
      onCloseAutoFocus={(e) => handleCloseAutoFocus(e, prevPreviewKey)}
      screenReaderTitle={
        type === 'occurrenceKey' ? (
          <FormattedMessage
            id={'occurrenceDetails.screenReader.title'}
            defaultMessage="Occurrence details"
          />
        ) : undefined
      }
      screenReaderDescription={undefined}
    >
      {type === 'occurrenceKey' && <StandaloneOccurrenceKeyPage url={`/occurrence/${key}`} />}
      {type === 'datasetKey' && <StandaloneOccurrenceKeyPage url={`/dataset/${key}`} />}
      {type === 'publisherKey' && <StandaloneOccurrenceKeyPage url={`/publisher/${key}`} />}
      {type === 'collectionKey' && <StandaloneOccurrenceKeyPage url={`/collection/${key}`} />}
      {type === 'institutionKey' && <StandaloneOccurrenceKeyPage url={`/institution/${key}`} />}
      {type === 'networkKey' && <StandaloneOccurrenceKeyPage url={`/network/${key}`} />}
      {type === 'installationKey' && <StandaloneOccurrenceKeyPage url={`/installation/${key}`} />}
      {type === 'speciesKey' && <StandaloneOccurrenceKeyPage url={`/species/${key}`} />}
      {type === 'downloadKey' && (
        <StandaloneOccurrenceKeyPage url={`/occurrence/download/${key}`} />
      )}
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
