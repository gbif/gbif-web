import { HyperText } from '@/components/hyperText';
import Properties, { Term, Value } from '@/components/properties';
import { DatasetQuery } from '@/gql/graphql';
import { FormattedMessage } from 'react-intl';

export function SamplingDescription({
  dataset,
}: {
  dataset: Pick<NonNullable<DatasetQuery['dataset']>, 'samplingDescription'>;
  className?: string;
}) {
  const methodSteps = dataset.samplingDescription?.methodSteps;
  return (
    <Properties className="g-mb-2 [p]:g-mt-0" useDefaultTermWidths>
      {dataset.samplingDescription?.sampling && (
        <>
          <Term>
            <FormattedMessage id={`dataset.sampling`} defaultMessage="Sampling" />
          </Term>
          <Value>
            <HyperText
              className="g-prose"
              text={dataset.samplingDescription.sampling}
              disableMarkdownParsing
            />
          </Value>
        </>
      )}
      {dataset.samplingDescription?.studyExtent && (
        <>
          <Term>
            <FormattedMessage id={`dataset.studyExtent`} defaultMessage="Study extent" />
          </Term>
          <Value>
            <HyperText
              className="g-prose"
              text={dataset.samplingDescription.studyExtent}
              disableMarkdownParsing
            />
          </Value>
        </>
      )}
      {dataset.samplingDescription?.qualityControl && (
        <>
          <Term>
            <FormattedMessage id={`dataset.qualityControl`} defaultMessage="Quality control" />
          </Term>
          <Value>
            <HyperText
              className="g-prose"
              text={dataset.samplingDescription.qualityControl}
              disableMarkdownParsing
            />
          </Value>
        </>
      )}
      {methodSteps && methodSteps.length > 0 && (
        <>
          <Term>
            <FormattedMessage id={`dataset.methodSteps`} defaultMessage="Method steps" />
          </Term>
          <Value>
            <div className="dataProse">
              <ol style={{ padding: '0px', margin: 0 }}>
                {methodSteps.map((s, i) => (
                  <li
                    className="g-p-0 g-m-0"
                    key={i}
                    style={i < methodSteps.length - 1 ? { marginBottom: '12px' } : undefined}
                  >
                    <HyperText className="g-prose" text={s} disableMarkdownParsing />
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
