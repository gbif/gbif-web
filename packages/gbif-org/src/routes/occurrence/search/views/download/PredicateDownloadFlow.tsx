import { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import FormatSelection from './components/FormatSelection';
import ConfigurationStep from './components/ConfigurationStep';
import TermsStep from './components/TermsStep';
import { OccurrenceDownloadRequestCreate } from '@/routes/occurrence/download/request/create';
import { usePredicateInformation } from './components/usePredicateInformation';
import { predicateDownloadSteps } from './components/stepOptions';

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
    predicate: currentStep !== 'PREDICATE' ? predicate : undefined,
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
            predicate={normalizedPredicate}
            onContinue={handleConfigurationComplete}
            initialConfig={configuration}
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
      </div>
    </div>
  );
}
