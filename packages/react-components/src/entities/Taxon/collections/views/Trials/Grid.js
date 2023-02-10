import React from 'react';
import { ResultsHeader } from '../../../../../search/ResultsHeader';
import { Trial } from '../../../../TaxonSidebar/details/Trial';
import { Row, Col } from '../../../../../components';
import range from 'lodash/range';

export const TrialsGrid = ({
  first,
  prev,
  next,
  size,
  from,
  results,
  total,
  loading,
}) => {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      <ResultsHeader loading={loading} total={total} />
      <div style={{ maxHeight: 400, overflowY: 'scroll', paddingRight: 5 }}>
        <Row halfGutter={5} gridGutter>
          {results
            ? results.map((trial) => (
                <Col
                  key={trial.eventID}
                  xs={24}
                  sm={24}
                  md={24}
                  lg={12}
                  xl={12}
                >
                  <Trial trial={trial} />
                </Col>
              ))
            : range(0, 8).map((key) => (
                <Col key={key} xs={24} sm={24} md={24} lg={12} xl={12}>
                  <Trial />
                </Col>
              ))}
        </Row>
      </div>
    </div>
  );
};
