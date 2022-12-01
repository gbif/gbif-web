import React from 'react';
// import ThemeContext from '../../../style/themes/ThemeContext';
import * as css from '../styles';
import { Classification, Image, Tag } from '../../../components';
import { Row, Col } from "../../../components";

export function DistinctTaxa({
  data = {},
  loading,
  error,
  setActiveEvent,
  addToSearch,
  addEventTypeToSearch,
  className,
  ...props
}) {
  const { event } = data;

  if (loading || !event) return <h2>Loading event information...</h2>;

  return <Row direction="column" wrap="nowrap">
    <Col style={{ padding: 12, paddingBottom: 50, overflow: 'auto' }} grow>
      {[...event.distinctTaxa, ...event.distinctTaxa, ...event.distinctTaxa].map((taxa) =>
        <div style={{ marginBottom: 12 }}>
          {/* <Image /> */}
          <div>
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'center' }}>
              <span style={{ margin: '6px 10px 6px 0' }}>{taxa.acceptedScientificName}</span>
              <Tag type='light'>{taxa.count} occurrence{taxa.count > 1 && 's'}</Tag>
            </div>
            <Classification>
              {['kingdom', 'phylum', 'class', 'order', 'family'].map((taxonRank) =>
                taxa[taxonRank] && (
                  <span key={taxonRank} style={{ color: 'var(--color500)', fontSize: 13 }}>
                    {taxa[taxonRank]}
                  </span>
                )
              )}
            </Classification>
          </div>
        </div>
      )}
    </Col>
  </Row>
};
