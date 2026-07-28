import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { FormattedMessage } from 'react-intl';

export function DataPackageExplore() {
  return (
    <Card className="g-mb-4">
      <CardHeader>
        <CardTitle>
          <FormattedMessage id="dataset.dataPackageTab.group.explore" defaultMessage="Explore" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="g-text-slate-600">
          Browsing of the Darwin Core Data Package content is not available yet.
        </p>
      </CardContent>
    </Card>
  );
}
