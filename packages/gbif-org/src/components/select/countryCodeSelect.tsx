import { useIntl } from 'react-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { useSortedCountries } from '@/hooks/useSortedCountries';

type Props = {
  selected?: string;
  onChange(value: string): void;
};

export function CountryCodeSelect({ selected, onChange }: Props) {
  const { formatMessage } = useIntl();
  const sortedCountries = useSortedCountries();

  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue
          placeholder={formatMessage({
            id: 'eoi.pleaseSelectCountry',
            defaultMessage: 'Select a country',
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {sortedCountries.map((country) => (
          <SelectItem key={country.key} value={country.key}>
            {country.title}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
