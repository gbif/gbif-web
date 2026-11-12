import { ProtectedForm } from '@/components/protectedForm';
import { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { isInProgress } from '../data/pollingMachine';
import { useValidation } from '../data/validationContext';
import { ValidatorTabContainer } from '../tabLayout';
import { getReportRenderer } from './reportRenderers';
import { ReportPageSkeleton, ReportSkeleton } from './ReportSkeleton';
import {
  ContactingServer,
  GeneratingReport,
  ValidationFailure,
  ValidationStatus,
} from './ValidationStatus';

export default function ResultPage() {
  const { state, validation } = useValidation();

  // an invalid key is not found whether or not the user is logged in
  if (state.phase === 'error' && !validation) {
    return (
      <ValidatorTabContainer>
        <ValidationFailure state={state} />
      </ValidatorTabContainer>
    );
  }

  return (
    <ProtectedForm
      className="g-bg-white g-flex-1"
      loading={<ReportPageSkeleton />}
      title={
        <FormattedMessage
          id="tools.dataValidator.loginToSeeReport"
          defaultMessage="Sign in to see this validation report"
        />
      }
      message={
        <FormattedMessage
          id="tools.dataValidator.loginToSeeReportMessage"
          defaultMessage="You need a GBIF account to see validation reports."
        />
      }
    >
      <ValidatorTabContainer>
        <ReportBody />
      </ValidatorTabContainer>
    </ProtectedForm>
  );
}

function ReportBody() {
  const { state, validation } = useValidation();

  if (!validation) {
    if (state.phase === 'error') return <ValidationFailure state={state} />;
    return state.phase === 'contacting' ? <ContactingServer /> : <ReportSkeleton />;
  }

  const Renderer = getReportRenderer(validation.fileFormat);
  const hasFiles = (validation.metrics?.files?.length ?? 0) > 0;
  const generating = state.phase !== 'error' && isInProgress(validation.status);
  const hasSummary = !!Renderer && hasFiles;

  return (
    <>
      {state.phase === 'error' && <ValidationFailure state={state} />}
      <ValidationStatus validation={validation} hasSummary={hasSummary} />
      {generating && <GeneratingReport validation={validation} partial={!!Renderer && hasFiles} />}
      {Renderer && (hasFiles || validation.status === 'FINISHED') && (
        <Suspense fallback={<ReportSkeleton withSteps={false} />}>
          <Renderer validation={validation} />
        </Suspense>
      )}
    </>
  );
}
