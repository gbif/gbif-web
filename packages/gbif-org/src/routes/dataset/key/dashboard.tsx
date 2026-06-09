import { useOccurrenceCount } from '@/components/count';
import { Button } from '@/components/ui/button';
import { useConfig } from '@/config/config';
import { DatasetType, Predicate, PredicateType } from '@/gql/graphql';
import { useStringParam } from '@/hooks/useParam';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { cn } from '@/utils/shadcn';
import { useEffect, useMemo, useState } from 'react';
import { FormattedMessage } from 'react-intl';
import { useDatasetKeyLoaderData } from '.';
import DashboardSections, { DashboardGroup } from './dashboard/sections';

export function DatasetKeyDashboard() {
  const config = useConfig();
  const { dataset, literatureSearch } = useDatasetKeyLoaderData().data;

  const [scopedDatasetPredicate, setScopedDatasetPredicate] = useState<Predicate>({
    type: PredicateType.Equals,
    key: 'datasetKey',
    value: dataset.key,
  });
  const { count, error, loading } = useOccurrenceCount({ predicate: scopedDatasetPredicate });
  const hasOccurrences = !loading && !error && count > 0;

  const defaultGroup: DashboardGroup = 'citations';
  const [group = defaultGroup, setGroup] = useStringParam({
    key: 'group',
    defaultValue: defaultGroup,
    hideDefault: true,
  });

  const sitePredicate = config?.occurrenceSearch?.scope as Predicate;
  const siteLiteraturePredicate = config?.literatureSearch?.scope as Predicate;
  useEffect(() => {
    const datasetPredicate = {
      type: PredicateType.Equals,
      key: 'datasetKey',
      value: dataset.key,
    };
    const scope = (sitePredicate as Predicate)
      ? { type: PredicateType.And, predicates: [sitePredicate, datasetPredicate] }
      : datasetPredicate;
    setScopedDatasetPredicate(scope);
  }, [sitePredicate, dataset?.key]);

  const literaturePredicate = {
    type: PredicateType.Equals,
    key: 'gbifDatasetKey',
    value: dataset.key,
  };

  const literatureScope = siteLiteraturePredicate
    ? {
        type: PredicateType.And,
        predicates: [siteLiteraturePredicate, literaturePredicate],
      }
    : literaturePredicate;

  const enableListOfDownloads = config?.datasetKey?.enableListOfDownloads ?? false;
  // if it is a checklist dataaset type then add checklist option to tabs. If there are occurrences, then show ocurrence metrics. If there are citations then show citation metrics. always show download tab
  const tabOptions = useMemo(() => {
    const options: DashboardGroup[] = ['citations'];

    if (enableListOfDownloads) {
      options.push('downloads');
    }

    if (dataset.type === DatasetType.Checklist) {
      options.push('checklist');
    }
    if (
      hasOccurrences ||
      dataset.type === DatasetType.Occurrence ||
      dataset.type === DatasetType.SamplingEvent
    ) {
      options.push('taxonomic', 'geographic', 'temporal', 'qualities');
    }
    return options;
  }, [dataset.type, hasOccurrences, enableListOfDownloads]);

  return (
    <ArticleContainer className="g-bg-slate-100 g-min-h-[70vh]">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {/* Mobile select dropdown */}
        <div className="g-mb-6 md:g-hidden">
          <label htmlFor="metric-group-select" className="g-sr-only">
            <FormattedMessage
              id="dataset.metricsTab.selectGroup"
              defaultMessage="Select metric group"
            />
          </label>
          <select
            id="metric-group-select"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="g-w-full g-px-4 g-py-2 g-border g-border-slate-300 g-rounded-md g-bg-white g-text-base focus:g-outline-none focus:g-ring-2 focus:g-ring-primary-500 focus:g-border-transparent"
          >
            {tabOptions.map((option) => (
              <option key={option} value={option}>
                <FormattedMessage
                  id={`dataset.metricsTab.group.${option}`}
                  defaultMessage={option}
                />
              </option>
            ))}
          </select>
        </div>

        {/* Desktop button group */}
        <div className="g-hidden md:g-flex g-flex-wrap g-gap-2 g-mb-8">
          {tabOptions.map((option) => (
            <Button
              key={option}
              onClick={() => setGroup(option)}
              variant={group === option ? 'default' : 'plain'}
              className={cn({ 'g-bg-slate-200 g-border g-border-slate-300': group !== option })}
            >
              <FormattedMessage id={`dataset.metricsTab.group.${option}`} defaultMessage={option} />
            </Button>
          ))}
        </div>

        <DashboardSections
          group={group as DashboardGroup}
          datasetKey={dataset.key}
          checklistBankDatasetKey={dataset.checklistBankDataset?.key}
          scopedDatasetPredicate={scopedDatasetPredicate}
          literatureScope={literatureScope}
          hasLiterature={(literatureSearch?.documents.total ?? 0) > 0}
          count={count}
          loading={loading}
          error={error}
        />
      </ArticleTextContainer>
    </ArticleContainer>
  );
}
