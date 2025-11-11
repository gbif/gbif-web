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
import { searchConfig } from '../../../searchConfig';
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

function App() {
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
      />
      <h1>predicate download</h1>
      <PredicateDownloadFlow defaultChecklist={selectedChecklist} />
      <h1>sql download</h1>
      <SqlDownloadFlow defaultChecklist={selectedChecklist} />
    </>
  );
}

function OccurrenceDownloadFlow({
  defaultChecklist = import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY,
  filter,
  predicate,
}: {
  defaultChecklist: string;
  filter: FilterType;
  predicate?: Predicate;
}) {
  const {
    total,
    loading,
    error,
    predicate: normalizedPredicate,
  } = usePredicateInformation({ predicate });

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

  return (
    <div className="g-min-h-screen g-py-8">
      <div className="g-max-w-6xl g-mx-auto">
        <ProtectedForm
          className=""
          title="Please sign in"
          message="A user account is required to download occurrence data."
        >
          {/* Step Indicator */}
          {/* <Card className="g-p-6 g-mb-8"> */}

          {/* </Card> */}
          <StepIndicator currentStep={currentStep} steps={occurrenceDownloadSteps} />

          {/* Step Content */}
          {currentStep === 'QUALITY' && <QualityFilters onContinue={handleFilterSelect} />}

          {currentStep === 'FORMAT' && (
            <FormatSelection
              onFormatSelect={handleFormatSelect}
              totalRecords={total}
              loadingCounts={loading}
              // onBack={() => setCurrentStep('QUALITY')}
            />
          )}

          {currentStep === 'CONFIGURE' && selectedFormat && (
            <ConfigurationStep
              defaultChecklist={defaultChecklist}
              selectedFormat={selectedFormat}
              onBack={() => setCurrentStep('FORMAT')}
              predicate={normalizedPredicate}
              onContinue={handleConfigurationComplete}
              filter={filter}
            />
          )}

          {currentStep === 'TERMS' && selectedFormat && configuration && (
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

export default App;
