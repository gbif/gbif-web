import { cn } from '@/utils/shadcn';
import { MdErrorOutline } from 'react-icons/md';
import { FormattedMessage } from 'react-intl';

export function TileErrorOverlay({ visible }: { visible: boolean }) {
  if (!visible) return null;

  return (
    <div
      className={cn(
        'g-absolute g-inset-0 g-flex g-items-center g-justify-center g-pointer-events-none g-z-20'
      )}
    >
      <div className="g-bg-black/70 g-text-white g-rounded-full g-px-4 g-py-2 g-flex g-items-center g-gap-2 g-text-sm">
        <MdErrorOutline className="g-size-5 g-shrink-0" />
        <FormattedMessage id="map.tilesUnavailable" defaultMessage="Map tiles temporarily unavailable" />
      </div>
    </div>
  );
}
