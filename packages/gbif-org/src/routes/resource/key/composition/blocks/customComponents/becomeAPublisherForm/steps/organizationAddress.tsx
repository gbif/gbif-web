import { CoordinatesPicker } from '@/components/maps/coordinatesPicker';
import { CountryCodeSelect } from '@/components/select/countryCodeSelect';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { memo } from 'react';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { Required } from '../../_shared';
import { Inputs, TextField } from '../becomeAPublisherForm';

const MemoCountryCodeSelect = memo(CountryCodeSelect);

export function OrganizationAddress() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <div className="g-flex g-flex-col g-gap-4">
      <TextField
        name="organizationAddress.address"
        label={<FormattedMessage id="eoi.address" defaultMessage="Address" />}
        required
      />

      <div className="g-flex g-gap-4">
        <FormField
          control={form.control}
          name="organizationAddress.country"
          render={({ field }) => (
            <FormItem className="g-flex-1">
              <FormLabel>
                <FormattedMessage id="eoi.country" defaultMessage="Country" />
                <Required />
              </FormLabel>
              <FormControl>
                <MemoCountryCodeSelect selected={field.value} onChange={field.onChange} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <TextField
          autoComplete="address-level2"
          name="organizationAddress.province"
          label={<FormattedMessage id="eoi.province" defaultMessage="Province" />}
        />
      </div>

      <div className="g-flex g-gap-4">
        <TextField
          autoComplete="address-line1"
          name="organizationAddress.city"
          label={<FormattedMessage id="eoi.city" defaultMessage="City" />}
          required
        />

        <TextField
          autoComplete="postal-code"
          name="organizationAddress.postalCode"
          label={<FormattedMessage id="eoi.postalCode" defaultMessage="Postal code" />}
        />
      </div>

      <FormField
        name="organizationAddress.coordinates"
        render={({ field }) => (
          <FormItem className="g-flex-1">
            <CoordinatesPicker
              coordinates={field.value}
              setCoordinates={field.onChange}
              instructions={
                <FormattedMessage
                  id="eoi.clickMapToAddOrg"
                  defaultMessage="Click on the map to add your organization"
                />
              }
            />
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
