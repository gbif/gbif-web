import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/shadcn';
import { MdBlock, MdCheck, MdClose, MdOutlineSchedule } from 'react-icons/md';
import { FormattedMessage, useIntl } from 'react-intl';
import { normalizeSteps, NOT_RUN } from '../data/normalizeReport';
import type { ValidationStep } from '../data/types';
import { useLabels } from './useLabels';

const WAITING = new Set(['PENDING', 'QUEUED', 'WAITING_FOR_CHECKLISTBANK']);

export function ValidationSteps({
  steps,
  jobStatus,
  className,
}: {
  steps?: ValidationStep[] | null;
  jobStatus?: string;
  className?: string;
}) {
  const labels = useLabels();
  const { formatMessage } = useIntl();
  const displaySteps = normalizeSteps(steps, jobStatus);
  if (displaySteps.length === 0) return null;

  const notRun = formatMessage({
    id: 'tools.dataValidator.steps.notRun',
    defaultMessage: 'Not run',
  });

  return (
    <ol className={cn('g-flex g-flex-col g-list-none g-p-0 g-m-0 md:g-flex-row', className)}>
      {displaySteps.map((step, index) => {
        const isNotRun = step.status === NOT_RUN;
        const isWaiting = WAITING.has(step.status);
        const isRunning = step.status === 'RUNNING';
        const isLast = index === displaySteps.length - 1;
        return (
          <li
            key={`${step.executionOrder}-${step.stepType}`}
            title={isNotRun ? notRun : undefined}
            aria-current={isRunning ? 'step' : undefined}
            className="g-relative g-flex g-min-w-0 g-gap-3 g-pb-5 last:g-pb-0 md:g-flex-1 md:g-flex-col md:g-items-center md:g-gap-2 md:g-pb-0"
          >
            {!isLast && (
              <span
                aria-hidden
                className={cn(
                  'g-absolute g-start-[11px] g-top-6 g-bottom-0 g-w-0.5 md:g-start-1/2 md:g-top-[11px] md:g-bottom-auto md:g-h-0.5 md:g-w-full',
                  step.status === 'FINISHED' ? 'g-bg-green-600' : 'g-bg-slate-300'
                )}
              />
            )}
            <span
              aria-hidden
              className={cn(
                'g-relative g-flex g-h-6 g-w-6 g-flex-none g-items-center g-justify-center g-rounded-full g-bg-white',
                {
                  'g-bg-green-600 g-text-white': step.status === 'FINISHED',
                  'g-bg-red-600 g-text-white': step.status === 'FAILED',
                  'g-border-2 g-border-solid g-border-slate-300 g-text-slate-400': isWaiting,
                  'g-bg-slate-200 g-text-slate-500': isNotRun,
                }
              )}
            >
              {step.status === 'FINISHED' && <MdCheck />}
              {step.status === 'FAILED' && <MdClose />}
              {isRunning && <Spinner className="g-h-6 g-w-6 g-fill-primary-500" />}
              {isWaiting && <MdOutlineSchedule className="g-h-3.5 g-w-3.5" />}
              {isNotRun && <MdBlock />}
            </span>
            <span
              className={cn('g-min-w-0 g-pt-0.5 g-text-sm md:g-px-2 md:g-pt-0 md:g-text-center', {
                'g-text-slate-600': isWaiting,
                'g-text-slate-500': isNotRun,
                'g-text-slate-800': step.status === 'FINISHED',
                'g-font-medium g-text-slate-900': isRunning,
                'g-text-red-700': step.status === 'FAILED',
              })}
            >
              {/* a step that never ran keeps the wording it had while it was waiting */}
              {labels.step(step.stepType, isNotRun ? 'PENDING' : step.status)}
              {isNotRun && (
                <span className="g-sr-only">
                  {' '}
                  (
                  <FormattedMessage
                    id="tools.dataValidator.steps.notRun"
                    defaultMessage="Not run"
                  />
                  )
                </span>
              )}
              {step.status === 'FAILED' && step.message && (
                <span className="g-block g-break-words g-text-xs g-text-red-600">
                  {step.message}
                </span>
              )}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

export function RetentionNote({ className }: { className?: string }) {
  return (
    <p className={cn('g-text-xs g-text-slate-500', className)}>
      <FormattedMessage
        id="tools.dataValidator.reportRetention"
        defaultMessage="The report will be deleted after one month. Until then you can revisit it at this address."
      />
    </p>
  );
}
