import { HyperText } from '@/components/hyperText';
import Properties, { Term, Value } from '@/components/properties';
import { FormattedMessage } from 'react-intl';

export function SamplingDescription({ dataset, ...props }) {
  return (
    <Properties className="g-mb-2 [p]:g-mt-0" useDefaultTermWidths>
      {dataset.samplingDescription?.sampling && (
        <>
          <Term>
            <FormattedMessage id={`dataset.sampling`} defaultMessage="Sampling" />
          </Term>
          <Value>
            <HyperText className="g-prose" text={dataset.samplingDescription.sampling} />
          </Value>
        </>
      )}
      {dataset.samplingDescription?.studyExtent && (
        <>
          <Term>
            <FormattedMessage id={`dataset.studyExtent`} defaultMessage="Study extent" />
          </Term>
          <Value>
            <HyperText className="g-prose" text={dataset.samplingDescription.studyExtent} />
          </Value>
        </>
      )}
      {dataset.samplingDescription?.qualityControl && (
        <>
          <Term>
            <FormattedMessage id={`dataset.qualityControl`} defaultMessage="Quality control" />
          </Term>
          <Value>
            <HyperText className="g-prose" text={dataset.samplingDescription.qualityControl} />
          </Value>
        </>
      )}
      {dataset.samplingDescription?.methodSteps &&
        dataset.samplingDescription?.methodSteps?.length > 0 && (
          <>
            <Term>
              <FormattedMessage id={`dataset.methodSteps`} defaultMessage="Method steps" />
            </Term>
            <Value>
              <div className="dataProse">
                <ol style={{ padding: '0px', margin: 0 }}>
                  {dataset.samplingDescription.methodSteps.map((s, i) => (
                    <li
                      className="g-p-0 g-m-0"
                      key={i}
                      style={
                        i < dataset.samplingDescription.methodSteps.length - 1
                          ? { marginBottom: '12px' }
                          : undefined
                      }
                    >
                      <HyperText className="g-prose" text={s} />
                    </li>
                  ))}
                </ol>
              </div>
            </Value>
          </>
        )}
    </Properties>
  );
}
