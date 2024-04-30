import { cn } from '@/utils/shadcn';
import { CheckIcon } from '@radix-ui/react-icons';
import { Step } from './StepperForm';

type Props = {
  currentStep: Step;
  steps: Step[];
  goToStep: (idx: number) => void;
};

export function TopNavigation({ currentStep, steps, goToStep }: Props) {
  return (
    <div className="relative">
      <div className="absolute w-full top-3 sm:top-4 -z-10">
        <div className="h-px flex">
          <div
            className="bg-primary-500"
            style={{ width: `${(currentStep.idx / (steps.length - 1)) * 100}%` }}
          />
          <div className="w-full bg-gray-300 flex-1" />
        </div>
      </div>
      <ol className="w-full flex justify-between pb-4">
        {steps.map((step) => {
          const isCurrent = step.idx === currentStep.idx;
          const isPast = step.idx < currentStep.idx;
          const isFuture = step.idx > currentStep.idx;

          return (
            <li key={step.idx}>
              <button
                onClick={() => goToStep(step.idx)}
                className={cn(
                  'text-sm font-semibold border bg-white rounded-full size-6 sm:size-8 inline-flex items-center justify-center',
                  {
                    'border-primary-500 bg-primary-50 text-primaryContrast-500': isCurrent,
                    'border-primary-500 text-primary-500': isPast,
                    'border-gray-300 text-gray-300': isFuture,
                  }
                )}
              >
                {isPast ? <CheckIcon /> : step.idx + 1}
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
