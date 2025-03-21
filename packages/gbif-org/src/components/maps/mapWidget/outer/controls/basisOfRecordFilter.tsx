import { Popover, PopoverContent } from '@/components/ui/popover';
import { Setter } from '@/types';
import { LuSettings2 } from 'react-icons/lu';
import { PopoverTitle } from './shared/popoverTitle';
import { FormattedMessage } from 'react-intl';
import { Checkbox } from '@/components/ui/checkbox';
import basisOfRecordOptions from '@/enums/basic/basisOfRecord.json';
import { Label } from '@/components/ui/label';
import { PopoverIconTrigger } from './shared/popoverIconTrigger';

type Props = {
  selected: string[];
  setSelected: Setter<string[]>;
  yearFilter?: React.ReactNode;
};

export function BasisOfRecordFilter({ selected, setSelected, yearFilter }: Props) {
  return (
    <Popover>
      <PopoverIconTrigger icon={LuSettings2} />
      <PopoverContent side="top" className="g-min-w-56 g-p-0">
        <PopoverTitle>
          <FormattedMessage id={yearFilter ? 'map.filters' : 'filters.basisOfRecord.name'} />
        </PopoverTitle>
        {yearFilter && <div className="g-p-4 g-pb-0">{yearFilter}</div>}
        <div className="g-space-y-3 g-p-4">
          {basisOfRecordOptions.map((basisOfRecord) => (
            <div className="g-flex g-items-center g-space-x-2" key={basisOfRecord}>
              <Checkbox
                key={basisOfRecord}
                checked={selected.includes(basisOfRecord)}
                id={basisOfRecord}
                onCheckedChange={(checked) => {
                  return checked
                    ? setSelected([...selected, basisOfRecord])
                    : setSelected(selected.filter((value) => value !== basisOfRecord));
                }}
              />
              <Label htmlFor={basisOfRecord} className="g-cursor-pointer">
                <FormattedMessage id={`enums.basisOfRecord.${basisOfRecord}`} />
              </Label>
            </div>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
}
