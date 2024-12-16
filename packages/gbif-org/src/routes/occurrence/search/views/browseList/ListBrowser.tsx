import { useOrderedList } from './useOrderedList';
import { Drawer } from '@/components/drawer/drawer';
import { useStringParam } from '@/hooks/useParam';
import { StandaloneOccurrenceKeyPage } from '@/routes/occurrence/key/standalone';
import { useEffect, useRef } from 'react';

const entityTypes = {
  o: 'occurrence',
  d: 'dataset',
  p: 'publisher',
  t: 'taxon',
  c: 'collection',
  i: 'institution',
  n: 'network',
  in: 'installation',
};
export default function EntityDrawer() {
  const { orderedList } = useOrderedList();
  const [previewKey, setPreviewKey] = useStringParam({ key: 'entity' });

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

  const key = previewKey ? (previewKey.split('_')[1] ?? previewKey) : undefined;

  const noList = !orderedList || orderedList.length < 2;
  const isFirst = noList || orderedList[0] === key;
  const isLast = noList || orderedList[orderedList.length - 1] === key;

  return (
    <Drawer
      isOpen={typeof key === 'string'}
      close={() => setPreviewKey()}
      viewOnGbifHref={`/${type === "taxon" ? "species": type}/${key}`}
      next={isFirst ? undefined : handleNext}
      previous={isLast ? undefined : handlePrevious}
    >
      {type === 'occurrence' && <StandaloneOccurrenceKeyPage occurrenceKey={key} />}
      {type === 'dataset' && <h1>Dataset {key}</h1>}
      {type === 'publisher' && <h1>Publisher {key}</h1>}
      {type === 'collection' && <h1>Collection {key}</h1>}
      {type === 'institution' && <h1>Institution {key}</h1>}
      {type === 'network' && <h1>Network {key}</h1>}
      {type === 'installation' && <h1>Installation {key}</h1>}
      {type === 'taxon' && <h1>Taxon {key}</h1>}
    </Drawer>
  );
}
