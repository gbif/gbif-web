import { cn } from '@/utils/shadcn';
import { Form } from '../ui/form';
import { Button } from '../ui/button';
import { UseFormReturn } from 'react-hook-form';
import { useWindowSize } from '@/hooks/useWindowSize';
import { SideNavigation } from './SideNavigation';
import { TopNavigation } from './TopNavigation';
import { useStepper } from './useStepper';

export type Step = {
  idx: number;
  title: string;
  component: () => JSX.Element;
  fieldset?: boolean;
  validationPath?: string | string[];
  heading?: string;
};

type StepperFormProps = {
  form: UseFormReturn<any>;
  onSubmit: React.FormEventHandler<HTMLFormElement>;
  steps: Step[];
};

export function StepperForm({ form, onSubmit, steps }: StepperFormProps) {
  const { currentStep, prevStep, nextStep, goToStep } = useStepper(steps, form);
  const { width } = useWindowSize();

  // The side navigation is positioned absolutely, os we need to set a min-height on the container to make sure it doesn't overflow
  const minHeight =
    width > 1226
      ? `${
          // Side navigation height
          steps.length * 2.75 +
          // Form padding
          4
        }rem`
      : 'unset';

  return (
    <div className="max-w-3xl m-auto py-8 relative" style={{ minHeight }}>
      {width > 1226 ? (
        <SideNavigation currentStep={currentStep} goToStep={goToStep} steps={steps} />
      ) : (
        <TopNavigation currentStep={currentStep} goToStep={goToStep} steps={steps} />
      )}
      <Form {...form}>
        <form onSubmit={onSubmit} className="flex-1">
          {steps.map((step) => {
            const SectionWrapper = step.fieldset ? 'fieldset' : 'section';
            const SectionHeading = step.fieldset ? 'legend' : 'h2';

            return (
              <SectionWrapper
                key={step.idx}
                className={cn({ hidden: step.idx !== currentStep.idx })}
              >
                <SectionHeading className="font-semibold">
                  <span className="text-gray-500 pr-1">
                    Step {step.idx + 1}/{steps.length}:
                  </span>
                  {step.heading ?? step.title}
                </SectionHeading>

                <hr className="my-2 border-gray-100" />

                <step.component key={step.idx} />

                <div className="flex w-full pt-8">
                  {step.idx > 0 && (
                    <Button className="mr-auto" variant="outline" type="button" onClick={prevStep}>
                      Back
                    </Button>
                  )}
                  {step.idx < steps.length - 1 && (
                    <Button className="ml-auto" type="button" onClick={nextStep}>
                      Next
                    </Button>
                  )}
                  {step.idx === steps.length - 1 && (
                    <Button className="ml-auto" type="submit">
                      Submit
                    </Button>
                  )}
                </div>
              </SectionWrapper>
            );
          })}
        </form>
      </Form>
    </div>
  );
}
