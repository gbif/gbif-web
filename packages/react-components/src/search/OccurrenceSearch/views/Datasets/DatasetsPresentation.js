import React, { useState, useContext, useEffect, useCallback } from 'react';
import { MdFilterList } from "react-icons/md";
import { FormattedMessage } from 'react-intl';
import get from 'lodash/get';
import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../config/OccurrenceContext';
import { Button, Row, Col, DataTable, Th, Td, TBody, DetailsDrawer } from '../../../../components';
import { OccurrenceSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { ViewHeader } from '../ViewHeader';

export const DatasetsPresentation = ({ more, size, data, total, loading }) => {
  const { labelMap } = useContext(OccurrenceContext);

  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true });

  const items = data?.occurrenceSearch?.facet?.datasetKey || [];

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
  test
    {/* <DetailsDrawer href={`https://www.gbif.org/occurrence/${activeItem?.gbifId}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <OccurrenceSidebar id={activeItem?.gbifId} defaultTab='details' style={{ maxWidth: '100%', width: 700, height: '100%' }} />
    </DetailsDrawer> */}
    <div style={{
      flex: "1 1 100%",
      display: "flex",
      height: "100%",
      maxHeight: "100vh",
      flexDirection: "column",
    }}>
      {/* <ViewHeader loading={loading} total={total}/> */}
      <ul>
        {items.length > 0 && items.map(item => <li>
          <DatasetResult key={item.key} item={item} />
        </li>)}
      </ul>
    </div>
  </>
}

function DatasetResult({item, ...props}) {
  return <div>
    <h2>{item.dataset.title}</h2>
    <div>{item.count}</div>
    <div>{item.dataset.description}</div>
    <div>{item.dataset.license}</div>
  </div>
}