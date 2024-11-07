import { useOrderedList } from './useOrderedList';
import { Drawer } from '@/components/drawer/drawer';
import { useStringParam } from '@/hooks/useParam';
import { StandaloneOccurrenceKeyPage } from '@/routes/occurrence/key/standalone';

const entityTypes = {
  o: 'occurrence',
  d: 'dataset',
  p: 'publisher',
  c: 'collection',
  i: 'institution',
  n: 'network',
  in: 'installation',
};
export default function EntityDrawer() {
  const { orderedList } = useOrderedList();
  const [previewKey, setPreviewKey] = useStringParam({ key: 'entity' });

  const handleNext = () => {
    // Logic to go to the next item in `orderedList`
    const currentIndex = orderedList.findIndex((o) => o.toString() === previewKey?.toString());
    const nextIndex = currentIndex + 1;
    if (nextIndex < orderedList.length) {
      setPreviewKey(orderedList[nextIndex].toString());
    }
  };

  const handlePrevious = () => {
    // Logic to go to the previous item in `orderedList`
    const currentIndex = orderedList.findIndex((o) => o?.toString() === previewKey?.toString());
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

  const key = previewKey ? previewKey.split('_')[1] ?? previewKey : undefined;

  const noList = !orderedList || orderedList.length < 2;
  const isFirst = noList || orderedList[0] === key;
  const isLast = noList || orderedList[orderedList.length - 1] === key;

  return (
    <Drawer
      isOpen={typeof key === 'string'}
      close={() => setPreviewKey()}
      viewOnGbifHref={`/occurrence/${key}`}
      next={isFirst ? undefined :  handleNext}
      previous={isLast ? undefined : handlePrevious}
    >
      {type === 'occurrence' && <StandaloneOccurrenceKeyPage occurrenceKey={key} />}
      {type === 'dataset' && <h1>Dataset {key}</h1>}
      {type === 'publisher' && <h1>Publisher {key}</h1>}
      {type === 'collection' && <h1>Collection {key}</h1>}
      {type === 'institution' && <h1>Institution {key}</h1>}
      {type === 'network' && <h1>Network {key}</h1>}
      {type === 'installation' && <h1>Installation {key}</h1>}
    </Drawer>
  );
}
