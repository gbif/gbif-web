import countries from '@/enums/basic/country.json';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

type Props = {
  selected?: string;
  onChange(value: string): void;
};

export function CountryCodeSelect({ selected, onChange }: Props) {
  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue placeholder="Select a country" />
      </SelectTrigger>
      <SelectContent>
        {countries.map((countryCode) => (
          <SelectItem key={countryCode} value={countryCode}>
            {/* <FormattedMessage id={`country.${countryCode}`} />
             */}
            {countryCode}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
