import { jsx } from '@emotion/react';
import React, { useContext } from 'react';
import ThemeContext from '../../style/themes/ThemeContext';
import * as css from './styles';
import { Row, Col, Properties, IconFeatures } from '../../components';

const { Term: T, Value: V } = Properties;

const getMof = (mofs, type) => mofs.find((mof) => mof.measurementType === type);
const getSummaryResults = (mofs) => {
  return mofs
    .filter((mof) => mof.measurementType === 'Summary result')
    .reduce(
      (prev, cur) => ({
        ...prev,
        [cur.measurementMethod]: cur.measurementValue,
      }),
      {}
    );
};

export function Trial({ trial, ...props }) {
  const theme = useContext(ThemeContext);

  const mofBestTest = getMof(trial.measurementOrFacts, 'bestTest');

  return (
    <article css={css.clusterCard({ theme })} {...props}>
      <Row wrap='nowrap' halfGutter={6} style={{ padding: 12 }}>
        <Col>
          <h4 style={{ margin: 0 }}>Trial</h4>
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
                .filter((mof) => mof.measurementType === 'Summary result')
                .sort(({ measurementMethod: a }, { measurementMethod: b }) =>
                  a.localeCompare(b)
                )
                .map((mof) => (
                  <>
                    <T>{mof.measurementMethod}</T>
                    <V>
                      {mof.measurementValue}
                      {mof.measurementUnit && ` ${mof.measurementUnit}`}
                    </V>
                  </>
                ))}
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
