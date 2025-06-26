import countries from '@/enums/basic/country.json';
import { FormattedMessage, useIntl } from 'react-intl';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
type Props = {
  selected?: string;
  onChange(value: string): void;
};

export function CountryCodeSelect({ selected, onChange }: Props) {
  const intl = useIntl();

  return (
    <Select value={selected} onValueChange={onChange}>
      <SelectTrigger>
        <SelectValue
          placeholder={intl.formatMessage({
            id: 'eoi.pleaseSelectCountry',
            defaultMessage: 'Select a country',
          })}
        />
      </SelectTrigger>
      <SelectContent>
        {countries.map((countryCode) => (
          <SelectItem key={countryCode} value={countryCode}>
            <FormattedMessage
              id={`enums.countryCode.${countryCode}`}
              defaultMessage={countryCode}
            />
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
