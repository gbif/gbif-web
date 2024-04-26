import countries from '@/enums/basic/country.json';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { FormattedMessage } from 'react-intl';

type Props = {
  selected?: string;
  onChange(value: string): void;
};

export function CountryCodeSelect({ selected, onChange }: Props) {
  function handleSelect(id: string) {
    onChange(id);
  }

  return (
    <Select value={selected} onValueChange={handleSelect}>
      <SelectTrigger>
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((countryCode) => (
          <SelectItem key={countryCode} value={countryCode}>
            <FormattedMessage id={`country.${countryCode}`} />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
