import { useWindowSize } from '@/hooks/useWindowSize';
import { cn } from '@/utils/shadcn';
import { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { SideNavigation } from './sideNavigation';
import { TopNavigation } from './topNavigation';
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
  const containerRef = useRef<HTMLDivElement>(null);

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
    <div ref={containerRef} className="g-max-w-3xl g-m-auto g-relative" style={{ minHeight }}>
      {width > 1226 ? (
        <SideNavigation currentStep={currentStep} goToStep={goToStep} steps={steps} />
      ) : (
        <TopNavigation currentStep={currentStep} goToStep={goToStep} steps={steps} />
      )}
      <Form {...form}>
        <form onSubmit={onSubmit} className="g-flex-1">
          {steps.map((step) => {
            const SectionWrapper = step.fieldset ? 'fieldset' : 'section';
            const SectionHeading = step.fieldset ? 'legend' : 'h2';

            return (
              <SectionWrapper
                key={step.idx}
                className={cn({ 'g-hidden': step.idx !== currentStep.idx })}
              >
                <SectionHeading className="g-font-semibold">
                  <span className="g-text-gray-500 g-pr-1">
                    Step {step.idx + 1}/{steps.length}:
                  </span>
                  {step.heading ?? step.title}
                </SectionHeading>

                <hr className="g-my-2 g-border-gray-100" />

                <step.component key={step.idx} />

                <div className="g-flex g-w-full g-pt-8">
                  {step.idx > 0 && (
                    <Button
                      className="mr-auto"
                      variant="outline"
                      type="button"
                      onClick={() => {
                        prevStep();
                        containerRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Back
                    </Button>
                  )}
                  {step.idx < steps.length - 1 && (
                    <Button
                      className="g-ml-auto"
                      type="button"
                      onClick={() => {
                        nextStep();
                        containerRef.current?.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      Next
                    </Button>
                  )}
                  {step.idx === steps.length - 1 && (
                    <Button className="g-ml-auto" type="submit">
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
