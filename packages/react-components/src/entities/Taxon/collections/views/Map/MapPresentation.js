import { jsx } from '@emotion/react';
import React, { useContext, useState, useEffect, useCallback } from 'react';
import { DetailsDrawer } from '../../../../../components';
import ThemeContext from '../../../../../style/themes/ThemeContext';
import { useDialogState } from 'reakit/Dialog';
import ListBox from './ListBox';
import { ViewHeader } from '../../../../../search/EventSearch/views/ViewHeader';
import MapboxMap from './MapboxMap';
import * as css from './map.styles';
import { CollectionSidebar } from '../../../../CollectionSidebar/CollectionSidebar';

function Map({
  labelMap,
  query,
  pointData,
  pointError,
  pointLoading,
  loading,
  total,
  predicateHash,
  registerPredicate,
  loadPointData,
  defaultMapSettings,
  mapLoaded,
  ...props
}) {
  const dialog = useDialogState({ animated: true, modal: false });
  const theme = useContext(ThemeContext);

  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const [listVisible, showList] = useState(false);
  const items = pointData?.eventSearch?.documents?.results || [];

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  return (
    <>
      <DetailsDrawer href={`${activeItem?.eventID}`} dialog={dialog}>
        <CollectionSidebar
          catalogNumber={activeItem?.occurrences?.results[0]?.catalogNumber}
          defaultTab='details'
          style={{ maxWidth: '100%', width: 700, height: '100%' }}
          onCloseRequest={() => dialog.setVisible(false)}
        />
      </DetailsDrawer>
      <div css={css.mapArea({ theme })}>
        <ViewHeader
          message='counts.nResultsWithCoordinates'
          loading={loading}
          total={total}
        />
        <div
          style={{
            position: 'relative',
            height: 500,
            flex: '1 1 auto',
            display: 'flex',
            flexDirection: 'column',
          }}
        >
          {listVisible && (
            <ListBox
              onCloseRequest={(e) => showList(false)}
              labelMap={labelMap}
              onClick={({ index }) => {
                dialog.show();
                setActive(index);
              }}
              data={pointData}
              error={pointError}
              loading={pointLoading}
              css={css.resultList({})}
            />
          )}
          <MapboxMap
            defaultMapSettings={defaultMapSettings}
            predicateHash={predicateHash}
            css={css.mapComponent({ theme })}
            theme={theme}
            query={query}
            onMapClick={(e) => showList(false)}
            onPointClick={(data) => {
              showList(true);
              loadPointData(data);
            }}
            registerPredicate={registerPredicate}
          />
        </div>
      </div>
    </>
  );
}

export default Map;
