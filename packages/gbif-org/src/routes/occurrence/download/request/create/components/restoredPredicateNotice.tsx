import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { FormattedMessage } from 'react-intl';

type Props = {
  show: boolean;
  discard(): void;
};

export function RestoredPredicateNotice({ show, discard }: Props) {
  const [isDismissed, setIsDismissed] = useState(false);
  const dismiss = () => setIsDismissed(true);

  if (!show) return null;
  if (isDismissed) return null;

  return (
    <div className="g-mb-4">
      <FormattedMessage
        id="download.request.weHaveRestoredYourPredicate"
        defaultMessage="We have restored the predicate your were working on last time you where here."
      />

      <Button
        variant="outline"
        className="g-ms-4"
        onClick={() => {
          discard();
          dismiss();
        }}
      >
        <FormattedMessage id="download.discard" defaultMessage="Discard" />
      </Button>
      <Button className="g-ms-4" onClick={dismiss}>
        <FormattedMessage id="download.keep" defaultMessage="Keep" />
      </Button>
    </div>
  );
}
