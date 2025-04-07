import { CoordinatesPicker } from '@/components/maps/coordinatesPicker';
import { CountryCodeSelect } from '@/components/select/countryCodeSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { Required } from '../../_shared';
import { Inputs, TextField } from '../becomeAPublisherForm';

type Props = {
  updateSuggestedNodeCountry(countryCode: string): void;
};

export function OrganizationAddress({ updateSuggestedNodeCountry }: Props) {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <div className="g-flex g-flex-col g-gap-4">
      <TextField name="organizationAddress.address" label="Address" required />

      <div className="g-flex g-gap-4">
        <FormField
          control={form.control}
          name="organizationAddress.country"
          render={({ field }) => (
            <FormItem className="g-flex-1">
              <FormLabel>
                Country
                <Required />
              </FormLabel>
              <FormControl>
                <CountryCodeSelect
                  selected={field.value}
                  onChange={(countryCode) => {
                    field.onChange(countryCode);
                    updateSuggestedNodeCountry(countryCode);
                  }}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TextField
          autoComplete="address-level2"
          name="organizationAddress.province"
          label="Province"
        />
      </div>

      <div className="g-flex g-gap-4">
        <TextField
          autoComplete="address-line1"
          name="organizationAddress.city"
          label="City"
          required
        />

        <TextField
          autoComplete="postal-code"
          name="organizationAddress.postalCode"
          label="Postal code"
        />
      </div>

      <FormField
        name="organizationAddress.coordinates"
        render={({ field }) => (
          <FormItem className="g-flex-1">
            <CoordinatesPicker
              coordinates={field.value}
              setCoordinates={field.onChange}
              instructions="Click on the map to add your organization"
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
