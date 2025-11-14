import { useState } from 'react';
import StepIndicator from './components/StepIndicator';
import TermsStep from './components/TermsStep';
import { sqlDownloadSteps } from './components/stepOptions';
import { StaticRenderSuspence } from '@/components/staticRenderSuspence';
import { Skeleton } from '@/components/ui/skeleton';
import SqlEditor from '@/routes/occurrence/download/editor/sqlEditor';

export function SqlDownloadFlow({
  defaultChecklist = import.meta.env.PUBLIC_DEFAULT_CHECKLIST_KEY,
}: {
  defaultChecklist?: string;
}) {
  const [currentStep, setCurrentStep] = useState<'SQL' | 'TERMS'>('SQL');
  const [selectedFormat] = useState({ id: 'SQL_TSV_ZIP' });
  const [configuration, setConfiguration] = useState(null);

  const handleSqlSelect = (sql: any) => {
    setCurrentStep('TERMS');
    setConfiguration({ sql, checklistKey: defaultChecklist });
  };

  return (
    <div className="g-min-h-screen g-py-8">
      <div className="g-max-w-4xl g-mx-auto">
        {/* Step Indicator */}
        <div className="g-max-w-md g-mx-auto">
          <StepIndicator currentStep={currentStep} steps={sqlDownloadSteps} />
        </div>

        {/* Step Content */}
        {currentStep === 'SQL' && (
          <StaticRenderSuspence fallback={<Skeleton className="g-h-96" />}>
            <SqlEditor onContinue={handleSqlSelect} />
          </StaticRenderSuspence>
        )}

        {currentStep === 'TERMS' && (
          <TermsStep
            selectedFormat={selectedFormat}
            configuration={configuration}
            onBack={() => setCurrentStep('SQL')}
          />
        )}
      </div>
    </div>
  );
}
