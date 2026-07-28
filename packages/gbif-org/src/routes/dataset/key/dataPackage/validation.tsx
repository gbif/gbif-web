import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';

export function DataPackageValidation() {
  return (
    <Card className="g-mb-4">
      <CardHeader>
        <CardTitle>
          <FormattedMessage
            id="dataset.dataPackageTab.group.validation"
            defaultMessage="Validation"
          />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="g-text-slate-600">
          Validation results for the Darwin Core Data Package are not available yet.
        </p>
      </CardContent>
    </Card>
  );
}
