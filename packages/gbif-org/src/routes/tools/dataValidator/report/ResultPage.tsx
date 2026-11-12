import { ProtectedForm } from '@/components/protectedForm';
import { ArticleTextContainer } from '@/routes/resource/key/components/articleTextContainer';
import { PageContainer } from '@/routes/resource/key/components/pageContainer';
import { Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { ToolCardSkeleton } from '../../_shared/toolCardSkeleton';
import { isInProgress } from '../data/pollingMachine';
import { useValidation } from '../data/validationContext';
import { getReportRenderer } from './reportRenderers';
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
      <ReportContainer>
        <ValidationFailure state={state} />
      </ReportContainer>
    );
  }

  return (
    <ProtectedForm
      className="g-bg-white g-flex-1"
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
      <ReportContainer>
        <ReportBody />
      </ReportContainer>
    </ProtectedForm>
  );
}

function ReportContainer({ children }: { children: React.ReactNode }) {
  return (
    <PageContainer className="g-bg-slate-100 g-flex-1">
      <ArticleTextContainer className="g-max-w-screen-xl g-pt-6 g-pb-12">
        {children}
      </ArticleTextContainer>
    </PageContainer>
  );
}

function ReportBody() {
  const { state, validation } = useValidation();

  if (!validation) {
    if (state.phase === 'error') return <ValidationFailure state={state} />;
    return <ContactingServer />;
  }

  const Renderer = getReportRenderer(validation.fileFormat);
  const hasFiles = (validation.metrics?.files?.length ?? 0) > 0;
  const generating = state.phase !== 'error' && isInProgress(validation.status);

  return (
    <>
      {state.phase === 'error' && <ValidationFailure state={state} />}
      <ValidationStatus validation={validation} />
      {generating && <GeneratingReport validation={validation} partial={!!Renderer && hasFiles} />}
      {Renderer && (hasFiles || validation.status === 'FINISHED') && (
        <Suspense fallback={<ToolCardSkeleton />}>
          <Renderer validation={validation} />
        </Suspense>
      )}
    </>
  );
}
