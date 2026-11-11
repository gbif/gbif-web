import { Spinner } from '@/components/ui/spinner';
import { cn } from '@/utils/shadcn';
import { MdCheck, MdClose, MdOutlineSchedule } from 'react-icons/md';
import { normalizeSteps } from '../data/normalizeReport';
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
  const displaySteps = normalizeSteps(steps, jobStatus);
  if (displaySteps.length === 0) return null;

  return (
    <ol className={cn('g-flex g-flex-wrap g-gap-x-6 g-gap-y-3 g-list-none g-p-0 g-m-0', className)}>
      {displaySteps.map((step) => (
        <li
          key={`${step.executionOrder}-${step.stepType}`}
          className={cn('g-flex g-items-start g-gap-2 g-text-sm', {
            'g-text-slate-500': WAITING.has(step.status),
            'g-text-slate-800': step.status === 'FINISHED' || step.status === 'RUNNING',
            'g-text-red-700': step.status === 'FAILED',
          })}
        >
          <div className="g-flex g-h-5 g-flex-none g-items-center" aria-hidden>
            {step.status === 'FINISHED' && <MdCheck className="g-text-green-600" />}
            {step.status === 'FAILED' && <MdClose className="g-text-red-600" />}
            {step.status === 'RUNNING' && <Spinner className="g-h-3.5 g-w-3.5" />}
            {WAITING.has(step.status) && <MdOutlineSchedule />}
          </div>
          <span>
            {labels.step(step.stepType, step.status)}
            {step.status === 'FAILED' && step.message && (
              <span className="g-block g-text-xs g-text-red-600">{step.message}</span>
            )}
          </span>
        </li>
      ))}
    </ol>
  );
}
