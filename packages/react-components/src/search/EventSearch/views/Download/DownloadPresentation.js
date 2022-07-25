import React, { useState, useContext, useEffect, useCallback } from 'react';
import EventContext from '../../../SearchContext';
import SiteContext from '../../../../dataManagement/SiteContext'
import { useDialogState } from "reakit/Dialog";
import * as styles from './downloadPresentation.styles';
import {Button, Popover} from '../../../../components';
import env from '../../../../../.env.json';

export const DownloadPresentation = ({ more, size, data, total, loading, getPredicate }) => {
  const siteContext = useContext(SiteContext);
  const { labelMap } = useContext(EventContext);
  const [activeId, setActive] = useState();
  const [activeItem, setActiveItem] = useState();
  const dialog = useDialogState({ animated: true, modal: false });
  const items = data?.eventSearch?.facet?.datasetKey || [];
  const [activePredicate, setActivePredicate] = useState();
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
                siteContext={siteContext}
            />
          </li>)}
        </ul>
    </div>
  </>
}

function DatasetResult({ largest, item, indicator, theme, setActive, index, dialog, activePredicate, predicateEmpty,
                         siteContext,...props }) {

  const [visible, setVisible] = useState(false);

  async function startFullDownload(dataset) {

    const getUser = siteContext.auth?.getUser;
    if (siteContext.auth && getUser) {
      const user = await getUser();
      if (user) {
        console.log("User logged in ");
        console.log(user);

        // validate the predicate - is there any filters set ?
        window.location.href = dataset.archive.url;
      } else if (siteContext.auth?.signIn) {
        siteContext.auth.signIn();
      }
    } else {
      console.log("Site context didnt provide a getUser function")
    }
  }

  async function startFilteredDownload() {

    const signIn = siteContext.auth?.signIn;
    const getUser = siteContext.auth?.getUser;

    if (siteContext.auth && getUser) {
      const user = await getUser();
      if (user) {
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
        console.log(download);
        console.log("JWT = " + user.access_token);

        request.send(JSON.stringify(download));

        console.log("Response text = " + request.responseText);
        console.log(request.response);


      } else if (signIn) {
        signIn();
      }
    } else {
      console.log("Site context didnt provide a getUser function")
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
        <Popover
            trigger={<Button onClick={() => setVisible(true)} disabled={predicateEmpty}>Download filtered
              archive</Button>}
            onClickOutside={action => console.log('close request', action)}
            visible={visible}>
          <FilteredDownloadForm
              hide={() => setVisible(false)}
              download={() => startFilteredDownload()}
              siteContext={siteContext}
          >
          </FilteredDownloadForm>
        </Popover>
        <Button onClick={() => { startFullDownload(item); }}  look="primaryOutline">
          Download full dataset archive
        </Button>
      </div>
    </div>
  </div>
}

const FilteredDownloadForm = React.memo(({ focusRef, hide, download, siteContext,...props }) => {

  const isUserLoggedIn = siteContext.auth?.getUser != null;
  const signIn = siteContext.auth?.signIn;

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
        </p>
        }

        {downloadSent && <p>
          The download will take approximately 10 minutes to create.
          <br/>
          After this time, you will receive an email sent to <br/>
          your registered email address with a link.
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
      <a href={`#`} onClick={signIn}>Click here</a> to login
    </div> }
  </div>
});
FilteredDownloadForm.displayName = 'FilteredDownloadForm';