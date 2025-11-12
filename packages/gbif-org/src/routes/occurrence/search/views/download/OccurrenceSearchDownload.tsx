import { useContext, useEffect, useState } from 'react';
import StepIndicator from './components/StepIndicator';
import FormatSelection from './components/FormatSelection';
import ConfigurationStep from './components/ConfigurationStep';
import TermsStep from './components/TermsStep';
import QualityFilters from './components/QualityFilters';
import { FilterContext, FilterType } from '@/contexts/filter';
import { useConfig } from '@/config/config';
import { OccurrenceDownloadRequestCreate } from '@/routes/occurrence/download/request/create';
import { OccurrenceDownloadSqlCreate } from '@/routes/occurrence/download/sql/create';
import { searchConfig } from '../../searchConfig';
import { useSearchContext } from '@/contexts/search';
import { getAsQuery } from '@/components/filters/filterTools';
import { Predicate } from '@/gql/graphql';
import { usePredicateInformation } from './components/usePredicateInformation';
import {
  occurrenceDownloadSteps,
  predicateDownloadSteps,
  sqlDownloadSteps,
} from './components/stepOptions';
import { ProtectedForm } from '@/components/protectedForm';
import { NoRecords } from '@/components/noDataMessages';
import { Card } from '@/components/ui/largeCard';
import { MdFileDownload } from 'react-icons/md';
import { Skeleton } from '@/components/ui/skeleton';
import { FreeTextWarning } from './shared';

export default function OccurrenceSearchDownload() {
  const currentFilterContext = useContext(FilterContext);
  const siteConfig = useConfig();
  const searchContext = useSearchContext();
  const selectedChecklist =
    currentFilterContext.filter.checklistKey ??
    siteConfig.defaultChecklistKey ??
    import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY;
  const [predicate, setPredicate] = useState<Predicate | undefined>(undefined);

  useEffect(() => {
    const query = getAsQuery({ filter: currentFilterContext.filter, searchContext, searchConfig });
    const predicate = query.predicate as Predicate;
    setPredicate(predicate);
    // We are tracking filter changes via a hash that is updated whenever the filter changes. This is so we do not have to deep compare the object everywhere
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentFilterContext.filterHash, searchContext]);

  return (
    <>
      <OccurrenceDownloadFlow
        defaultChecklist={selectedChecklist}
        filter={currentFilterContext.filter}
        predicate={predicate}
        q={currentFilterContext.filter?.must?.q?.[0]}
      />
      {/* <h1>predicate download</h1>
      <PredicateDownloadFlow defaultChecklist={selectedChecklist} />
      <h1>sql download</h1>
      <SqlDownloadFlow defaultChecklist={selectedChecklist} /> */}
    </>
  );
}

function OccurrenceDownloadFlow({
  defaultChecklist = import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY,
  filter,
  predicate,
  q,
}: {
  defaultChecklist: string;
  filter: FilterType;
  predicate?: Predicate;
  q?: string;
}) {
  const {
    total,
    loading,
    error,
    predicate: normalizedPredicate,
  } = usePredicateInformation({ predicate });

  if (error) {
    throw error;
  }

  const [currentStep, setCurrentStep] = useState<'QUALITY' | 'FORMAT' | 'CONFIGURE' | 'TERMS'>(
    'FORMAT'
  );
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [configuration, setConfiguration] = useState(null);

  const handleFilterSelect = () => {
    setCurrentStep('FORMAT');
  };

  const handleFormatSelect = (format: any) => {
    setSelectedFormat({ ...format });
    setCurrentStep('CONFIGURE');
  };

  const handleConfigurationComplete = (config: any) => {
    setConfiguration(config);
    setCurrentStep('TERMS');
  };

  if (total === 0 && !loading) {
    return <NoRecords />;
  }

  if (q) {
    // no support for queries containing free text search since small and large downloads differ in how they interpret fuzzy matching and it is dependent on ES version i suppose.
    return (
      <Card className="g-p-8 g-mt-2 g-text-center g-w-96 g-max-w-full g-mx-auto">
        <div className="g-w-16 g-h-16 g-mx-auto g-mb-4 g-text-slate-300 g-border-slate-300 g-text-4xl g-rounded-full g-border-2 g-flex g-items-center g-justify-center">
          <MdFileDownload />
        </div>
        <FreeTextWarning />
      </Card>
    );
  }

  return (
    <div className="g-min-h-screen g-py-8">
      <div className="g-max-w-4xl g-mx-auto">
        <ProtectedForm
          className=""
          title="Please sign in"
          message="A user account is required to download occurrence data."
        >
          {/* </Card> */}
          <StepIndicator currentStep={currentStep} steps={occurrenceDownloadSteps} />

          {loading && <LoadingSkeleton />}

          {/* Step Content */}
          {currentStep === 'QUALITY' && !loading && (
            <QualityFilters onContinue={handleFilterSelect} />
          )}

          {currentStep === 'FORMAT' && !loading && (
            <FormatSelection
              onFormatSelect={handleFormatSelect}
              totalRecords={total}
              loadingCounts={loading}
              // onBack={() => setCurrentStep('QUALITY')}
            />
          )}

          {currentStep === 'CONFIGURE' && selectedFormat && !loading && (
            <ConfigurationStep
              defaultChecklist={defaultChecklist}
              selectedFormat={selectedFormat}
              onBack={() => setCurrentStep('FORMAT')}
              predicate={normalizedPredicate}
              onContinue={handleConfigurationComplete}
              filter={filter}
              initialConfig={configuration}
            />
          )}

          {currentStep === 'TERMS' && selectedFormat && configuration && !loading && (
            <TermsStep
              selectedFormat={selectedFormat}
              configuration={configuration}
              predicate={normalizedPredicate}
              totalRecords={total}
              onBack={() => setCurrentStep('CONFIGURE')}
            />
          )}
        </ProtectedForm>
      </div>
    </div>
  );
}

export function PredicateDownloadFlow({
  defaultChecklist = import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY,
}: {
  defaultChecklist?: string;
}) {
  const [currentStep, setCurrentStep] = useState<'PREDICATE' | 'FORMAT' | 'CONFIGURE' | 'TERMS'>(
    'PREDICATE'
  );
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [configuration, setConfiguration] = useState(null);
  const [predicate, setPredicate] = useState<string | undefined>(undefined);
  const {
    total,
    loading,
    error,
    predicate: normalizedPredicate,
  } = usePredicateInformation({
    predicate: currentStep === 'FORMAT' ? predicate : undefined,
  });

  const handleFilterSelect = (predicate: string) => {
    setPredicate(predicate);
    setCurrentStep('FORMAT');
  };

  const handleFormatSelect = (format: any) => {
    setSelectedFormat(format);
    setCurrentStep('CONFIGURE');
  };

  const handleConfigurationComplete = (config: any) => {
    setConfiguration(config);
    setCurrentStep('TERMS');
  };

  return (
    <div className="g-min-h-screen g-py-8">
      <div className="g-max-w-4xl g-mx-auto">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={predicateDownloadSteps} />

        {/* Step Content */}
        {currentStep === 'PREDICATE' && (
          <OccurrenceDownloadRequestCreate onContinue={handleFilterSelect} />
          // <OccurrenceDownloadRequestCreate onContinue={handleFilterSelect} content={predicate} />
        )}

        {currentStep === 'FORMAT' && (
          <FormatSelection
            onFormatSelect={handleFormatSelect}
            totalRecords={total}
            loadingCounts={loading}
            onBack={() => setCurrentStep('PREDICATE')}
          />
        )}

        {currentStep === 'CONFIGURE' && selectedFormat && (
          <ConfigurationStep
            defaultChecklist={defaultChecklist}
            initialConfig={configuration}
            selectedFormat={selectedFormat}
            onBack={() => setCurrentStep('FORMAT')}
            onContinue={handleConfigurationComplete}
          />
        )}

        {currentStep === 'TERMS' && selectedFormat && configuration && (
          <TermsStep
            selectedFormat={selectedFormat}
            configuration={configuration}
            onBack={() => setCurrentStep('CONFIGURE')}
            predicate={normalizedPredicate}
          />
        )}
      </div>
    </div>
  );
}

export function SqlDownloadFlow({
  defaultChecklist = import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY,
}: {
  defaultChecklist?: string;
}) {
  const [currentStep, setCurrentStep] = useState<'SQL' | 'TERMS'>('SQL');
  const [selectedFormat, setSelectedFormat] = useState(null);
  const [configuration, setConfiguration] = useState(null);

  const handleSqlSelect = (sql: any) => {
    setCurrentStep('TERMS');
  };

  return (
    <div className="g-min-h-screen g-py-8">
      <div className="g-max-w-6xl g-mx-auto">
        {/* Step Indicator */}
        <StepIndicator currentStep={currentStep} steps={sqlDownloadSteps} />

        {/* Step Content */}
        {currentStep === 'SQL' && <OccurrenceDownloadSqlCreate onContinue={handleSqlSelect} />}

        {currentStep === 'TERMS' && selectedFormat && configuration && (
          <TermsStep
            selectedFormat={selectedFormat}
            configuration={configuration}
            onBack={() => setCurrentStep('CONFIGURE')}
          />
        )}
      </div>
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="g-min-h-screen g-py-8">
      <div className="g-max-w-4xl g-mx-auto">
        <div className="g-grid lg:g-grid-cols-3 g-gap-8">
          <div className="lg:g-col-span-2 g-space-y-4">
            <Skeleton className="g-h-36" />
            <Skeleton className="g-h-36" />
            <Skeleton className="g-h-36" />
          </div>
          <div className="lg:g-col-span-1">
            <Skeleton className="g-h-96" />
          </div>
        </div>
      </div>
    </div>
  );
}
