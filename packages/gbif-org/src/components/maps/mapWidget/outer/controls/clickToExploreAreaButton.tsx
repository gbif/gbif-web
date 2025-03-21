import { SimpleTooltip } from '@/components/simpleTooltip';
import { Button } from '@/components/ui/button';
import { Setter } from '@/types';
import { cn } from '@/utils/shadcn';
import { MdAdsClick } from 'react-icons/md';

type Props = {
  clickToSearchAreaEnabled: boolean;
  setClickToSearchAreaEnabled: Setter<boolean>;
};

export function ClickToExploreAreaButton({
  clickToSearchAreaEnabled,
  setClickToSearchAreaEnabled,
}: Props) {
  return (
    <SimpleTooltip
      asChild
      open={clickToSearchAreaEnabled}
      side="top"
      i18nKey="map.clickToSearchArea"
    >
      <Button
        size="icon"
        variant="outline"
        className={cn(
          'g-h-8 g-w-8 ',
          {
            'g-border-gray-200 g-text-gray-500 hover:g-text-gray-600 hover:g-border-gray-300':
              !clickToSearchAreaEnabled,
          },
          {
            'g-border-primary-200 g-text-primary-500 hover:g-text-primary-600 hover:g-border-primary-300':
              clickToSearchAreaEnabled,
          }
        )}
        onClick={() => setClickToSearchAreaEnabled((prev) => !prev)}
      >
        <MdAdsClick size={18} />
      </Button>
    </SimpleTooltip>
  );
}
