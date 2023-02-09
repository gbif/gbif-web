import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Row, Col, Properties, IconFeatures } from '../../../components';
import { FormattedMessage } from 'react-intl';

const { Term: T, Value: V } = Properties;

const getMof = (mofs, type, method = null) =>
  mofs.find(
    (mof) =>
      mof.measurementType === type &&
      (method === null || method === mof.measurementMethod)
  );

const getDate = ({ temporalCoverage: tc }) => {
  if (tc?.gte && tc?.lte) {
    return `${tc.gte} to ${tc.lte}`;
  } else if (tc?.gte) {
    return tc.gte;
  } else if (tc?.lte) {
    return tc.lte;
  }

  return 'Unknown Date';
};

export function Trial({ trial, ...props }) {
  const theme = useContext(ThemeContext);

  const mofBestTest = getMof(trial.measurementOrFacts, 'bestTest');

  return (
    <article css={css.clusterCard({ theme })} {...props}>
      <Row wrap='nowrap' halfGutter={6} style={{ padding: 12 }}>
        <Col>
          <h4 style={{ margin: 0 }}>{getDate(trial)}</h4>
          <div css={css.entitySummary({ theme })}>
            <IconFeatures
              css={css.features({ theme })}
              eventDate={trial.eventDate}
              countryCode={trial.countryCode}
              locality={trial.locality}
            />
            {/* <IconFeatures
              css={css.features({ theme })}
              stillImageCount={related.stillImageCount}
              movingImageCount={related.movingImageCount}
              soundCount={related.soundCount}
              typeStatus={related.typeStatus}
              basisOfRecord={related.basisOfRecord}
              isSequenced={related.volatile.features.isSequenced}
              isTreament={related.volatile.features.isTreament}
              isClustered={related.volatile.features.isClustered}
              isSamplingEvent={related.volatile.features.isSamplingEvent}
              issueCount={related.issues?.length}
            /> */}
          </div>
          <div>
            <Properties style={{ fontSize: 12 }} horizontal dense>
              {trial.measurementOrFacts
                .filter(
                  (mof) =>
                    mof.measurementType === 'Summary result' ||
                    mof.measurementMethod === 'Sample size'
                )
                .sort(({ measurementMethod: a }, { measurementMethod: b }) =>
                  a.localeCompare(b)
                )
                .map((mof) => (
                  <React.Fragment key={mof.measurementID}>
                    <T>{mof.measurementMethod}</T>
                    <V>
                      {mof.measurementValue}
                      {mof.measurementUnit && ` ${mof.measurementUnit}`}
                    </V>
                  </React.Fragment>
                ))}
              <T>
                <FormattedMessage
                  id='occurrenceFieldsNames.datasetName'
                  defaultMessage='Dataset name'
                />
              </T>
              <V>{trial.datasetTitle}</V>
            </Properties>
          </div>
        </Col>
      </Row>
      <div css={css.clusterFooter({ theme })}>
        <Properties style={{ fontSize: 12 }} horizontal dense>
          <T>Attributes</T>
          <V>
            {mofBestTest && (
              <span css={css.chip({ theme })}>
                {mofBestTest.measurementValue === 'Yes'
                  ? 'Best test'
                  : 'Not best test'}
              </span>
            )}
          </V>
        </Properties>
      </div>
    </article>
  );
}
