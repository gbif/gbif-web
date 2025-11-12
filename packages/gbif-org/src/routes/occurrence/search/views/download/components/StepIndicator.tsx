import { FaCheck } from 'react-icons/fa';
import { FormattedMessage, useIntl } from 'react-intl';
import { occurrenceDownloadSteps, Step, stepOptions } from './stepOptions';
import useUpdateEffect from '@/hooks/useUpdateEffect';
import { useRef } from 'react';

interface StepIndicatorProps {
  currentStep: string;
  steps?: Step[];
}

export default function StepIndicator({
  currentStep,
  steps = occurrenceDownloadSteps,
}: StepIndicatorProps) {
  const intl = useIntl();
  const ref = useRef<HTMLDivElement>(null);
  const progressLabel = intl.formatMessage({
    id: 'occurrenceDownloadFlow.progressLabel',
    defaultMessage: 'Progress',
  });

  useUpdateEffect(() => {
    if (window.innerHeight < 800) {
      ref.current?.scrollIntoView({ behavior: 'smooth' });
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentStep]);

  // Calculate progress percentage based on completed steps
  const currentStepIndex = steps.findIndex(
    (step) => stepOptions[currentStep]?.ordering === step.ordering
  );
  const progressPercentage =
    currentStepIndex >= 0 ? (currentStepIndex / (steps.length - 1)) * 100 : 0;

  return (
    <div className="g-mb-4" ref={ref}>
      <nav aria-label={progressLabel}>
        <ol className="g-flex g-justify-between g-items-center g-relative">
          {/* Progress bar background and fill */}
          <div
            className="g-absolute g-top-4 md:g-top-5 g-left-4 sm:g-left-8 g-right-4 sm:g-right-8 g-h-0.5 g-bg-gray-200 g-z-0"
            aria-hidden="true"
          >
            <div
              className="g-h-full g-bg-primary-600 g-transition-all g-duration-300"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          {steps.map((step) => {
            const isCompleted = stepOptions[currentStep]?.ordering > step.ordering;
            const isCurrent = stepOptions[currentStep]?.ordering === step.ordering;
            const IconComponent = step.icon;

            return (
              <li
                key={step.id}
                className="g-flex g-flex-col g-items-center g-relative g-flex-shrink-0 g-z-10"
              >
                {/* Step circle */}
                <div
                  className={`g-flex g-h-8 g-w-8 md:g-h-10 md:g-w-10 g-items-center g-justify-center g-rounded-full g-border-2 g-transition-colors g-duration-200 ${
                    isCompleted
                      ? 'g-border-primary-600 g-bg-primary-600'
                      : isCurrent
                      ? 'g-border-primary-600 g-bg-white'
                      : 'g-border-gray-300 g-bg-white'
                  }`}
                >
                  {isCompleted ? (
                    <FaCheck className="g-h-4 g-w-4 md:g-h-5 md:g-w-5 g-text-white" />
                  ) : (
                    <IconComponent
                      className={`g-h-4 g-w-4 md:g-h-5 md:g-w-5 ${
                        isCurrent ? 'g-text-primary-600' : 'g-text-gray-500'
                      }`}
                    />
                  )}
                </div>

                {/* Step label */}
                <span
                  className={`g-text-xs g-mt-2 g-hidden sm:g-block g-text-center g-max-w-24 ${
                    isCurrent
                      ? 'g-text-primary-600 g-font-medium'
                      : isCompleted
                      ? 'g-text-gray-600'
                      : 'g-text-gray-500'
                  }`}
                >
                  <FormattedMessage id={step.name} />
                </span>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
