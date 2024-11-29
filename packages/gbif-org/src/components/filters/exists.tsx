import { cn } from '@/utils/shadcn';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { FormattedMessage } from 'react-intl';

export function Exists({
  isEmpty,
  onChange,
}: {
  isEmpty: boolean;
  onChange: (val: { isEmpty: boolean }) => void;
}) {
  return (
    <div>
      <RadioGroup
        onValueChange={(val) => {
          onChange({ isEmpty: val === 'EMPTY' });
        }}
        defaultValue={isEmpty ? 'EMPTY' : 'NOT_EMPTY'}
        className="g-gap-1"
      >
        <label className={cn('g-flex g-w-full')}>
          <RadioGroupItem value="NOT_EMPTY" className="g-flex-none g-me-2 g-mt-1" />
          <div className="g-flex-auto g-overflow-hidden">
            <FormattedMessage id={'filterSupport.nullOrNot.isNotNull'} />
          </div>
        </label>
        <label className={cn('g-flex g-w-full')}>
          <RadioGroupItem value="EMPTY" className="g-flex-none g-me-2 g-mt-1" />
          <div className="g-flex-auto g-overflow-hidden">
            <FormattedMessage id={'filterSupport.nullOrNot.isNull'} />
          </div>
        </label>
      </RadioGroup>
    </div>
  );
}
