import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/largeCard';
import { Spinner } from '@/components/ui/spinner';
import { DynamicLink } from '@/reactRouterPlugins';
import { ReactNode } from 'react';
import { FormattedDate, FormattedMessage, FormattedNumber } from 'react-intl';
import { fileSize, normalizeSteps } from '../data/normalizeReport';
import { isInProgress, PollState } from '../data/pollingMachine';
import type { Validation } from '../data/types';
import { ValidatorErrorMessage } from '../validatorErrorMessage';
import { useLabels } from './useLabels';
import { ValidationSteps } from './ValidationSteps';

const dateTimeFormat = {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
} as const;

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

export function ValidationStatus({ validation }: { validation: Validation }) {
  const labels = useLabels();
  const status = validation.status ?? '';
  const running = isInProgress(status);
  const size = fileSize(validation.fileSize);

  return (
    <StatusCard>
      <p className="g-text-sm g-text-slate-500">
        <FormattedMessage
          id="tools.dataValidator.reportProducedBy"
          defaultMessage="Report produced by the GBIF data validator"
        />
      </p>
      {validation.file && (
        <h2 className="g-text-xl g-font-semibold g-break-all g-mt-1" dir="auto">
          {validation.file}
        </h2>
      )}

      <dl className="g-grid g-grid-cols-[auto_1fr] g-gap-x-4 g-gap-y-1 g-text-sm g-mt-4">
        <dt className="g-text-slate-500">
          <FormattedMessage id="tools.dataValidator.status.title" defaultMessage="Status" />
        </dt>
        <dd className="g-flex g-items-center g-gap-2" aria-live="polite">
          {running && <Spinner className="g-h-3.5 g-w-3.5" />}
          <span className={status === 'FAILED' ? 'g-text-red-700' : undefined}>
            {labels.status(status || 'UNKNOWN')}
          </span>
        </dd>
        {validation.fileFormat && (
          <>
            <dt className="g-text-slate-500">
              <FormattedMessage
                id="tools.dataValidator.fileFormat.title"
                defaultMessage="File format"
              />
            </dt>
            <dd>{labels.fileFormat(validation.fileFormat)}</dd>
          </>
        )}
        {size && (
          <>
            <dt className="g-text-slate-500">
              <FormattedMessage id="tools.dataValidator.fileSize" defaultMessage="File size" />
            </dt>
            <dd>
              <FormattedNumber value={size.value} style="unit" unit={size.unit} />
            </dd>
          </>
        )}
        {validation.created && (
          <>
            <dt className="g-text-slate-500">
              <FormattedMessage id="tools.dataValidator.started" defaultMessage="Started" />
            </dt>
            <dd>
              <FormattedDate value={validation.created} {...dateTimeFormat} />
            </dd>
          </>
        )}
      </dl>

      <ValidationSteps
        steps={validation.metrics?.stepTypes}
        jobStatus={status}
        className="g-mt-5"
      />

      {status === 'FINISHED' && (
        <p className="g-text-xs g-text-slate-500 g-mt-5">
          <FormattedMessage
            id="tools.dataValidator.reportRetention"
            defaultMessage="The report will be deleted after one month. Until then you can revisit it at this address."
          />
        </p>
      )}
      {(status === 'FINISHED' || status === 'FAILED' || (!running && status)) && (
        <div className="g-mt-4">
          <NewValidationButton />
        </div>
      )}
    </StatusCard>
  );
}
