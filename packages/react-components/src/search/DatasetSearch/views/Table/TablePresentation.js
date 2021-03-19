import React, { useState, useContext, useEffect, useCallback } from 'react';
import { MdFilterList } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import { FilterContext } from '../../../../widgets/Filter/state';
import DatasetContext from '../../config/DatasetContext';
import { Button, Row, Col, DetailsDrawer } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { ViewHeader } from '../ViewHeader';

export const ListPresentation = ({ first, prev, next, size, from, data, total, loading }) => {
  const currentFilterContext = useContext(FilterContext);
  const { filters, tableConfig, labelMap } = useContext(DatasetContext);
  const [fixedColumn, setFixed] = useState(true);

  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true });

  const items = data?.datasetSearch?.documents?.results || [];

  useEffect(() => {
    setActiveItem(items[activeId]);
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [activeId]);


  return <>
    <DetailsDrawer href={`https://www.gbif.org/occurrence/${activeItem?.gbifId}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeItem?.gbifId} defaultTab='details' style={{ maxWidth: '100%', width: 700, height: '100%' }} />
    </DetailsDrawer>
    <div style={{
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column",
    }}>
      <ViewHeader loading={loading} total={total} />
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  </>
}
