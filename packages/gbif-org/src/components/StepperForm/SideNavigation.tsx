import { CheckIcon } from '@radix-ui/react-icons';
import { cn } from '@/utils/shadcn';
import { Step } from './StepperForm';

type Props = {
  currentStep: Step;
  steps: Step[];
  goToStep: (idx: number) => void;
};

export function SideNavigation({ currentStep, steps, goToStep }: Props) {
  return (
    <div className="w-48 -left-52 h-min absolute overflow-hidden">
      <div className="h-full py-6 absolute left-5 -z-10">
        <div className="w-px h-full flex flex-col">
          <div
            className="bg-primary-500"
            style={{ height: `${Math.floor((currentStep.idx / (steps.length - 1)) * 100)}%` }}
          />
          <div className="bg-gray-300 flex-1" />
        </div>
      </div>
      <ol className="w-full flex flex-col">
        {steps.map((step) => {
          const isCurrent = step.idx === currentStep.idx;
          const isPast = step.idx < currentStep.idx;
          const isFuture = step.idx > currentStep.idx;

          return (
            <li key={step.idx}>
              <button
                onClick={() => goToStep(step.idx)}
                className={cn(
                  'text-sm font-semibold p-2 rounded-lg w-full flex items-center my-0.5',
                  {
                    'bg-primary-50': step.idx === currentStep.idx,
                  }
                )}
              >
                <span
                  className={cn(
                    'border bg-white rounded-full size-6 inline-flex items-center justify-center',
                    {
                      'border-primary-500 text-primary-500': isCurrent || isPast,
                      'border-gray-300 text-gray-300': isFuture,
                    }
                  )}
                >
                  {isPast ? <CheckIcon /> : step.idx + 1}
                </span>
                <span
                  className={cn('pl-2 whitespace-nowrap', {
                    'text-gray-300': isFuture,
                    'text-primary-500': isPast,
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
