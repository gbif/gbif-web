import { FormControl, FormField, FormItem, FormMessage } from '@/components/ui/form';
import { useFormContext } from 'react-hook-form';
import { FormattedMessage } from 'react-intl';
import { CheckboxField, Inputs } from '../mdtForm';
export function Terms() {
  const form = useFormContext<Partial<Inputs>>();

  return (
    <>
      <FormField
        control={form.control}
        name="have_read_the_service_agreement"
        render={({ field }) => (
          <FormItem className="g-pb-2 g-text-sm">
            <FormControl>
              <CheckboxField
                name="have_read_the_service_agreement"
                label={
                  <span>
                    I have read the{' '}
                    <a
                      className="g-text-blue-500"
                      href="https://www.gbif.org/terms/hosted-repository-service"
                      target="_blank"
                    >
                      service agreement
                    </a>{' '}
                    and I accept these terms and conditions for the hosted Metabarcoding Data
                    Toolkit I will use.
                  </span>
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="will_ensure_datasets_published_will_remain_online"
        render={({ field }) => (
          <FormItem className="g-pb-2 g-text-sm">
            <FormControl>
              <CheckboxField
                name="will_ensure_datasets_published_will_remain_online"
                label={
                  <span>
                    I commit to ensuring that data holders engaging in data publishing get the
                    appropriate help to be able to publish to GBIF.
                  </span>
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="will_participate_in_quarterly_webinars"
        render={({ field }) => (
          <FormItem className="g-pb-2 g-text-sm">
            <FormControl>
              <CheckboxField
                name="will_participate_in_quarterly_webinars"
                label={
                  <span>
                    I will participate in quarterly webinars and encourage users (data holders) to
                    join to provide feedback.
                  </span>
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="will_provide_feedback"
        render={({ field }) => (
          <FormItem className="g-pb-2 g-text-sm">
            <FormControl>
              <CheckboxField
                name="will_provide_feedback"
                label={
                  <span>
                    I agree to help ensure all datasets published to GBIF.org during the pilot will
                    remain online at the end of the pilot, should the installations be moved or the
                    programme terminated.
                  </span>
                }
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <p className="g-pb-2 g-text-sm">
        <FormattedMessage
          id="mdt.followingSubmission"
          defaultMessage="Following submission we will check the eligibility, configure the installation and contact you to arrange an introduction session.
"
        />
      </p>
    </>
  );
}
