import { useMemo, useState } from 'react';
import { Step } from './StepperForm';
import { UseFormReturn } from 'react-hook-form';

export type UseStepperResult = {
  currentStep: Step;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (idx: number) => void;
};

export function useStepper(steps: Step[], form: UseFormReturn<any>) {
  const [currentStep, setCurrentStep] = useState<Step>(steps[0]);

  return useMemo(() => {
    return {
      currentStep,
      nextStep() {
        const nextIdx = currentStep.idx + 1;
        setCurrentStep(steps[nextIdx]);
      },
      prevStep() {
        const prevIdx = currentStep.idx - 1;
        setCurrentStep(steps[prevIdx]);
      },
      async goToStep(idx: number) {
        // Make sure the user does not skip steps without passing validation
        for (let i = 0; i < idx; i++) {
          // Continue if the step does not have a validation path
          if (!steps[i].validationPath) continue;

          // Continue if validation passes
          if (await form.trigger(steps[i].validationPath)) continue;

          // If validation fails, navigate to the first step that failed validation
          setCurrentStep(steps[i]);
          return;
        }

        setCurrentStep(steps[idx]);
      },
    };
  }, [steps, currentStep, form]);
}
