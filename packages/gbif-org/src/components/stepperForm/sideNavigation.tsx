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

export function SideNavigation({ currentStep, steps, goToStep, className }: Props) {
  return (
    <div className={cn('g-right-[100%] g-pr-4 g-h-min g-absolute', className)}>
      <div className="g-h-full g-py-6 g-absolute g-left-5">
        <div className="g-w-px g-h-full g-flex g-flex-col">
          <div
            className="g-bg-primary-500"
            style={{ height: `${Math.floor((currentStep.idx / (steps.length - 1)) * 100)}%` }}
          />
          <div className="g-bg-gray-300 g-flex-1" />
        </div>
      </div>
      <ol className="g-flex g-flex-col g-relative">
        {steps.map((step) => {
          const isCurrent = step.idx === currentStep.idx;
          const isPast = step.idx < currentStep.idx;
          const isFuture = step.idx > currentStep.idx;

          return (
            <li key={step.idx}>
              <button
                onClick={() => goToStep(step.idx)}
                className={cn(
                  'g-text-sm g-font-semibold g-p-2 g-rounded-lg g-w-full g-flex g-items-center g-my-0.5',
                  {
                    'g-bg-primary-50': step.idx === currentStep.idx,
                  }
                )}
              >
                <span
                  className={cn(
                    'g-border g-bg-white g-rounded-full g-size-6 g-inline-flex g-items-center g-justify-center',
                    {
                      'g-border-primary-500 g-text-primary-500': isCurrent || isPast,
                      'g-border-gray-300 g-text-gray-300': isFuture,
                    }
                  )}
                >
                  {isPast ? <CheckIcon /> : <FormattedNumber value={step.idx + 1} />}
                </span>
                <span
                  className={cn('g-pl-2 g-whitespace-nowrap', {
                    'g-text-gray-300': isFuture,
                    'g-text-primary-500': isPast,
                  })}
                >
                  {step.title}
                </span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
