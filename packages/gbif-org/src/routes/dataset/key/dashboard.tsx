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
import { DatasetQuery, Predicate, PredicateType } from '@/gql/graphql';
import { useEffect, useState } from 'react';
import { Downloads } from '@/routes/user/downloads/downloads';

const GROUPS = [
  'checklist',
  'taxonomic',
  'geographic',
  'temporal',
  'qualities',
  'citations',
  'downloads',
];

const GROUP_OPTIONS = GROUPS.map((group) => ({
  key: group,
  label: <FormattedMessage id={`dataset.metrics.group.${group}.title`} />,
}));

export function DatasetKeyDashboard({ defaultGroup = 'checklist' }: { defaultGroup?: string }) {
  const config = useConfig();
  const { data } = useDatasetKeyLoaderData() as { data: DatasetQuery };
  const dataset = data?.dataset;
  const [scopedDatasetPredicate, setScopedDatasetPredicate] = useState<Predicate>({
    type: PredicateType.Equals,
    key: 'datasetKey',
    value: dataset?.key,
  });

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

  return (
    <ArticleContainer className="g-bg-slate-100">
      <ArticleTextContainer className="g-max-w-screen-xl">
        {/* Mobile select dropdown */}
        <div className="g-mb-6 md:g-hidden">
          <label htmlFor="metric-group-select" className="g-sr-only">
            <FormattedMessage
              id="dataset.metrics.selectGroup"
              defaultMessage="Select metric group"
            />
          </label>
          <select
            id="metric-group-select"
            value={group}
            onChange={(e) => setGroup(e.target.value)}
            className="g-w-full g-px-4 g-py-2 g-border g-border-slate-300 g-rounded-md g-bg-white g-text-base focus:g-outline-none focus:g-ring-2 focus:g-ring-primary-500 focus:g-border-transparent"
          >
            {GROUP_OPTIONS.map((option) => (
              <option key={option.key} value={option.key}>
                {/* Extract text from FormattedMessage for select option */}
                {option.key.charAt(0).toUpperCase() + option.key.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Desktop button group */}
        <div className="g-hidden md:g-flex g-flex-wrap g-gap-2 g-mb-8">
          {GROUP_OPTIONS.map((option) => (
            <Button
              key={option.key}
              onClick={() => setGroup(option.key)}
              variant={group === option.key ? 'default' : 'plain'}
              className={cn({ 'g-bg-slate-200 g-border g-border-slate-300': group !== option.key })}
            >
              {option.label}
            </Button>
          ))}
        </div>
        {group === 'taxonomic' && <TaxonomicMetrics predicate={scopedDatasetPredicate} />}
        {group === 'geographic' && <GeographicMetrics predicate={scopedDatasetPredicate} />}
        {group === 'temporal' && <TemporalMetrics predicate={scopedDatasetPredicate} />}
        {group === 'qualities' && <IssuesMetrics predicate={scopedDatasetPredicate} />}
        {group === 'citations' && <CitationMetrics predicate={literaturePredicate} />}
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
        <Country predicate={predicate} visibilityThreshold={0} interactive={false} />
        <GadmGid
          predicate={predicate}
          visibilityThreshold={0}
          interactive={false}
          options={['TABLE']}
        />
        <Continent predicate={predicate} visibilityThreshold={0} interactive={false} />
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
        <DataQuality predicate={predicate} />
        <OccurrenceIssue predicate={predicate} visibilityThreshold={0} interactive={false} />
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
        <LiteratureCountriesOfCoverage
          visibilityThreshold={1}
          predicate={predicate}
          options={['PIE', 'TABLE', 'COLUMN']}
        />
        <LiteratureCountriesOfResearcher
          visibilityThreshold={1}
          predicate={predicate}
          options={['PIE', 'TABLE', 'COLUMN']}
        />
        <LiteratureType visibilityThreshold={1} predicate={predicate} />
      </DashBoardLayout>
    </ClientSideOnly>
  );
}
