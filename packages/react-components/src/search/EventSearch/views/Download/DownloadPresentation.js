import React, { useState, useContext, useEffect, useCallback } from 'react';
import EventContext from '../../../SearchContext';
import { useDialogState } from "reakit/Dialog";
import * as styles from './downloadPresentation.styles';
import {Button, Popover} from '../../../../components';
import {useAuth} from "react-oidc-context";
import env from '../../../../../.env.json';

export const DownloadPresentation = ({ more, size, data, total, loading, getPredicate }) => {
  const { labelMap } = useContext(EventContext);
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true, modal: false });
  const items = data?.eventSearch?.facet?.datasetKey || [];
  const [activePredicate, setActivePredicate] = useState();
  const auth = useAuth();
  const [predicateEmpty, setPredicateEmpty] = useState(true);

  useEffect(() => {
    setActiveItem(items[activeId]);
    setActivePredicate(getPredicate())
    let predicate = getPredicate();
    if (predicate && predicate.predicates && predicate.predicates[0].type != "and"){
      setPredicateEmpty(false)
    }
  }, [activeId, items]);

  const nextItem = useCallback(() => {
    setActive(Math.min(items.length - 1, activeId + 1));
  }, [items, activeId]);

  const previousItem = useCallback(() => {
    setActive(Math.max(0, activeId - 1));
  }, [activeId]);

  const isLoggedIn = auth.isAuthenticated;
  const user = auth.user;

  const loginCallback = useCallback(() => {
    console.log("Redirecting to login page");
    auth.signinRedirect();
  }, [auth]);

  const logoutCallback = useCallback(() => {
    console.log("Redirecting to login page");
    auth.signoutRedirect();
  }, [auth]);

  return <>
    <div>
        <ul key={`dataset_results`} style={{ padding: 0, margin: 0 }}>
          {items.length > 0 && items.map((item, index) => <li key={`dataset_results_${item.key}`}>
            <DatasetResult
                activePredicate={activePredicate}
                predicateEmpty={predicateEmpty}
                setActive={setActive}
                index={index}
                dialog={dialog}
                key={item.key}
                item={item}
                largest={items[0].count}
                user={user}
                loginCallback={loginCallback}
            />
          </li>)}
        </ul>
    </div>
  </>
}

function DatasetResult({ largest, item, indicator, theme, setActive, index, dialog, activePredicate, predicateEmpty,
                         user, loginCallback,...props }) {

  const [visible, setVisible] = useState(false);

  function startDownload(dataset) {
    window.location.href = dataset.archive.url;
  }

  function startFilteredDownload() {
    // validate the predicate - is there any filters set ?
    let download = {
      "datasetId": item.key,
      "creator": user.profile.email,
      "notificationAddresses": [user.profile.email],
      "predicate": activePredicate
    }

    let request = new XMLHttpRequest();
    request.open('POST', env.DOWNLOADS_API_URL + '/event/download', true);
    request.setRequestHeader('Content-Type', 'application/json; charset=UTF-8');
    request.setRequestHeader('Authorization', 'Bearer ' + user.access_token);
    request.send(JSON.stringify(download));
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
        <Popover
            trigger={<Button onClick={() => setVisible(true)} disabled={predicateEmpty}>Download filtered
              archive</Button>}
            aria-label="Location filter"
            onClickOutside={action => console.log('close request', action)}
            visible={visible}>
          <FilteredDownloadForm
              hide={() => setVisible(false)}
              download={() => startFilteredDownload()}
              user={user}
              loginCallback={loginCallback}
          >
          </FilteredDownloadForm>
        </Popover>
        <Button onClick={() => { startDownload(item, user); }}  look="primaryOutline">
          Download full dataset archive
        </Button>
      </div>
    </div>
  </div>
}

const FilteredDownloadForm = React.memo(({ focusRef, hide, download, user, loginCallback,...props }) => {

  const isUserLoggedIn = user != null;
  const [downloadButtonText, setDownloadButtonText] = useState("Download");
  const [downloadDisabled, setDownloadDisabled] = useState(false);

  const [downloadSent, setDownloadSent] = useState(false);

  const startDownload = useCallback(() => {
    console.log("Starting download");

    // change button
    setDownloadDisabled(true);
    setDownloadButtonText("Requesting download....");

    download();

    // change button
    setDownloadButtonText("Download sent!");
    setDownloadSent(true)
  }, []);

  return <div style={{ padding: "30px" }}>

    {!downloadSent &&
      <h3>Download data for this search</h3>
    }

    {downloadSent &&
        <h3>Download started !</h3>
    }

    { isUserLoggedIn && <div>
        {!downloadSent && <p>
        This will create a download of this dataset filtered to your search.
          <br/>
          Once the download is generated you'll receive an email with a link <br/>
          you can use to download the data.
          <br/>
          <br/>

          Note: The email will be sent to <b>{user.profile.email}</b>
          <br/>
        </p>
        }

        {downloadSent && <p>
          The download will take approximately 10 minutes to create.
          <br/>
          After this time, you will receive an email sent to <br/>
          <b>{user.profile.email}</b> with a link.
        </p>
        }
        <br/>
      <div>
        {!downloadSent &&
            <Button onClick={startDownload} ref={focusRef} disabled={downloadDisabled}>{downloadButtonText}</Button>
        }
        <Button onClick={() => hide()} look="primaryOutline">Close</Button>
      </div>
    </div> }
    { !isUserLoggedIn && <div>
      <p>You need to login to download</p>
      <a href={`#`} onClick={loginCallback}>Click here</a> to login
    </div> }
  </div>
});
FilteredDownloadForm.displayName = 'FilteredDownloadForm';