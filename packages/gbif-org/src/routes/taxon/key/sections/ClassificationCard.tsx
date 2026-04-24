import { ErrorBoundary } from '@/components/ErrorBoundary';
import { Suggest, SuggestFnProps } from '@/components/filters/suggest';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/largeCard';
import { CardDescription } from '@/components/ui/smallCard';
import { useLink } from '@/reactRouterPlugins/dynamicLink';
import { taxonKeyClbSuggest } from '@/utils/suggestEndpoints';
import { cn } from '@/utils/shadcn';
import { useCallback } from 'react';
import { FormattedMessage } from 'react-intl';
import { useNavigate } from 'react-router-dom';
import { TaxonTree } from '../../search/views/tree';
import { ColFeedback } from './ColFeedback';

type Props = {
  datasetKey: string;
  taxonKey: string;
  className?: string;
};

export default function ClassificationCard({ datasetKey, taxonKey, className }: Props) {
  const createLink = useLink();
  const navigate = useNavigate();

  const getSuggestions = useCallback(
    (args: SuggestFnProps) =>
      taxonKeyClbSuggest.getSuggestions({ ...args, checklistKey: datasetKey }),
    [datasetKey]
  );

  return (
    <ErrorBoundary
      type="BLOCK"
      errorMessage={<FormattedMessage id="taxon.errors.classification" />}
    >
      <Card className={cn('g-mb-4', className)} id="classification">
        <CardHeader>
          <CardTitle>
            <FormattedMessage id="taxon.classificationAndDescendants" />
          </CardTitle>
          <CardDescription>
            <ColFeedback taxonId={taxonKey} datasetKey={datasetKey} />
          </CardDescription>
        </CardHeader>
        <CardContent className="g-overflow-auto g-text-[15px]/4">
          <div className="g-mb-4">
            <Suggest
              className="g-border-slate-100 g-py-1 g-px-4 g-rounded g-bg-slate-50 g-border focus-within:g-ring-2 focus-within:g-ring-blue-400/70 focus-within:g-ring-offset-0 g-ring-inset"
              getSuggestions={getSuggestions}
              render={taxonKeyClbSuggest.render}
              onSelect={(item) => {
                let { to } = createLink({ pageId: 'taxonKey', variables: { key: item.key, datasetKey } });
                if (!to) to = `/taxon/${item.key}`;
                navigate(typeof to === 'string' ? to : '');
              }}
            />
          </div>
          <TaxonTree datasetKey={datasetKey} taxonKey={taxonKey} />
        </CardContent>
      </Card>
    </ErrorBoundary>
  );
}
