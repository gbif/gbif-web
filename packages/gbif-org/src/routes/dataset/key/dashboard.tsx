import { ClientSideOnly } from '@/components/clientSideOnly';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import { Button } from '@/components/ui/button';
import { useStringParam } from '@/hooks/useParam';
import { ArticleContainer } from '@/routes/resource/key/components/articleContainer';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { cn } from '@/utils/shadcn';
import { FormattedMessage } from 'react-intl';
import {
  OccurrenceSummary,
  Country,
  GadmGid,
  EventDate,
  Months,
  Taxa,
  Iucn,
  IucnCounts,
  DataQuality,
  OccurrenceIssue,
  Continent,
  LiteratureCreatedAt,
  LiteratureTopics,
  LiteratureRelevance,
  LiteratureCountriesOfCoverage,
  LiteratureCountriesOfResearcher,
  LiteratureType,
  OccurrenceTaxonomySunburst,
} from '@/components/dashboard';
import { useConfig } from '@/config/config';
import { useDatasetKeyLoaderData } from '.';
import { DatasetQuery, DatasetType, Predicate, PredicateType } from '@/gql/graphql';
import { useEffect, useMemo, useState } from 'react';
import { CardListSkeleton } from '@/components/skeletonLoaders';
import { Downloads } from './dashboard/downloads';
import { ChecklistMetrics } from './dashboard/checklistMetrics';
import { NoRecords } from '@/components/noDataMessages';

type DatasetMetricType =
  | 'checklist'
  | 'taxonomic'
  | 'geographic'
  | 'temporal'
  | 'qualities'
  | 'citations'
  | 'downloads';

export function DatasetKeyDashboard() {
  const config = useConfig();
  const { data } = useDatasetKeyLoaderData() as { data: DatasetQuery };
  const dataset = data?.dataset;
  const [scopedDatasetPredicate, setScopedDatasetPredicate] = useState<Predicate>({
    type: PredicateType.Equals,
    key: 'datasetKey',
    value: dataset?.key,
  });

  const defaultGroup = 'citations';
  const [group = defaultGroup, setGroup] = useStringParam({
    key: 'group',
    defaultValue: defaultGroup,
    hideDefault: true,
  });

  const sitePredicate = config?.occurrenceSearch?.scope as Predicate;
  useEffect(() => {
    if (!dataset?.key) return;
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
    value: dataset?.key,
  };

  // if it is a checklist dataaset type then add checklist option to tabs. If there are occurrences, then show ocurrence metrics. If there are citations then show citation metrics. always show download tab
  const tabOptions = useMemo(() => {
    const options: DatasetMetricType[] = ['citations', 'downloads'];

    if (dataset?.type === DatasetType.Checklist) {
      options.push('checklist');
    }
    if (dataset?.type === DatasetType.Occurrence || dataset?.type === DatasetType.SamplingEvent) {
      options.push('taxonomic', 'geographic', 'temporal', 'qualities');
    }
    return options;
  }, [dataset?.type]);

  if (!dataset) return <CardListSkeleton />;

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
        {group === 'checklist' && dataset?.key && (
          <ClientSideOnly>
            <ChecklistMetrics datasetKey={dataset.key} />
          </ClientSideOnly>
        )}
        {group === 'taxonomic' && <TaxonomicMetrics predicate={scopedDatasetPredicate} />}
        {group === 'geographic' && <GeographicMetrics predicate={scopedDatasetPredicate} />}
        {group === 'temporal' && <TemporalMetrics predicate={scopedDatasetPredicate} />}
        {group === 'qualities' && <IssuesMetrics predicate={scopedDatasetPredicate} />}
        {group === 'citations' && (
          <>
            {data.literatureSearch?.documents.total > 0 && (
              <CitationMetrics predicate={literaturePredicate} />
            )}
            {data.literatureSearch?.documents.total === 0 && (
              <div className="g-my-8 g-text-slate-500">
                <NoRecords messageId="dataset.noCitations" />
              </div>
            )}
          </>
        )}
        {group === 'downloads' && <Downloads />}
      </ArticleTextContainer>
    </ArticleContainer>
  );
}

function TaxonomicMetrics({ predicate }: { predicate: Predicate }) {
  return (
    <ClientSideOnly>
      <DashBoardLayout>
        <Taxa predicate={predicate} visibilityThreshold={0} interactive={false} />
        <Iucn predicate={predicate} visibilityThreshold={0} interactive={false} />
        <IucnCounts predicate={predicate} visibilityThreshold={1} interactive={false} />
        <OccurrenceTaxonomySunburst
          predicate={predicate}
          visibilityThreshold={0}
          interactive={false}
        />
      </DashBoardLayout>
    </ClientSideOnly>
  );
}

function GeographicMetrics({ predicate }: { predicate: Predicate }) {
  return (
    <ClientSideOnly>
      <DashBoardLayout>
        <Country
          predicate={predicate}
          visibilityThreshold={0}
          interactive={false}
          options={['TABLE', 'COLUMN', 'PIE']}
        />
        <GadmGid
          predicate={predicate}
          visibilityThreshold={0}
          interactive={false}
          options={['TABLE']}
        />
        <Continent
          predicate={predicate}
          visibilityThreshold={0}
          interactive={false}
          options={['TABLE', 'COLUMN', 'PIE']}
        />
      </DashBoardLayout>
    </ClientSideOnly>
  );
}

function TemporalMetrics({ predicate }: { predicate: Predicate }) {
  return (
    <ClientSideOnly>
      <DashBoardLayout>
        <EventDate
          predicate={predicate}
          visibilityThreshold={1}
          options={['TIME']}
          interactive={false}
        />
        <Months
          predicate={predicate}
          defaultOption="COLUMN"
          visibilityThreshold={0}
          interactive={false}
        />
      </DashBoardLayout>
    </ClientSideOnly>
  );
}

function IssuesMetrics({ predicate }: { predicate: Predicate }) {
  return (
    <ClientSideOnly>
      <DashBoardLayout>
        <OccurrenceSummary predicate={predicate} />
        <DataQuality predicate={predicate} optional={['hasSequence', 'hasCollector', 'hasMedia']} />
        <OccurrenceIssue
          predicate={predicate}
          visibilityThreshold={0}
          interactive={false}
          options={['TABLE', 'COLUMN', 'PIE']}
        />
      </DashBoardLayout>
    </ClientSideOnly>
  );
}

function CitationMetrics({ predicate }: { predicate: Predicate }) {
  return (
    <ClientSideOnly>
      <DashBoardLayout>
        <LiteratureCreatedAt visibilityThreshold={1} predicate={predicate} />
        <LiteratureTopics visibilityThreshold={1} predicate={predicate} />
        <LiteratureRelevance visibilityThreshold={1} predicate={predicate} />
        <LiteratureType visibilityThreshold={1} predicate={predicate} />
        <LiteratureCountriesOfCoverage
          visibilityThreshold={1}
          predicate={predicate}
          options={['TABLE', 'PIE', 'COLUMN']}
        />
        <LiteratureCountriesOfResearcher
          visibilityThreshold={1}
          predicate={predicate}
          options={['TABLE', 'PIE', 'COLUMN']}
        />
      </DashBoardLayout>
    </ClientSideOnly>
  );
}
