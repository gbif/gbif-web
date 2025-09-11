import { cn } from '@/utils/shadcn';
import { CheckIcon } from '@radix-ui/react-icons';
import { FormattedNumber } from '../dashboard/shared';
import { Step } from './stepperForm';

type Props = {
  currentStep: Step;
  steps: Step[];
  goToStep: (idx: number) => void;
  className?: string;
};

export function TopNavigation({ currentStep, steps, goToStep, className }: Props) {
  return (
    <div className={cn('g-relative', className)}>
      <div className="g-absolute g-w-full g-top-3 sm:g-top-4">
        <div className="g-h-px g-flex">
          <div
            className="g-bg-primary-500"
            style={{ width: `${(currentStep.idx / (steps.length - 1)) * 100}%` }}
          />
          <div className="g-w-full g-bg-gray-300 g-flex-1" />
        </div>
      </div>
      <ol className="g-w-full g-flex g-justify-between g-relative g-pb-4">
        {steps.map((step) => {
          const isCurrent = step.idx === currentStep.idx;
          const isPast = step.idx < currentStep.idx;
          const isFuture = step.idx > currentStep.idx;

          return (
            <li key={step.idx}>
              <button
                onClick={() => goToStep(step.idx)}
                className={cn(
                  'g-text-sm g-font-semibold g-border g-rounded-full g-size-6 sm:g-size-8 g-inline-flex g-items-center g-justify-center',
                  {
                    'g-bg-primary-50 g-border-primary-500 g-text-primaryContrast-50': isCurrent,
                    'g-bg-white g-border-primary-500 g-text-primary-500': isPast,
                    'g-bg-white g-border-gray-300 g-text-gray-300': isFuture,
                  }
                )}
              >
                {isPast ? <CheckIcon /> : <FormattedNumber value={step.idx + 1} />}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
