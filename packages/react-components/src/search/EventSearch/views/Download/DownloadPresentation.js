
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { FormattedNumber } from 'react-intl';
import EventContext from '../../../SearchContext';
import { useDialogState } from "reakit/Dialog";
import * as styles from './downloadPresentation.styles';
import {Button, Input, Popover} from '../../../../components';
import SiteContext from '../../../../dataManagement/SiteContext'

export const DownloadPresentation = ({ more, size, data, total, loading, getPredicate }) => {
  const siteContext = useContext(SiteContext);
  const { labelMap } = useContext(EventContext);
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true, modal: false });
  const items = data?.eventSearch?.facet?.datasetKey || [];
  const [activePredicate, setActivePredicate] = useState();

  const customDownload = siteContext?.overwrites?.fn?.filteredEventDatasetDownload;

  useEffect(() => {
    setActiveItem(items[activeId]);
    setActivePredicate(getPredicate())
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [activeId]);

  return <>
    <div>
        <ul key={`dataset_results`} style={{ padding: 0, margin: 0 }}>
          {items.length > 0 && items.map((item, index) => <li key={`dataset_results-${item.key}`}>
            <DatasetResult activePredicate={activePredicate} filteredDownload={customDownload} setActive={setActive} index={index} dialog={dialog} key={item.key} item={item} largest={items[0].count} />
          </li>)}
        </ul>
    </div>
  </>
}

function DatasetResult({ largest, item, indicator, theme, setActive, index, dialog, activePredicate, filteredDownload, ...props }) {

  const [visible, setVisible] = useState(false);

  function startDownload(dataset) {
    window.location.href = dataset.archive.url;
  }

  function startFilteredDownload() {
    if (filteredDownload) {
      filteredDownload({datasetKey: item.key, predicate: activePredicate})
    } else {
      alert('This will start a download');
    }
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
        <span>Compressed archive size: {item.archive.fileSizeInMB}MB</span>
        <br/>
        <span>Format: Darwin core archive / Frictionless data package</span>
        <br/>
        <span>Last generated: {item.archive.modified}</span>
      </div>
      <div>
        <Button onClick={startFilteredDownload}>Download filtered archive</Button>
        <Button onClick={() => { startDownload(item); }}  look="primaryOutline">
          Download full dataset archive
        </Button>
      </div>
    </div>
  </div>
}

const FilteredDownloadForm = React.memo(({ focusRef, hide, download,...props }) => {

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  return <div style={{ padding: "30px" }}>
    <h3>Download data for this search</h3>
    <p>
      To download this dataset, please supply an email address.<br/>
      Once the download is generated you'll receive an email with a link <br/>
      you can use to download the data.
      <br/>
    </p>
    <form>
      <label>
        Email:
        <Input id={email} value={email} onInput={e => setEmail(e.target.value)}/>
      </label>
    </form>
    <br/>
    <div>
      <Button onClick={() => download(name, email)} ref={focusRef}>Download</Button>
      <Button onClick={() => hide()} look="primaryOutline">Close</Button>
    </div>
    <br/>
    <span>Note: this is form is demo purposes only in lieu of proper authentication.</span>
  </div>
});
FilteredDownloadForm.displayName = 'FilteredDownloadForm';