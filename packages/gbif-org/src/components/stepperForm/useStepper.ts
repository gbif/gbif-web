import { useMemo, useState } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Step } from './stepperForm';

export type UseStepperResult = {
  currentStep: Step;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (idx: number) => void;
};

export function useStepper(steps: Step[], validateForm: UseFormReturn<any>['trigger']) {
  const [currentStep, setCurrentStep] = useState<Step>(steps[0]);

  return useMemo(() => {
    return {
      currentStep,
      async nextStep() {
        // If the current step has no validation path, just move to the next step
        if (!currentStep.validationPath) {
          return setCurrentStep(steps[currentStep.idx + 1]);
        }

        // Trigger validation and only go to next step if validation passes
        if (await validateForm(currentStep.validationPath)) {
          return setCurrentStep(steps[currentStep.idx + 1]);
        }
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
          if (await validateForm(steps[i].validationPath)) continue;

          // If validation fails, navigate to the first step that failed validation
          setCurrentStep(steps[i]);
          return;
        }

        setCurrentStep(steps[idx]);
      },
    };
  }, [steps, currentStep, validateForm]);
}
