
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { FormattedNumber } from 'react-intl';
import EventContext from '../../../SearchContext';
import { DetailsDrawer } from '../../../../components';
import { DatasetSidebar } from '../../../../entities';
import { useDialogState } from "reakit/Dialog";
import * as styles from './downloadPresentation.styles';
import { ViewHeader } from '../ViewHeader';
import { Button } from '../../../../components';

export const DownloadPresentation = ({ more, size, data, total, loading }) => {
  const { labelMap } = useContext(EventContext);

  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true, modal: false });

  const items = data?.eventSearch?.facet?.datasetKey || [];

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
    <div >
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

  function startDownload() {
    alert('This will start a download, once we have downloads !');
  }

  return <div css={styles.dataset({ theme })}>
    <a css={styles.actionOverlay({theme})} href={`${item.key}`} onClick={(event) => {
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
        {item.datasetTitle}
        <br/>
        <span>This archive has extension for X, Y, Z and is structure like W...</span>
        <br/>
        <span>Events: <FormattedNumber value={item.count} /></span>
        <br/>
        <span>Archive size: 123MB</span>
      </div>
      <div>
        <Button onClick={startDownload} look="primaryOutline">Download</Button>
      </div>
    </div>
    {/*<Progress percent={100 * item.count / largest} />*/}
  </div>
}
