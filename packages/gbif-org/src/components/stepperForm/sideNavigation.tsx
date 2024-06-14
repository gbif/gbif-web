import { CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/utils/shadcn';
import { Step } from './stepperForm';

type Props = {
  currentStep: Step;
  steps: Step[];
  goToStep: (idx: number) => void;
};

export function SideNavigation({ currentStep, steps, goToStep }: Props) {
  return (
    <div className="g-w-48 g--left-52 g-h-min g-absolute g-overflow-hidden">
      <div className="g-h-full g-py-6 g-absolute g-left-5">
        <div className="g-w-px g-h-full g-flex g-flex-col">
          <div
            className="g-bg-primary-500"
            style={{ height: `${Math.floor((currentStep.idx / (steps.length - 1)) * 100)}%` }}
          />
          <div className="g-bg-gray-300 g-flex-1" />
        </div>
      </div>
      <ol className="g-w-full g-flex g-flex-col g-relative">
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
                  {isPast ? <CheckIcon /> : step.idx + 1}
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
