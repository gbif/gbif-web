import { FormattedMessage } from 'react-intl';
import { ToggleGroup, ToggleGroupItem } from '../../ui/toggle-group';

export function Tertiary({
  value,
  setValue,
}: {
  value?: boolean | string;
  setValue: (val?: boolean) => void;
}) {
  return (
    <ToggleGroup
      type="single"
      size="sm"
      value={typeof value === 'undefined' ? 'either' : value.toString()}
      variant="primary"
      onValueChange={(val) => {
        if (val === 'either' || val === undefined || val === '') {
          setValue(undefined);
        } else {
          setValue(val.toString() === 'true');
        }
      }}
    >
      <ToggleGroupItem value="true" variant="primary">
        <FormattedMessage id="search.ternary.yes" />
      </ToggleGroupItem>
      <ToggleGroupItem value="false" variant="primary">
        <FormattedMessage id="search.ternary.no" />
      </ToggleGroupItem>
      <ToggleGroupItem value="either" variant="primary">
        <FormattedMessage id="search.ternary.either" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
