import React, { useEffect, useState } from 'react';
import { useDialogState } from 'reakit/Dialog';
import { CollectionSidebar } from '../../../../CollectionSidebar/CollectionSidebar';
import { ResultsHeader } from '../../../../../search/ResultsHeader';
import { Trial } from '../../../../CollectionSidebar/details/Trial';
import { Row, Col, DetailsDrawer } from '../../../../../components';
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
  const [activeCatalog, setActiveCatalog] = useState();
  const dialog = useDialogState({ animated: true, modal: false });

  useEffect(() => {
    if (activeCatalog) {
      dialog.show();
    } else {
      dialog.hide();
    }
  }, [activeCatalog]);

  return (
    <>
      {dialog.visible && (
        <DetailsDrawer
          // href={`${'tempurl'}${activeCollection.catalogNumber}`}
          href='https://google.com' // REPLACE
          dialog={dialog}
        >
          <CollectionSidebar
            catalogNumber={activeCatalog}
            defaultTab='details'
            style={{ maxWidth: '100%', width: 700, height: '100%' }}
            onCloseRequest={() => dialog.setVisible(false)}
          />
        </DetailsDrawer>
      )}
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
                    <Trial
                      trial={trial}
                      onRelatedClick={() => {
                        setActiveCatalog(
                          trial.occurrences?.results?.[0].catalogNumber
                        );
                        if (!dialog.visible) dialog.setVisible(true);
                      }}
                    />
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
    </>
  );
};
