import { FaCheck } from 'react-icons/fa';
import { FormattedMessage, useIntl } from 'react-intl';
import { occurrenceDownloadSteps, Step, stepOptions } from './stepOptions';

interface StepIndicatorProps {
  currentStep: string;
  steps?: Step[];
}

export default function StepIndicator({
  currentStep,
  steps = occurrenceDownloadSteps,
}: StepIndicatorProps) {
  const intl = useIntl();
  const progressLabel = intl.formatMessage({
    id: 'occurrenceDownloadFlow.progressLabel',
    defaultMessage: 'Progress',
  });
  return (
    <div className="g-mb-12">
      <nav aria-label={progressLabel}>
        <ol className="g-flex g-items-center g-justify-center">
          {steps.map((step, stepIdx) => {
            const isCompleted = stepOptions[currentStep]?.ordering > step.ordering;
            const isCurrent = stepOptions[currentStep]?.ordering === step.ordering;
            const IconComponent = step.icon;

            return (
              <li
                key={step.id}
                className={`g-relative ${
                  stepIdx !== steps.length - 1 ? 'g-pr-8 sm:g-pr-20 md:g-pr-40' : ''
                }`}
              >
                {stepIdx !== steps.length - 1 && (
                  <div className="g-absolute g-inset-0 g-flex g-items-center" aria-hidden="true">
                    <div
                      className={`g-h-0.5 g-w-full ${
                        isCompleted ? 'g-bg-primary-600' : 'g-bg-gray-200'
                      }`}
                    />
                  </div>
                )}
                <div className="g-relative g-flex g-items-center g-justify-center">
                  <div
                    className={`g-flex g-h-8 g-w-8 g-items-center g-justify-center g-rounded-full g-border-2 ${
                      isCompleted
                        ? 'g-border-primary-600 g-bg-primary-600'
                        : isCurrent
                        ? 'g-border-primary-600 g-bg-white'
                        : 'g-border-gray-300 g-bg-white'
                    }`}
                  >
                    {isCompleted ? (
                      <FaCheck className="g-h-4 g-w-4 g-text-white" />
                    ) : (
                      <IconComponent
                        className={`g-h-4 g-w-4 ${
                          isCurrent ? 'g-text-primary-600' : 'g-text-gray-500'
                        }`}
                      />
                    )}
                  </div>
                  <div
                    className={`g-absolute g-top-12 g-text-center g-overflow-hidden g-hidden sm:g-block sm:g-max-w-96 md:g-max-w-40`}
                  >
                    <div
                      className={`g-text-sm g-font-medium g-whitespace-nowrap g-overflow-hidden g-text-ellipsis ${
                        isCurrent
                          ? 'g-text-primary-600'
                          : isCompleted
                          ? 'g-text-primary-600 g-hidden md:g-block'
                          : 'g-text-gray-500 g-hidden md:g-block'
                      }`}
                    >
                      <FormattedMessage id={step.name} />
                    </div>
                    {/* <div className="g-text-xs g-text-gray-500 g-mt-1 g-hidden sm:g-block">
                      <FormattedMessage id={step.description} />
                    </div> */}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>
    </div>
  );
}
