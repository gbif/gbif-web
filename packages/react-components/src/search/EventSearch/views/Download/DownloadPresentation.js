
import React, { useState, useContext, useEffect, useCallback } from 'react';
import { FormattedNumber } from 'react-intl';
import EventContext from '../../../SearchContext';
import { useDialogState } from "reakit/Dialog";
import * as styles from './downloadPresentation.styles';
import {Button, Input, Popover} from '../../../../components';

export const DownloadPresentation = ({ more, size, data, total, loading, getPredicate }) => {

  const { labelMap } = useContext(EventContext);
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true, modal: false });
  const items = data?.eventSearch?.facet?.datasetKey || [];
  const [activePredicate, setActivePredicate] = useState();

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

  const [visible, setVisible] = useState(false);

  function startDownload(dataset) {
    window.location.href = dataset.archive.url;
  }

  function startFilteredDownload(name, email) {
    alert('This will start a download for ' + name + ", sending to " + email);
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
        <span>Compressed archive size: {item.archive.fileSizeInMB}MB</span>
        <br/>
        <span>Format: Darwin core archive / Frictionless data package</span>
        <br/>
        <span>Last generated: {item.archive.modified}</span>
      </div>

      <div>
        <Popover
            trigger={<Button onClick={() => setVisible(true)}>Download filtered archive</Button>}
            aria-label="Location filter"
            onClickOutside={action => console.log('close request', action)}
            visible={visible} >
          <FilteredDownloadForm
              hide={() => setVisible(false)}
              download={(name, email) => startFilteredDownload(name, email)}>
          </FilteredDownloadForm>
        </Popover>

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