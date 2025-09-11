import { cn } from '@/utils/shadcn';
import { useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormattedMessage, FormattedNumber } from 'react-intl';
import { Button } from '../ui/button';
import { Form } from '../ui/form';
import { SideNavigation } from './sideNavigation';
import { TopNavigation } from './topNavigation';
import { useStepper } from './useStepper';

export type Step = {
  idx: number;
  title: React.ReactNode;
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
  const { currentStep, prevStep, nextStep, goToStep } = useStepper(steps, form.trigger);
  const containerRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={containerRef}
      // This runtime calculated class, that normally wouldn't work, has been added to the safelist in tailwind.config.js
      className={`g-max-w-3xl g-m-auto g-relative 2xl:g-min-h-[${steps.length * 2.75}rem]`}
    >
      <SideNavigation
        className="g-hidden 2xl:g-block"
        currentStep={currentStep}
        goToStep={goToStep}
        steps={steps}
      />
      <TopNavigation
        className="g-block 2xl:g-hidden"
        currentStep={currentStep}
        goToStep={goToStep}
        steps={steps}
      />
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
                    <FormattedMessage
                      id="phrases.stepperFormProgress"
                      values={{
                        currentStep: <FormattedNumber value={step.idx + 1} />,
                        totalSteps: <FormattedNumber value={steps.length} />,
                      }}
                    />
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
                      <FormattedMessage id="phrases.back" />
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
                      <FormattedMessage id="phrases.next" />
                    </Button>
                  )}
                  {step.idx === steps.length - 1 && (
                    <Button className="g-ml-auto" type="submit">
                      <FormattedMessage id="phrases.submit" />
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
