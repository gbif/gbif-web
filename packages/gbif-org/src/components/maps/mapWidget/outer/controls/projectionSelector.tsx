import { Label } from '@/components/ui/label';
import { Popover, PopoverContent } from '@/components/ui/popover';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Projection } from '@/config/config';
import { Setter } from '@/types';
import { MdLanguage } from 'react-icons/md';
import { mapWidgetOptions } from '../../options';
import { FormattedMessage } from 'react-intl';
import { PopoverTitle } from './shared/popoverTitle';
import { PopoverIconTrigger } from './shared/popoverIconTrigger';

type Props = {
  selectedProjection: Projection;
  setSelectedProjection: Setter<Projection>;
};

export function ProjectionSelector({ selectedProjection, setSelectedProjection }: Props) {
  return (
    <Popover>
      <PopoverIconTrigger icon={MdLanguage} />
      <PopoverContent side="top" className="g-min-w-56 g-p-0">
        <PopoverTitle>
          <FormattedMessage id="map.projection" />
        </PopoverTitle>
        <RadioGroup
          value={selectedProjection}
          onValueChange={(v) => setSelectedProjection(v as Projection)}
          className="g-p-4"
        >
          {mapWidgetOptions.projections.map(({ i18nKey, value }) => (
            <div className="g-flex g-items-center g-space-x-2" key={value}>
              <RadioGroupItem value={value} id={value} />
              <Label htmlFor={value} className="g-cursor-pointer">
                <FormattedMessage id={i18nKey} />
              </Label>
            </div>
          ))}
        </RadioGroup>
      </PopoverContent>
    </Popover>
  );
}
