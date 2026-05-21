import { ClientSideOnly } from '@/components/clientSideOnly';
import DashBoardLayout from '@/components/dashboard/DashboardLayout';
import {
  Continent,
  Country,
  DataQuality,
  EventDate,
  GadmGid,
  Iucn,
  IucnCounts,
  LiteratureCountriesOfCoverage,
  LiteratureCountriesOfResearcher,
  LiteratureCreatedAt,
  LiteratureRelevance,
  LiteratureTopics,
  LiteratureType,
  Months,
  OccurrenceIssue,
  OccurrenceSummary,
  OccurrenceTaxonomySunburst,
  Taxa,
} from '@/components/dashboard';
import { NoRecords } from '@/components/noDataMessages';
import { Skeleton } from '@/components/ui/skeleton';
import { Predicate } from '@/gql/graphql';
import { ChecklistMetrics } from './checklistMetrics';
import { Downloads } from './downloads';

export type DashboardGroup =
  | 'checklist'
  | 'taxonomic'
  | 'geographic'
  | 'temporal'
  | 'qualities'
  | 'citations'
  | 'downloads';

type Props = {
  group: DashboardGroup;
  datasetKey: string;
  scopedDatasetPredicate: Predicate;
  literatureScope: Predicate;
  hasLiterature: boolean;
  count?: number;
  loading?: boolean;
  error?: Error;
};

export default function DashboardSections({
  group,
  datasetKey,
  scopedDatasetPredicate,
  literatureScope,
  hasLiterature,
  count,
  loading,
  error,
}: Props) {
  if (group === 'checklist') {
    return (
      <ClientSideOnly>
        <ChecklistMetrics datasetKey={datasetKey} />
      </ClientSideOnly>
    );
  }
  if (group === 'downloads') return <Downloads />;
  if (group === 'citations') {
    return hasLiterature ? (
      <CitationMetrics predicate={literatureScope} />
    ) : (
      <div className="g-my-8 g-text-slate-500">
        <NoRecords messageId="dataset.noCitations" />
      </div>
    );
  }

  return (
    <HasDataMessage count={count} loading={loading} error={error}>
      {group === 'taxonomic' && <TaxonomicMetrics predicate={scopedDatasetPredicate} />}
      {group === 'geographic' && <GeographicMetrics predicate={scopedDatasetPredicate} />}
      {group === 'temporal' && <TemporalMetrics predicate={scopedDatasetPredicate} />}
      {group === 'qualities' && <IssuesMetrics predicate={scopedDatasetPredicate} />}
    </HasDataMessage>
  );
}

function HasDataMessage({
  children,
  count,
  loading,
  error,
}: {
  children: React.ReactNode;
  count?: number;
  loading?: boolean;
  error?: Error;
}) {
  if (loading) return <Skeleton className="g-h-96" />;
  if (count && count > 0) return <>{children}</>;
  return (
    <div className="g-my-8 g-text-slate-500">
      <NoRecords messageId="dataset.noOccurrences" />
    </div>
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
          defaultOption="TABLE"
        />
      </DashBoardLayout>
    </ClientSideOnly>
  );
}

function CitationMetrics({ predicate }: { predicate: Predicate }) {
  return (
    <ClientSideOnly>
      <DashBoardLayout>
        <LiteratureCreatedAt visibilityThreshold={0} predicate={predicate} />
        <LiteratureTopics visibilityThreshold={0} predicate={predicate} />
        <LiteratureRelevance visibilityThreshold={0} predicate={predicate} />
        <LiteratureType visibilityThreshold={0} predicate={predicate} />
        <LiteratureCountriesOfCoverage
          visibilityThreshold={0}
          predicate={predicate}
          options={['TABLE', 'PIE', 'COLUMN']}
        />
        <LiteratureCountriesOfResearcher
          visibilityThreshold={0}
          predicate={predicate}
          options={['TABLE', 'PIE', 'COLUMN']}
        />
      </DashBoardLayout>
    </ClientSideOnly>
  );
}
