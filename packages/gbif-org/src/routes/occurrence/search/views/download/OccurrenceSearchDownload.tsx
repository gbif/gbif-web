import { useContext, useEffect, useState } from 'react';
import StepIndicator from './components/StepIndicator';
import FormatSelection from './components/FormatSelection';
import ConfigurationStep from './components/ConfigurationStep';
import TermsStep from './components/TermsStep';
import QualityFilters from './components/QualityFilters';
import { FilterContext, FilterType } from '@/contexts/filter';
import { useConfig } from '@/config/config';
import { searchConfig } from '../../searchConfig';
import { useSearchContext } from '@/contexts/search';
import { getAsQuery } from '@/components/filters/filterTools';
import { Predicate } from '@/gql/graphql';
import { usePredicateInformation } from './components/usePredicateInformation';
import { occurrenceDownloadSteps } from './components/stepOptions';
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

  const hasCubeSupport = defaultChecklist === import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY;
  const enabledFormats = hasCubeSupport
    ? ['SIMPLE_CSV', 'DWCA', 'SPECIES_LIST', 'SQL_CUBE']
    : ['SIMPLE_CSV', 'DWCA', 'SPECIES_LIST'];

  return (
    <div className="g-min-h-screen g-py-8">
      <div className="g-max-w-4xl g-mx-auto">
        <ProtectedForm
          className=""
          title="Please sign in"
          message="A user account is required to download occurrence data."
        >
          {/* </Card> */}
          <div className="g-max-w-lg g-mx-auto">
            <StepIndicator currentStep={currentStep} steps={occurrenceDownloadSteps} />
          </div>

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
              enabledFormats={enabledFormats}
              // onBack={() => setCurrentStep('QUALITY')}
            />
          )}

          {currentStep === 'CONFIGURE' && selectedFormat && !loading && (
            <ConfigurationStep
              defaultChecklist={defaultChecklist}
              selectedFormat={selectedFormat}
              onBack={() => {
                setCurrentStep('FORMAT');
                setConfiguration(null);
              }}
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
