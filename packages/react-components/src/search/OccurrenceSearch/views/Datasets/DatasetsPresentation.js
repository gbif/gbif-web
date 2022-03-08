
import { jsx } from '@emotion/react';
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { MdHelp } from "react-icons/md";
import { FormattedNumber } from 'react-intl';
import get from 'lodash/get';
import { FilterContext } from '../../../../widgets/Filter/state';
import OccurrenceContext from '../../../SearchContext';
import { Progress, Row, Col, DetailsDrawer } from '../../../../components';
import { DatasetSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import { ViewHeader } from '../ViewHeader';
import * as styles from './datasetPresentation.styles';

export const DatasetsPresentation = ({ more, size, data, total, loading }) => {
  const { labelMap } = useContext(OccurrenceContext);

  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true, modal: false });

  const items = data?.occurrenceSearch?.facet?.datasetKey || [];
  const cardinality = data?.occurrenceSearch?.cardinality?.datasetKey;

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
    <DetailsDrawer href={`https://www.gbif.org/dataset/${activeItem?.dataset?.key}`} dialog={dialog} nextItem={nextItem} previousItem={previousItem}>
      <DatasetSidebar id={activeItem?.dataset?.key} defaultTab='details' style={{ maxWidth: '100%', width: 700, height: '100%' }} onCloseRequest={() => dialog.setVisible(false)}  />
    </DetailsDrawer>
    <div >
      <ViewHeader loading={loading} total={cardinality}/>
      {/* <Row direction="row-reverse">
        <Col><MdHelp /></Col>
      </Row> */}
      <div>
        <ul style={{ padding: 0, margin: 0 }}>
          {items.length > 0 && items.map((item, index) => <li>
            <DatasetResult setActive={setActive} index={index} dialog={dialog} key={item.key} item={item} largest={items[0].count} />
          </li>)}
        </ul>
      </div>
    </div>
  </>
}

function DatasetResult({ largest, item, indicator, theme, setActive, index, dialog, ...props }) {
  return <div css={styles.dataset({ theme })}>
    <a css={styles.actionOverlay({theme})} href={`https://www.gbif.org/dataset/${item.dataset.key}`} onClick={(event) => {
      if (
        event.ctrlKey ||
        event.shiftKey ||
        event.metaKey || // apple
        (event.button && event.button == 1) // middle click, >IE9 + everyone else
      ) {
        return;
      } else {
        setActive(index);
        dialog.show();
        event.preventDefault();
      }
    }}></a>
    <div css={styles.title({ theme })}>
      <div style={{ flex: '1 1 auto' }}>
        {item.dataset.title}</div>
      <span><FormattedNumber value={item.count} /></span>
    </div>
    <Progress percent={100 * item.count / largest} />
    {/* <Progress percent={indicator} /> */}
  </div>
}

// function getIndicatorValues(values) {
//   const min = Math.min(...values);
//   const max = Math.max(...values);
//   const logMin = Math.log(min);
//   const logMax = Math.log(max);
//   const logStart = Math.max(0, Math.floor(logMin));
//   return values.map(x => x === 0 
//     ? 0 
//     : 100 * (Math.log(x) - logStart) / (logMax - logStart)
//     );
// }