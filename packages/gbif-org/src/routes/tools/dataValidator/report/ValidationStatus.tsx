import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { Spinner } from '@/components/ui/spinner';
import { DynamicLink } from '@/reactRouterPlugins';
import { ReactNode } from 'react';
import { FormattedMessage } from 'react-intl';
import { normalizeSteps } from '../data/normalizeReport';
import type { PollState } from '../data/pollingMachine';
import type { Validation } from '../data/types';
import { ValidatorErrorMessage } from '../validatorErrorMessage';
import { useLabels } from './useLabels';
import { RetentionNote, ValidationSteps } from './ValidationSteps';

function StatusCard({ children }: { children: ReactNode }) {
  return <Card className="g-bg-white g-p-6 g-mb-4">{children}</Card>;
}

export function NewValidationButton() {
  return (
    <Button asChild variant="outline" size="sm">
      <DynamicLink to="/tools/data-validator">
        <FormattedMessage
          id="tools.dataValidator.backToValidator"
          defaultMessage="Start a new validation"
        />
      </DynamicLink>
    </Button>
  );
}

export function ContactingServer() {
  return (
    <StatusCard>
      <div className="g-flex g-items-center g-gap-2 g-text-slate-600" aria-live="polite">
        <Spinner className="g-h-4 g-w-4" />
        <FormattedMessage
          id="tools.dataValidator.status.CONTACTING_SERVER"
          defaultMessage="Contacting server…"
        />
      </div>
    </StatusCard>
  );
}

export function GeneratingReport({
  validation,
  partial,
}: {
  validation: Validation;
  partial: boolean;
}) {
  const labels = useLabels();
  const lastStep = normalizeSteps(validation.metrics?.stepTypes, validation.status).at(-1);
  const step = lastStep && (
    <span className="g-font-medium g-text-slate-800">
      {labels.step(lastStep.stepType, 'PENDING')}
    </span>
  );

  return (
    <StatusCard>
      <div className="g-flex g-items-start g-gap-2" aria-live="polite">
        <div className="g-flex g-h-6 g-flex-none g-items-center" aria-hidden>
          <Spinner className="g-h-3.5 g-w-3.5" />
        </div>
        <div>
          <p className="g-font-medium">
            <FormattedMessage
              id="tools.dataValidator.generatingReport"
              defaultMessage="The report is being generated"
            />
          </p>
          <p className="g-text-sm g-text-slate-600 g-mt-1">
            {partial && step && (
              <FormattedMessage
                id="tools.dataValidator.generatingReportPartial"
                defaultMessage="The results below are incomplete until the step {step} has finished."
                values={{ step }}
              />
            )}
            {!partial && step && (
              <FormattedMessage
                id="tools.dataValidator.generatingReportEmpty"
                defaultMessage="The full report is shown when the step {step} has finished."
                values={{ step }}
              />
            )}{' '}
            <FormattedMessage
              id="tools.dataValidator.generatingReportRevisit"
              defaultMessage="You can leave this page and come back later at the same address."
            />
          </p>
        </div>
      </div>
    </StatusCard>
  );
}

export function ValidationFailure({ state }: { state: Extract<PollState, { phase: 'error' }> }) {
  return (
    <StatusCard>
      <p role="alert" className="g-text-red-700 g-font-medium g-mb-4">
        <ValidatorErrorMessage kind={state.kind} />
      </p>
      <NewValidationButton />
    </StatusCard>
  );
}

// The steps sit above the cards. hasSummary=true when the report summary shows the failure reason
// and the retention note.
export function ValidationStatus({
  validation,
  hasSummary,
}: {
  validation: Validation;
  hasSummary: boolean;
}) {
  const labels = useLabels();
  const status = validation.status ?? '';
  const failed = status === 'FAILED';

  return (
    <>
      <ValidationSteps
        steps={validation.metrics?.stepTypes}
        jobStatus={status}
        className="g-mb-6 g-mt-2"
      />
      {!hasSummary && (failed || status === 'FINISHED') && (
        <StatusCard>
          {failed && <p className="g-mb-3 g-font-medium g-text-red-700">{labels.status(status)}</p>}
          <RetentionNote />
        </StatusCard>
      )}
    </>
  );
}
